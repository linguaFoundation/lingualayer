# Proof-of-Translation Consensus — Refactor #211

**Author:** Ngozi Obiora
**Date:** 2025-11-23
**Type:** Refactor

## Overview

This refactor improves the internal structure of the Proof-of-Translation (PoT)
consensus mechanism. PoT is LinguaLayer's quality gate: before a dataset is marked
`Verified` and eligible for enterprise licensing, a quorum of independent peer
reviewers must attest to translation accuracy on-chain.

## Problem

The original consensus check used a simple threshold comparison
(`approve_count >= 3`) that didn't account for cases where:
1. The same reviewer submitted multiple reviews for the same dataset
2. Reviewers who are also contributors reviewed their own work
3. The dataset owner attempted a self-review

## Changes

### Deduplication Guard
Added a `reviews_by: Set<Address>` field to `DatasetRecord` to track which
addresses have already submitted a review. Duplicate submissions now panic with
`AlreadyReviewed` rather than silently incrementing the counter.

### Self-Review Prevention
`submit_review()` now compares `reviewer == dataset.contributor` and panics with
`SelfReviewNotAllowed` to enforce the independence requirement.

### Consensus Threshold Configuration
Threshold moved from a hardcoded `3` to a configurable `consensus_threshold: u32`
stored in registry instance storage. Admin can update via `set_consensus_threshold`.

## Testing Notes

Unit tests updated to cover:
- `test_duplicate_review_panics` — same address submits twice
- `test_self_review_panics` — contributor reviews own dataset
- `test_consensus_at_threshold` — exactly N approvals triggers Verified

## Related
- PoT specification: `docs/architecture.md#proof-of-translation`
