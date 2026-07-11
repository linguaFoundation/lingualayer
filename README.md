# LinguaLayer — Language Rights Protocol on Stellar

> **The missing economic infrastructure for linguistic diversity in AI.**
> African and underrepresented language communities earn perpetual, on-chain royalties every time their datasets power an AI model.

[![CI](https://github.com/linguaFoundation/lingualayer/actions/workflows/ci.yml/badge.svg)](https://github.com/linguaFoundation/lingualayer/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](./LICENSE.md)
[![Stellar Testnet](https://img.shields.io/badge/Stellar-Testnet-blue)](https://stellar.expert/explorer/testnet)
[![Live App](https://img.shields.io/badge/App-lingualayer.vercel.app-orange)](https://lingualayer.vercel.app)

---

## 🔗 Links

| Resource | URL |
|---|---|
| 🌐 Web App (Live) | https://lingualayer.vercel.app |
| 📦 Monorepo | https://github.com/linguaFoundation/lingualayer |
| 🔍 Testnet Explorer | https://stellar.expert/explorer/testnet |
| 📄 DatasetRegistry Contract | `CBET4YWSMIZB3LGLVTDKQJ5HXQAPQGM3NKGXJLJEJQNF7TBDOVMXUOK` |
| 🔮 QualityOracle Contract | `CCJVLNJ5O4NHIFMJMYZRFYIBRFM3WS7BKGYGWIQXNQYFXQTUYAEZQR5` |
| 💰 DataCommission Contract | `CDTGZ2PFUODWQFKLCMF2XZ7NY2HQPJFN3BQKUOIYRBKL5VWKRQBZLMJ` |
| 🛤️ LicenseRouter Contract | `CAQPZ5IK3WSHZTRQUAEKK3GMVKHSMWUFMJ4RFBOQ2QYQAUWK2TGZJMK` |
| 💸 RoyaltySplitter Contract | `CBQPFV7LQRSQOJTLXE7LIQXZSPJHBV7LQYSVYUUQZFJTJDZMUFKGQHJ` |

---

## 🌍 What is LinguaLayer?

LinguaLayer is a **decentralized protocol built on Stellar Soroban** that enables fair, transparent ownership and monetization of multilingual AI training datasets.

Every Yoruba sentence, every Swahili paragraph, every Igbo audio clip scraped from the web powers billion-dollar AI models — yet the communities who speak those languages receive no compensation, attribution, or control. LinguaLayer changes this:

- **On-chain attribution** — every dataset is registered with its contributors' Stellar addresses and share allocations
- **Automatic royalties** — every license purchase triggers a programmable split to all contributors instantly
- **Quality-gated multipliers** — certified curators attest dataset quality on-chain, boosting royalties for high-quality contributions
- **Trustless commissioning** — AI companies post USDC bounties for specific language datasets; funds are held in escrow and released on delivery

---

## 🆕 What's New in v2

### 1. 🔮 QualityOracle Contract
Trusted language curators stake XLM and submit quality attestations (score: 0–100) for any registered dataset. Scores aggregate into a **quality tier** that feeds a **royalty multiplier** applied on every license purchase:

| Tier | Score Range | Royalty Multiplier |
|---|---|---|
| 🏆 Platinum | 90–100 | 1.5× |
| 🥇 Gold | 75–89 | 1.25× |
| 🥈 Silver | 50–74 | 1.0× |
| 🥉 Bronze | 0–49 | 0.75× |

- Curators who submit malicious or outlier attestations face **slashing** of their stake
- A minimum attestation quorum is required before a quality tier is assigned
- Quality scores are stored permanently on-chain and visible via the Dataset Detail page

### 2. 💰 DataCommission Contract — Language Bounty Board
AI companies and researchers can post **USDC-denominated bounties** for specific language datasets they need:

```
Post Commission → USDC locked in escrow → Contributor delivers → Admin verifies → Escrow released on-chain
```

- Commissions are browseable at `/bounties` — the **Language Bounty Board**
- Arbiter role available for disputed commissions
- Milestone-based escrow release for larger bounties
- Commission deadline countdown on every bounty card

### 3. 👛 All Stellar Wallets — Stellar Wallets Kit
We replaced custom Freighter-only connection logic with **`@creit.tech/stellar-wallets-kit`**, enabling native support for every major Stellar wallet:

| Wallet | Type |
|---|---|
| Freighter | Browser Extension |
| xBull | Browser Extension + PWA |
| Lobstr | Mobile + Extension |
| Hana | Browser Extension |
| Rabet | Browser Extension |
| WalletConnect | QR Code / Mobile |
| Ledger | Hardware Wallet |
| ALBEDO | Web-based Signer |

### 4. 🔐 SEP-0010 Web Authentication
Replaced custom Sign-In With Stellar (SIWS) with the **official Stellar SEP-0010 web authentication standard**:
- Backend issues a signed challenge transaction using the `manage_data` operation
- Client signs with their wallet and returns the envelope
- Backend verifies the signature against the Stellar network
- Issues a JWT for authenticated API calls

### 5. 📊 DatasetRegistry v3 Upgrades
- Duplicate registration prevention (hash-based deduplication)
- ISO 639-3 language code validation at the contract level
- Reputation score tracked per contributor address
- Weighted contributor share modification by dataset owner
- Admin upgrade path via WASM hash rotation

---

## 🏛️ Protocol Architecture

```
linguaFoundation/lingualayer/          (monorepo)
│
├── apps/
│   ├── web/                           # Next.js 15 Frontend
│   │   ├── app/                       # App Router pages
│   │   │   ├── page.tsx               # Dataset Marketplace
│   │   │   ├── /bounties/             # Language Bounty Board
│   │   │   ├── /communities/          # Language Community Explorer
│   │   │   ├── /governance/           # Community Governance Voting
│   │   │   ├── /royalties/            # Contributor Royalty Dashboard
│   │   │   ├── /licensing/            # License Purchase Flow
│   │   │   └── /roadmap/              # Public Roadmap
│   │   └── lib/
│   │       └── wallets-kit.ts         # Stellar Wallets Kit integration
│   │
│   └── backend/                       # Fastify REST + WebSocket API
│       ├── src/indexer/               # Soroban event indexer → Postgres
│       ├── src/routes/sep10/          # SEP-0010 auth endpoints
│       ├── src/routes/datasets/       # Dataset listing + detail
│       ├── src/routes/commissions/    # DataCommission API
│       └── src/routes/quality/        # QualityOracle attestation API
│
├── contracts/                         # Soroban smart contracts (Rust)
│   ├── dataset-registry/              # Dataset attribution + contributor shares
│   ├── license-router/                # License issuance + validation + revocation
│   ├── royalty-splitter/              # Weighted royalty distribution (5% treasury)
│   ├── quality-oracle/                # Curator staking + attestation + slashing
│   └── data-commission/               # USDC escrow bounty board
│
├── docs/                              # Protocol documentation
│   └── ARCHITECTURE.md               # Contract interaction patterns
│
├── .github/workflows/
│   └── ci.yml                         # Node App Build + Rust/Soroban Build CI
│
└── README.md
```

---

## 📜 Smart Contracts — Testnet Deployment

All contracts are deployed and verified on **Stellar Testnet**.

| Contract | Address | Description |
|---|---|---|
| DatasetRegistry v3 | `CBET4YWSMIZB3LGLVTDKQJ5HXQAPQGM3NKGXJLJEJQNF7TBDOVMXUOK` | Core dataset + contributor registry |
| LicenseRouter | `CAQPZ5IK3WSHZTRQUAEKK3GMVKHSMWUFMJ4RFBOQ2QYQAUWK2TGZJMK` | On-chain license issuance & validation |
| RoyaltySplitter | `CBQPFV7LQRSQOJTLXE7LIQXZSPJHBV7LQYSVYUUQZFJTJDZMUFKGQHJ` | Weighted revenue distribution |
| QualityOracle | `CCJVLNJ5O4NHIFMJMYZRFYIBRFM3WS7BKGYGWIQXNQYFXQTUYAEZQR5` | Curator staking + quality scoring |
| DataCommission | `CDTGZ2PFUODWQFKLCMF2XZ7NY2HQPJFN3BQKUOIYRBKL5VWKRQBZLMJ` | USDC escrow + bounty board |

> 🔍 All contracts are verifiable on [Stellar Expert (Testnet)](https://stellar.expert/explorer/testnet).

---

## ⚡ Quick Start

### Prerequisites
- Node.js 20+
- Rust + `soroban-cli`
- A Stellar Testnet wallet (Freighter recommended)

### Run the Web App Locally

```bash
git clone https://github.com/linguaFoundation/lingualayer.git
cd lingualayer/apps/web
npm install
cp .env.example .env.local
# Set NEXT_PUBLIC_STELLAR_NETWORK=testnet
npm run dev
```

App runs at `http://localhost:3000`.

### Run the Backend API Locally

```bash
cd lingualayer/apps/backend
npm install
cp .env.example .env
# Configure DATABASE_URL, STELLAR_NETWORK=testnet, CONTRACT addresses
npm run dev
```

Backend runs at `http://localhost:4000`.

### Build & Deploy Contracts

```bash
cd lingualayer/contracts
# Build all contracts
cargo build --target wasm32-unknown-unknown --release

# Deploy DatasetRegistry (example)
soroban contract deploy \
  --wasm target/wasm32-unknown-unknown/release/dataset_registry.wasm \
  --source <YOUR_SECRET_KEY> \
  --network testnet
```

---

## 🔄 Contract Interaction Flow

```
User connects wallet (Freighter / xBull / Lobstr / etc.)
         │
         ▼
SEP-0010 Authentication (backend issues challenge → wallet signs → JWT issued)
         │
         ▼
┌────────────────────────────────────────────────────────────┐
│                    Dataset Marketplace                     │
│  Browse datasets → filter by language → view contributors │
└──────────────────────────┬─────────────────────────────────┘
                           │
              ┌────────────▼────────────┐
              │      License Purchase   │
              │  LicenseRouter.issue()  │
              └────────────┬────────────┘
                           │
         ┌─────────────────▼──────────────────┐
         │         QualityOracle              │
         │   Reads quality score → tier →     │
         │   applies royalty multiplier       │
         └─────────────────┬──────────────────┘
                           │
         ┌─────────────────▼──────────────────┐
         │         RoyaltySplitter            │
         │  Distributes USDC to all           │
         │  contributor addresses by share %  │
         │  5% → protocol treasury            │
         └────────────────────────────────────┘
```

---

## 🗺️ Roadmap

| Phase | Status | Milestone |
|---|---|---|
| Phase 1 | ✅ Complete | DatasetRegistry + LicenseRouter + RoyaltySplitter deployed to Testnet |
| Phase 2 | ✅ Complete | QualityOracle + DataCommission deployed; multi-wallet support; SEP-0010 |
| Phase 3 | 🔜 In Progress | Security audit of all 5 contracts |
| Phase 4 | 🔜 Planned | Mainnet deployment + first 50 African language community onboarding |
| Phase 5 | 🔜 Planned | AI company partnership program + data procurement API |

---

## 🤝 Contributing

We welcome contributors! We have **154 open GitHub Issues** labeled by component and priority:

- `[priority: critical]` — blocking mainnet launch
- `[priority: high]` — important for v2 feature completeness
- `[component: contracts]` — Soroban/Rust work
- `[component: backend]` — Fastify API + indexer
- `[component: frontend]` — Next.js UI/UX

See [`CONTRIBUTING.md`](./CONTRIBUTING.md) for setup instructions and our PR workflow.

---

## 🔒 Security

See [`SECURITY.md`](./SECURITY.md) for our vulnerability disclosure policy.

**Current security posture:**
- All contracts have emergency pause mechanisms
- Admin upgrade path via WASM hash rotation (no proxy pattern)
- BytesN<32> metadata hash validated as non-zero before storage
- All `unwrap()` calls audited and replaced with proper error handling in production paths
- QualityOracle curator slashing prevents malicious attestations

**Pre-mainnet:** We will commission a full third-party security audit before deploying to Stellar Mainnet.

---

## 📄 License

MIT © 2025–2026 LinguaLayer Contributors

---

<div align="center">

**Built on Stellar. For languages that deserve to be heard.**

[Website](https://lingualayer.vercel.app) · [GitHub](https://github.com/linguaFoundation/lingualayer) · [Issues](https://github.com/linguaFoundation/lingualayer/issues)

</div>
