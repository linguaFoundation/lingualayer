# Contributing

Thank you for helping ship production-grade open infrastructure.

## Workflow

1. Read `README.md` and `docs/SITE_MAP.md` so UI/API changes stay aligned with the route backlog.
2. Pick or open an issue from `docs/milestones-issues.md`.
3. For contract changes: run `cargo check --workspace` and extend tests before opening a PR.
4. For web/API changes: run `npm run lint` and `npm run build` in `apps/web`; run `npm run lint` in `apps/backend`.

## Code review bar

- Deterministic on-chain logic and explicit auth boundaries for anything touching funds or identity.
- No silent breaking changes to contract interfaces without a migration note in `docs/`.

## Conduct

Be respectful and assume good intent. Disagree on architecture with evidence and benchmarks.
