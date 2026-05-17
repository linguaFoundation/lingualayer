# LinguaLayer — Decentralized Linguistic Asset Protocol

> Every translation is an asset. Every contributor earns automatically.

[![Testnet](https://img.shields.io/badge/Soroban-Testnet%20Live-8b5cf6?style=flat-square&logo=stellar)](https://stellar.expert/explorer/testnet/contract/CABO2HQDY4DF6XA2R3O75CZ6XQTZ5D4Y2D5NYV7KOIC2BCZNV7OKZXK5)
[![Contract](https://img.shields.io/badge/Dataset%20Registry-Deployed-10b981?style=flat-square)](https://stellar.expert/explorer/testnet/contract/CABO2HQDY4DF6XA2R3O75CZ6XQTZ5D4Y2D5NYV7KOIC2BCZNV7OKZXK5)
[![Live App](https://img.shields.io/badge/App-lingualayer.vercel.app-a855f7?style=flat-square)](https://lingualayer.vercel.app)

---

## Testnet Deployment

The LinguaLayer Dataset Registry contract is **live on Stellar Soroban testnet** with real on-chain interactions.

| | |
|---|---|
| **Contract ID** | `CABO2HQDY4DF6XA2R3O75CZ6XQTZ5D4Y2D5NYV7KOIC2BCZNV7OKZXK5` |
| **Network** | Stellar Testnet (Soroban) |
| **Explorer** | [View on Stellar Expert](https://stellar.expert/explorer/testnet/contract/CABO2HQDY4DF6XA2R3O75CZ6XQTZ5D4Y2D5NYV7KOIC2BCZNV7OKZXK5) |
| **Deployed** | May 2026 |
| **Deployer** | `GC3JR6LHS53D5B4EKUZJUXY74FWRL6ZOR5YV6J3XOZYH3UR6IDSUWDQG` |

### Live On-Chain Activity

The contract has been initialized and populated with real dataset registrations and verifications:

| Tx | Action | Dataset | Language Pair |
|---|---|---|---|
| [203811f9...](https://stellar.expert/explorer/testnet/tx/203811f91f6ae8f1618fca6654768c485f9ac481636402ad37f23d5ccf13f5fd) | `initialize` | — | Admin set |
| [4eda8507...](https://stellar.expert/explorer/testnet/tx/4eda85077849658f31e3aa125e383f391167baf53311d6e3b3e2c87961447ea6) | `register_dataset` | React Documentation | EN → SW |
| On-chain | `register_dataset` | UN SDG Reports | EN → AR |
| On-chain | `register_dataset` | Medical Protocols | EN → HI ✓ Verified |
| On-chain | `register_dataset` | DeFi Glossary | EN → ZH |

### Roadmap: Testnet → Mainnet

Active development continues through the Drips Wave Program. After full feature completion and security review on testnet, the protocol will migrate to **Stellar Mainnet**. The License Router and Royalty Splitter contracts are next in the deployment queue.

---

LinguaLayer is a decentralized protocol for the management, licensing, and monetization of multilingual datasets. Built on Stellar Soroban, it provides a transparent, auditable framework where crowdsourced localization contributors own their work, license it to enterprises, and earn proportional royalties—automatically, in real time, without a platform intermediary.

**Language data is the world's most undervalued digital asset. LinguaLayer makes it ownable, tradeable, and permanently rewarding for those who create it.**

---

## Why This Matters

The global localization industry is worth $65 billion and growing. Yet the people who actually perform the work—linguists, translators, domain experts—are paid once for work that generates ongoing revenue for years. When a tech company uses a translated dataset to train a multilingual AI model, the original translators receive nothing from that compounding value.

LinguaLayer decouples localization from centralized agencies and returns value to the actual creators. It treats "Language Data" as a financial primitive: licensable, versionable, and income-generating for as long as it is used.

---

## Protocol Architecture

### Dataset Registry · `contracts/dataset-registry`

A decentralized storage and versioning system for language pairs and localization strings.

- **Hierarchical Structure** — Datasets are organized by domain (technical, legal, medical, casual) and language pair, with clear versioning for iterative improvements.
- **IPFS-Linked Metadata** — Large dataset files are pinned to IPFS; the registry stores content hashes and provenance metadata on-chain.
- **Version Control** — Every update creates an immutable version snapshot. Licensees can pin to specific versions or always access the latest.
- **Contribution Attribution** — Every string in a dataset carries a cryptographic reference to its author and peer reviewer, forming an unbreakable attribution chain.

### License Router · `contracts/license-router`

A programmable rights management and distribution engine.

- **Automated Permissions** — Enterprises apply for a dataset license by paying the on-chain price. Approval (or rejection based on use-case filters) is instant and automatic.
- **Dynamic Pricing** — License prices are set by dataset authors using market signals: current demand, dataset size, domain rarity, and quality score.
- **Usage Tracking** — Every license grant is recorded with the licensee's identity and intended use case—providing authors with full visibility into how their work is being used.
- **License Types** — Supports single-use research licenses, commercial production licenses, and perpetual enterprise agreements with different royalty structures.

### Royalty Splitter · `contracts/royalty-splitter`

An automated, multi-level royalty disbursement engine.

- **Split Trees** — Each dataset has a configured split tree: what percentage goes to the original author, primary translators, peer reviewers, and domain specialists.
- **Real-Time Payouts** — The moment a license purchase is confirmed on Stellar, royalties flow to every contributor in the tree within the same transaction.
- **Contribution-Based Weighting** — Weights are calculated based on the number of strings contributed, quality score from peer review, and the strategic value of the translation pair.
- **Retroactive Attribution** — When a dataset is updated with new contributors, the split tree updates. Existing licensees continue under their original terms.

---

## Repository Layout

```
.
├── apps/
│   ├── backend/        # On-chain event indexer; translation progress APIs
│   └── web/            # Next.js 14 — contributor workbench and enterprise portal
├── contracts/
│   ├── dataset-registry/   # Dataset versioning and IPFS anchoring
│   ├── license-router/     # Automated rights management engine
│   └── royalty-splitter/   # Real-time multi-contributor disbursement
├── docs/               # Proof-of-Translation specification, split tree format
└── scripts/            # Deployment and dataset ingestion tooling
```

---

## Getting Started

### Prerequisites

| Tool | Version |
|------|---------|
| Rust | 1.78+ |
| Soroban CLI | 20+ |
| Node.js | 20+ |
| pnpm | 9+ |

### Build Contracts

```bash
# Compile all Soroban contracts
cargo build --release --target wasm32-unknown-unknown
```

### Run Tests

```bash
# Unit tests: registry CRUD, royalty math, license validation
cargo test --workspace

# Proof-of-Translation consensus simulation
cargo test --workspace -- --include-ignored
```

### Launch Applications

```bash
pnpm install

# Backend indexer
cd apps/backend
npm run dev

# Contributor workbench and enterprise portal
cd apps/web
pnpm dev
# Opens at http://localhost:3000
```

---

## Proof-of-Translation

LinguaLayer introduces **Proof-of-Translation (PoT)** — a consensus mechanism for linguistic accuracy.

When a translator submits strings to the Dataset Registry:

1. The submission is marked `pending_review` with a staked reputation bond
2. Independent peer reviewers assess accuracy, fluency, and domain appropriateness
3. A majority-positive review consensus triggers `verified` status and releases the contributor's bond plus earnings
4. Reviewers who align with majority consensus earn a reviewer fee; reviewers who dissent consistently lose reputation

This creates economic incentives for honest translation and honest review—neither party benefits from poor quality.

---

## Contribution Workflow

| Step | Actor | Action | Contract |
|------|-------|--------|----------|
| 1 | Developer | Upload source dataset with IPFS hash | `dataset-registry` |
| 2 | Linguist | Claim and submit translation strings | `dataset-registry` |
| 3 | Peer Reviewer | Validate translation quality | `dataset-registry` |
| 4 | Protocol | Award PoT verification; update contributor weights | `dataset-registry` |
| 5 | Enterprise | License the verified dataset | `license-router` |
| 6 | Protocol | Distribute royalties to split tree | `royalty-splitter` |

---

## Technical Standards

| Standard | Implementation |
|----------|----------------|
| Serialization | Soroban XDR (gas-efficient on-chain storage) |
| Metadata | IPFS-linked JSON-LD with language pair schema |
| API | GraphQL + REST for frontend and third-party integrations |
| Identity | Non-custodial Stellar wallet; no account required to contribute |
| Quality | Peer-reviewed Proof-of-Translation consensus |

---

## Contributing

LinguaLayer is open-source and welcomes contributions from developers, linguists, and localization industry professionals. See [CONTRIBUTING.md](CONTRIBUTING.md) for full guidelines.

High-impact areas:
- New language pair support (priority: low-resource languages)
- Proof-of-Translation consensus improvements
- Enterprise SDK for automated dataset licensing
- Contributor mobile app for offline translation submission

---

## License

MIT — build the future of language data, freely.

---

*Localizing the internet, one verifiable string at a time.*
