#![no_std]
use soroban_sdk::{
    contract, contractimpl, contracttype,
    Address, Env, String, Vec,
};

const MAX_SCORE: u32 = 100;

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

#[contracttype]
#[derive(Clone, Debug)]
pub struct CuratorStats {
    pub curator: Address,
    pub attestation_count: u32,
    pub average_score: u32,
    pub tier: QualityTier,
}

#[contracttype]
#[derive(Clone)]
enum DataKey {
    Admin,
    CuratorCount,
    CuratorList,
    Curator(Address),
    Attestation(String, Address),
    Quality(String),
    CuratorStats(Address),
}

#[contract]
pub struct QualityOracle;

#[contractimpl]
impl QualityOracle {
    pub fn initialize(env: Env, admin: Address) {
        if env.storage().instance().has(&DataKey::Admin) {
            panic!("already initialized");
        }
        admin.require_auth();
        env.storage().instance().set(&DataKey::Admin, &admin);
        env.storage().instance().set(&DataKey::CuratorCount, &0u32);
    }

    pub fn register_curator(env: Env, curator: Address) {
        curator.require_auth();
        let key = DataKey::Curator(curator.clone());
        if env.storage().persistent().has(&key) {
            panic!("curator already registered");
        }
        env.storage().persistent().set(&key, &true);
        env.storage().persistent().extend_ttl(&key, 7_776_000, 7_776_000);
        let cnt: u32 = env.storage().instance().get(&DataKey::CuratorCount).unwrap_or(0);
        env.storage().instance().set(&DataKey::CuratorCount, &(cnt + 1));

        let mut curators: Vec<Address> = env.storage().instance()
            .get(&DataKey::CuratorList)
            .unwrap_or(Vec::new(&env));
        curators.push_back(curator);
        env.storage().instance().set(&DataKey::CuratorList, &curators);
    }

    pub fn attest_quality(
        env: Env,
        curator: Address,
        dataset_id: String,
        score: u32,
        rubric_hash: soroban_sdk::BytesN<32>,
    ) {
        curator.require_auth();
        let cur_key = DataKey::Curator(curator.clone());
        if !env.storage().persistent().has(&cur_key) {
            panic!("curator not registered");
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
        let attest_key = DataKey::Attestation(dataset_id.clone(), curator.clone());
        env.storage().persistent().set(&attest_key, &attest);

        let agg_key = DataKey::Quality(dataset_id.clone());
        let mut quality: DatasetQuality = env.storage().persistent()
            .get(&agg_key)
            .unwrap_or(DatasetQuality {
                dataset_id: dataset_id.clone(),
                average_score: 0,
                attestation_count: 0,
                last_updated_ledger: 0,
                tier: QualityTier::Unrated,
            });

        let new_total = quality.average_score as u64 * quality.attestation_count as u64 + score as u64;
        quality.attestation_count += 1;
        quality.average_score = (new_total / quality.attestation_count as u64) as u32;
        quality.last_updated_ledger = env.ledger().sequence();
        quality.tier = Self::compute_tier(quality.average_score);

        env.storage().persistent().set(&agg_key, &quality);
        env.storage().persistent().extend_ttl(&agg_key, 7_776_000, 7_776_000);

        let stats_key = DataKey::CuratorStats(curator.clone());
        let mut stats: CuratorStats = env.storage().persistent()
            .get(&stats_key)
            .unwrap_or(CuratorStats {
                curator: curator.clone(),
                attestation_count: 0,
                average_score: 0,
                tier: QualityTier::Unrated,
            });

        let stats_total = stats.average_score as u64 * stats.attestation_count as u64 + score as u64;
        stats.attestation_count += 1;
        stats.average_score = (stats_total / stats.attestation_count as u64) as u32;
        stats.tier = Self::compute_tier(stats.average_score);

        env.storage().persistent().set(&stats_key, &stats);
        env.storage().persistent().extend_ttl(&stats_key, 7_776_000, 7_776_000);
    }

    pub fn get_quality(env: Env, dataset_id: String) -> DatasetQuality {
        env.storage().persistent().get(&DataKey::Quality(dataset_id)).expect("no quality data")
    }

    /// Every curator address that has ever called `register_curator`, in registration order.
    pub fn list_curators(env: Env) -> Vec<Address> {
        env.storage().instance()
            .get(&DataKey::CuratorList)
            .unwrap_or(Vec::new(&env))
    }

    /// Aggregate activity/reliability stats for one curator, used to build the leaderboard.
    pub fn get_curator_stats(env: Env, curator: Address) -> CuratorStats {
        env.storage().persistent()
            .get(&DataKey::CuratorStats(curator.clone()))
            .unwrap_or(CuratorStats {
                curator,
                attestation_count: 0,
                average_score: 0,
                tier: QualityTier::Unrated,
            })
    }

    pub fn royalty_multiplier_bps(env: Env, dataset_id: String) -> u32 {
        match env.storage().persistent().get::<DataKey, DatasetQuality>(&DataKey::Quality(dataset_id)) {
            Some(q) => match q.tier {
                QualityTier::Platinum => 15000,
                QualityTier::Gold     => 12500,
                QualityTier::Silver   => 10000,
                QualityTier::Bronze   => 7500,
                QualityTier::Unrated  => 10000,
            },
            None => 10000,
        }
    }

    fn compute_tier(score: u32) -> QualityTier {
        match score {
            0           => QualityTier::Unrated,
            1..=39      => QualityTier::Bronze,
            40..=69     => QualityTier::Silver,
            70..=84     => QualityTier::Gold,
            _           => QualityTier::Platinum,
        }
    }

    pub fn version(_env: Env) -> u32 { 1 }
}

#[cfg(test)]
mod test {
    use super::*;
    use soroban_sdk::testutils::Address as _;
    use soroban_sdk::BytesN;

    fn hash(env: &Env, byte: u8) -> BytesN<32> {
        BytesN::from_array(env, &[byte; 32])
    }

    #[test]
    fn list_curators_tracks_registration_order() {
        let env = Env::default();
        env.mock_all_auths();
        let contract_id = env.register_contract(None, QualityOracle);
        let client = QualityOracleClient::new(&env, &contract_id);

        let admin = Address::generate(&env);
        client.initialize(&admin);

        let curator_a = Address::generate(&env);
        let curator_b = Address::generate(&env);
        client.register_curator(&curator_a);
        client.register_curator(&curator_b);

        let curators = client.list_curators();
        assert_eq!(curators.len(), 2);
        assert_eq!(curators.get(0).unwrap(), curator_a);
        assert_eq!(curators.get(1).unwrap(), curator_b);
    }

    #[test]
    fn curator_stats_aggregate_across_datasets() {
        let env = Env::default();
        env.mock_all_auths();
        let contract_id = env.register_contract(None, QualityOracle);
        let client = QualityOracleClient::new(&env, &contract_id);

        let admin = Address::generate(&env);
        client.initialize(&admin);

        let curator = Address::generate(&env);
        client.register_curator(&curator);

        let dataset_a = String::from_str(&env, "yo-proverbs-001");
        let dataset_b = String::from_str(&env, "sw-news-002");

        client.attest_quality(&curator, &dataset_a, &80, &hash(&env, 1));
        client.attest_quality(&curator, &dataset_b, &60, &hash(&env, 2));

        let stats = client.get_curator_stats(&curator);
        assert_eq!(stats.attestation_count, 2);
        assert_eq!(stats.average_score, 70);
        assert_eq!(stats.tier, QualityTier::Gold);
    }

    #[test]
    fn curator_stats_defaults_for_unknown_curator() {
        let env = Env::default();
        env.mock_all_auths();
        let contract_id = env.register_contract(None, QualityOracle);
        let client = QualityOracleClient::new(&env, &contract_id);

        let admin = Address::generate(&env);
        client.initialize(&admin);

        let stranger = Address::generate(&env);
        let stats = client.get_curator_stats(&stranger);
        assert_eq!(stats.attestation_count, 0);
        assert_eq!(stats.average_score, 0);
        assert_eq!(stats.tier, QualityTier::Unrated);
    }

    #[test]
    #[should_panic(expected = "curator already registered")]
    fn register_curator_twice_panics() {
        let env = Env::default();
        env.mock_all_auths();
        let contract_id = env.register_contract(None, QualityOracle);
        let client = QualityOracleClient::new(&env, &contract_id);

        let admin = Address::generate(&env);
        client.initialize(&admin);

        let curator = Address::generate(&env);
        client.register_curator(&curator);
        client.register_curator(&curator);
    }
}
