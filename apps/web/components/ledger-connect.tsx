"use client";

import { useState } from "react";
import { connectLedger } from "@/lib/wallets-kit";

type ConnectionStatus = "idle" | "connecting" | "connected" | "error" | "unsupported";

function LedgerIcon() {
  return (
    <svg width="36" height="36" viewBox="0 0 36 36" fill="none" aria-hidden="true">
      <rect x="2" y="2" width="32" height="32" rx="8" stroke="var(--accent)" strokeWidth="2" fill="none" />
      <rect x="7" y="7" width="14" height="22" rx="3" stroke="var(--accent)" strokeWidth="1.5" fill="none" />
      <path d="M7 24h22v7H7z" fill="var(--accent)" opacity="0.18" />
      <path d="M7 24h22" stroke="var(--accent)" strokeWidth="1.5" />
      <path d="M25 7h4v10h-4" stroke="var(--muted)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function UsbIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M10 3v14M7 5h6M7 15h6" stroke="var(--muted)" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="10" cy="3" r="1.5" fill="var(--accent)" />
      <rect x="6" y="14" width="8" height="3" rx="1.5" stroke="var(--muted)" strokeWidth="1.2" fill="none" />
    </svg>
  );
}

const STEPS = [
  "Connect your Ledger via USB",
  "Unlock the Ledger device",
  "Open the Stellar app on Ledger",
  "Approve the connection in your browser",
];

interface LedgerConnectProps {
  onConnected?: (address: string) => void;
}

export function LedgerConnect({ onConnected }: LedgerConnectProps) {
  const [status, setStatus] = useState<ConnectionStatus>("idle");
  const [address, setAddress] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  async function handleConnect() {
    setStatus("connecting");
    setErrorMsg(null);
    try {
      const result = await connectLedger();
      setAddress(result.address);
      setStatus("connected");
      onConnected?.(result.address);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Connection failed.";
      if (message.includes("WebUSB") || message.includes("WebHID")) {
        setStatus("unsupported");
      } else {
        setStatus("error");
      }
      setErrorMsg(message);
    }
  }

  function handleReset() {
    setStatus("idle");
    setAddress(null);
    setErrorMsg(null);
  }

  return (
    <div className="ledger-connect">
      <div className="ledger-connect-header">
        <LedgerIcon />
        <div>
          <p className="ledger-connect-title">Ledger Hardware Wallet</p>
          <p className="ledger-connect-subtitle">
            Connect via USB &mdash; Chrome &amp; Edge only
          </p>
        </div>
      </div>

      {status === "idle" && (
        <>
          <ol className="ledger-steps">
            {STEPS.map((step, i) => (
              <li key={i} className="ledger-step">
                <span className="ledger-step-num">{i + 1}</span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
          <button className="ledger-btn" onClick={handleConnect}>
            <UsbIcon />
            Connect Ledger
          </button>
        </>
      )}

      {status === "connecting" && (
        <div className="ledger-status ledger-status--pending">
          <span className="ledger-spinner" aria-label="Connecting" />
          <span>Waiting for Ledger&hellip; follow the prompts on your device.</span>
        </div>
      )}

      {status === "connected" && address && (
        <div className="ledger-status ledger-status--ok">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <circle cx="10" cy="10" r="9" stroke="var(--accent)" strokeWidth="1.5" />
            <path d="M6 10l3 3 5-6" stroke="var(--accent)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <div>
            <p className="ledger-ok-label">Ledger connected</p>
            <code className="ledger-address">{address}</code>
          </div>
          <button className="ledger-btn-sm" onClick={handleReset} aria-label="Disconnect Ledger">
            Disconnect
          </button>
        </div>
      )}

      {(status === "error" || status === "unsupported") && (
        <div className="ledger-status ledger-status--error">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <circle cx="10" cy="10" r="9" stroke="#f87171" strokeWidth="1.5" />
            <path d="M7 7l6 6M13 7l-6 6" stroke="#f87171" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
          <div>
            <p className="ledger-error-label">
              {status === "unsupported" ? "Browser not supported" : "Connection failed"}
            </p>
            {errorMsg && <p className="ledger-error-msg">{errorMsg}</p>}
            {status === "unsupported" && (
              <p className="ledger-error-msg">
                Use Google Chrome or Microsoft Edge to connect a Ledger via WebUSB.
              </p>
            )}
          </div>
          <button className="ledger-btn-sm" onClick={handleReset}>
            Retry
          </button>
        </div>
      )}
    </div>
  );
}
