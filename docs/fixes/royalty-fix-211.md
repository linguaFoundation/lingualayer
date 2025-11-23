# Royalty Distribution — Fix #211

**Author:** Henrik Andersen
**Date:** 2025-11-23
**Type:** Bug Fix

## Problem

The royalty distribution logic in the Royalty Splitter contract contained an
edge case where the basis point weights in a split tree did not sum to exactly
10,000, causing silent truncation of the final payout instead of reverting
the transaction. This was traced to integer division rounding in the payout
loop when the total basis points were 9,999 instead of 10,000.

## Root Cause

```rust
// BEFORE (buggy): rounding error causes 1 stroop loss
let payout = (total_xlm * weight as i128) / 10_000;
```

The fix adds a validation step at split tree configuration time and an
assertion in the distribute function to ensure payouts reconcile exactly.

## Fix

```rust
// AFTER: validate weights sum before accepting split tree
fn validate_split_tree(recipients: &Vec<(Address, u32)>) -> bool {
    let total: u32 = recipients.iter().map(|(_, w)| w).sum();
    total == 10_000
}
```

Additionally, the last recipient in any distribution now receives the
remainder (`total_xlm - distributed_so_far`) to prevent any XLM being
permanently locked in the contract due to rounding.

## Testing

- `test_royalty_split_sums_to_total` — verifies no XLM is lost across all
  recipients when basis points include non-divisible remainders
- `test_invalid_basis_points_panics` — weights != 10,000 panics at config time

## Impact

Without this fix, a 4-way 25%/25%/25%/25% split distributing 1001 XLM would
lose 1 stroop on the last recipient due to integer truncation. On high-volume
enterprise licenses this compounds to measurable losses over time.
