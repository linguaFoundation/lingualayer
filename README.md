# LinguaLayer

> **Data rights, licensing, and transparent royalties for African and underrepresented language AI.**

---

## Vision

LinguaLayer makes language **data a durable public good**: contributors and communities retain clear attribution and revenue rights while model builders access **legal, traceable** datasets.

---

## Problems we address

- Most African languages are **underrepresented** in AI corpora, slowing equitable voice and text applications.
- Contributors rarely receive **ongoing compensation** when datasets are relicensed or models are commercialized.
- License terms are scattered across PDFs and emails—hard to **enforce** or audit.

---

## What we aim to achieve

- Register datasets with **immutable provenance** and contributor share tables.
- Encode **license SKUs** (region, commercial use, model class) in `license-router`.
- Distribute **royalties** transparently via `royalty-splitter` as revenue arrives.
- Give communities **governance hooks** (curation, appeals, maintenance budgets).

---

## Who we serve

| Stakeholder | What they need |
| --- | --- |
| Language communities & linguists | Fair attribution and income from language assets. |
| NLP startups & labs | Clear licensing and reduced legal friction. |
| Universities & archives | Structured stewardship and public-interest terms. |
| Funders | Measurable inclusion outcomes and transparent splits. |

---

## Solution overview

`dataset-registry` anchors **who contributed what** and how quality evolves. `license-router` expresses buyer obligations on-chain where useful for enforcement hooks. `royalty-splitter` implements splits **deterministically** so payouts match published rules.

---

## Why Stellar and Soroban

Low-cost settlement and programmable logic suit **many small payouts** to many contributors. Stellar’s asset and anchor ecosystem also aligns with **cross-border** teams and buyers.

---

## What success looks like

- Growing corpus size per **language cluster** with documented consent and splits.
- Royalty flows that match **published share tables** (reconcilable on-chain).
- At least one **sustained buyer** license renewing based on clear terms.

---

## Explicit non-goals (for v1)

- Building a general-purpose **machine translation** product—focus is rights and economics.
- Storing large media blobs on-chain—use IPFS or object storage with **content hashes** on-chain.

---

## Delivery phases (high level)

Planned work is also tracked as GitHub-ready items in `docs/milestones-issues.md`.

### Phase 1 — Provenance
- Contributor roles, dataset versioning, moderation policy.
- `dataset-registry` MVP.

### Phase 2 — Licensing
- License templates and renewal.
- `license-router` enforcement hooks.

### Phase 3 — Royalties
- Treasury and payout reconciliation UX.
- `royalty-splitter` under load tests.


---

## Technical architecture at a glance

This repository is a **production-grade monorepo**:

| Layer | Path | Role |
| ----- | ---- | ---- |
| Smart contracts | `contracts/` | Soroban — source of truth for rules, escrow, and attestations |
| Web application | `apps/web/` | Next.js — narrative, roadmap, operator UX ([details](apps/web/README.md)) |
| API service | `apps/backend/` | Fastify — integrations, webhooks, privileged workflows ([details](apps/backend/README.md)) |
| Docs | `docs/` | Site map, layout plan, milestone/issue backlog |

Cross-cutting principles:

- **Contracts stay deterministic**; complexity belongs in well-named crates with tests.
- **No secrets in the browser**; sensitive RPC or signing policies live in `apps/backend` or secure infra.
- **Product surface follows `docs/SITE_MAP.md`** so contributors align UI routes with delivery status.

---

## Repository layout

```
├── Cargo.toml                 # Rust workspace (all Soroban crates)
├── contracts/
│   ├── dataset-registry/
│   ├── license-router/
│   └── royalty-splitter/
├── apps/
│   ├── web/                   # Next.js (App Router) — see apps/web/README.md
│   └── backend/               # Fastify API — see apps/backend/README.md
├── docs/
│   ├── SITE_MAP.md            # Expected pages (route backlog)
│   ├── layout-plan.md         # Architecture notes
│   └── milestones-issues.md   # Milestone → GitHub issues
├── CONTRIBUTING.md
├── SECURITY.md
├── .github/workflows/ci.yml
└── README.md                  # This file
```

---

## Soroban contracts

- `contracts/dataset-registry` — Dataset metadata and contributor shares.
- `contracts/license-router` — Usage licenses by region and model class.
- `contracts/royalty-splitter` — Revenue distribution to contributors.

Each crate currently exposes **`initialize`**, **`ping`** (placeholder domain hook), and **`version`** as **minimal compilable scaffolds**. Before production:

1. Replace `ping` with real domain entrypoints and storage maps.
2. Add **`require_auth`** (and multisig / roles) everywhere funds or reputation change hands.
3. Add integration tests and — where applicable — formal audit scope notes in `docs/`.

Build (Rust + Soroban toolchain):

```bash
cargo check --workspace
cargo build --release
```

---

## Web application (Next.js)

Located in [`apps/web/`](apps/web/README.md). Routes include (among others): /, /communities, /licensing, /royalties, /governance, /roadmap.

```bash
cd apps/web
npm install
npm run dev
```

The **landing page** embeds the **`ExpectedPages`** component — a live **site map table** aligned with [`docs/SITE_MAP.md`](docs/SITE_MAP.md).

---

## Backend API (Fastify)

Located in [`apps/backend/`](apps/backend/README.md). Thin by design: each independent GitHub organization applies its own auth, rate limits, key custody, and RPC policies.

```bash
cd apps/backend
npm install
cp .env.example .env
npm run dev
```

---

## Documentation index

| Document | Purpose |
| -------- | ------- |
| [`docs/SITE_MAP.md`](docs/SITE_MAP.md) | Canonical route backlog and delivery status |
| [`docs/layout-plan.md`](docs/layout-plan.md) | System layout and integration notes |
| [`docs/milestones-issues.md`](docs/milestones-issues.md) | Milestones split into actionable issues |
| [`CONTRIBUTING.md`](CONTRIBUTING.md) | Contribution workflow and review bar |
| [`SECURITY.md`](SECURITY.md) | Responsible disclosure |

---

## Contributing

Read [`CONTRIBUTING.md`](CONTRIBUTING.md). In short: pick work from `docs/milestones-issues.md`, keep contract/API/UI changes aligned with [`docs/SITE_MAP.md`](docs/SITE_MAP.md), and open draft PRs early for architectural shifts.

---

## License

Apache-2.0 is recommended for OSS grant programs — confirm with your GitHub organization’s legal policy before publishing.
