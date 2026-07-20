"use client";
import { useState, useCallback } from "react";

interface ContractEntry {
  name: string;
  address: string;
  explorerUrl: string;
}

const NETWORK = process.env.NEXT_PUBLIC_STELLAR_NETWORK ?? "testnet";
const IS_TESTNET = NETWORK !== "mainnet";

const EXPERT_BASE = IS_TESTNET
  ? "https://stellar.expert/explorer/testnet"
  : "https://stellar.expert/explorer/public";

const CONTRACTS: ContractEntry[] = [
  {
    name: "DatasetRegistry",
    address: process.env.NEXT_PUBLIC_CONTRACT_DATASET_REGISTRY ?? "",
    explorerUrl: `${EXPERT_BASE}/contract/${process.env.NEXT_PUBLIC_CONTRACT_DATASET_REGISTRY ?? ""}`,
  },
  {
    name: "LicenseRouter",
    address: process.env.NEXT_PUBLIC_CONTRACT_LICENSE_ROUTER ?? "",
    explorerUrl: `${EXPERT_BASE}/contract/${process.env.NEXT_PUBLIC_CONTRACT_LICENSE_ROUTER ?? ""}`,
  },
  {
    name: "RoyaltySplitter",
    address: process.env.NEXT_PUBLIC_CONTRACT_ROYALTY_SPLITTER ?? "",
    explorerUrl: `${EXPERT_BASE}/contract/${process.env.NEXT_PUBLIC_CONTRACT_ROYALTY_SPLITTER ?? ""}`,
  },
  {
    name: "QualityOracle",
    address: process.env.NEXT_PUBLIC_CONTRACT_QUALITY_ORACLE ?? "",
    explorerUrl: `${EXPERT_BASE}/contract/${process.env.NEXT_PUBLIC_CONTRACT_QUALITY_ORACLE ?? ""}`,
  },
  {
    name: "DataCommission",
    address: process.env.NEXT_PUBLIC_CONTRACT_DATA_COMMISSION ?? "",
    explorerUrl: `${EXPERT_BASE}/contract/${process.env.NEXT_PUBLIC_CONTRACT_DATA_COMMISSION ?? ""}`,
  },
].filter((c) => c.address.length > 0);

function shorten(addr: string) {
  return `${addr.slice(0, 4)}…${addr.slice(-4)}`;
}

export function NetworkBanner() {
  const [copiedAddr, setCopiedAddr] = useState<string | null>(null);

  const handleCopy = useCallback(async (addr: string) => {
    try {
      await navigator.clipboard.writeText(addr);
      setCopiedAddr(addr);
      setTimeout(() => setCopiedAddr(null), 1800);
    } catch {
      /* clipboard unavailable — silently skip */
    }
  }, []);

  if (!IS_TESTNET) return null;
  if (CONTRACTS.length === 0) return null;

  return (
    <div className="net-banner" role="complementary" aria-label="Testnet contract addresses">
      <div className="container net-banner-inner">
        <span className="net-badge" aria-label="Current network: testnet">
          <span className="net-dot" aria-hidden="true" />
          TESTNET
        </span>

        <ul className="net-contracts" aria-label="Deployed contract addresses">
          {CONTRACTS.map(({ name, address, explorerUrl }) => (
            <li key={name} className="net-contract">
              <a
                href={explorerUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="net-contract-name"
                title={`View ${name} on Stellar Expert`}
              >
                {name}
              </a>
              <button
                className="net-contract-addr"
                onClick={() => handleCopy(address)}
                title={`Copy full address: ${address}`}
                aria-label={`Copy ${name} address`}
              >
                <code>{shorten(address)}</code>
                <span className="net-copy-icon" aria-hidden="true">
                  {copiedAddr === address ? "✓" : "⧉"}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
