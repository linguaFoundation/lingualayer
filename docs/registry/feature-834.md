# Dataset Registry — Feature #834

**Author:** Ngozi Obiora
**Date:** 2025-11-22
**Type:** Feature implementation

## Summary

This change advances the LinguaLayer Dataset Registry by extending the on-chain
indexing mechanism for language pair assets. Each dataset registered through the
`register_dataset` contract function is assigned a unique `dataset_id` and anchored
with an IPFS content hash — ensuring the raw dataset never touches the chain while
its provenance is permanently verifiable.

## Changes

### Registry State Additions
- Added `language_pair` field to `DatasetRecord` struct for front-end filtering
- Extended `DataKey::Dataset(u32)` storage key to support persistent lookups by hash
- Added `dataset_count` increment guard to prevent integer overflow on high-volume
  deployments (relevant for markets with >10k datasets, e.g. Swahili-English pairs)

### Storage Layout
The dataset record now stores:
```
DatasetRecord {
  id: u32,
  name: String,           // human-readable dataset name
  language_pair: String,  // e.g. "EN->SW"
  ipfs_hash: String,      // IPFS CID of the full dataset
  contributor: Address,   // Stellar address of registrant
  license_price_xlm: i128,
  verified: bool,
}
```

### Event Schema
`register` event now emits `(id, contributor, language_pair)` as indexed fields
so the off-chain indexer can efficiently filter by language pair without full
contract state scans.

## Notes

The `language_pair` field uses arrow notation (`EN->SW`) rather than BCP-47 tags
to remain readable in contract storage and on-chain explorers like Stellar Expert.
A future PR will add BCP-47 metadata to the IPFS-linked dataset manifest.

## References
- LinguaLayer Architecture: `docs/architecture.md`
- Soroban persistent storage docs: https://docs.stellar.org/docs/build/smart-contracts/getting-started/storing-data
