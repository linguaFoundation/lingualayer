# Language Data Rights Framework — #950

**Author:** Ngozi Obiora
**Date:** 2026-02-01
**Document Type:** Protocol Specification

## Overview

This document specifies the rights framework governing language datasets
registered in the LinguaLayer protocol. Unlike traditional localization
platforms that hold all rights centrally, LinguaLayer implements on-chain
attribution that makes rights management trustless and permanent.

## Core Rights Principles

### 1. Contributor Ownership
When a linguist submits a translation via the LinguaLayer contributor
workbench, they retain ownership of that contribution. Ownership is
evidenced by:
- Their Stellar address stored in the `DatasetRecord.contributor` field
- The on-chain `DatasetRegistered` event linking their address to the dataset
- An immutable IPFS hash anchoring the content at time of submission

### 2. Proportional Licensing Rights
Contributors earn royalties proportional to their contribution weight in the
dataset's split tree. The split tree is configured at dataset creation and
stored immutably in the Royalty Splitter contract. No party — including
LinguaFoundation — can alter a contributor's royalty percentage after it
is set, except through an explicit on-chain governance action.

### 3. Enterprise License Terms
When an enterprise purchases a license through the License Router contract,
they receive:
- **Research License**: Single-use, non-commercial, 12-month term
- **Commercial License**: Production deployment, perpetual, single organization
- **Enterprise License**: Unlimited seats, perpetual, custom terms via on-chain governance

All license terms are encoded in the License Router contract at purchase time.
No off-chain agreement supersedes the on-chain terms.

### 4. Contributor Attribution Requirements
Any enterprise deploying a LinguaLayer-licensed dataset must:
- Retain attribution metadata in the IPFS manifest
- Not claim original authorship of translated strings
- Not sub-license to third parties without a new on-chain license purchase

### 5. Protocol Treasury
10% of all license revenue flows to the LinguaLayer Foundation treasury,
managed by a Soroban multi-sig contract. Treasury funds are used exclusively
for:
- Protocol security audits
- Open-source contributor bounties
- Low-resource language pair incentives

## Dispute Resolution

In the event of a rights dispute, the on-chain record is authoritative.
The immutable chain of custody (registration transaction → review events →
license purchase event) constitutes the complete provenance proof
admissible in any jurisdiction that recognizes blockchain evidence.

## Governing Law

This framework is encoded in the LinguaLayer protocol contracts. For
jurisdictions that require written agreements, the LinguaFoundation provides
supplementary Terms of Service that reference and defer to the on-chain record.

---
*This document is part of the LinguaLayer Protocol Specification series.*
