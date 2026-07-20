"use client";

/**
 * WalletContext: React context wrapping Stellar Wallets Kit unified modal (Issue #140).
 *
 * wallets-kit is imported dynamically inside callbacks so the stellar-wallets-kit
 * package (which accesses localStorage at module scope) is never pulled into the
 * server render and does not crash during Next.js static prerendering.
 *
 * Usage:
 *   // Wrap your app (in layout.tsx or a root client boundary):
 *   <WalletProvider>…</WalletProvider>
 *
 *   // Consume in any client component:
 *   const { address, connected, connect, disconnect, sign } = useWallet();
 */

import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from "react";

interface WalletState {
  address: string | null;
  walletId: string | null;
  connected: boolean;
  connecting: boolean;
  error: string | null;
}

interface WalletContextValue extends WalletState {
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  sign: (xdr: string, networkPassphrase?: string) => Promise<string>;
}

const WalletContext = createContext<WalletContextValue | null>(null);

export function WalletProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<WalletState>({
    address: null,
    walletId: null,
    connected: false,
    connecting: false,
    error: null,
  });

  const connect = useCallback(async () => {
    setState((s) => ({ ...s, connecting: true, error: null }));
    try {
      const { initWalletsKit, openWalletModal } = await import("./wallets-kit");
      initWalletsKit();
      const { address, walletId } = await openWalletModal();
      setState({
        address,
        walletId,
        connected: true,
        connecting: false,
        error: null,
      });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Wallet connection failed.";
      setState((s) => ({ ...s, connecting: false, error: message }));
    }
  }, []);

  const disconnect = useCallback(async () => {
    try {
      const { disconnectWallet } = await import("./wallets-kit");
      await disconnectWallet();
    } catch {
      // Ignore disconnect errors — clear local state regardless.
    } finally {
      setState({
        address: null,
        walletId: null,
        connected: false,
        connecting: false,
        error: null,
      });
    }
  }, []);

  const sign = useCallback(
    async (xdr: string, networkPassphrase?: string): Promise<string> => {
      if (!state.connected) throw new Error("No wallet connected.");
      const { signTransaction } = await import("./wallets-kit");
      return signTransaction(xdr, networkPassphrase);
    },
    [state.connected]
  );

  return (
    <WalletContext.Provider value={{ ...state, connect, disconnect, sign }}>
      {children}
    </WalletContext.Provider>
  );
}

/** Consume wallet state and actions inside any client component. */
export function useWallet(): WalletContextValue {
  const ctx = useContext(WalletContext);
  if (!ctx) throw new Error("useWallet must be used inside <WalletProvider>.");
  return ctx;
}
