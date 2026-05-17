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

const SCRIPT_CHARS = [
  "語","言","ب","ت","भ","ष","언","어","Λ","Σ","Я","Ж","ሀ","ለ","文","字",
  "翻","译","ح","خ","ण","ध","번","역","Δ","Ω","Ф","Ш","ሐ","መ","日","本",
  "한","국","عر","بي","हि","ंद","日","語","한","글","Ελ","λη",
];

const ROYALTY_EVENTS = [
  { linguist: "@yuki_t", lang: "EN→JA", dataset: "React Docs", amount: "0.47 XLM", ago: "2s" },
  { linguist: "@amara_sw", lang: "EN→SW", dataset: "Medical Terms", amount: "1.23 XLM", ago: "5s" },
  { linguist: "@chen_zh", lang: "EN→ZH", dataset: "OpenAI API", amount: "2.18 XLM", ago: "11s" },
  { linguist: "@priya_hi", lang: "EN→HI", dataset: "UN Reports", amount: "0.89 XLM", ago: "18s" },
  { linguist: "@omar_ar", lang: "EN→AR", dataset: "Legal Corpus", amount: "3.41 XLM", ago: "24s" },
  { linguist: "@leo_pt", lang: "EN→PT", dataset: "Climate Data", amount: "0.62 XLM", ago: "31s" },
  { linguist: "@aisha_fr", lang: "EN→FR", dataset: "Tech Manuals", amount: "1.77 XLM", ago: "45s" },
  { linguist: "@nguyen_v", lang: "EN→VI", dataset: "E-Commerce", amount: "0.34 XLM", ago: "1m" },
];

const TRANSLATION_SAMPLES = [
  {
    pair: "EN → AR",
    source: "The protocol executes settlement instantly.",
    target: "يُنفّذ البروتوكول التسوية فورياً.",
    dataset: "DeFi Glossary v3.2",
    contributor: "@omar_ar",
    royalty: "0.041 XLM",
    block: "#9,847,291",
    status: "VERIFIED",
  },
  {
    pair: "EN → ZH",
    source: "Language ownership is a fundamental right.",
    target: "语言所有权是一项基本权利。",
    dataset: "Human Rights Corpus",
    contributor: "@chen_zh",
    royalty: "0.028 XLM",
    block: "#9,847,289",
    status: "VERIFIED",
  },
  {
    pair: "EN → SW",
    source: "Smart contracts remove the middleman.",
    target: "Mikataba ya akili huondoa mtu wa kati.",
    dataset: "Blockchain Basics v2",
    contributor: "@amara_sw",
    royalty: "0.057 XLM",
    block: "#9,847,285",
    status: "IN REVIEW",
  },
  {
    pair: "EN → HI",
    source: "Contributors earn royalties automatically.",
    target: "योगदानकर्ता स्वतः रॉयल्टी अर्जित करते हैं।",
    dataset: "Web3 Terminology",
    contributor: "@priya_hi",
    royalty: "0.033 XLM",
    block: "#9,847,280",
    status: "VERIFIED",
  },
];

function LiveRoyaltyFeed({ isDark }: { isDark: boolean }) {
  const [items, setItems] = useState(ROYALTY_EVENTS.slice(0, 6));
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setItems(prev => {
        const next = ROYALTY_EVENTS[tick % ROYALTY_EVENTS.length];
        return [next, ...prev.slice(0, 5)];
      });
      setTick(t => t + 1);
    }, 2200);
    return () => clearInterval(id);
  }, [tick]);

  return (
    <div className={cn(
      "rounded-xl border overflow-hidden h-full flex flex-col",
      isDark ? "bg-purple-950/50 border-purple-900/60" : "bg-white border-violet-200"
    )}>
      <div className={cn("flex items-center gap-2 px-4 py-3 border-b shrink-0", isDark ? "border-purple-900/50" : "border-violet-100")}>
        <span className="w-1.5 h-1.5 rounded-full bg-fuchsia-400 animate-pulse" />
        <span className="text-[8px] font-mono text-purple-500 tracking-[0.4em] uppercase">Live Royalties</span>
        <span className="ml-auto text-[7px] font-mono text-purple-700">REAL-TIME</span>
      </div>
      <div className="flex-1 overflow-hidden divide-y divide-purple-900/20">
        {items.map((ev, i) => (
          <motion.div
            key={`${ev.linguist}-${i}-${tick}`}
            initial={i === 0 ? { opacity: 0, y: -10, backgroundColor: "rgba(139,92,246,0.15)" } : { opacity: 1, y: 0 }}
            animate={{ opacity: 1, y: 0, backgroundColor: "rgba(0,0,0,0)" }}
            transition={{ duration: 0.4 }}
            className="px-4 py-2.5"
          >
            <div className="flex items-center justify-between mb-0.5">
              <span className="text-[10px] font-mono text-violet-300">{ev.linguist}</span>
              <span className="text-[11px] font-black text-fuchsia-400">+{ev.amount}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-[8px] font-mono text-purple-600 bg-purple-900/40 px-1.5 py-0.5 rounded">{ev.lang}</span>
              <span className="text-[8px] text-purple-700 truncate flex-1">{ev.dataset}</span>
              <span className="text-[7px] font-mono text-purple-800 shrink-0">{ev.ago}</span>
            </div>
          </motion.div>
        ))}
      </div>
      <div className={cn("px-4 py-2.5 border-t shrink-0", isDark ? "border-purple-900/50" : "border-violet-100")}>
        <p className="text-[8px] font-mono text-purple-700 text-center tracking-widest">8,200 LINGUISTS EARNING</p>
      </div>
    </div>
  );
}

function TranslationCard({ isDark }: { isDark: boolean }) {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setIdx(i => (i + 1) % TRANSLATION_SAMPLES.length), 3800);
    return () => clearInterval(t);
  }, []);

  const s = TRANSLATION_SAMPLES[idx];

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={idx}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.4 }}
        className={cn(
          "rounded-xl border p-5",
          isDark ? "bg-purple-950/70 border-purple-800/50" : "bg-white border-violet-200"
        )}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-[8px] font-mono text-purple-600 uppercase tracking-widest">Proof-of-Translation</span>
            <span className="text-[7px] font-mono text-purple-700">·</span>
            <span className="text-[9px] font-bold text-violet-400">{s.pair}</span>
          </div>
          <span className={cn(
            "text-[8px] font-mono font-bold tracking-widest px-2 py-0.5 rounded-full",
            s.status === "VERIFIED"
              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
              : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
          )}>{s.status}</span>
        </div>

        <div className="space-y-3 mb-4">
          <div className={cn("p-3 rounded-lg border", isDark ? "bg-purple-900/30 border-purple-800/40" : "bg-violet-50 border-violet-200")}>
            <div className="text-[7px] font-mono text-purple-600 uppercase tracking-widest mb-1">Source</div>
            <p className={cn("text-xs leading-relaxed", isDark ? "text-purple-200" : "text-purple-900")}>"{s.source}"</p>
          </div>
          <div className={cn("p-3 rounded-lg border", isDark ? "bg-violet-900/20 border-violet-800/30" : "bg-violet-100 border-violet-300")}>
            <div className="text-[7px] font-mono text-violet-500 uppercase tracking-widest mb-1">Translation</div>
            <p className="text-xs leading-relaxed text-violet-300">{s.target}</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 border-t border-purple-900/40 pt-4 mb-3">
          <div>
            <div className="text-[7px] font-mono text-purple-600 uppercase mb-0.5">Dataset</div>
            <div className="text-[9px] text-purple-300 leading-tight">{s.dataset}</div>
          </div>
          <div>
            <div className="text-[7px] font-mono text-purple-600 uppercase mb-0.5">Royalty</div>
            <div className="text-[10px] text-fuchsia-400 font-black">{s.royalty}</div>
          </div>
          <div>
            <div className="text-[7px] font-mono text-purple-600 uppercase mb-0.5">Block</div>
            <div className="text-[9px] text-purple-400 font-mono">{s.block}</div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-violet-500 shrink-0" />
          <span className="text-[8px] font-mono text-purple-500">{s.contributor}</span>
          <div className="ml-auto flex gap-1">
            {TRANSLATION_SAMPLES.map((_, i) => (
              <div key={i} className={cn("w-1 h-1 rounded-full transition-all", i === idx ? "bg-violet-400 w-3" : "bg-purple-800")} />
            ))}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

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

      {/* TESTNET ALERT STRIP */}
      <div className="fixed top-16 inset-x-0 z-40 h-7 flex items-center border-b border-amber-500/20 bg-amber-500/8 backdrop-blur-sm overflow-hidden">
        <div className="flex items-center gap-2 px-4 shrink-0 border-r border-amber-500/20 h-full">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse shrink-0" />
          <span className="text-[8px] font-mono text-amber-400 tracking-[0.35em] uppercase whitespace-nowrap">Soroban Testnet</span>
        </div>
        <div className="flex items-center gap-2 px-4 shrink-0 border-r border-amber-500/20 h-full hidden sm:flex">
          <span className="text-[7px] font-mono text-amber-400/60 tracking-widest uppercase whitespace-nowrap">Contract: CABO2HQDY4DF6XA2R3O75CZ6XQTZ5D4Y2D5NYV7KOIC2BCZNV7OKZXK5</span>
        </div>
        <div className="flex-1 overflow-hidden flex items-center">
          <motion.div
            className="flex items-center gap-8 whitespace-nowrap pl-6"
            animate={{ x: ["0%", "-50%"] }}
            transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
          >
            {[...ROYALTY_EVENTS, ...ROYALTY_EVENTS].map((ev, i) => (
              <span key={i} className="text-[8px] font-mono text-amber-400/50 tracking-widest">
                {ev.linguist} <span className="text-amber-400/80">+{ev.amount}</span> <span className="text-amber-400/20">·</span>
              </span>
            ))}
          </motion.div>
        </div>
        <a href="https://stellar.expert/explorer/testnet/contract/CABO2HQDY4DF6XA2R3O75CZ6XQTZ5D4Y2D5NYV7KOIC2BCZNV7OKZXK5"
          target="_blank" rel="noopener noreferrer"
          className="px-4 h-full flex items-center text-[7px] font-mono text-amber-400/60 hover:text-amber-400 tracking-widest uppercase transition-colors border-l border-amber-500/20 shrink-0 whitespace-nowrap">
          View on Explorer →
        </a>
      </div>

      {/* HERO — Linguistic Exchange Dashboard */}
      <section className="relative min-h-screen overflow-hidden flex flex-col" style={{ paddingTop: "88px" }}>
        {/* Floating script background */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {SCRIPT_CHARS.map((char, i) => (
            <motion.span
              key={i}
              className="absolute font-bold select-none"
              style={{
                left: `${(i * 13.7) % 94}%`,
                top: `${(i * 17.3) % 88}%`,
                fontSize: `${16 + (i % 3) * 6}px`,
                color: isDark ? `rgba(139,92,246,0.06)` : `rgba(109,40,217,0.05)`,
              }}
              animate={{ y: [0, -20, 0], opacity: [0.03, 0.09, 0.03] }}
              transition={{ duration: 10 + (i % 5) * 2, repeat: Infinity, ease: "easeInOut", delay: i * 0.3 }}
            >
              {char}
            </motion.span>
          ))}
        </div>

        {/* 3-column layout */}
        <div className="relative z-10 flex flex-1">

          {/* LEFT: Vertical label + Live royalty feed */}
          <div className="hidden lg:flex shrink-0">
            <div className={cn("flex items-center justify-center w-9 border-r", isDark ? "border-purple-900/40" : "border-violet-200")}>
              <span className="text-[7px] font-black tracking-[0.5em] uppercase select-none"
                style={{ writingMode: "vertical-rl", transform: "rotate(180deg)", color: isDark ? "rgba(139,92,246,0.25)" : "rgba(109,40,217,0.2)" }}>
                LINGUA LAYER
              </span>
            </div>
            <div className={cn("w-64 border-r flex flex-col", isDark ? "border-purple-900/40" : "border-violet-200")}>
              <LiveRoyaltyFeed isDark={isDark} />
            </div>
          </div>

          {/* CENTER: Numbers → Statement → CTAs */}
          <div className="flex-1 flex flex-col justify-center px-8 lg:px-14 py-12">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            >
              {/* Stats as the hero — DATA first, not a slogan */}
              <div className={cn("grid grid-cols-2 lg:grid-cols-4 gap-px mb-10 border rounded-2xl overflow-hidden",
                isDark ? "border-purple-900/50 bg-purple-900/20" : "border-violet-200 bg-violet-100/50")}>
                {STATS.map((s) => (
                  <div key={s.label} className={cn("px-5 py-5", isDark ? "bg-[#0c0814]" : "bg-white/80")}>
                    <s.icon className={cn("w-4 h-4 mb-2", s.color)} />
                    <div className={cn("text-3xl lg:text-4xl font-black leading-none tracking-tight mb-1", isDark ? "text-white" : "text-purple-950")}>
                      {s.value}
                    </div>
                    <div className="text-[8px] font-mono uppercase tracking-widest text-purple-500">{s.label}</div>
                  </div>
                ))}
              </div>

              {/* Label */}
              <p className="text-[9px] font-mono tracking-[0.5em] text-violet-500 uppercase mb-5">
                Linguistic Asset Protocol · Soroban Testnet
              </p>

              {/* Statement — left-aligned, not a giant brand name */}
              <h1 className={cn("text-3xl md:text-4xl lg:text-[2.8rem] font-black leading-[1.08] tracking-tight mb-5 max-w-2xl",
                isDark ? "text-white" : "text-purple-950")}>
                The first protocol that turns every verified translation into a{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-fuchsia-400 to-violet-500">
                  permanently ownable, licensable, income-generating asset.
                </span>
              </h1>

              <p className={cn("text-sm leading-[1.8] mb-8 max-w-xl", isDark ? "text-purple-300" : "text-purple-700")}>
                Linguists contribute. Enterprises license verified datasets.
                Royalties flow automatically — on Stellar Soroban, in real time, forever.
                No platform takes a cut. No middleman. No waiting.
              </p>

              <div className="flex flex-wrap gap-3">
                <button onClick={() => setWalletOpen(true)}
                  className="flex items-center gap-2 px-7 py-3.5 font-black uppercase text-[11px] tracking-widest bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white rounded-xl hover:opacity-90 transition-all shadow-lg shadow-violet-500/20">
                  Start Contributing <ArrowRight className="w-4 h-4" />
                </button>
                <a href="https://stellar.expert/explorer/testnet/contract/CABO2HQDY4DF6XA2R3O75CZ6XQTZ5D4Y2D5NYV7KOIC2BCZNV7OKZXK5"
                  target="_blank" rel="noopener noreferrer"
                  className={cn("flex items-center gap-2 px-7 py-3.5 font-bold uppercase text-[11px] tracking-widest rounded-xl border transition-all",
                    isDark ? "border-amber-500/30 text-amber-400 hover:bg-amber-500/10" : "border-amber-400 text-amber-600 hover:bg-amber-50")}>
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" /> View Testnet Contract
                </a>
                <a href="#protocol"
                  className={cn("flex items-center gap-2 px-7 py-3.5 font-bold uppercase text-[11px] tracking-widest rounded-xl border transition-all",
                    isDark ? "border-purple-800 text-purple-400 hover:border-violet-500/30 hover:text-white" : "border-violet-300 text-purple-700")}>
                  Protocol Architecture
                </a>
              </div>
            </motion.div>
          </div>

          {/* RIGHT: Translation verifier */}
          <div className={cn("hidden lg:flex flex-col w-72 border-l px-5 py-10 shrink-0 justify-center gap-4",
            isDark ? "border-purple-900/40" : "border-violet-200")}>
            <div className="text-[7px] font-mono text-purple-600 tracking-[0.4em] uppercase mb-1">Live Verification Feed</div>
            <TranslationCard isDark={isDark} />
            <div className={cn("p-3 rounded-xl border mt-2", isDark ? "bg-purple-950/60 border-purple-900/50" : "bg-violet-50 border-violet-200")}>
              <div className="text-[7px] font-mono text-purple-600 uppercase tracking-widest mb-2">Testnet Contract</div>
              <div className="text-[8px] font-mono text-violet-400 break-all leading-relaxed">CABO2HQDY4DF6XA2R3O75CZ6XQTZ5D4Y2D5NYV7KOIC2BCZNV7OKZXK5</div>
              <div className="flex items-center gap-2 mt-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                <span className="text-[7px] font-mono text-amber-400 tracking-widest uppercase">4 Datasets Registered</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom language ticker */}
        <div className={cn("relative z-10 border-t h-9 flex items-center overflow-hidden shrink-0",
          isDark ? "border-purple-900/40" : "border-violet-200")}>
          <motion.div
            className="flex items-center gap-10 whitespace-nowrap px-6"
            animate={{ x: ["0%", "-50%"] }}
            transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
          >
            {[...LANGUAGES, ...LANGUAGES, ...LANGUAGES, ...LANGUAGES].map((lang, i) => (
              <span key={i} className={cn("text-[9px] font-mono tracking-[0.4em]",
                isDark ? "text-purple-800" : "text-violet-300")}>
                {lang}
              </span>
            ))}
          </motion.div>
        </div>
      </section>

      {/* PROTOCOL ARCHITECTURE */}
      <section id="protocol" className="px-6 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="mb-14">
            <p className="text-[9px] font-mono text-violet-500 uppercase tracking-[0.5em] mb-3">Architecture</p>
            <h2 className={cn("text-3xl md:text-4xl font-black tracking-tight", isDark ? "text-white" : "text-purple-950")}>
              Three contracts. One protocol.<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400">
                Infinite language pairs.
              </span>
            </h2>
          </div>

          {/* Horizontal connected flow */}
          <div className="relative">
            {/* Connecting line */}
            <div className={cn("absolute top-12 left-[16.5%] right-[16.5%] h-px hidden md:block",
              isDark ? "bg-gradient-to-r from-violet-500/30 via-fuchsia-500/40 to-violet-500/30" : "bg-gradient-to-r from-violet-300 via-fuchsia-300 to-violet-300")} />

            <div className="grid md:grid-cols-3 gap-6">
              {COMPONENTS.map((c, i) => (
                <motion.div
                  key={c.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15 }}
                  className={cn("p-6 rounded-2xl border transition-all hover:shadow-xl group relative",
                    isDark ? "bg-purple-950/60 border-purple-900 hover:border-violet-500/40" : "bg-white border-violet-200 hover:border-violet-400")}
                >
                  {/* Step indicator */}
                  <div className={cn("absolute -top-3 left-6 text-[8px] font-mono px-2 py-0.5 rounded-full border",
                    isDark ? "bg-[#0c0814] border-purple-800 text-purple-500" : "bg-white border-violet-200 text-violet-600")}>
                    0{i + 1}
                  </div>
                  <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center mb-4 bg-gradient-to-br", c.gradient)}>
                    <c.icon className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-[8px] font-mono text-purple-600 mb-1.5 tracking-wider">{c.tag}</div>
                  <h3 className={cn("text-lg font-black uppercase tracking-tight mb-2", isDark ? "text-white" : "text-purple-950")}>{c.title}</h3>
                  <p className={cn("text-xs leading-relaxed", isDark ? "text-purple-400" : "text-purple-700")}>{c.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* WORKFLOW — horizontal timeline */}
      <section id="linguists" className={cn("py-20 border-t", isDark ? "border-purple-900/40" : "border-violet-100")}>
        <div className="max-w-6xl mx-auto px-6">
          <div className="mb-14">
            <p className="text-[9px] font-mono text-violet-500 uppercase tracking-[0.5em] mb-3">How It Works</p>
            <h2 className={cn("text-3xl md:text-4xl font-black tracking-tight", isDark ? "text-white" : "text-purple-950")}>
              From string to royalty —<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400">five steps, fully on-chain.</span>
            </h2>
          </div>

          {/* Horizontal steps */}
          <div className="grid md:grid-cols-5 gap-4 relative">
            <div className={cn("absolute top-8 left-[10%] right-[10%] h-px hidden md:block",
              isDark ? "bg-purple-900/50" : "bg-violet-100")} />
            {WORKFLOW.map((step, i) => (
              <motion.div
                key={step.n}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="relative"
              >
                <div className={cn("w-8 h-8 rounded-full border-2 flex items-center justify-center mb-4 relative z-10",
                  isDark ? "bg-[#0c0814] border-violet-500/50" : "bg-white border-violet-400")}>
                  <span className="text-[9px] font-black text-violet-400 font-mono">{step.n}</span>
                </div>
                <h3 className={cn("font-black uppercase text-xs tracking-wide mb-1.5", isDark ? "text-white" : "text-purple-950")}>{step.title}</h3>
                <p className={cn("text-[11px] leading-relaxed", isDark ? "text-purple-400" : "text-purple-700")}>{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* LIVE DATASET MARKETPLACE */}
      <section id="marketplace" className={cn("py-20 border-t", isDark ? "border-purple-900/40" : "border-violet-100")}>
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-[9px] font-mono text-violet-500 uppercase tracking-[0.5em] mb-3">Live Marketplace</p>
              <h2 className={cn("text-3xl md:text-4xl font-black tracking-tight", isDark ? "text-white" : "text-purple-950")}>
                Open datasets.<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400">Real rewards.</span>
              </h2>
            </div>
            <a href="#" className={cn("hidden md:flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest",
              isDark ? "text-violet-400 hover:text-white" : "text-violet-600")}>
              View all <ArrowRight className="w-3 h-3" />
            </a>
          </div>

          <div className={cn("rounded-2xl border overflow-hidden", isDark ? "border-purple-900/50" : "border-violet-200")}>
            {/* Table header */}
            <div className={cn("grid grid-cols-[2fr_1fr_1fr_1fr_1fr] gap-4 px-6 py-3 border-b text-[8px] font-mono uppercase tracking-[0.3em]",
              isDark ? "bg-purple-950/80 border-purple-900/50 text-purple-600" : "bg-violet-50 border-violet-200 text-violet-500")}>
              <span>Dataset</span><span>Pair</span><span>Contributors</span><span>Reward</span><span>Status</span>
            </div>
            {[
              { dataset: "React Documentation", pair: "EN → SW", contributors: 3, reward: "180 XLM", status: "Open" },
              { dataset: "UN SDG Climate Reports", pair: "EN → AR", contributors: 28, reward: "1,200 XLM", status: "Verified" },
              { dataset: "Medical Protocols v2", pair: "EN → HI", contributors: 12, reward: "540 XLM", status: "In Review" },
              { dataset: "DeFi Protocol Glossary", pair: "EN → ZH", contributors: 7, reward: "240 XLM", status: "Open" },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className={cn(
                  "grid grid-cols-[2fr_1fr_1fr_1fr_1fr] gap-4 px-6 py-4 items-center border-b transition-all cursor-pointer group",
                  i === 3 && "border-b-0",
                  isDark
                    ? "border-purple-900/30 hover:bg-purple-900/20"
                    : "border-violet-100 hover:bg-violet-50"
                )}
              >
                <span className={cn("font-bold text-sm group-hover:text-violet-400 transition-colors", isDark ? "text-white" : "text-purple-950")}>{item.dataset}</span>
                <span className={cn("text-xs font-mono px-2 py-1 rounded-full border w-fit",
                  isDark ? "border-violet-800/50 text-violet-400 bg-violet-900/20" : "border-violet-200 text-violet-600 bg-violet-50")}>{item.pair}</span>
                <span className={cn("text-xs", isDark ? "text-purple-400" : "text-purple-600")}>{item.contributors} people</span>
                <span className="text-xs font-black text-fuchsia-400">{item.reward}</span>
                <span className={cn("text-[9px] font-bold uppercase tracking-wider px-2 py-1 rounded-full w-fit",
                  item.status === "Verified" ? "bg-emerald-500/10 text-emerald-400" :
                  item.status === "In Review" ? "bg-amber-500/10 text-amber-400" :
                  "bg-violet-500/10 text-violet-400"
                )}>{item.status}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA — asymmetric split */}
      <section className={cn("border-t", isDark ? "border-purple-900/40" : "border-violet-100")}>
        <div className="max-w-6xl mx-auto px-6 py-20">
          <div className={cn("rounded-3xl overflow-hidden border relative",
            isDark ? "bg-purple-950/60 border-purple-900/60" : "bg-white border-violet-200")}>
            <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 via-transparent to-fuchsia-500/5 pointer-events-none" />
            <div className="grid md:grid-cols-[1fr_auto] items-center gap-0">
              <div className="p-10 md:p-14">
                <p className="text-[9px] font-mono text-violet-500 uppercase tracking-[0.5em] mb-4">Join the Protocol</p>
                <h2 className={cn("text-4xl md:text-5xl font-black tracking-tight mb-5", isDark ? "text-white" : "text-purple-950")}>
                  Your words.<br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400">
                    Your royalties.
                  </span><br />
                  Forever.
                </h2>
                <p className={cn("text-sm leading-relaxed mb-8 max-w-md", isDark ? "text-purple-300" : "text-purple-700")}>
                  8,200 linguists are already building the decentralized internet of language.
                  Every translation you submit is attributed, verified, and earning — permanently on Stellar Soroban.
                </p>
                <div className="flex flex-wrap gap-3">
                  <button onClick={() => setWalletOpen(true)}
                    className="flex items-center gap-2 px-8 py-4 font-black uppercase text-[11px] tracking-widest bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white rounded-xl hover:opacity-90 transition-all shadow-lg shadow-violet-500/20">
                    <Wallet className="w-4 h-4" /> Start Earning
                  </button>
                  <a href="https://github.com/linguaFoundation/lingualayer" target="_blank" rel="noopener noreferrer"
                    className={cn("flex items-center gap-2 px-8 py-4 font-bold uppercase text-[11px] tracking-widest rounded-xl border transition-all",
                      isDark ? "border-purple-800 text-purple-400 hover:border-violet-500/30 hover:text-white" : "border-violet-300 text-purple-700")}>
                    <GitBranch className="w-4 h-4" /> Contribute on GitHub
                  </a>
                </div>
              </div>
              <div className={cn("hidden md:flex flex-col gap-4 p-10 border-l self-stretch justify-center min-w-[240px]",
                isDark ? "border-purple-900/40" : "border-violet-200")}>
                {STATS.map(s => (
                  <div key={s.label} className={cn("py-4 border-b last:border-b-0", isDark ? "border-purple-900/30" : "border-violet-100")}>
                    <div className={cn("text-3xl font-black leading-none mb-1", isDark ? "text-white" : "text-purple-950")}>{s.value}</div>
                    <div className="text-[8px] font-mono text-purple-500 uppercase tracking-widest">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
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
