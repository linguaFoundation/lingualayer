# Lingualayer Architecture

## Overview
Three-layer architecture: Smart Contracts (Soroban) → Backend API (Fastify) → Frontend (Next.js).

## Contracts
- `dataset-registry` — primary registry and state
- `license-router` — pooled resources management
- `royalty-splitter` — execution and settlement

## Data Flow
```
User → Frontend (Next.js) → Backend (Fastify) → Soroban RPC → Stellar Network
```
