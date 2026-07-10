# LinguaLayer — Language Rights Protocol on Stellar

LinguaLayer builds transparent licensing and royalty splits for African and underrepresented languages — so communities earn when their voices power the next wave of AI.

[![CI](https://github.com/linguaFoundation/lingualayer/actions/workflows/ci.yml/badge.svg)](https://github.com/linguaFoundation/lingualayer/actions)

---

## 🆕 What's New in v2 (Appeal Update)

### 1. QualityOracle Contract
Trusted language curators stake XLM and submit quality attestations (0–100) for every dataset. Scores drive a **royalty multiplier**:
Platinum (1.5x), Gold (1.25x), Silver (1.0x), Bronze (0.75x).

### 2. Dataset Commissioning Escrow (DataCommission Contract)
AI companies can post **USDC bounties** for specific language datasets:
- Post a commission → USDC locked in smart contract escrow
- Contributors deliver → admin verifies → escrow released on-chain
- Browseable at `/bounties` — our new **Language Bounty Board** page.

### 3. All Stellar Wallets via Stellar Wallets Kit
We replaced custom Freighter-only hooks with **@creit-tech/stellar-wallets-kit** supporting Freighter, xBull, Lobstr, Hana, Rabet, WalletConnect, Ledger, and ALBEDO.

### 4. SEP-0010 Web Authentication
Replaced custom SIWS with the **official Stellar SEP-0010** web authentication standard.

---

## Protocol Architecture

```
linguaFoundation/lingualayer/
├── apps/
│   ├── backend/        # Fastify API + indexer (SEP-0010 + Commissions)
│   └── web/            # Next.js 14 Web App (Stellar Wallets Kit + Bounty Board)
└── contracts/
    ├── dataset-registry/   # Dataset + contributor + reputation
    ├── license-router/     # Licensing engine
    ├── royalty-splitter/   # Revenue split router
    ├── quality-oracle/     # Quality attestations oracle
    └── data-commission/    # USDC escrow for data bounties
```
