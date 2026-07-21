#![no_std]
extern crate alloc;
use alloc::format;
use soroban_sdk::{
    contract, contractimpl, contracttype, symbol_short,
    Address, Env, String, Symbol, Vec,
};

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub enum DatasetState { Active, Deprecated, UnderReview }

/// Payload published with the `("dataset", "registered")` event topic.
///
/// This is the on-chain provenance record the off-chain indexer subscribes to
/// (see `apps/backend/src/indexer`). Every field here is what the indexer needs
/// to materialize a row without re-reading contract storage, so the event is
/// intentionally self-contained.
#[contracttype]
#[derive(Clone, Debug)]
pub struct DatasetRegisteredEvent {
    pub id: String,
    pub owner: Address,
    pub language_code: String,
    pub name: String,
    pub metadata_hash: soroban_sdk::BytesN<32>,
    pub version: u32,
    pub sample_count: u32,
    pub duration_seconds: u32,
    pub commission_id: Option<String>,
    pub created_ledger: u32,
}

#[contracttype]
#[derive(Clone, Debug)]
pub struct ContributorShare {
    pub address: Address,
    pub share_bps: u32,
}

#[contracttype]
#[derive(Clone, Debug)]
pub struct Dataset {
    pub id: String,
    pub owner: Address,
    pub language_code: String,
    pub name: String,
    pub metadata_hash: soroban_sdk::BytesN<32>,
    pub version: u32,
    pub state: DatasetState,
    pub contributors: Vec<ContributorShare>,
    pub created_ledger: u32,
    pub sample_count: u32,
    pub duration_seconds: u32,
    pub commission_id: Option<String>,
}

#[contracttype]
#[derive(Clone, Debug)]
pub struct ContributorReputation {
    pub address: Address,
    pub reputation_score: u32,
    pub datasets_registered: u32,
    pub total_royalties_stroops: i128,
    pub quality_average: u32,
}

#[contract]
pub struct DatasetRegistry;

#[contractimpl]
impl DatasetRegistry {
    pub fn initialize(env: Env, admin: Address) {
        if env.storage().instance().has(&symbol_short!("admin")) {
            panic!("already initialized");
        }
        admin.require_auth();
        env.storage().instance().set(&symbol_short!("admin"), &admin);
        env.storage().instance().set(&symbol_short!("count"), &0u32);
    }

    pub fn register_dataset(
        env: Env,
        owner: Address,
        language_code: String,
        name: String,
        metadata_hash: soroban_sdk::BytesN<32>,
        contributors: Vec<ContributorShare>,
        sample_count: u32,
        duration_seconds: u32,
        commission_id: Option<String>,
    ) -> String {
        owner.require_auth();
        let total: u32 = contributors.iter().map(|c| c.share_bps).sum();
        if total != 10000 { panic!("contributor shares must sum to 10000 bps"); }

        let count: u32 = env.storage().instance().get(&symbol_short!("count")).unwrap_or(0);
        let id = String::from_str(&env, &format!("ds_{}", count + 1));

        let dataset = Dataset {
            id: id.clone(),
            owner: owner.clone(),
            language_code: language_code.clone(),
            name: name.clone(),
            metadata_hash,
            version: 1,
            state: DatasetState::Active,
            contributors,
            created_ledger: env.ledger().sequence(),
            sample_count,
            duration_seconds,
            commission_id,
        };

        env.storage().persistent().set(&id, &dataset);
        env.storage().instance().set(&symbol_short!("count"), &(count + 1));
        env.storage().persistent().extend_ttl(&id, 7_776_000, 7_776_000);

        Self::increment_reputation(&env, &owner);

        // Provenance event for off-chain indexers. Topic is
        // ("dataset", "registered"); the data is the full self-contained record.
        // "registered" exceeds the 9-char `symbol_short!` limit, so build it with
        // `Symbol::new`.
        env.events().publish(
            (symbol_short!("dataset"), Symbol::new(&env, "registered")),
            DatasetRegisteredEvent {
                id: dataset.id.clone(),
                owner: dataset.owner.clone(),
                language_code: dataset.language_code.clone(),
                name: dataset.name.clone(),
                metadata_hash: dataset.metadata_hash.clone(),
                version: dataset.version,
                sample_count: dataset.sample_count,
                duration_seconds: dataset.duration_seconds,
                commission_id: dataset.commission_id.clone(),
                created_ledger: dataset.created_ledger,
            },
        );

        id
    }

    fn increment_reputation(env: &Env, address: &Address) {
        let rep_key = String::from_str(env, &format!("rep_{:?}", address));
        let mut rep: ContributorReputation = env.storage().persistent()
            .get(&rep_key)
            .unwrap_or(ContributorReputation {
                address: address.clone(),
                reputation_score: 0,
                datasets_registered: 0,
                total_royalties_stroops: 0,
                quality_average: 0,
            });
        rep.datasets_registered += 1;
        rep.reputation_score = (rep.reputation_score + 50).min(1000);
        env.storage().persistent().set(&rep_key, &rep);
        env.storage().persistent().extend_ttl(&rep_key, 7_776_000, 7_776_000);
    }

    pub fn get_reputation(env: Env, address: Address) -> ContributorReputation {
        let rep_key = String::from_str(&env, &format!("rep_{:?}", address));
        env.storage().persistent().get(&rep_key).expect("no reputation data")
    }

    pub fn get_dataset(env: Env, dataset_id: String) -> Dataset {
        env.storage().persistent().get(&dataset_id).expect("dataset not found")
    }

    pub fn dataset_count(env: Env) -> u32 {
        env.storage().instance().get(&symbol_short!("count")).unwrap_or(0)
    }

    pub fn version(_env: Env) -> u32 { 3 }
}

#[cfg(test)]
mod test {
    use super::*;
    use soroban_sdk::testutils::{Address as _, Events, Ledger};
    use soroban_sdk::{vec, IntoVal, TryFromVal};

    fn setup() -> (Env, DatasetRegistryClient<'static>, Address) {
        let env = Env::default();
        env.mock_all_auths();
        let contract_id = env.register_contract(None, DatasetRegistry);
        let client = DatasetRegistryClient::new(&env, &contract_id);
        let admin = Address::generate(&env);
        client.initialize(&admin);
        (env, client, contract_id)
    }

    fn sample_contributors(env: &Env, owner: &Address) -> Vec<ContributorShare> {
        vec![env, ContributorShare { address: owner.clone(), share_bps: 10000 }]
    }

    fn hash(env: &Env) -> soroban_sdk::BytesN<32> {
        soroban_sdk::BytesN::from_array(env, &[7u8; 32])
    }

    #[test]
    fn register_dataset_publishes_a_registered_event() {
        let (env, client, contract_id) = setup();
        let owner = Address::generate(&env);
        env.ledger().set_sequence_number(42);

        let id = client.register_dataset(
            &owner,
            &String::from_str(&env, "yo"),
            &String::from_str(&env, "Yoruba Proverbs"),
            &hash(&env),
            &sample_contributors(&env, &owner),
            &1234u32,
            &600u32,
            &None,
        );

        // Exactly one event, from this contract, with the provenance topic.
        let events = env.events().all();
        assert_eq!(events.len(), 1);
        let (emitting_contract, topics, data) = events.last().unwrap();
        assert_eq!(emitting_contract, contract_id);

        let expected_topics: Vec<soroban_sdk::Val> =
            (symbol_short!("dataset"), Symbol::new(&env, "registered")).into_val(&env);
        assert_eq!(topics, expected_topics);

        // The event payload round-trips and mirrors the stored dataset.
        let payload = DatasetRegisteredEvent::try_from_val(&env, &data).unwrap();
        assert_eq!(payload.id, id);
        assert_eq!(payload.owner, owner);
        assert_eq!(payload.language_code, String::from_str(&env, "yo"));
        assert_eq!(payload.name, String::from_str(&env, "Yoruba Proverbs"));
        assert_eq!(payload.version, 1);
        assert_eq!(payload.sample_count, 1234);
        assert_eq!(payload.duration_seconds, 600);
        assert_eq!(payload.created_ledger, 42);
        assert_eq!(payload.commission_id, None);
    }

    #[test]
    fn commission_id_is_carried_in_the_event() {
        let (env, client, _) = setup();
        let owner = Address::generate(&env);
        let commission = String::from_str(&env, "cm_9");

        client.register_dataset(
            &owner,
            &String::from_str(&env, "ha"),
            &String::from_str(&env, "Hausa Corpus"),
            &hash(&env),
            &sample_contributors(&env, &owner),
            &10u32,
            &0u32,
            &Some(commission.clone()),
        );

        let (_, _, data) = env.events().all().last().unwrap();
        let payload = DatasetRegisteredEvent::try_from_val(&env, &data).unwrap();
        assert_eq!(payload.commission_id, Some(commission));
    }

    #[test]
    fn each_registration_emits_its_own_event_with_a_unique_id() {
        let (env, client, _) = setup();
        let owner = Address::generate(&env);
        let contributors = sample_contributors(&env, &owner);

        for _ in 0..3 {
            client.register_dataset(
                &owner,
                &String::from_str(&env, "sw"),
                &String::from_str(&env, "Swahili"),
                &hash(&env),
                &contributors,
                &5u32,
                &0u32,
                &None,
            );
        }

        let events = env.events().all();
        assert_eq!(events.len(), 3);

        let mut ids: Vec<String> = Vec::new(&env);
        for (_, _, data) in events.iter() {
            let payload = DatasetRegisteredEvent::try_from_val(&env, &data).unwrap();
            ids.push_back(payload.id);
        }
        assert_eq!(ids, vec![
            &env,
            String::from_str(&env, "ds_1"),
            String::from_str(&env, "ds_2"),
            String::from_str(&env, "ds_3"),
        ]);
    }

    #[test]
    #[should_panic(expected = "contributor shares must sum to 10000 bps")]
    fn bad_shares_emit_no_event() {
        let (env, client, _) = setup();
        let owner = Address::generate(&env);
        let bad = vec![&env, ContributorShare { address: owner.clone(), share_bps: 9999 }];
        // A rejected registration must panic before publishing an event.
        client.register_dataset(
            &owner,
            &String::from_str(&env, "ig"),
            &String::from_str(&env, "Igbo"),
            &hash(&env),
            &bad,
            &1u32,
            &0u32,
            &None,
        );
    }
}
