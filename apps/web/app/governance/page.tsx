"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import {
  Shield, CheckCircle2, Clock, MessageSquare, BarChart3,
  Users, Zap, Star, ArrowRight, GitBranch,
} from "lucide-react";
import { PageShell } from "@/components/ui/page-shell";
import { cn } from "@/lib/utils";

const ACTIVE_PROPOSALS = [
  {
    id: "LIP-014",
    title: "Reduce Protocol Fee from 10% to 7%",
    proposer: "CONT-8821-BEN",
    status: "Voting",
    votesFor: 1842,
    votesAgainst: 613,
    endDate: "2026-05-22",
    desc: "Reduce the Protocol Treasury share from 10% to 7% and reallocate the 3% delta proportionally to Primary Translators (2%) and Peer Reviewers (1%). This change is projected to increase contributor retention by 18% based on Q1 survey data.",
    quorum: 2000,
  },
  {
    id: "LIP-015",
    title: "Add Hausa as Priority Language with 1.5x Reward Multiplier",
    proposer: "CONT-3344-LAG",
    status: "Voting",
    votesFor: 2201,
    votesAgainst: 287,
    endDate: "2026-05-20",
    desc: "Designate Hausa (HA) as a Priority Language for Q3 2026, applying a 1.5x reward multiplier to all HA translation tasks. Hausa has 90M+ speakers across West Africa but fewer than 80 active translators on the protocol.",
    quorum: 2000,
  },
  {
    id: "LIP-016",
    title: "Implement Anti-Sybil Reviewer Staking Requirement",
    proposer: "CONT-5512-NAI",
    status: "Discussion",
    votesFor: 0,
    votesAgainst: 0,
    endDate: "2026-06-01",
    desc: "Require peer reviewers to stake a minimum of 50 XLM before submitting reviews. Staked amounts are slashed by 20% for reviews flagged as low-quality by subsequent validators. Aims to reduce Sybil attacks on the review layer.",
    quorum: 2000,
  },
];

const PAST_PROPOSALS = [
  { id: "LIP-011", title: "Launch Igbo Language Track with NGO Partnership", outcome: "Passed", votes: "2,441 / 302", date: "2026-03-15" },
  { id: "LIP-012", title: "Increase Peer Reviewer share from 12% to 15%", outcome: "Passed", votes: "2,189 / 554", date: "2026-03-28" },
  { id: "LIP-013", title: "Enable Cross-Dataset Bundled Licensing", outcome: "Passed", votes: "1,920 / 211", date: "2026-04-12" },
  { id: "LIP-010", title: "Require IPFS Pinning for All New Dataset Submissions", outcome: "Passed", votes: "3,102 / 88", date: "2026-02-20" },
  { id: "LIP-009", title: "Reduce Minimum Contribution Threshold to 100 Strings", outcome: "Rejected", votes: "701 / 1,844", date: "2026-01-30" },
];

const HOW_STEPS = [
  { n: "01", icon: GitBranch, title: "Submit Proposal", desc: "Any contributor with ≥500 contribution score can submit a Linguistic Improvement Proposal (LIP) via the governance portal.", color: "from-violet-500 to-purple-600" },
  { n: "02", icon: MessageSquare, title: "Discussion Period", desc: "Proposals enter a 7-day discussion window. Community members debate, request amendments, and signal sentiment before formal voting.", color: "from-fuchsia-500 to-violet-600" },
  { n: "03", icon: BarChart3, title: "On-Chain Vote", desc: "Voting is weighted by contribution score. Each verified translation or review earns voting power. Quorum requires 2,000 votes.", color: "from-purple-500 to-fuchsia-600" },
  { n: "04", icon: Zap, title: "Auto-Execution", desc: "Passed proposals with a 3-day timelock are executed automatically by the Governance contract. No centralized intervention required.", color: "from-violet-600 to-fuchsia-500" },
];

const statusStyle: Record<string, string> = {
  Voting: "text-violet-400 bg-violet-400/10 border-violet-400/20",
  Discussion: "text-amber-400 bg-amber-400/10 border-amber-400/20",
  Passed: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
};

const outcomeStyle: Record<string, string> = {
  Passed: "text-emerald-400",
  Rejected: "text-red-400",
};

export default function GovernancePage() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return null;
  const isDark = theme !== "light";

  return (
    <PageShell>
      <div className="px-6 pb-24">
        <div className="max-w-6xl mx-auto">

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
              <Shield className="w-3 h-3" />
              Protocol Governance
            </div>
            <h1 className={cn(
              "text-5xl md:text-7xl font-black uppercase tracking-tight mb-4",
              isDark ? "text-white" : "text-purple-950"
            )}>
              Shape the<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-fuchsia-400 to-violet-500">
                Protocol.
              </span>
            </h1>
            <p className={cn("text-lg max-w-2xl mx-auto", isDark ? "text-purple-300" : "text-purple-700")}>
              LinguaLayer is governed by its contributors. Vote on protocol parameters, language priorities, and economic policy — your contribution score is your voice.
            </p>
          </motion.div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            {[
              { label: "Active Proposals", value: "3", icon: Shield, color: "text-violet-400" },
              { label: "Total Votes Cast", value: "42,800", icon: BarChart3, color: "text-fuchsia-400" },
              { label: "Proposals Passed", value: "13", icon: CheckCircle2, color: "text-emerald-400" },
              { label: "Avg Participation", value: "38%", icon: Users, color: "text-purple-400" },
            ].map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className={cn("p-5 rounded-2xl border", isDark ? "bg-purple-950/60 border-purple-900" : "bg-white border-violet-200")}
              >
                <s.icon className={cn("w-5 h-5 mb-3", s.color)} />
                <div className={cn("text-2xl font-black tracking-tight mb-1", isDark ? "text-white" : "text-purple-950")}>{s.value}</div>
                <div className={cn("text-[10px] font-bold uppercase tracking-widest", isDark ? "text-purple-500" : "text-purple-600")}>{s.label}</div>
              </motion.div>
            ))}
          </div>

          {/* Active Proposals */}
          <div className="mb-12">
            <div className={cn("text-[10px] font-bold uppercase tracking-[0.4em] mb-2", isDark ? "text-purple-500" : "text-purple-600")}>Live Now</div>
            <h2 className={cn("text-2xl font-black uppercase tracking-tight mb-6", isDark ? "text-white" : "text-purple-950")}>Active Proposals</h2>
            <div className="space-y-5">
              {ACTIVE_PROPOSALS.map((p, i) => {
                const total = p.votesFor + p.votesAgainst;
                const forPct = total > 0 ? (p.votesFor / total) * 100 : 0;
                const quorumPct = Math.min((total / p.quorum) * 100, 100);
                return (
                  <motion.div
                    key={p.id}
                    initial={{ opacity: 0, x: -16 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className={cn("p-6 rounded-2xl border", isDark ? "bg-purple-950/60 border-purple-900" : "bg-white border-violet-200")}
                  >
                    <div className="flex items-start justify-between mb-4 flex-wrap gap-3">
                      <div>
                        <div className="flex items-center gap-3 mb-2 flex-wrap">
                          <span className={cn("text-[9px] font-mono font-bold", isDark ? "text-purple-600" : "text-purple-400")}>{p.id}</span>
                          <span className={cn("text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full border", statusStyle[p.status])}>
                            {p.status === "Voting" && <BarChart3 className="w-2.5 h-2.5 inline mr-1" />}
                            {p.status === "Discussion" && <MessageSquare className="w-2.5 h-2.5 inline mr-1" />}
                            {p.status}
                          </span>
                        </div>
                        <h3 className={cn("font-black text-base uppercase tracking-tight", isDark ? "text-white" : "text-purple-950")}>{p.title}</h3>
                      </div>
                      <div className="text-right">
                        <div className={cn("text-[10px] font-bold uppercase tracking-wider", isDark ? "text-purple-600" : "text-purple-500")}>Ends</div>
                        <div className={cn("text-sm font-black font-mono", isDark ? "text-white" : "text-purple-950")}>{p.endDate.slice(5)}</div>
                      </div>
                    </div>

                    <p className={cn("text-sm leading-relaxed mb-5", isDark ? "text-purple-400" : "text-purple-600")}>{p.desc}</p>

                    {p.status === "Voting" && (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-emerald-400 font-bold">{p.votesFor.toLocaleString()} For</span>
                          <span className={cn("font-bold", isDark ? "text-purple-500" : "text-purple-600")}>{forPct.toFixed(0)}%</span>
                          <span className="text-red-400 font-bold">{p.votesAgainst.toLocaleString()} Against</span>
                        </div>
                        <div className={cn("w-full h-2 rounded-full overflow-hidden", isDark ? "bg-purple-900" : "bg-violet-100")}>
                          <div className="h-full bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-full" style={{ width: `${forPct}%` }} />
                        </div>
                        <div className="flex items-center justify-between text-[10px]">
                          <span className={cn("font-bold uppercase tracking-wider", isDark ? "text-purple-600" : "text-purple-500")}>Quorum Progress</span>
                          <span className={cn("font-black", isDark ? "text-purple-400" : "text-purple-600")}>{total.toLocaleString()} / {p.quorum.toLocaleString()}</span>
                        </div>
                        <div className={cn("w-full h-1 rounded-full overflow-hidden", isDark ? "bg-purple-900" : "bg-violet-100")}>
                          <div className="h-full bg-violet-500 rounded-full" style={{ width: `${quorumPct}%` }} />
                        </div>
                        <button className="w-full py-2.5 rounded-xl text-[11px] font-bold uppercase tracking-widest bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white hover:opacity-90 transition-all flex items-center justify-center gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Cast Your Vote
                        </button>
                      </div>
                    )}

                    {p.status === "Discussion" && (
                      <button className={cn(
                        "w-full py-2.5 rounded-xl text-[11px] font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-all border",
                        isDark ? "border-purple-800 text-purple-400 hover:border-violet-500/30" : "border-violet-300 text-purple-700 hover:border-violet-500"
                      )}>
                        <MessageSquare className="w-3.5 h-3.5" /> Join Discussion <ArrowRight className="w-3 h-3" />
                      </button>
                    )}

                    <div className="flex items-center gap-2 mt-3">
                      <span className={cn("text-[10px] uppercase tracking-wider font-bold", isDark ? "text-purple-600" : "text-purple-500")}>Proposer:</span>
                      <span className={cn("text-[10px] font-mono font-bold", isDark ? "text-purple-400" : "text-purple-700")}>{p.proposer}</span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* How Governance Works */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className={cn("p-6 rounded-2xl border mb-12", isDark ? "bg-purple-950/60 border-purple-900" : "bg-white border-violet-200")}
          >
            <div className={cn("text-[10px] font-bold uppercase tracking-[0.4em] mb-2", isDark ? "text-purple-500" : "text-purple-600")}>Process</div>
            <h2 className={cn("text-xl font-black uppercase tracking-tight mb-8", isDark ? "text-white" : "text-purple-950")}>How Governance Works</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {HOW_STEPS.map((step) => (
                <div key={step.n} className={cn("p-4 rounded-xl border", isDark ? "bg-purple-900/40 border-purple-800" : "bg-violet-50 border-violet-200")}>
                  <div className={cn("w-10 h-10 rounded-xl bg-gradient-to-br flex items-center justify-center mb-3", step.color)}>
                    <step.icon className="w-5 h-5 text-white" />
                  </div>
                  <div className={cn("text-[9px] font-mono mb-1", isDark ? "text-purple-600" : "text-purple-400")}>{step.n}</div>
                  <h3 className={cn("text-sm font-black uppercase tracking-tight mb-2", isDark ? "text-white" : "text-purple-950")}>{step.title}</h3>
                  <p className={cn("text-xs leading-relaxed", isDark ? "text-purple-400" : "text-purple-600")}>{step.desc}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Voting Power */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className={cn("p-6 rounded-2xl border mb-12", isDark ? "bg-purple-950/60 border-purple-900" : "bg-white border-violet-200")}
          >
            <div className={cn("text-[10px] font-bold uppercase tracking-[0.4em] mb-2", isDark ? "text-purple-500" : "text-purple-600")}>Tokenomics</div>
            <h2 className={cn("text-xl font-black uppercase tracking-tight mb-4", isDark ? "text-white" : "text-purple-950")}>Voting Power</h2>
            <div className="grid md:grid-cols-3 gap-4">
              {[
                { level: "New Contributor", score: "0–499", power: "1x", icon: Star, color: "from-purple-500 to-fuchsia-600", desc: "Voting power scales from your first verified translation submission." },
                { level: "Verified Linguist", score: "500–1999", power: "2.5x", icon: CheckCircle2, color: "from-violet-500 to-purple-600", desc: "Reaching 500 contribution score unlocks proposal submission rights and 2.5x weight." },
                { level: "Protocol Elder", score: "2000+", power: "5x", icon: Shield, color: "from-fuchsia-500 to-violet-600", desc: "Top contributors earn Elder status, max voting weight, and can fast-track critical security proposals." },
              ].map((tier) => (
                <div key={tier.level} className={cn("p-5 rounded-xl border", isDark ? "bg-purple-900/40 border-purple-800" : "bg-violet-50 border-violet-200")}>
                  <div className={cn("w-10 h-10 rounded-xl bg-gradient-to-br flex items-center justify-center mb-3", tier.color)}>
                    <tier.icon className="w-5 h-5 text-white" />
                  </div>
                  <div className={cn("text-[9px] font-mono mb-1", isDark ? "text-purple-600" : "text-purple-400")}>Score: {tier.score}</div>
                  <h3 className={cn("text-sm font-black uppercase tracking-tight mb-1", isDark ? "text-white" : "text-purple-950")}>{tier.level}</h3>
                  <div className={cn("text-xl font-black mb-2", isDark ? "text-violet-400" : "text-violet-600")}>{tier.power}</div>
                  <p className={cn("text-xs leading-relaxed", isDark ? "text-purple-400" : "text-purple-600")}>{tier.desc}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Past Proposals */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className={cn("p-6 rounded-2xl border", isDark ? "bg-purple-950/60 border-purple-900" : "bg-white border-violet-200")}
          >
            <div className={cn("text-[10px] font-bold uppercase tracking-[0.4em] mb-2", isDark ? "text-purple-500" : "text-purple-600")}>Archive</div>
            <h2 className={cn("text-xl font-black uppercase tracking-tight mb-6", isDark ? "text-white" : "text-purple-950")}>Past Proposals</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className={cn("text-[10px] font-bold uppercase tracking-widest", isDark ? "text-purple-600" : "text-purple-500")}>
                    {["ID", "Title", "Votes (For/Against)", "Date", "Outcome"].map((h) => (
                      <th key={h} className="text-left pb-3 pr-4 font-bold">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {PAST_PROPOSALS.map((p, i) => (
                    <tr key={i} className={cn("transition-colors border-t", isDark ? "border-purple-900 hover:bg-purple-900/30" : "border-violet-100 hover:bg-violet-50")}>
                      <td className={cn("py-3 pr-4 text-xs font-mono font-bold", isDark ? "text-purple-500" : "text-purple-400")}>{p.id}</td>
                      <td className={cn("py-3 pr-4 text-xs font-medium max-w-[220px]", isDark ? "text-white" : "text-purple-950")}>{p.title}</td>
                      <td className={cn("py-3 pr-4 text-xs font-mono", isDark ? "text-purple-400" : "text-purple-600")}>{p.votes}</td>
                      <td className={cn("py-3 pr-4 text-xs font-mono", isDark ? "text-purple-500" : "text-purple-600")}>{p.date.slice(5)}</td>
                      <td className={cn("py-3 text-xs font-black", outcomeStyle[p.outcome])}>{p.outcome}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>

        </div>
      </div>
    </PageShell>
  );
}
