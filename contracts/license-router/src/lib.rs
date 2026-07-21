#![no_std]
use soroban_sdk::{
    contract, contractimpl, contracttype, symbol_short, token,
    Address, Env, String,
};

// ---------------------------------------------------------------------------
// Cross-contract client for QualityOracle
// ---------------------------------------------------------------------------

mod quality_oracle {
    soroban_sdk::contractimport!(
        file = "../../target/wasm32v1-none/release/quality_oracle.wasm"
    );
}

// ---------------------------------------------------------------------------
// Storage key macros
// symbol_short! requires a string literal — define thin macros to avoid
// repeating the literal strings at every call site.
// ---------------------------------------------------------------------------

macro_rules! key_admin  { () => { symbol_short!("admin")  }; }
macro_rules! key_oracle { () => { symbol_short!("oracle") }; }

// ---------------------------------------------------------------------------
// Public types
// ---------------------------------------------------------------------------

/// Returned by `route_license` so callers can inspect both the raw base
/// amount and the quality-adjusted amount that was actually transferred.
#[contracttype]
#[derive(Clone, Debug)]
pub struct LicenseRouteResult {
    /// Caller-supplied base royalty amount (in token stroops).
    pub base_amount: i128,
    /// Multiplier applied from QualityOracle, in basis points
    /// (10 000 = 1×, 15 000 = 1.5×, etc.).
    pub multiplier_bps: u32,
    /// Amount transferred to the recipient after quality scaling:
    /// `base_amount * multiplier_bps / 10_000`.
    pub adjusted_amount: i128,
}

// ---------------------------------------------------------------------------
// Contract
// ---------------------------------------------------------------------------

#[contract]
pub struct LicenseRouter;

#[contractimpl]
impl LicenseRouter {
    // -----------------------------------------------------------------------
    // Lifecycle
    // -----------------------------------------------------------------------

    /// One-time initialisation. Stores the admin address and the address of
    /// the deployed `QualityOracle` contract used for royalty multipliers.
    pub fn initialize(env: Env, admin: Address, oracle: Address) {
        if env.storage().instance().has(&key_admin!()) {
            panic!("already initialized");
        }
        admin.require_auth();
        env.storage().instance().set(&key_admin!(), &admin);
        env.storage().instance().set(&key_oracle!(), &oracle);
    }

    // -----------------------------------------------------------------------
    // Core: royalty routing
    // -----------------------------------------------------------------------

    /// Route a license-usage royalty payment to `recipient`.
    ///
    /// The `QualityOracle` returns a multiplier in *basis points* keyed by
    /// the dataset's quality tier:
    ///
    /// | Tier     | BPS    | Effective rate |
    /// |----------|--------|----------------|
    /// | Unrated  | 10 000 | 1.0×           |
    /// | Bronze   |  7 500 | 0.75×          |
    /// | Silver   | 10 000 | 1.0×           |
    /// | Gold     | 12 500 | 1.25×          |
    /// | Platinum | 15 000 | 1.5×           |
    ///
    /// The adjusted amount is: `base_amount * multiplier_bps / 10_000`.
    ///
    /// # Arguments
    /// * `caller`      – address paying; must authorise this call.
    /// * `dataset_id`  – identifies the dataset in the `QualityOracle`.
    /// * `base_amount` – royalty amount in token stroops before quality scaling.
    /// * `token`       – SEP-41 token contract address used for payment.
    /// * `recipient`   – address that receives the adjusted royalty.
    pub fn route_license(
        env: Env,
        caller: Address,
        dataset_id: String,
        base_amount: i128,
        token: Address,
        recipient: Address,
    ) -> LicenseRouteResult {
        caller.require_auth();

        if base_amount <= 0 {
            panic!("base_amount must be positive");
        }

        // 1. Fetch the oracle address stored at initialisation.
        let oracle_addr: Address = env
            .storage()
            .instance()
            .get(&key_oracle!())
            .expect("not initialized");

        // 2. Cross-contract call: ask QualityOracle for the multiplier BPS.
        let oracle_client = quality_oracle::Client::new(&env, &oracle_addr);
        let multiplier_bps: u32 = oracle_client.royalty_multiplier_bps(&dataset_id);

        // 3. Scale: adjusted = base * multiplier_bps / 10_000.
        let adjusted_amount: i128 =
            base_amount * (multiplier_bps as i128) / 10_000_i128;

        if adjusted_amount <= 0 {
            panic!("adjusted_amount must be positive after scaling");
        }

        // 4. Transfer adjusted amount from caller to recipient.
        let tok = token::Client::new(&env, &token);
        tok.transfer(&caller, &recipient, &adjusted_amount);

        LicenseRouteResult {
            base_amount,
            multiplier_bps,
            adjusted_amount,
        }
    }

    // -----------------------------------------------------------------------
    // Views
    // -----------------------------------------------------------------------

    /// Returns the address of the QualityOracle this router is bound to.
    pub fn oracle_address(env: Env) -> Address {
        env.storage()
            .instance()
            .get(&key_oracle!())
            .expect("not initialized")
    }

    /// Protocol ping — useful for liveness checks by integrators.
    pub fn ping(_env: Env, marker: soroban_sdk::Symbol) -> soroban_sdk::Symbol {
        marker
    }

    /// Contract ABI / deployment marker for integrators.
    pub fn version(_env: Env) -> u32 {
        2
    }
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

#[cfg(test)]
mod test;
