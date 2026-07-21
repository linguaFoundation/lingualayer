"use client";

import { useWallet } from "@/lib/wallet-context";

function short(address: string): string {
  return `${address.slice(0, 4)}…${address.slice(-4)}`;
}

export function WalletConnectButton() {
  const { address, isAuthenticated, isConnecting, isAuthenticating, error, connect, disconnect } =
    useWallet();

  if (isAuthenticated && address) {
    return (
      <button className="wallet-btn wallet-btn--connected" onClick={disconnect}>
        <span className="wallet-btn-dot" aria-hidden="true" />
        {short(address)}
      </button>
    );
  }

  const busy = isConnecting || isAuthenticating;

  return (
    <div className="wallet-btn-wrap">
      <button className="wallet-btn" onClick={connect} disabled={busy}>
        {busy ? "Connecting…" : "Connect Wallet"}
      </button>
      {error && <span className="wallet-btn-error">{error}</span>}
    </div>
  );
}
