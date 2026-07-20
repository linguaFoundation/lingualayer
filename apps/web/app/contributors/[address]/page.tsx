import type { Metadata } from "next";
import Link from "next/link";

interface Props {
  params: Promise<{ address: string }>;
}

interface HorizonAccount {
  id: string;
  sequence: string;
  balances: Array<{
    balance: string;
    asset_type: string;
    asset_code?: string;
    asset_issuer?: string;
  }>;
  last_modified_ledger: number;
}

interface HorizonOperation {
  id: string;
  type: string;
  created_at: string;
}

const IS_MAINNET = process.env.NEXT_PUBLIC_STELLAR_NETWORK === "mainnet";
const HORIZON_BASE = IS_MAINNET
  ? "https://horizon.stellar.org"
  : "https://horizon-testnet.stellar.org";
const EXPERT_BASE = IS_MAINNET
  ? "https://stellar.expert/explorer/public"
  : "https://stellar.expert/explorer/testnet";

function isValidStellarAddress(addr: string): boolean {
  return /^G[A-Z2-7]{55}$/.test(addr);
}

async function fetchAccount(address: string): Promise<HorizonAccount | null> {
  try {
    const res = await fetch(`${HORIZON_BASE}/accounts/${address}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    return res.json() as Promise<HorizonAccount>;
  } catch {
    return null;
  }
}

async function fetchOperations(address: string): Promise<HorizonOperation[]> {
  try {
    const res = await fetch(
      `${HORIZON_BASE}/accounts/${address}/operations?limit=50&order=desc`,
      { next: { revalidate: 60 } }
    );
    if (!res.ok) return [];
    const data = (await res.json()) as {
      _embedded?: { records: HorizonOperation[] };
    };
    return data._embedded?.records ?? [];
  } catch {
    return [];
  }
}

function reputationTier(opCount: number): string {
  if (opCount >= 100) return "Platinum";
  if (opCount >= 50) return "Gold";
  if (opCount >= 10) return "Silver";
  if (opCount >= 1) return "Bronze";
  return "Unrated";
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { address } = await params;
  const short = address.slice(0, 8);
  return {
    title: `Contributor ${short}…`,
    description: `On-chain reputation profile for ${address} on LinguaLayer.`,
  };
}

export default async function ContributorPage({ params }: Props) {
  const { address } = await params;

  if (!isValidStellarAddress(address)) {
    return (
      <section className="section">
        <span className="tag">Error</span>
        <h2>Invalid address</h2>
        <p style={{ color: "var(--muted)" }}>
          <code>{address}</code> is not a valid Stellar public key (must start
          with G and be 56 characters).
        </p>
        <Link href="/" className="cta" style={{ marginTop: 16, display: "inline-block" }}>
          Back to home
        </Link>
      </section>
    );
  }

  const [account, operations] = await Promise.all([
    fetchAccount(address),
    fetchOperations(address),
  ]);

  const xlmBalance =
    account?.balances.find((b) => b.asset_type === "native")?.balance ?? null;
  const opCount = operations.length;
  const tier = reputationTier(opCount);
  const activityTypes = [...new Set(operations.map((o) => o.type))];

  return (
    <>
      <section className="hero">
        <span className="tag">Contributor Profile</span>
        <h1 className="contributor-address">{address}</h1>
        <p style={{ color: "var(--muted)", maxWidth: 640 }}>
          On-chain reputation for this LinguaLayer contributor on the Stellar{" "}
          {IS_MAINNET ? "mainnet" : "testnet"}.
        </p>
      </section>

      {!account && (
        <div className="card contributor-notice">
          <p style={{ margin: 0, color: "var(--muted)" }}>
            This address was not found on the Stellar{" "}
            {IS_MAINNET ? "mainnet" : "testnet"}. It may be inactive or not yet
            funded.
          </p>
        </div>
      )}

      <div className="grid contributor-stats-grid">
        <div className="card">
          <p className="stat-label">Reputation tier</p>
          <p className="stat-value" style={{ color: tierColor(tier) }}>
            {tier}
          </p>
        </div>
        <div className="card">
          <p className="stat-label">Testnet operations</p>
          <p className="stat-value">{opCount > 0 ? `${opCount}+` : "—"}</p>
        </div>
        <div className="card">
          <p className="stat-label">XLM balance</p>
          <p className="stat-value">
            {xlmBalance != null
              ? `${parseFloat(xlmBalance).toFixed(2)} XLM`
              : "—"}
          </p>
        </div>
        <div className="card">
          <p className="stat-label">Activity types</p>
          <p className="stat-value">
            {activityTypes.length > 0 ? activityTypes.length : "—"}
          </p>
        </div>
      </div>

      <section className="section">
        <h2>LinguaLayer contributions</h2>
        <p style={{ color: "var(--muted)", maxWidth: 680 }}>
          Dataset registrations, license issuances, and royalty splits
          attributed to this address appear here once LinguaLayer contracts
          finish indexing contributions for this wallet.
        </p>
        <div className="grid" style={{ marginTop: 12 }}>
          <div className="card">
            <h3>Datasets registered</h3>
            <p>
              Language datasets this contributor has submitted to the
              DatasetRegistry contract will be listed here.
            </p>
          </div>
          <div className="card">
            <h3>Licenses issued</h3>
            <p>
              Licenses purchased through the LicenseRouter tied to this
              contributor&#39;s datasets will appear here.
            </p>
          </div>
          <div className="card">
            <h3>Royalties earned</h3>
            <p>
              Payouts from the RoyaltySplitter contract attributed to this
              address will appear here once splits are processed.
            </p>
          </div>
        </div>
      </section>

      {operations.length > 0 && (
        <section className="section">
          <h2>Recent testnet activity</h2>
          <div style={{ overflowX: "auto" }}>
            <table className="contributor-table">
              <thead>
                <tr>
                  <th>Operation type</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {operations.slice(0, 10).map((op) => (
                  <tr key={op.id}>
                    <td>
                      <code>{op.type.replace(/_/g, " ")}</code>
                    </td>
                    <td style={{ color: "var(--muted)" }}>
                      {new Date(op.created_at).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      <div style={{ paddingBottom: 40 }}>
        <a
          href={`${EXPERT_BASE}/account/${address}`}
          target="_blank"
          rel="noopener noreferrer"
          className="cta-secondary"
        >
          View on Stellar Expert ↗
        </a>
      </div>
    </>
  );
}

function tierColor(tier: string): string {
  const map: Record<string, string> = {
    Platinum: "#8b5cf6",
    Gold: "#f59e0b",
    Silver: "#9ca3af",
    Bronze: "#cd7f32",
    Unrated: "var(--muted)",
  };
  return map[tier] ?? "var(--accent)";
}
