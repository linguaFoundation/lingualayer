"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";
import {
  Languages, Globe, Coins, Database, BookOpen, Users, ArrowRight,
  Moon, Sun, Wallet, X, ChevronRight, AlertCircle, Zap,
  Lock, Shield, GitBranch, BarChart3, MessageSquare, Layers,
  Star, CheckCircle2, Sparkles, Network
} from "lucide-react";
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
    } catch (err: any) {
      setError(err.message || "Connection failed.");
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
        isDark ? "bg-violet-500/10 border-violet-500/20 hover:bg-violet-500/20" : "bg-violet-50 border-violet-200 hover:bg-violet-100"
      )}
    >
      <AnimatePresence mode="wait" initial={false}>
        {isDark ? (
          <motion.span key="sun" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
            <Sun className="w-4 h-4 text-violet-400" />
          </motion.span>
        ) : (
          <motion.span key="moon" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}>
            <Moon className="w-4 h-4 text-violet-700" />
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  );
};

const WalletModal = ({ isOpen, onClose, wallet }: {
  isOpen: boolean; onClose: () => void; wallet: ReturnType<typeof useWallet>;
}) => (
  <AnimatePresence>
    {isOpen && (
      <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onClick={onClose} className="absolute inset-0 bg-purple-950/80 backdrop-blur-xl" />
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 16 }}
          className="relative w-full max-w-sm bg-purple-950 border border-purple-900 rounded-2xl p-7 shadow-2xl"
        >
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-violet-500 to-transparent rounded-t-2xl" />
          <div className="flex items-center justify-between mb-7">
            <div>
              <h3 className="text-xl font-black text-white uppercase tracking-tight">Connect Wallet</h3>
              <p className="text-[10px] text-purple-400 uppercase tracking-[0.3em] mt-1">Stellar · Mainnet Only</p>
            </div>
            <button onClick={onClose} className="w-8 h-8 rounded-full bg-purple-900 flex items-center justify-center hover:bg-purple-800 transition-colors">
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
                  <p className="text-[10px] text-violet-400 uppercase tracking-widest font-bold">Connected · Mainnet</p>
                </div>
                <p className="font-mono text-xs text-white break-all leading-relaxed">{wallet.address}</p>
              </div>
              <button onClick={() => { wallet.disconnect(); onClose(); }}
                className="w-full px-4 py-2.5 text-xs font-bold uppercase tracking-widest rounded-xl border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-all">
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
                <p className="font-black text-white uppercase text-sm tracking-wide">Freighter</p>
                <p className="text-[10px] text-purple-400 mt-0.5">Official Stellar Extension</p>
              </div>
              {wallet.isConnecting
                ? <div className="w-5 h-5 border-2 border-violet-500/30 border-t-violet-500 rounded-full animate-spin" />
                : <ChevronRight className="w-4 h-4 text-purple-600 group-hover:text-violet-400 transition-colors" />
              }
            </button>
          )}
          <p className="text-center text-[10px] text-purple-700 mt-5 uppercase tracking-widest">Soroban · LinguaLayer Foundation</p>
        </motion.div>
      </div>
    )}
  </AnimatePresence>
);

const LANGUAGES = ["EN", "ES", "FR", "ZH", "AR", "PT", "SW", "HI", "RU", "JA", "KO", "DE"];

const STATS = [
  { label: "Language Pairs", value: "2,400+", icon: Languages, color: "text-violet-400" },
  { label: "Active Linguists", value: "8,200", icon: Users, color: "text-purple-400" },
  { label: "Royalties Paid", value: "$1.2M", icon: Coins, color: "text-fuchsia-400" },
  { label: "Datasets Live", value: "680", icon: Database, color: "text-violet-300" },
];

const COMPONENTS = [
  {
    icon: Database, title: "Dataset Registry", tag: "contracts/dataset-registry",
    desc: "Decentralized versioning for language pairs and localization strings. Hierarchical structure with IPFS-linked metadata, version control, and immutable source string management.",
    gradient: "from-violet-500 to-purple-600",
  },
  {
    icon: Lock, title: "License Router", tag: "contracts/license-router",
    desc: "A programmable rights management engine. Automated permissions, dynamic pricing, and usage tracking. Enterprises license localized content with on-chain auditability for every access event.",
    gradient: "from-fuchsia-500 to-violet-600",
  },
  {
    icon: Coins, title: "Royalty Splitter", tag: "contracts/royalty-splitter",
    desc: "Multi-level split trees distribute revenue the instant a license is purchased. Authors, primary translators, and peer reviewers all earn proportional, automatic, real-time payouts.",
    gradient: "from-purple-500 to-fuchsia-600",
  },
];

const WORKFLOW = [
  { n: "01", title: "Upload Dataset", desc: "A developer or publisher uploads a source language dataset via the LinguaLayer portal. Metadata is hashed and anchored on Stellar." },
  { n: "02", title: "Linguists Translate", desc: "Verified linguists claim translation tasks. Each submission is recorded on-chain with contributor identity and timestamp." },
  { n: "03", title: "Peer Review", desc: "Community reviewers validate translation quality, triggering Proof-of-Translation—a consensus mechanism for linguistic accuracy." },
  { n: "04", title: "Enterprise Licensing", desc: "Companies license the verified dataset via the License Router. All pricing, terms, and usage rights are encoded in the contract." },
  { n: "05", title: "Royalties Split", desc: "Revenue is distributed instantly and proportionally to every contributor in the chain—authors, translators, reviewers—the moment payment is received." },
];

export default function LinguaLayerPage() {
  const [walletOpen, setWalletOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [activeLang, setActiveLang] = useState(0);
  const wallet = useWallet();
  const { theme } = useTheme();

  useEffect(() => setMounted(true), []);
  useEffect(() => {
    const t = setInterval(() => setActiveLang(l => (l + 1) % LANGUAGES.length), 1200);
    return () => clearInterval(t);
  }, []);

  if (!mounted) return null;
  const isDark = theme !== "light";

  return (
    <div className={cn(
      "min-h-screen transition-colors duration-500",
      isDark ? "bg-[#0c0814] text-purple-100" : "bg-violet-50 text-purple-950"
    )}>
      {/* BACKGROUND */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className={cn("absolute inset-0", isDark ? "bg-[#0c0814]" : "bg-violet-50")} />
        <div className="absolute top-0 left-1/3 w-[600px] h-[600px] rounded-full blur-[150px] opacity-20 bg-violet-600" />
        <div className="absolute -bottom-40 right-1/4 w-[500px] h-[500px] rounded-full blur-[120px] opacity-15 bg-fuchsia-600" />
        <div className="absolute top-1/2 left-0 w-[300px] h-[300px] rounded-full blur-[100px] opacity-10 bg-purple-700" />
        <div className={cn(
          "absolute inset-0",
          isDark
            ? "bg-[radial-gradient(ellipse_100%_60%_at_50%_0%,rgba(139,92,246,0.08),transparent)]"
            : "bg-[radial-gradient(ellipse_100%_60%_at_50%_0%,rgba(139,92,246,0.12),transparent)]"
        )} />
      </div>

      <WalletModal isOpen={walletOpen} onClose={() => setWalletOpen(false)} wallet={wallet} />

      {/* HEADER — center-split editorial: nav items flank a centered logo */}
      <header className="fixed top-0 inset-x-0 z-50">
        <div className={cn(
          "relative grid grid-cols-[1fr_auto_1fr] items-center h-16 border-b backdrop-blur-xl px-6",
          isDark ? "bg-purple-950/70 border-purple-900/40" : "bg-white/92 border-violet-200"
        )}>
          {/* Left nav items */}
          <nav className="hidden md:flex items-center gap-1 justify-start">
            {[
              { label: "Datasets", href: "/datasets" },
              { label: "Royalties", href: "/royalties" },
              { label: "Licensing", href: "/licensing" },
            ].map(n => (
              <a key={n.href} href={n.href}
                className={cn(
                  "px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest rounded-lg transition-all hover:text-violet-400 hover:bg-violet-500/10",
                  isDark ? "text-purple-400/60" : "text-purple-700/60"
                )}
              >{n.label}</a>
            ))}
          </nav>

          {/* Center logo */}
          <div className="flex flex-col items-center gap-1 px-8">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center">
                <Languages className="w-4 h-4 text-white" />
              </div>
              <span className={cn("font-black text-base uppercase tracking-[0.12em]", isDark ? "text-white" : "text-purple-950")}>
                LinguaLayer
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="h-px w-8 bg-gradient-to-r from-transparent to-violet-500/40" />
              <span className="text-[7px] font-mono text-violet-500/60 uppercase tracking-[0.5em]">Soroban · Mainnet</span>
              <div className="h-px w-8 bg-gradient-to-l from-transparent to-violet-500/40" />
            </div>
          </div>

          {/* Right nav items + controls */}
          <div className="flex items-center justify-end gap-1">
            <nav className="hidden md:flex items-center gap-1 mr-3">
              {[
                { label: "Governance", href: "/governance" },
                { label: "Community", href: "/communities" },
                { label: "Roadmap", href: "/roadmap" },
              ].map(n => (
                <a key={n.href} href={n.href}
                  className={cn(
                    "px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest rounded-lg transition-all hover:text-violet-400 hover:bg-violet-500/10",
                    isDark ? "text-purple-400/60" : "text-purple-700/60"
                  )}
                >{n.label}</a>
              ))}
            </nav>
            <div className={cn("w-px h-5 mx-1", isDark ? "bg-purple-800" : "bg-violet-200")} />
            <ThemeToggle isDark={isDark} />
            {wallet.address ? (
              <button onClick={() => setWalletOpen(true)}
                className="ml-1 flex items-center gap-2 px-3 py-1.5 text-[10px] font-mono font-bold bg-violet-500/10 border border-violet-500/20 text-violet-400 rounded-lg hover:bg-violet-500/15 transition-all">
                <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
                {wallet.address.slice(0, 4)}…{wallet.address.slice(-4)}
              </button>
            ) : (
              <button onClick={() => setWalletOpen(true)}
                className="ml-1 flex items-center gap-1.5 px-4 py-2 rounded-xl text-[11px] font-black uppercase tracking-widest bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white hover:opacity-90 transition-all">
                <Wallet className="w-3.5 h-3.5" /> Connect
              </button>
            )}
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="relative pt-44 pb-20 px-6 overflow-hidden">
        <div className="max-w-6xl mx-auto text-center relative z-10">
          {/* Floating language tokens */}
          <div className="absolute inset-x-0 top-0 flex justify-center gap-4 opacity-30 pointer-events-none select-none">
            {LANGUAGES.map((lang, i) => (
              <motion.div
                key={lang}
                animate={{ y: [0, i % 2 === 0 ? -16 : -8, 0] }}
                transition={{ duration: 4 + i * 0.5, repeat: Infinity, ease: "easeInOut", delay: i * 0.3 }}
                className={cn(
                  "text-sm font-black font-mono px-2.5 py-1 rounded-lg border",
                  activeLang === i
                    ? "text-violet-300 border-violet-500/40 bg-violet-500/10"
                    : isDark ? "text-purple-700 border-purple-900 bg-purple-950" : "text-purple-300 border-purple-200 bg-white"
                )}
              >
                {lang}
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className={cn(
              "inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-[0.5em] mb-10 border",
              isDark ? "bg-violet-500/10 border-violet-500/20 text-violet-400" : "bg-violet-100 border-violet-300 text-violet-700"
            )}>
              <Sparkles className="w-3 h-3" />
              Linguistic Asset Protocol · Mainnet
            </div>

            <h1 className={cn(
              "text-[4rem] md:text-[7.5rem] lg:text-[10rem] font-black leading-[0.8] tracking-[-0.04em] uppercase mb-8",
              isDark ? "text-white" : "text-purple-950"
            )}>
              Language<br />Is An<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-fuchsia-400 to-violet-500">
                Asset.
              </span>
            </h1>

            <p className={cn(
              "text-lg md:text-xl max-w-3xl mx-auto leading-relaxed mb-12",
              isDark ? "text-purple-300" : "text-purple-700"
            )}>
              LinguaLayer turns every translation into a <strong className={isDark ? "text-white" : "text-purple-950"}>verifiable, income-generating asset.</strong>{" "}
              Decentralized localization where linguists own their contributions and earn royalties automatically—forever.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button onClick={() => setWalletOpen(true)}
                className="flex items-center justify-center gap-2 px-10 py-4 rounded-xl font-bold uppercase tracking-widest text-sm bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white shadow-xl shadow-violet-500/20 hover:opacity-90 transition-all">
                Start Translating <ArrowRight className="w-4 h-4" />
              </button>
              <a href="#protocol" className={cn(
                "flex items-center justify-center gap-2 px-10 py-4 rounded-xl font-bold uppercase tracking-widest text-sm border transition-all",
                isDark ? "border-purple-800 text-purple-400 hover:border-violet-500/30 hover:text-white" : "border-violet-300 text-purple-700"
              )}>
                View Protocol
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* STATS */}
      <section className="px-6 pb-16">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
          {STATS.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={cn(
                "p-5 rounded-2xl border transition-all",
                isDark ? "bg-purple-950/60 border-purple-900 hover:border-violet-500/30" : "bg-white border-violet-200 hover:border-violet-400"
              )}
            >
              <s.icon className={cn("w-5 h-5 mb-3", s.color)} />
              <div className={cn("text-3xl font-black tracking-tight mb-1", isDark ? "text-white" : "text-purple-950")}>{s.value}</div>
              <div className={cn("text-[10px] font-bold uppercase tracking-widest", isDark ? "text-purple-500" : "text-purple-600")}>{s.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* COMPONENTS */}
      <section id="protocol" className="px-6 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-[10px] font-bold text-violet-400 uppercase tracking-[0.5em] mb-4">Architecture</p>
            <h2 className={cn("text-4xl md:text-5xl font-black uppercase tracking-tight", isDark ? "text-white" : "text-purple-950")}>
              Three Contracts.<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400">
                Infinite Languages.
              </span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {COMPONENTS.map((c, i) => (
              <motion.div
                key={c.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className={cn(
                  "p-7 rounded-2xl border transition-all hover:shadow-xl group",
                  isDark ? "bg-purple-950/60 border-purple-900 hover:border-violet-500/30" : "bg-white border-violet-200 hover:border-violet-400"
                )}
              >
                <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center mb-5 bg-gradient-to-br", c.gradient)}>
                  <c.icon className="w-6 h-6 text-white" />
                </div>
                <div className={cn("text-[9px] font-mono mb-2 tracking-wider", isDark ? "text-purple-500" : "text-purple-600")}>{c.tag}</div>
                <h3 className={cn("text-xl font-black uppercase tracking-tight mb-3", isDark ? "text-white" : "text-purple-950")}>{c.title}</h3>
                <p className={cn("text-sm leading-relaxed", isDark ? "text-purple-300" : "text-purple-700")}>{c.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* WORKFLOW */}
      <section id="linguists" className="px-6 py-16">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-[10px] font-bold text-violet-400 uppercase tracking-[0.5em] mb-4">Workflow</p>
            <h2 className={cn("text-4xl md:text-5xl font-black uppercase tracking-tight", isDark ? "text-white" : "text-purple-950")}>
              From Upload<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400">
                To Royalty.
              </span>
            </h2>
          </div>

          <div className="space-y-4">
            {WORKFLOW.map((step, i) => (
              <motion.div
                key={step.n}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={cn(
                  "flex gap-6 p-6 rounded-2xl border transition-all group",
                  isDark ? "bg-purple-950/40 border-purple-900 hover:border-violet-500/30" : "bg-white border-violet-200 hover:border-violet-300"
                )}
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 flex items-center justify-center shrink-0">
                  <span className="text-xs font-black text-violet-400 font-mono">{step.n}</span>
                </div>
                <div>
                  <h3 className={cn("font-black uppercase text-sm tracking-wide mb-1.5", isDark ? "text-white" : "text-purple-950")}>{step.title}</h3>
                  <p className={cn("text-sm leading-relaxed", isDark ? "text-purple-300" : "text-purple-700")}>{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* LIVE TRANSLATIONS */}
      <section id="marketplace" className="px-6 py-16">
        <div className="max-w-5xl mx-auto">
          <div className={cn("rounded-2xl border p-8", isDark ? "bg-purple-950/60 border-purple-900" : "bg-white border-violet-200")}>
            <div className="text-[10px] font-mono uppercase tracking-widest mb-6 text-violet-500">Live Translation Market</div>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                { dataset: "OpenAI API Docs", pair: "EN → AR", status: "In Review", contributors: 12, reward: "240 XLM" },
                { dataset: "React Documentation", pair: "EN → SW", status: "Open", contributors: 3, reward: "180 XLM" },
                { dataset: "UN SDG Reports", pair: "EN → HI", status: "Verified", contributors: 28, reward: "1,200 XLM" },
                { dataset: "Medical Protocols", pair: "EN → FR", status: "Open", contributors: 7, reward: "540 XLM" },
              ].map((item, i) => (
                <div key={i} className={cn(
                  "p-4 rounded-xl border flex items-center justify-between",
                  isDark ? "bg-purple-900/40 border-purple-800" : "bg-violet-50 border-violet-200"
                )}>
                  <div>
                    <p className={cn("font-bold text-sm", isDark ? "text-white" : "text-purple-950")}>{item.dataset}</p>
                    <p className={cn("text-xs mt-0.5", isDark ? "text-purple-400" : "text-purple-600")}>{item.pair} · {item.contributors} contributors</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-black text-violet-400">{item.reward}</p>
                    <p className={cn("text-[9px] font-bold uppercase tracking-wider mt-0.5",
                      item.status === "Verified" ? "text-emerald-400" : item.status === "In Review" ? "text-amber-400" : "text-violet-400"
                    )}>{item.status}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center"
        >
          <h2 className={cn("text-5xl md:text-7xl font-black uppercase tracking-tight mb-6", isDark ? "text-white" : "text-purple-950")}>
            Speak.<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400">
              Earn.
            </span>
          </h2>
          <p className={cn("text-lg mb-10 max-w-xl mx-auto", isDark ? "text-purple-300" : "text-purple-700")}>
            Every language contribution is a verifiable, income-generating asset. Join 8,000+ linguists building the decentralized internet of language.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button onClick={() => setWalletOpen(true)}
              className="flex items-center justify-center gap-2 px-10 py-4 rounded-xl font-bold uppercase tracking-widest text-sm bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white shadow-xl shadow-violet-500/20 hover:opacity-90 transition-all">
              <Wallet className="w-4 h-4" /> Join the Network
            </button>
            <a href="https://github.com/linguaFoundation/LinguaLayer" target="_blank" rel="noopener noreferrer"
              className={cn(
                "flex items-center justify-center gap-2 px-10 py-4 rounded-xl font-bold uppercase tracking-widest text-sm border transition-all",
                isDark ? "border-purple-800 text-purple-400 hover:border-violet-500/30 hover:text-white" : "border-violet-300 text-purple-700"
              )}>
              <GitBranch className="w-4 h-4" /> Contribute
            </a>
          </div>
        </motion.div>
      </section>

      {/* FOOTER */}
      <footer className={cn("border-t px-6 py-12", isDark ? "border-purple-900" : "border-violet-200")}>
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center">
              <Languages className="w-4 h-4 text-white" />
            </div>
            <div>
              <span className={cn("font-black text-base uppercase tracking-tight", isDark ? "text-white" : "text-purple-950")}>LinguaLayer</span>
              <span className={cn("text-[10px] block uppercase tracking-widest", isDark ? "text-purple-600" : "text-purple-600")}>Linguistic Asset Protocol</span>
            </div>
          </div>
          <div className="flex items-center gap-6">
            {["GitHub", "Twitter", "Discord", "Docs"].map(l => (
              <a key={l} href="#" className={cn("text-[11px] font-bold uppercase tracking-widest transition-colors hover:text-violet-400", isDark ? "text-purple-600" : "text-purple-600")}>{l}</a>
            ))}
          </div>
          <p className={cn("text-[10px] uppercase tracking-widest", isDark ? "text-purple-700" : "text-purple-600")}>© 2026 LinguaFoundation · MIT</p>
        </div>
      </footer>
    </div>
  );
}
