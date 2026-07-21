#![cfg_attr(not(test), no_std)]

use soroban_sdk::{
    contract, contractimpl, contracttype, symbol_short,
    Address, Env, String,
};

const MAX_SCORE: u32 = 100;

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
    pub fn initialize(env: Env, admin: Address) {
        if env.storage().instance().has(&symbol_short!("admin")) {
            panic!("already initialized");
        }
        admin.require_auth();
        env.storage().instance().set(&symbol_short!("admin"), &admin);
        env.storage().instance().set(&symbol_short!("cur_cnt"), &0u32);
    }

    pub fn register_curator(env: Env, curator: Address) {
        curator.require_auth();
        let key = StorageKey::Curator(curator.clone());
        if env.storage().persistent().has(&key) {
            panic!("curator already registered");
        }
        env.storage().persistent().set(&key, &true);
        env.storage().persistent().extend_ttl(&key, 7_776_000, 7_776_000);
        let cnt: u32 = env.storage().instance().get(&symbol_short!("cur_cnt")).unwrap_or(0);
        env.storage().instance().set(&symbol_short!("cur_cnt"), &(cnt + 1));
    }

    pub fn attest_quality(
        env: Env,
        curator: Address,
        dataset_id: String,
        score: u32,
        rubric_hash: soroban_sdk::BytesN<32>,
    ) {
        curator.require_auth();
        let cur_key = StorageKey::Curator(curator.clone());
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
        let attest_key = StorageKey::Attestation(dataset_id.clone(), curator);
        env.storage().persistent().set(&attest_key, &attest);

        let agg_key = StorageKey::Quality(dataset_id.clone());
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
    }

    pub fn get_quality(env: Env, dataset_id: String) -> DatasetQuality {
        let agg_key = StorageKey::Quality(dataset_id);
        env.storage().persistent().get(&agg_key).expect("no quality data")
    }

    pub fn royalty_multiplier_bps(env: Env, dataset_id: String) -> u32 {
        let agg_key = StorageKey::Quality(dataset_id);
        match env.storage().persistent().get::<StorageKey, DatasetQuality>(&agg_key) {
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
