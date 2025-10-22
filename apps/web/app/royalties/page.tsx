"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import {
  Coins, Wallet, Users, ArrowRight, Zap,
  TrendingUp, Globe, BarChart3, Star, Sparkles,
} from "lucide-react";
import { PageShell } from "@/components/ui/page-shell";
import { cn } from "@/lib/utils";

const TOP_EARNERS = [
  { id: "CONT-8821-BEN", pairs: "EN→AR, EN→FR", earned: "14,200 XLM", streams: 8, badge: "Elite" },
  { id: "CONT-3344-LAG", pairs: "EN→SW, EN→HA", earned: "11,850 XLM", streams: 6, badge: "Elite" },
  { id: "CONT-7721-MUM", pairs: "EN→HI, EN→BN", earned: "10,400 XLM", streams: 7, badge: "Elite" },
  { id: "CONT-5512-NAI", pairs: "EN→SW, EN→YO", earned: "8,930 XLM", streams: 5, badge: "Pro" },
  { id: "CONT-2298-SAO", pairs: "EN→PT, EN→ES", earned: "7,640 XLM", streams: 4, badge: "Pro" },
  { id: "CONT-9934-SHA", pairs: "EN→ZH, EN→JA", earned: "6,210 XLM", streams: 4, badge: "Pro" },
  { id: "CONT-1187-CAI", pairs: "EN→AR, EN→FR", earned: "4,880 XLM", streams: 3, badge: "Rising" },
  { id: "CONT-6623-ACC", pairs: "EN→TW, EN→HA", earned: "3,540 XLM", streams: 2, badge: "Rising" },
];

const RECENT_PAYOUTS = [
  { date: "2026-05-14", dataset: "Medical Protocol Suite EN→SW", buyer: "0x7f3a…b291", amount: "720 XLM", share: "252 XLM" },
  { date: "2026-05-13", dataset: "OpenAI API Docs EN→AR", buyer: "0x2c8e…f104", amount: "480 XLM", share: "168 XLM" },
  { date: "2026-05-12", dataset: "UN SDG Reports EN→HI", buyer: "0x9b1d…3a87", amount: "1,200 XLM", share: "420 XLM" },
  { date: "2026-05-11", dataset: "Climate Science Reports EN→FR", buyer: "0x4e5c…7d22", amount: "860 XLM", share: "301 XLM" },
  { date: "2026-05-10", dataset: "Legal Contract Templates EN→ZH", buyer: "0x1a2b…9c34", amount: "950 XLM", share: "332 XLM" },
  { date: "2026-05-09", dataset: "Agricultural Guides EN→HA", buyer: "0x8f3c…2e56", amount: "340 XLM", share: "119 XLM" },
  { date: "2026-05-08", dataset: "E-Commerce Catalog EN→BN", buyer: "0x3d7a…1b89", amount: "620 XLM", share: "217 XLM" },
  { date: "2026-05-07", dataset: "Gov Services Glossary EN→YO", buyer: "0x5c9b…4f12", amount: "240 XLM", share: "84 XLM" },
  { date: "2026-05-06", dataset: "Tech Startup Decks EN→PT", buyer: "0x7e2f…8a45", amount: "180 XLM", share: "63 XLM" },
  { date: "2026-05-05", dataset: "Educational Curriculum EN→IG", buyer: "0x2a8d…6c78", amount: "290 XLM", share: "101 XLM" },
];

const SPLIT_BREAKDOWN = [
  { role: "Author / Publisher", pct: 40, color: "bg-violet-500", textColor: "text-violet-400" },
  { role: "Primary Translator", pct: 35, color: "bg-fuchsia-500", textColor: "text-fuchsia-400" },
  { role: "Peer Reviewer", pct: 15, color: "bg-purple-500", textColor: "text-purple-400" },
  { role: "Protocol Treasury", pct: 10, color: "bg-purple-800", textColor: "text-purple-500" },
];

const badgeColor: Record<string, string> = {
  Elite: "text-amber-400 bg-amber-400/10 border-amber-400/20",
  Pro: "text-violet-400 bg-violet-400/10 border-violet-400/20",
  Rising: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
};

export default function RoyaltiesPage() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [walletAddress] = useState<string | null>(null);

  useEffect(() => { setMounted(true); }, []);

  if (!mounted) return null;
  const isDark = theme !== "light";

  return (
    <PageShell>
      <div className="px-6 pb-24">
        <div className="max-w-7xl mx-auto">

          {/* Hero */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="text-center mb-12 pt-8"
          >
            <div className={cn(
              "inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-[0.5em] mb-6 border",
              isDark ? "bg-violet-500/10 border-violet-500/20 text-violet-400" : "bg-violet-100 border-violet-300 text-violet-700"
            )}>
              <Coins className="w-3 h-3" />
              {walletAddress ? "Your Earnings" : "Protocol Royalties"}
            </div>
            <h1 className={cn(
              "text-5xl md:text-7xl font-black uppercase tracking-tight mb-4",
              isDark ? "text-white" : "text-purple-950"
            )}>
              {walletAddress ? "Your" : "Protocol"}<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-fuchsia-400 to-violet-500">
                Royalties.
              </span>
            </h1>
            {!walletAddress && (
              <div className={cn(
                "inline-flex items-center gap-3 mt-4 px-6 py-3 rounded-xl border text-sm",
                isDark ? "bg-violet-500/10 border-violet-500/20 text-violet-300" : "bg-violet-100 border-violet-300 text-violet-700"
              )}>
                <Wallet className="w-4 h-4" />
                Connect your wallet to view personal earnings
              </div>
            )}
          </motion.div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            {[
              { label: "Total Paid Out", value: "$1.24M", icon: Coins, color: "text-fuchsia-400" },
              { label: "This Month", value: "84,200 XLM", icon: TrendingUp, color: "text-violet-400" },
              { label: "Active Streams", value: "3,812", icon: Zap, color: "text-purple-400" },
              { label: "Avg / Contributor", value: "151 XLM", icon: Star, color: "text-amber-400" },
            ].map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className={cn(
                  "p-5 rounded-2xl border",
                  isDark ? "bg-purple-950/60 border-purple-900" : "bg-white border-violet-200"
                )}
              >
                <s.icon className={cn("w-5 h-5 mb-3", s.color)} />
                <div className={cn("text-2xl font-black tracking-tight mb-1", isDark ? "text-white" : "text-purple-950")}>{s.value}</div>
                <div className={cn("text-[10px] font-bold uppercase tracking-widest", isDark ? "text-purple-500" : "text-purple-600")}>{s.label}</div>
              </motion.div>
            ))}
          </div>

          <div className="grid lg:grid-cols-3 gap-8 mb-12">
            {/* Royalty Split Breakdown */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className={cn(
                "p-6 rounded-2xl border lg:col-span-1",
                isDark ? "bg-purple-950/60 border-purple-900" : "bg-white border-violet-200"
              )}
            >
              <div className={cn("text-[10px] font-bold uppercase tracking-[0.4em] mb-2", isDark ? "text-purple-500" : "text-purple-600")}>Revenue Split</div>
              <h2 className={cn("text-xl font-black uppercase tracking-tight mb-6", isDark ? "text-white" : "text-purple-950")}>
                Every License, Split Instantly
              </h2>

              <div className="flex h-3 rounded-full overflow-hidden mb-6 gap-0.5">
                {SPLIT_BREAKDOWN.map((s) => (
                  <div key={s.role} className={cn("h-full", s.color)} style={{ width: `${s.pct}%` }} />
                ))}
              </div>

              <div className="space-y-3">
                {SPLIT_BREAKDOWN.map((s) => (
                  <div key={s.role} className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className={cn("w-2.5 h-2.5 rounded-full", s.color)} />
                      <span className={cn("text-xs font-medium", isDark ? "text-purple-300" : "text-purple-700")}>{s.role}</span>
                    </div>
                    <span className={cn("text-sm font-black", s.textColor)}>{s.pct}%</span>
                  </div>
                ))}
              </div>

              <div className={cn("mt-6 p-4 rounded-xl border text-xs leading-relaxed", isDark ? "bg-purple-900/50 border-purple-800 text-purple-400" : "bg-violet-50 border-violet-200 text-purple-600")}>
                Splits execute atomically via the Royalty Splitter contract the instant a license payment is confirmed on Stellar.
              </div>
            </motion.div>

            {/* How Royalties Work */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className={cn(
                "p-6 rounded-2xl border lg:col-span-2",
                isDark ? "bg-purple-950/60 border-purple-900" : "bg-white border-violet-200"
              )}
            >
              <div className={cn("text-[10px] font-bold uppercase tracking-[0.4em] mb-2", isDark ? "text-purple-500" : "text-purple-600")}>Mechanism</div>
              <h2 className={cn("text-xl font-black uppercase tracking-tight mb-8", isDark ? "text-white" : "text-purple-950")}>
                How Royalties Work
              </h2>
              <div className="grid md:grid-cols-3 gap-4">
                {[
                  { n: "01", icon: Globe, title: "License Purchased", desc: "An enterprise or researcher buys a license via the License Router. Payment is made in XLM.", color: "from-violet-500 to-purple-600" },
                  { n: "02", icon: Zap, title: "Split Tree Executes", desc: "The Royalty Splitter atomically distributes funds to all contributors based on their verified roles.", color: "from-fuchsia-500 to-violet-600" },
                  { n: "03", icon: Coins, title: "XLM Arrives", desc: "Each contributor's wallet receives their share in the same block. No delays, no intermediaries.", color: "from-purple-500 to-fuchsia-600" },
                ].map((step, i) => (
                  <div key={step.n} className="relative">
                    {i < 2 && (
                      <div className="hidden md:flex absolute top-5 left-full w-4 z-10 items-center">
                        <ArrowRight className={cn("w-4 h-4", isDark ? "text-purple-600" : "text-purple-400")} />
                      </div>
                    )}
                    <div className={cn("p-4 rounded-xl border h-full", isDark ? "bg-purple-900/50 border-purple-800" : "bg-violet-50 border-violet-200")}>
                      <div className={cn("w-10 h-10 rounded-xl bg-gradient-to-br flex items-center justify-center mb-3", step.color)}>
                        <step.icon className="w-5 h-5 text-white" />
                      </div>
                      <div className={cn("text-[9px] font-mono mb-1", isDark ? "text-purple-600" : "text-purple-400")}>{step.n}</div>
                      <h3 className={cn("text-sm font-black uppercase tracking-tight mb-2", isDark ? "text-white" : "text-purple-950")}>{step.title}</h3>
                      <p className={cn("text-xs leading-relaxed", isDark ? "text-purple-400" : "text-purple-600")}>{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Top Earners */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className={cn("p-6 rounded-2xl border mb-8", isDark ? "bg-purple-950/60 border-purple-900" : "bg-white border-violet-200")}
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <div className={cn("text-[10px] font-bold uppercase tracking-[0.4em] mb-1", isDark ? "text-purple-500" : "text-purple-600")}>Leaderboard</div>
                <h2 className={cn("text-xl font-black uppercase tracking-tight", isDark ? "text-white" : "text-purple-950")}>Top Earners</h2>
              </div>
              <div className={cn("flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider", isDark ? "text-purple-600" : "text-purple-500")}>
                <Users className="w-3.5 h-3.5" />
                Anonymized
              </div>
            </div>
            <div className="space-y-3">
              {TOP_EARNERS.map((earner, i) => (
                <div key={earner.id} className={cn(
                  "flex items-center gap-4 p-4 rounded-xl border transition-all",
                  isDark ? "bg-purple-900/40 border-purple-800 hover:border-violet-500/30" : "bg-violet-50 border-violet-200 hover:border-violet-400"
                )}>
                  <div className={cn(
                    "w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-sm font-black",
                    i === 0 ? "bg-amber-400/20 text-amber-400" : i === 1 ? "bg-purple-400/20 text-purple-400" : i === 2 ? "bg-orange-400/20 text-orange-400" : isDark ? "bg-purple-800 text-purple-400" : "bg-violet-100 text-purple-600"
                  )}>
                    #{i + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={cn("text-xs font-black font-mono", isDark ? "text-white" : "text-purple-950")}>{earner.id}</span>
                      <span className={cn("text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border", badgeColor[earner.badge])}>{earner.badge}</span>
                    </div>
                    <span className={cn("text-[10px]", isDark ? "text-purple-500" : "text-purple-600")}>{earner.pairs}</span>
                  </div>
                  <div className="text-right shrink-0">
                    <div className={cn("text-sm font-black", isDark ? "text-white" : "text-purple-950")}>{earner.earned}</div>
                    <div className={cn("text-[10px] font-bold", isDark ? "text-purple-500" : "text-purple-600")}>{earner.streams} streams</div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Recent Payouts */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className={cn("p-6 rounded-2xl border", isDark ? "bg-purple-950/60 border-purple-900" : "bg-white border-violet-200")}
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <div className={cn("text-[10px] font-bold uppercase tracking-[0.4em] mb-1", isDark ? "text-purple-500" : "text-purple-600")}>On-Chain History</div>
                <h2 className={cn("text-xl font-black uppercase tracking-tight", isDark ? "text-white" : "text-purple-950")}>Recent Payouts</h2>
              </div>
              <div className={cn("flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider", isDark ? "text-purple-600" : "text-purple-500")}>
                <Sparkles className="w-3.5 h-3.5 text-violet-400" />
                Live Data
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className={cn("text-[10px] font-bold uppercase tracking-widest", isDark ? "text-purple-600" : "text-purple-500")}>
                    {["Date", "Dataset", "License Buyer", "Amount", "Your Share"].map((h) => (
                      <th key={h} className="text-left pb-3 pr-4 font-bold">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {RECENT_PAYOUTS.map((payout, i) => (
                    <tr key={i} className={cn("transition-colors border-t", isDark ? "border-purple-900 hover:bg-purple-900/30" : "border-violet-100 hover:bg-violet-50")}>
                      <td className={cn("py-3 pr-4 text-xs font-mono", isDark ? "text-purple-400" : "text-purple-600")}>{payout.date.slice(5)}</td>
                      <td className={cn("py-3 pr-4 text-xs font-medium max-w-[180px] truncate", isDark ? "text-white" : "text-purple-950")}>{payout.dataset}</td>
                      <td className={cn("py-3 pr-4 text-xs font-mono", isDark ? "text-purple-500" : "text-purple-600")}>{payout.buyer}</td>
                      <td className="py-3 pr-4 text-xs font-black text-fuchsia-400">{payout.amount}</td>
                      <td className={cn("py-3 text-xs font-black", isDark ? "text-violet-400" : "text-violet-600")}>{payout.share}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {!walletAddress && (
              <div className={cn(
                "mt-6 p-4 rounded-xl border flex items-center gap-4",
                isDark ? "bg-violet-500/10 border-violet-500/20" : "bg-violet-100 border-violet-300"
              )}>
                <Wallet className="w-5 h-5 text-violet-400 shrink-0" />
                <div>
                  <p className={cn("text-sm font-bold", isDark ? "text-violet-300" : "text-violet-700")}>Connect wallet to see your personal earnings</p>
                  <p className={cn("text-xs", isDark ? "text-purple-500" : "text-purple-600")}>Above table shows aggregate protocol data. Your splits are private to your address.</p>
                </div>
                <BarChart3 className="w-5 h-5 text-violet-400 ml-auto shrink-0" />
              </div>
            )}
          </motion.div>

        </div>
      </div>
    </PageShell>
  );
}
