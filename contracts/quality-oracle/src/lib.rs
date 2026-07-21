#![cfg_attr(not(test), no_std)]

use soroban_sdk::{
    contract, contractimpl, contracttype, symbol_short,
    Address, Env, String,
};

const MAX_SCORE: u32 = 100;
// Default minimum stake: 1 XLM expressed in stroops
const MIN_STAKE_DEFAULT: u64 = 10_000_000;

#[contracttype]
#[derive(Clone, Debug)]
pub struct CuratorRecord {
    pub stake: u64,
    pub slashed: bool,
}

#[contracttype]
#[derive(Clone)]
enum StorageKey {
    Curator(Address),
    Attestation(String, Address),
    Quality(String),
}

#[contracttype]
#[derive(Clone, Debug)]
pub struct QualityAttestation {
    pub dataset_id: String,
    pub curator: Address,
    pub score: u32,
    pub rubric_hash: soroban_sdk::BytesN<32>,
    pub ledger: u32,
}

#[contracttype]
#[derive(Clone, Debug)]
pub struct DatasetQuality {
    pub dataset_id: String,
    pub average_score: u32,
    pub attestation_count: u32,
    pub last_updated_ledger: u32,
    pub tier: QualityTier,
}

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub enum QualityTier {
    Unrated,
    Bronze,
    Silver,
    Gold,
    Platinum,
}

#[contract]
pub struct QualityOracle;

#[contractimpl]
impl QualityOracle {
    /// Initialise the contract. `min_stake` is the minimum stroops a curator
    /// must commit when registering — this is the amount at risk of slashing.
    pub fn initialize(env: Env, admin: Address, min_stake: u64) {
        if env.storage().instance().has(&symbol_short!("admin")) {
            panic!("already initialized");
        }
        admin.require_auth();
        env.storage().instance().set(&symbol_short!("admin"), &admin);
        env.storage().instance().set(&symbol_short!("cur_cnt"), &0u32);
        env.storage().instance().set(&symbol_short!("min_stk"), &min_stake);
    }

    /// Register as a curator with an on-chain stake commitment.
    /// `stake` must be >= the configured minimum stake.
    pub fn register_curator(env: Env, curator: Address, stake: u64) {
        curator.require_auth();
        let key = StorageKey::Curator(curator.clone());
        let min: u64 = env
            .storage()
            .instance()
            .get(&symbol_short!("min_stk"))
            .unwrap_or(MIN_STAKE_DEFAULT);
        if stake < min {
            panic!("stake below minimum");
        }
        let key = Self::curator_key(&env, &curator);
        if env.storage().persistent().has(&key) {
            panic!("curator already registered");
        }
        let record = CuratorRecord { stake, slashed: false };
        env.storage().persistent().set(&key, &record);
        env.storage()
            .persistent()
            .extend_ttl(&key, 7_776_000, 7_776_000);
        let cnt: u32 = env
            .storage()
            .instance()
            .get(&symbol_short!("cur_cnt"))
            .unwrap_or(0);
        env.storage()
            .instance()
            .set(&symbol_short!("cur_cnt"), &(cnt + 1));
    }

    /// Admin slashes a curator for malicious attestations. Zeroes their stake
    /// and permanently bars them from submitting further attestations.
    pub fn slash_curator(env: Env, admin: Address, curator: Address) {
        let stored_admin: Address = env
            .storage()
            .instance()
            .get(&symbol_short!("admin"))
            .expect("not initialized");
        if admin != stored_admin {
            panic!("unauthorized");
        }
        admin.require_auth();
        let key = Self::curator_key(&env, &curator);
        let mut record: CuratorRecord = env
            .storage()
            .persistent()
            .get(&key)
            .expect("curator not found");
        if record.slashed {
            panic!("already slashed");
        }
        let slashed_stake = record.stake;
        record.stake = 0;
        record.slashed = true;
        env.storage().persistent().set(&key, &record);
        env.events()
            .publish((symbol_short!("slash"), curator), slashed_stake);
    }

    /// Returns the current stake amount for a curator (0 if not registered or slashed).
    pub fn get_curator_stake(env: Env, curator: Address) -> u64 {
        let key = Self::curator_key(&env, &curator);
        let maybe: Option<CuratorRecord> = env.storage().persistent().get(&key);
        maybe.map(|r| r.stake).unwrap_or(0)
    }

    pub fn attest_quality(
        env: Env,
        curator: Address,
        dataset_id: String,
        score: u32,
        rubric_hash: soroban_sdk::BytesN<32>,
    ) {
        curator.require_auth();
        let cur_key = Self::curator_key(&env, &curator);
        if !env.storage().persistent().has(&cur_key) {
            panic!("curator not registered");
        let record: CuratorRecord = env
            .storage()
            .persistent()
            .get(&cur_key)
            .expect("curator not registered");
        if record.slashed {
            panic!("curator is slashed");
        }
        if score > MAX_SCORE {
            panic!("score must be 0-100");
        }

        let attest = QualityAttestation {
            dataset_id: dataset_id.clone(),
            curator: curator.clone(),
            score,
            rubric_hash,
            ledger: env.ledger().sequence(),
        };
        let attest_key =
            String::from_str(&env, &format!("att_{}_{}", dataset_id, curator));
        env.storage().persistent().set(&attest_key, &attest);

        let agg_key = String::from_str(&env, &format!("agg_{}", dataset_id));
        let mut quality: DatasetQuality =
            env.storage().persistent().get(&agg_key).unwrap_or(DatasetQuality {
                dataset_id: dataset_id.clone(),
                average_score: 0,
                attestation_count: 0,
                last_updated_ledger: 0,
                tier: QualityTier::Unrated,
            });

        let new_total =
            quality.average_score as u64 * quality.attestation_count as u64 + score as u64;
        quality.attestation_count += 1;
        quality.average_score = (new_total / quality.attestation_count as u64) as u32;
        quality.last_updated_ledger = env.ledger().sequence();
        quality.tier = Self::compute_tier(quality.average_score);

        env.storage().persistent().set(&agg_key, &quality);
        env.storage()
            .persistent()
            .extend_ttl(&agg_key, 7_776_000, 7_776_000);
    }

    pub fn get_quality(env: Env, dataset_id: String) -> DatasetQuality {
        let agg_key = String::from_str(&env, &format!("agg_{}", dataset_id));
        env.storage()
            .persistent()
            .get(&agg_key)
            .expect("no quality data")
    }

    pub fn royalty_multiplier_bps(env: Env, dataset_id: String) -> u32 {
        let agg_key = String::from_str(&env, &format!("agg_{}", dataset_id));
        match env
            .storage()
            .persistent()
            .get::<String, DatasetQuality>(&agg_key)
        {
            Some(q) => match q.tier {
                QualityTier::Platinum => 15000,
                QualityTier::Gold => 12500,
                QualityTier::Silver => 10000,
                QualityTier::Bronze => 7500,
                QualityTier::Unrated => 10000,
            },
            None => 10000,
        }
    }

    fn compute_tier(score: u32) -> QualityTier {
        match score {
            0 => QualityTier::Unrated,
            1..=39 => QualityTier::Bronze,
            40..=69 => QualityTier::Silver,
            70..=84 => QualityTier::Gold,
            _ => QualityTier::Platinum,
        }
    }

    fn curator_key(env: &Env, curator: &Address) -> String {
        String::from_str(env, &format!("cur_{}", curator))
    }

    pub fn version(_env: Env) -> u32 {
        2
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use soroban_sdk::{testutils::Address as _, Env};

    fn setup(env: &Env) -> (QualityOracleClient, Address) {
        env.mock_all_auths();
        let id = env.register_contract(None, QualityOracle);
        let client = QualityOracleClient::new(env, &id);
        let admin = Address::generate(env);
        client.initialize(&admin, &1_000_000);
        (client, admin)
    }

    #[test]
    fn test_register_stores_stake() {
        let env = Env::default();
        let (client, _) = setup(&env);
        let curator = Address::generate(&env);
        client.register_curator(&curator, &2_000_000);
        assert_eq!(client.get_curator_stake(&curator), 2_000_000);
    }

    #[test]
    fn test_slash_zeroes_stake() {
        let env = Env::default();
        let (client, admin) = setup(&env);
        let curator = Address::generate(&env);
        client.register_curator(&curator, &5_000_000);
        client.slash_curator(&admin, &curator);
        assert_eq!(client.get_curator_stake(&curator), 0);
    }

    #[test]
    #[should_panic(expected = "curator is slashed")]
    fn test_slashed_curator_cannot_attest() {
        let env = Env::default();
        let (client, admin) = setup(&env);
        let curator = Address::generate(&env);
        client.register_curator(&curator, &1_000_000);
        client.slash_curator(&admin, &curator);
        let ds = soroban_sdk::String::from_str(&env, "ds-001");
        let hash = soroban_sdk::BytesN::from_array(&env, &[0u8; 32]);
        client.attest_quality(&curator, &ds, &75, &hash);
    }

    #[test]
    #[should_panic(expected = "unauthorized")]
    fn test_non_admin_cannot_slash() {
        let env = Env::default();
        let (client, _) = setup(&env);
        let curator = Address::generate(&env);
        let impostor = Address::generate(&env);
        client.register_curator(&curator, &1_000_000);
        client.slash_curator(&impostor, &curator);
    }

    #[test]
    #[should_panic(expected = "stake below minimum")]
    fn test_stake_below_minimum_rejected() {
        let env = Env::default();
        let (client, _) = setup(&env);
        let curator = Address::generate(&env);
        client.register_curator(&curator, &500_000);
    }

    #[test]
    fn test_attest_and_get_quality() {
        let env = Env::default();
        let (client, _) = setup(&env);
        let curator = Address::generate(&env);
        client.register_curator(&curator, &1_000_000);
        let ds = soroban_sdk::String::from_str(&env, "ds-gold");
        let hash = soroban_sdk::BytesN::from_array(&env, &[1u8; 32]);
        client.attest_quality(&curator, &ds, &80, &hash);
        let q = client.get_quality(&ds);
        assert_eq!(q.average_score, 80);
        assert_eq!(q.tier, QualityTier::Gold);
    }
}
