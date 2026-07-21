"use client";

import { useState, useId } from "react";

type QualityTier = "Unrated" | "Bronze" | "Silver" | "Gold" | "Platinum";

function scoreTier(score: number): QualityTier {
  if (score === 0) return "Unrated";
  if (score <= 39) return "Bronze";
  if (score <= 69) return "Silver";
  if (score <= 84) return "Gold";
  return "Platinum";
}

const TIER_META: Record<QualityTier, { color: string; emoji: string; bps: number }> = {
  Unrated:  { color: "#6b7280", emoji: "○", bps: 10000 },
  Bronze:   { color: "#cd7f32", emoji: "◆", bps: 7500  },
  Silver:   { color: "#9ca3af", emoji: "◆", bps: 10000 },
  Gold:     { color: "#f59e0b", emoji: "◆", bps: 12500 },
  Platinum: { color: "#8b5cf6", emoji: "★", bps: 15000 },
};

function generateRubricHash(): string {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
}

function isValidRubricHash(h: string): boolean {
  return /^[0-9a-fA-F]{64}$/.test(h);
}

export default function AttestationPage() {
  const scoreId = useId();
  const datasetId = useId();
  const rubricId = useId();

  const [wallet, setWallet] = useState<string | null>(null);
  const [connecting, setConnecting] = useState(false);
  const [connectError, setConnectError] = useState<string | null>(null);

  const [dataset, setDataset] = useState("");
  const [score, setScore] = useState(75);
  const [rubric, setRubric] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState<{ dataset: string; score: number; tier: QualityTier } | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const tier = scoreTier(score);
  const meta = TIER_META[tier];

  async function handleConnect() {
    setConnecting(true);
    setConnectError(null);
    try {
      const { openWalletModal } = await import("@/lib/wallets-kit");
      const { address } = await openWalletModal();
      setWallet(address);
    } catch (err: unknown) {
      setConnectError(err instanceof Error ? err.message : "Connection failed");
    } finally {
      setConnecting(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitError(null);

    if (!dataset.trim()) {
      setSubmitError("Dataset ID is required.");
      return;
    }
    if (!isValidRubricHash(rubric)) {
      setSubmitError("Rubric hash must be 64 hex characters (32 bytes).");
      return;
    }

    setSubmitting(true);
    // Simulate network round-trip; actual path: build XDR via stellar-sdk →
    // sign with wallet → submit to Soroban RPC attest_quality entry point.
    await new Promise((r) => setTimeout(r, 1200));
    setSubmitting(false);
    setSubmitted({ dataset: dataset.trim(), score, tier });
    setDataset("");
    setRubric("");
    setScore(75);
  }

  return (
    <>
      <section className="hero">
        <span className="tag">Quality Oracle</span>
        <h1>Submit Quality Attestation</h1>
        <p style={{ color: "var(--muted)", maxWidth: 640 }}>
          Certified curators evaluate datasets against a shared rubric and
          submit a quality score on-chain. Scores aggregate into a tier that
          influences royalty multipliers for dataset contributors.
        </p>
      </section>

      <div className="attest-layout">
        {/* ── Left: How it works ── */}
        <aside className="attest-how">
          <h3>How it works</h3>
          <ol className="attest-steps">
            <li className="attest-step">
              <span className="attest-step-num">1</span>
              <div>
                <strong>Connect your wallet</strong>
                <p>Use a Freighter, Ledger, or compatible Stellar wallet associated with your registered curator address.</p>
              </div>
            </li>
            <li className="attest-step">
              <span className="attest-step-num">2</span>
              <div>
                <strong>Evaluate the dataset</strong>
                <p>Review the dataset against the published rubric. Compute your score (0–100) and record the rubric hash.</p>
              </div>
            </li>
            <li className="attest-step">
              <span className="attest-step-num">3</span>
              <div>
                <strong>Submit on-chain</strong>
                <p>Your wallet signs the <code>attest_quality</code> invocation. The oracle aggregates scores and updates the dataset tier immediately.</p>
              </div>
            </li>
          </ol>

          <div className="attest-tiers">
            <h4>Quality tiers</h4>
            {(["Bronze", "Silver", "Gold", "Platinum"] as QualityTier[]).map((t) => (
              <div key={t} className="attest-tier-row">
                <span style={{ color: TIER_META[t].color }}>{TIER_META[t].emoji} {t}</span>
                <span className="attest-tier-bps">{(TIER_META[t].bps / 100).toFixed(0)}% royalty multiplier</span>
              </div>
            ))}
          </div>
        </aside>

        {/* ── Right: Form / result ── */}
        <div className="attest-main">
          {!wallet ? (
            <div className="attest-connect-gate">
              <svg width="56" height="56" viewBox="0 0 56 56" fill="none" aria-hidden="true">
                <circle cx="28" cy="28" r="27" stroke="var(--accent)" strokeWidth="2" fill="none" />
                <circle cx="28" cy="28" r="27" fill="var(--accent)" opacity="0.06" />
                <path d="M20 28h16M28 20v16" stroke="var(--accent)" strokeWidth="2.5" strokeLinecap="round" />
              </svg>
              <p className="attest-gate-heading">Wallet required</p>
              <p className="attest-gate-body">
                Connect your curator wallet to submit quality attestations.
              </p>
              <button
                className="attest-connect-btn"
                onClick={handleConnect}
                disabled={connecting}
              >
                {connecting ? (
                  <>
                    <span className="attest-spinner" aria-label="Connecting" />
                    Connecting…
                  </>
                ) : (
                  "Connect wallet"
                )}
              </button>
              {connectError && (
                <p className="attest-error" role="alert">{connectError}</p>
              )}
            </div>
          ) : submitted ? (
            <div className="attest-success">
              <svg width="48" height="48" viewBox="0 0 48 48" fill="none" aria-hidden="true">
                <circle cx="24" cy="24" r="23" stroke="var(--accent)" strokeWidth="2" fill="none" />
                <circle cx="24" cy="24" r="23" fill="var(--accent)" opacity="0.08" />
                <path d="M14 24l8 8 12-14" stroke="var(--accent)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <p className="attest-success-heading">Attestation submitted</p>
              <p className="attest-success-body">
                Dataset <strong>{submitted.dataset}</strong> received a score of{" "}
                <strong>{submitted.score}/100</strong> —{" "}
                <span style={{ color: TIER_META[submitted.tier].color }}>
                  {TIER_META[submitted.tier].emoji} {submitted.tier}
                </span>.
              </p>
              <p className="attest-success-note">
                Curator: <code>{wallet.slice(0, 8)}…{wallet.slice(-6)}</code>
              </p>
              <button
                className="attest-connect-btn"
                style={{ marginTop: 20 }}
                onClick={() => setSubmitted(null)}
              >
                Submit another attestation
              </button>
            </div>
          ) : (
            <form className="attest-form" onSubmit={handleSubmit} noValidate>
              <div className="attest-curator-bar">
                <span className="attest-curator-label">Curator</span>
                <code className="attest-curator-addr">{wallet.slice(0, 8)}…{wallet.slice(-6)}</code>
                <button
                  type="button"
                  className="attest-switch-btn"
                  onClick={() => setWallet(null)}
                >
                  Switch wallet
                </button>
              </div>

              <div className="attest-field">
                <label htmlFor={datasetId} className="attest-label">
                  Dataset ID <span className="attest-required" aria-hidden="true">*</span>
                </label>
                <input
                  id={datasetId}
                  className="attest-input"
                  type="text"
                  placeholder="e.g. yoruba-speech-v2"
                  value={dataset}
                  onChange={(e) => setDataset(e.target.value)}
                  required
                  autoComplete="off"
                  spellCheck={false}
                />
              </div>

              <div className="attest-field">
                <label htmlFor={scoreId} className="attest-label">
                  Quality score (0 – 100) <span className="attest-required" aria-hidden="true">*</span>
                </label>
                <div className="attest-score-row">
                  <input
                    id={scoreId}
                    className="attest-range"
                    type="range"
                    min={0}
                    max={100}
                    value={score}
                    onChange={(e) => setScore(Number(e.target.value))}
                  />
                  <input
                    className="attest-score-num"
                    type="number"
                    min={0}
                    max={100}
                    value={score}
                    onChange={(e) => {
                      const v = Math.max(0, Math.min(100, Number(e.target.value)));
                      setScore(v);
                    }}
                  />
                </div>
                <div
                  className="attest-tier-preview"
                  style={{ "--preview-color": meta.color } as React.CSSProperties}
                >
                  {meta.emoji} {tier} tier
                  <span className="attest-tier-bps-inline">
                    · {(meta.bps / 100).toFixed(0)}% royalty multiplier
                  </span>
                </div>
              </div>

              <div className="attest-field">
                <label htmlFor={rubricId} className="attest-label">
                  Rubric hash (32 bytes, hex) <span className="attest-required" aria-hidden="true">*</span>
                </label>
                <div className="attest-rubric-row">
                  <input
                    id={rubricId}
                    className="attest-input attest-mono"
                    type="text"
                    placeholder="64 hex characters"
                    value={rubric}
                    onChange={(e) => setRubric(e.target.value.toLowerCase())}
                    maxLength={64}
                    required
                    autoComplete="off"
                    spellCheck={false}
                  />
                  <button
                    type="button"
                    className="attest-switch-btn"
                    onClick={() => setRubric(generateRubricHash())}
                  >
                    Generate
                  </button>
                </div>
                <p className="attest-hint">
                  SHA-256 of the rubric document you used to evaluate this dataset.
                </p>
              </div>

              {submitError && (
                <p className="attest-error" role="alert">{submitError}</p>
              )}

              <button
                type="submit"
                className="attest-submit-btn"
                disabled={submitting}
              >
                {submitting ? (
                  <>
                    <span className="attest-spinner" aria-label="Submitting" />
                    Signing &amp; submitting…
                  </>
                ) : (
                  "Submit attestation"
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </>
  );
}
