"use client";

/**
 * WalletContext: React context wrapping Stellar Wallets Kit unified modal (Issue #140).
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
import {
  initWalletsKit,
  openWalletModal,
  disconnectWallet,
  signTransaction,
} from "./wallets-kit";

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
