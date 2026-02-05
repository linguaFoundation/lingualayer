# Layout Plan

## Repository map
- `contracts/dataset-registry`: dataset ownership and curation state
- `contracts/license-router`: contract-based licensing with policy gates
- `contracts/royalty-splitter`: payout rules and revenue distribution
- `apps/web`: contributor portal, curator workspace, license console
- `docs`: governance, data ethics, contribution standards
- `configs`: environment and deployment settings

## Product surfaces
- contributor onboarding flow
- curation queue with peer review
- buyer license checkout
- payout reporting by language community

## Reliability targets
- deterministic royalty split math
- immutable provenance for dataset revisions
- license enforcement aligned to jurisdiction metadata

## Runtime layout (monorepo)

| Path | Responsibility |
| --- | --- |
| `contracts/*` | Soroban smart contracts — source of truth for rules |
| `apps/web` | Next.js — marketing, dashboards, contributor UX |
| `apps/backend` | Fastify — integrations, optional server-side signing gateway |

See also `docs/SITE_MAP.md` for the web route backlog.
