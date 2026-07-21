#![cfg_attr(not(test), no_std)]
#[cfg(not(test))]
#[macro_use]
extern crate alloc;

use soroban_sdk::{
    contract, contractimpl, contracttype, symbol_short, token,
    Address, Env, String,
};

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub enum CommissionState {
    Open,
    Fulfilled,
    Cancelled,
    Expired,
}

#[contracttype]
#[derive(Clone, Debug)]
pub struct Commission {
    pub id: String,
    pub commissioner: Address,
    pub language_code: String,
    pub description_hash: soroban_sdk::BytesN<32>,
    pub bounty_token: Address,
    pub bounty_amount: i128,
    pub min_sample_count: u32,
    pub min_duration_seconds: u32,
    pub deadline_ledger: u32,
    pub state: CommissionState,
    pub fulfiller: Option<Address>,
    pub fulfilled_dataset_id: Option<String>,
}

#[contract]
pub struct DataCommission;

#[contractimpl]
impl DataCommission {
    pub fn initialize(env: Env, admin: Address) {
        if env.storage().instance().has(&symbol_short!("admin")) {
            panic!("already initialized");
        }
        admin.require_auth();
        env.storage().instance().set(&symbol_short!("admin"), &admin);
        env.storage().instance().set(&symbol_short!("com_cnt"), &0u32);
    }

    pub fn post_commission(
        env: Env,
        commissioner: Address,
        language_code: String,
        description_hash: soroban_sdk::BytesN<32>,
        bounty_token: Address,
        bounty_amount: i128,
        min_sample_count: u32,
        min_duration_seconds: u32,
        deadline_ledger: u32,
    ) -> String {
        commissioner.require_auth();
        if bounty_amount <= 0 { panic!("bounty must be positive"); }
        if deadline_ledger <= env.ledger().sequence() {
            panic!("deadline must be in the future");
        }

        let tok = token::Client::new(&env, &bounty_token);
        tok.transfer(&commissioner, &env.current_contract_address(), &bounty_amount);

        let cnt: u32 = env.storage().instance().get(&symbol_short!("com_cnt")).unwrap_or(0);
        let id = String::from_str(&env, &format!("com_{}", cnt + 1));

        let commission = Commission {
            id: id.clone(),
            commissioner,
            language_code: language_code.clone(),
            description_hash,
            bounty_token,
            bounty_amount,
            min_sample_count,
            min_duration_seconds,
            deadline_ledger,
            state: CommissionState::Open,
            fulfiller: None,
            fulfilled_dataset_id: None,
        };

        env.storage().persistent().set(&id, &commission);
        env.storage().persistent().extend_ttl(&id, 7_776_000, 7_776_000);
        env.storage().instance().set(&symbol_short!("com_cnt"), &(cnt + 1));

        id
    }

    pub fn fulfil_commission(
        env: Env,
        commission_id: String,
        fulfiller: Address,
        dataset_id: String,
    ) {
        let admin: Address = env.storage().instance().get(&symbol_short!("admin")).expect("not initialized");
        admin.require_auth();

        let mut comm: Commission = env.storage().persistent().get(&commission_id).expect("commission not found");
        if comm.state != CommissionState::Open {
            panic!("commission not open");
        }

        let tok = token::Client::new(&env, &comm.bounty_token);
        tok.transfer(&env.current_contract_address(), &fulfiller, &comm.bounty_amount);

        comm.state = CommissionState::Fulfilled;
        comm.fulfiller = Some(fulfiller);
        comm.fulfilled_dataset_id = Some(dataset_id);
        env.storage().persistent().set(&commission_id, &comm);
    }

    pub fn cancel_commission(env: Env, commission_id: String) {
        let mut comm: Commission = env.storage().persistent().get(&commission_id).expect("commission not found");
        if comm.state != CommissionState::Open {
            panic!("commission not open");
        }
        if env.ledger().sequence() <= comm.deadline_ledger {
            comm.commissioner.require_auth();
        }

        let tok = token::Client::new(&env, &comm.bounty_token);
        tok.transfer(&env.current_contract_address(), &comm.commissioner, &comm.bounty_amount);

        comm.state = CommissionState::Cancelled;
        env.storage().persistent().set(&commission_id, &comm);
    }

    pub fn get_commission(env: Env, commission_id: String) -> Commission {
        env.storage().persistent().get(&commission_id).expect("commission not found")
    }

    pub fn version(_env: Env) -> u32 { 1 }
}
