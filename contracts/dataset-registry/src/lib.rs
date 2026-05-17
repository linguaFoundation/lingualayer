#![no_std]

use soroban_sdk::{
    contract, contractimpl, contracttype,
    symbol_short, Address, Env, String,
};

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct RegistryState {
    pub admin: Address,
    pub dataset_count: u32,
    pub version: u32,
}

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct Dataset {
    pub id: u32,
    pub name: String,
    pub language_pair: String,
    pub ipfs_hash: String,
    pub contributor: Address,
    pub license_price_xlm: i128,
    pub verified: bool,
}

#[contracttype]
pub enum DataKey {
    State,
    Dataset(u32),
}

#[contract]
pub struct DatasetRegistryContract;

#[contractimpl]
impl DatasetRegistryContract {
    pub fn initialize(env: Env, admin: Address) {
        if env.storage().instance().has(&DataKey::State) {
            panic!("Already initialized");
        }
        admin.require_auth();
        let state = RegistryState {
            admin: admin.clone(),
            dataset_count: 0,
            version: 1,
        };
        env.storage().instance().set(&DataKey::State, &state);
        env.events().publish((symbol_short!("init"),), (admin,));
    }

    pub fn register_dataset(
        env: Env,
        contributor: Address,
        name: String,
        language_pair: String,
        ipfs_hash: String,
        license_price_xlm: i128,
    ) -> u32 {
        contributor.require_auth();
        let mut state: RegistryState = env
            .storage()
            .instance()
            .get(&DataKey::State)
            .expect("Not initialized");

        let id = state.dataset_count + 1;
        let dataset = Dataset {
            id,
            name,
            language_pair: language_pair.clone(),
            ipfs_hash,
            contributor: contributor.clone(),
            license_price_xlm,
            verified: false,
        };

        env.storage()
            .persistent()
            .set(&DataKey::Dataset(id), &dataset);

        state.dataset_count = id;
        env.storage().instance().set(&DataKey::State, &state);

        env.events().publish(
            (symbol_short!("register"),),
            (id, contributor, language_pair),
        );

        id
    }

    pub fn verify_dataset(env: Env, admin: Address, dataset_id: u32) {
        admin.require_auth();
        let state: RegistryState = env
            .storage()
            .instance()
            .get(&DataKey::State)
            .expect("Not initialized");
        if state.admin != admin {
            panic!("Unauthorized");
        }
        let mut dataset: Dataset = env
            .storage()
            .persistent()
            .get(&DataKey::Dataset(dataset_id))
            .expect("Dataset not found");

        dataset.verified = true;
        env.storage()
            .persistent()
            .set(&DataKey::Dataset(dataset_id), &dataset);

        env.events()
            .publish((symbol_short!("verified"),), (dataset_id,));
    }

    pub fn get_dataset(env: Env, dataset_id: u32) -> Dataset {
        env.storage()
            .persistent()
            .get(&DataKey::Dataset(dataset_id))
            .expect("Dataset not found")
    }

    pub fn get_count(env: Env) -> u32 {
        let state: RegistryState = env
            .storage()
            .instance()
            .get(&DataKey::State)
            .expect("Not initialized");
        state.dataset_count
    }

    pub fn get_state(env: Env) -> RegistryState {
        env.storage()
            .instance()
            .get(&DataKey::State)
            .expect("Not initialized")
    }
}

#[cfg(test)]
mod test {
    use super::*;
    use soroban_sdk::{testutils::Address as _, Address, Env, String};

    #[test]
    fn test_full_lifecycle() {
        let env = Env::default();
        env.mock_all_auths();
        let contract_id = env.register(DatasetRegistryContract, ());
        let client = DatasetRegistryContractClient::new(&env, &contract_id);

        let admin = Address::generate(&env);
        let contributor = Address::generate(&env);

        client.initialize(&admin);

        let id = client.register_dataset(
            &contributor,
            &String::from_str(&env, "React Docs EN-SW"),
            &String::from_str(&env, "EN->SW"),
            &String::from_str(&env, "QmXzY7bN9wKpL3mR8vT2sD6fG4hJ5kM1nP0qA"),
            &180_i128,
        );
        assert_eq!(id, 1);
        assert_eq!(client.get_count(), 1);

        client.verify_dataset(&admin, &1);
        let dataset = client.get_dataset(&1);
        assert!(dataset.verified);
    }
}
