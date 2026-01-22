"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";
import {
  Languages, Moon, Sun, Wallet, X, ChevronRight, AlertCircle,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

declare global {
  interface Window {
    freighter?: {
      isConnected: () => Promise<boolean>;
      getAddress: () => Promise<{ address: string } | { error: string }>;
      getNetwork: () => Promise<{ network: string; networkPassphrase: string } | { error: string }>;
      requestAccess: () => Promise<{ address: string } | { error: string }>;
    };
  }
}

const MAINNET_PASSPHRASE = "Public Global Stellar Network ; September 2015";

function useWallet() {
  const [address, setAddress] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const connect = async () => {
    setIsConnecting(true);
    setError(null);
    try {
      if (!window.freighter) {
        window.open("https://freighter.app", "_blank");
        setError("Freighter not found. Install it to continue.");
        return;
      }
      const result = await window.freighter.requestAccess();
      if ("error" in result) throw new Error(result.error);
      const net = await window.freighter.getNetwork();
      if ("error" in net) throw new Error(net.error);
      if (net.networkPassphrase !== MAINNET_PASSPHRASE) {
        setError("Switch to Stellar Mainnet in Freighter settings.");
        return;
      }
      setAddress(result.address);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Connection failed.";
      setError(msg);
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnect = () => setAddress(null);
  return { address, isConnecting, error, connect, disconnect };
}

const ThemeToggle = ({ isDark }: { isDark: boolean }) => {
  const { setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return <div className="w-10 h-10" />;
  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label="Toggle theme"
      className={cn(
        "w-10 h-10 rounded-xl flex items-center justify-center transition-all border",
        isDark
          ? "bg-violet-500/10 border-violet-500/20 hover:bg-violet-500/20"
          : "bg-violet-50 border-violet-200 hover:bg-violet-100"
      )}
    >
      <AnimatePresence mode="wait" initial={false}>
        {isDark ? (
          <motion.span
            key="sun"
            initial={{ rotate: -90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: 90, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Sun className="w-4 h-4 text-violet-400" />
          </motion.span>
        ) : (
          <motion.span
            key="moon"
            initial={{ rotate: 90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: -90, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Moon className="w-4 h-4 text-violet-700" />
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  );
};

const WalletModal = ({
  isOpen,
  onClose,
  wallet,
}: {
  isOpen: boolean;
  onClose: () => void;
  wallet: ReturnType<typeof useWallet>;
}) => (
  <AnimatePresence>
    {isOpen && (
      <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-purple-950/80 backdrop-blur-xl"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 16 }}
          className="relative w-full max-w-sm bg-purple-950 border border-purple-900 rounded-2xl p-7 shadow-2xl"
        >
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-violet-500 to-transparent rounded-t-2xl" />
          <div className="flex items-center justify-between mb-7">
            <div>
              <h3 className="text-xl font-black text-white uppercase tracking-tight">
                Connect Wallet
              </h3>
              <p className="text-[10px] text-purple-400 uppercase tracking-[0.3em] mt-1">
                Stellar · Mainnet Only
              </p>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-purple-900 flex items-center justify-center hover:bg-purple-800 transition-colors"
            >
              <X className="w-4 h-4 text-purple-400" />
            </button>
          </div>

          {wallet.error && (
            <div className="mb-5 p-3 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center gap-3">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <p className="text-xs text-red-300">{wallet.error}</p>
            </div>
          )}

          {wallet.address ? (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-violet-500/10 border border-violet-500/20">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 rounded-full bg-violet-400 animate-pulse" />
                  <p className="text-[10px] text-violet-400 uppercase tracking-widest font-bold">
                    Connected · Mainnet
                  </p>
                </div>
                <p className="font-mono text-xs text-white break-all leading-relaxed">
                  {wallet.address}
                </p>
              </div>
              <button
                onClick={() => {
                  wallet.disconnect();
                  onClose();
                }}
                className="w-full px-4 py-2.5 text-xs font-bold uppercase tracking-widest rounded-xl border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-all"
              >
                Disconnect
              </button>
            </div>
          ) : (
            <button
              onClick={wallet.connect}
              disabled={wallet.isConnecting}
              className="w-full flex items-center gap-4 p-4 rounded-xl bg-purple-900 border border-purple-800 hover:border-violet-500/30 transition-all text-left group"
            >
              <div className="w-11 h-11 rounded-xl bg-violet-500/10 flex items-center justify-center shrink-0 group-hover:bg-violet-500/20 transition-colors">
                <Wallet className="w-5 h-5 text-violet-400" />
              </div>
              <div className="flex-1">
                <p className="font-black text-white uppercase text-sm tracking-wide">
                  Freighter
                </p>
                <p className="text-[10px] text-purple-400 mt-0.5">
                  Official Stellar Extension
                </p>
              </div>
              {wallet.isConnecting ? (
                <div className="w-5 h-5 border-2 border-violet-500/30 border-t-violet-500 rounded-full animate-spin" />
              ) : (
                <ChevronRight className="w-4 h-4 text-purple-600 group-hover:text-violet-400 transition-colors" />
              )}
            </button>
          )}
          <p className="text-center text-[10px] text-purple-700 mt-5 uppercase tracking-widest">
            Soroban · LinguaLayer Foundation
          </p>
        </motion.div>
      </div>
    )}
  </AnimatePresence>
);

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Datasets", href: "/datasets" },
  { label: "Royalties", href: "/royalties" },
  { label: "Licensing", href: "/licensing" },
  { label: "Governance", href: "/governance" },
  { label: "Community", href: "/communities" },
  { label: "Roadmap", href: "/roadmap" },
];

export function PageShell({ children }: { children: React.ReactNode }) {
  const [walletOpen, setWalletOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const wallet = useWallet();
  const { theme } = useTheme();
  const pathname = usePathname();

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;
  const isDark = theme !== "light";

  return (
    <div
      className={cn(
        "min-h-screen transition-colors duration-500",
        isDark ? "bg-[#0c0814] text-purple-100" : "bg-violet-50 text-purple-950"
      )}
    >
      {/* BACKGROUND */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className={cn("absolute inset-0", isDark ? "bg-[#0c0814]" : "bg-violet-50")} />
        <div className="absolute top-0 left-1/3 w-[700px] h-[700px] rounded-full blur-[160px] opacity-20 bg-violet-600" />
        <div className="absolute -bottom-40 right-1/4 w-[500px] h-[500px] rounded-full blur-[130px] opacity-15 bg-fuchsia-600" />
        <div className="absolute top-1/2 left-0 w-[350px] h-[350px] rounded-full blur-[110px] opacity-10 bg-purple-700" />
        <div className="absolute bottom-1/3 right-0 w-[300px] h-[300px] rounded-full blur-[100px] opacity-10 bg-violet-800" />
        <div
          className={cn(
            "absolute inset-0",
            isDark
              ? "bg-[radial-gradient(ellipse_100%_60%_at_50%_0%,rgba(139,92,246,0.08),transparent)]"
              : "bg-[radial-gradient(ellipse_100%_60%_at_50%_0%,rgba(139,92,246,0.12),transparent)]"
          )}
        />
      </div>

      <WalletModal
        isOpen={walletOpen}
        onClose={() => setWalletOpen(false)}
        wallet={wallet}
      />

      {/* HEADER */}
      <header className="fixed top-0 inset-x-0 z-50">
        <div
          className={cn(
            "mx-4 mt-4 flex items-center justify-between px-5 py-3 rounded-2xl border backdrop-blur-xl",
            isDark
              ? "bg-purple-950/60 border-purple-900/50"
              : "bg-white/80 border-violet-200"
          )}
        >
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 shrink-0">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center shadow-lg shadow-violet-500/30">
              <Languages className="w-5 h-5 text-white" />
            </div>
            <div>
              <span
                className={cn(
                  "font-black text-lg uppercase tracking-tight leading-none block",
                  isDark ? "text-white" : "text-purple-950"
                )}
              >
                LinguaLayer
              </span>
              <span className="text-[9px] font-bold text-violet-400 uppercase tracking-[0.4em]">
                Soroban · Mainnet
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-6">
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "text-[11px] font-bold uppercase tracking-widest transition-colors hover:text-violet-400",
                    isActive
                      ? "text-violet-400"
                      : isDark
                      ? "text-purple-500"
                      : "text-purple-600"
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <ThemeToggle isDark={isDark} />

            {wallet.address ? (
              <button
                onClick={() => setWalletOpen(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest bg-violet-500/10 border border-violet-500/20 text-violet-400 hover:bg-violet-500/20 transition-all"
              >
                <div className="w-2 h-2 rounded-full bg-violet-400 animate-pulse" />
                <span className="font-mono hidden sm:inline">
                  {wallet.address.slice(0, 4)}&hellip;{wallet.address.slice(-4)}
                </span>
              </button>
            ) : (
              <button
                onClick={() => setWalletOpen(true)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white shadow-lg shadow-violet-500/20 hover:opacity-90 transition-all"
              >
                <Wallet className="w-3.5 h-3.5" /> Connect
              </button>
            )}

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={cn(
                "lg:hidden w-10 h-10 rounded-xl flex items-center justify-center transition-all border",
                isDark
                  ? "bg-violet-500/10 border-violet-500/20 hover:bg-violet-500/20"
                  : "bg-violet-50 border-violet-200 hover:bg-violet-100"
              )}
              aria-label="Toggle menu"
            >
              <div className="w-4 flex flex-col gap-1">
                <span
                  className={cn(
                    "block h-0.5 rounded-full transition-all",
                    isDark ? "bg-violet-400" : "bg-violet-700",
                    mobileMenuOpen && "rotate-45 translate-y-1.5"
                  )}
                />
                <span
                  className={cn(
                    "block h-0.5 rounded-full transition-all",
                    isDark ? "bg-violet-400" : "bg-violet-700",
                    mobileMenuOpen && "opacity-0"
                  )}
                />
                <span
                  className={cn(
                    "block h-0.5 rounded-full transition-all",
                    isDark ? "bg-violet-400" : "bg-violet-700",
                    mobileMenuOpen && "-rotate-45 -translate-y-1.5"
                  )}
                />
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Nav Dropdown */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className={cn(
                "lg:hidden mx-4 mt-2 rounded-2xl border backdrop-blur-xl p-4",
                isDark
                  ? "bg-purple-950/90 border-purple-900/50"
                  : "bg-white/95 border-violet-200"
              )}
            >
              {NAV_LINKS.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 rounded-xl text-[11px] font-bold uppercase tracking-widest transition-all",
                      isActive
                        ? isDark
                          ? "bg-violet-500/10 text-violet-400"
                          : "bg-violet-100 text-violet-700"
                        : isDark
                        ? "text-purple-400 hover:bg-violet-500/10 hover:text-violet-400"
                        : "text-purple-600 hover:bg-violet-50 hover:text-violet-700"
                    )}
                  >
                    {isActive && (
                      <span className="w-1.5 h-1.5 rounded-full bg-violet-400" />
                    )}
                    {link.label}
                  </Link>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* PAGE CONTENT */}
      <main className="pt-24">{children}</main>

      {/* FOOTER */}
      <footer
        className={cn(
          "border-t px-6 py-12 mt-16",
          isDark ? "border-purple-900" : "border-violet-200"
        )}
      >
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center">
              <Languages className="w-4 h-4 text-white" />
            </div>
            <div>
              <span
                className={cn(
                  "font-black text-base uppercase tracking-tight",
                  isDark ? "text-white" : "text-purple-950"
                )}
              >
                LinguaLayer
              </span>
              <span
                className={cn(
                  "text-[10px] block uppercase tracking-widest",
                  isDark ? "text-purple-600" : "text-purple-600"
                )}
              >
                Linguistic Asset Protocol
              </span>
            </div>
          </Link>
          <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "text-[11px] font-bold uppercase tracking-widest transition-colors hover:text-violet-400",
                  isDark ? "text-purple-600" : "text-purple-600"
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <p
            className={cn(
              "text-[10px] uppercase tracking-widest",
              isDark ? "text-purple-700" : "text-purple-600"
            )}
          >
            © 2026 LinguaFoundation · MIT
          </p>
        </div>
      </footer>
    </div>
  );
}
