"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import {
  Rocket, Globe, Zap, Building2, Brain, CheckCircle2,
  Clock, Circle, Lock, ArrowRight, Star,
} from "lucide-react";
import { PageShell } from "@/components/ui/page-shell";
import { cn } from "@/lib/utils";

const PHASES = [
  {
    phase: "Phase 1",
    title: "Language Expansion",
    period: "Q1–Q2 2026",
    status: "In Progress",
    icon: Globe,
    color: "from-violet-500 to-purple-600",
    progress: 72,
    items: [
      { title: "Launch 10 Priority Language Tracks", detail: "Hausa, Igbo, Yoruba, Swahili, Hindi, Bengali, Arabic, Simplified Chinese, Brazilian Portuguese, French designated as priority tracks with 1.5x reward multipliers.", done: true },
      { title: "Sub-Saharan Africa Regional Hub", detail: "Establish contributor communities, local coordinator roles, and regional quality review pools across West, East, and Southern Africa.", done: true },
      { title: "South Asia Onboarding Campaign", detail: "Partner with universities and translation agencies in India, Bangladesh, and Pakistan to bring 2,000+ verified linguists onto the protocol.", done: true },
      { title: "Community Governance for Language Prioritization", detail: "Enable governance proposals to nominate new priority languages. First successful proposal: Hausa (LIP-015).", done: false },
      { title: "Reach 100 Verified Datasets", detail: "Scale from 10 seed datasets to 100 fully verified, licensed linguistic asset packages across 20 language pairs.", done: false },
      { title: "Mobile-Responsive Contributor Portal", detail: "Launch a mobile-optimized web app for linguists in low-bandwidth environments, with offline queue support.", done: false },
    ],
  },
  {
    phase: "Phase 2",
    title: "Proof-of-Translation v2",
    period: "Q3–Q4 2026",
    status: "Upcoming",
    icon: Zap,
    color: "from-fuchsia-500 to-violet-600",
    progress: 0,
    items: [
      { title: "Adversarial Review Layer", detail: "Introduce a staked adversarial review step where reviewers can challenge translations. Slashing conditions eliminate low-quality submissions.", done: false },
      { title: "LinguaScore On-Chain Metric", detail: "Deploy LinguaScore, a composite quality metric combining peer review consensus, semantic similarity scores, and community acceptance rate — all anchored on-chain.", done: false },
      { title: "ZK Proof-of-Linguistic-Expertise", detail: "Integrate zero-knowledge credentials so linguists can prove academic or professional qualifications without revealing personal identity.", done: false },
      { title: "Automated BLEU/COMET Integration", detail: "Run BLEU and COMET automated translation quality scores as a first-pass filter before peer review, reducing reviewer workload by 40%.", done: false },
      { title: "Anti-Sybil Staking (LIP-016)", detail: "If LIP-016 passes, implement reviewer staking with slashable bonds to prevent Sybil attacks on the review layer.", done: false },
      { title: "Translation Dispute Resolution DAO", detail: "Form a specialized sub-DAO of senior linguists to adjudicate contested translation quality disputes.", done: false },
    ],
  },
  {
    phase: "Phase 3",
    title: "Enterprise Partnerships",
    period: "Q1–Q2 2027",
    status: "Planned",
    icon: Building2,
    color: "from-purple-500 to-fuchsia-600",
    progress: 0,
    items: [
      { title: "Enterprise API SDK Launch", detail: "Release production-ready TypeScript and Python SDKs enabling enterprises to query, license, and stream linguistic datasets programmatically.", done: false },
      { title: "SLA-Backed Enterprise License Tier", detail: "Introduce Enterprise Plus licensing with guaranteed 99.9% uptime, dedicated reviewer pools, custom SLAs, and on-chain audit trails.", done: false },
      { title: "Big Tech Integration Pipeline", detail: "Begin structured conversations with AI labs and tech companies seeking high-quality multilingual training data with verifiable provenance.", done: false },
      { title: "Healthcare & Legal Vertical Packages", detail: "Launch curated dataset bundles for healthcare localization (WHO/clinical) and legal localization (contracts, compliance) with domain-expert reviewers.", done: false },
      { title: "Revenue-Sharing Agreements with NGOs", detail: "Enable NGOs to co-fund dataset creation in exchange for research-tier access, while contributors earn protocol-native royalties.", done: false },
      { title: "Cross-Chain Bridge (Ethereum, Solana)", detail: "Explore bridges to bring Stellar-native royalty payouts to contributors preferring ETH or SOL ecosystems.", done: false },
    ],
  },
  {
    phase: "Phase 4",
    title: "AI Training Data Market",
    period: "Q3–Q4 2027",
    status: "Vision",
    icon: Brain,
    color: "from-violet-600 to-fuchsia-500",
    progress: 0,
    items: [
      { title: "LinguaLayer Training Data Marketplace", detail: "Launch a dedicated marketplace for AI labs to purchase curated, multilingual fine-tuning datasets with verifiable quality scores and contributor provenance.", done: false },
      { title: "On-Chain Data Licensing for LLMs", detail: "Develop smart contract primitives enabling AI companies to license datasets under usage-metered terms — paying per token processed, with automatic royalties.", done: false },
      { title: "Synthetic Augmentation Controls", detail: "Allow contributors to set explicit permissions on whether their translations may be used for synthetic data augmentation by AI systems.", done: false },
      { title: "Multilingual Benchmark Datasets", detail: "Create and open-source standardized multilingual benchmarks in African and South Asian languages, improving AI evaluation across underrepresented languages.", done: false },
      { title: "LinguaScore as Industry Standard", detail: "Push for adoption of LinguaScore as a standard translation quality metric for AI training data, referenced in academic papers and industry evaluations.", done: false },
      { title: "Contributor Revenue from AI Scale", detail: "Enable contributors to earn royalties not just from traditional licensing but from AI inference calls that use their translation datasets as training context.", done: false },
    ],
  },
];

const statusStyle: Record<string, { badge: string; icon: React.ElementType; label: string }> = {
  "In Progress": { badge: "text-violet-400 bg-violet-400/10 border-violet-400/20", icon: Zap, label: "In Progress" },
  Upcoming: { badge: "text-amber-400 bg-amber-400/10 border-amber-400/20", icon: Clock, label: "Upcoming" },
  Planned: { badge: "text-purple-400 bg-purple-400/10 border-purple-400/20", icon: Circle, label: "Planned" },
  Vision: { badge: "text-fuchsia-400 bg-fuchsia-400/10 border-fuchsia-400/20", icon: Star, label: "Vision" },
};

export default function RoadmapPage() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [expanded, setExpanded] = useState<number | null>(0);

  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return null;
  const isDark = theme !== "light";

  return (
    <PageShell>
      <div className="px-6 pb-24">
        <div className="max-w-5xl mx-auto">

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
              <Rocket className="w-3 h-3" />
              Product Roadmap
            </div>
            <h1 className={cn(
              "text-5xl md:text-7xl font-black uppercase tracking-tight mb-4",
              isDark ? "text-white" : "text-purple-950"
            )}>
              The Road<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-fuchsia-400 to-violet-500">
                Ahead.
              </span>
            </h1>
            <p className={cn("text-lg max-w-2xl mx-auto", isDark ? "text-purple-300" : "text-purple-700")}>
              Four phases from language expansion to powering the global AI training data economy. Built in public, governed by contributors.
            </p>
          </motion.div>

          {/* Phase timeline overview */}
          <div className="relative mb-12">
            <div className={cn("absolute top-6 left-6 right-6 h-px", isDark ? "bg-purple-900" : "bg-violet-200")} />
            <div className="grid grid-cols-4 gap-3 relative z-10">
              {PHASES.map((phase, i) => {
                const meta = statusStyle[phase.status];
                return (
                  <button
                    key={phase.phase}
                    onClick={() => setExpanded(expanded === i ? null : i)}
                    className="flex flex-col items-center gap-3 group"
                  >
                    <div className={cn(
                      "w-12 h-12 rounded-2xl bg-gradient-to-br flex items-center justify-center shadow-lg transition-all group-hover:scale-110",
                      phase.color,
                      expanded === i ? "scale-110 ring-2 ring-violet-400 ring-offset-2 ring-offset-transparent" : ""
                    )}>
                      <phase.icon className="w-5 h-5 text-white" />
                    </div>
                    <div className="text-center">
                      <div className={cn("text-[9px] font-mono font-bold", isDark ? "text-purple-600" : "text-purple-400")}>{phase.phase}</div>
                      <div className={cn("text-[10px] font-black uppercase tracking-tight hidden sm:block", isDark ? "text-white" : "text-purple-950")}>{phase.title.split(" ").slice(0, 2).join(" ")}</div>
                      <div className={cn("text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border mt-1 hidden sm:inline-flex", meta.badge)}>{meta.label}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Phase Cards */}
          <div className="space-y-5">
            {PHASES.map((phase, i) => {
              const meta = statusStyle[phase.status];
              const isOpen = expanded === i;
              return (
                <motion.div
                  key={phase.phase}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className={cn("rounded-2xl border overflow-hidden", isDark ? "bg-purple-950/60 border-purple-900" : "bg-white border-violet-200")}
                >
                  {/* Phase header */}
                  <button
                    className="w-full p-6 text-left flex items-center gap-4"
                    onClick={() => setExpanded(isOpen ? null : i)}
                  >
                    <div className={cn("w-12 h-12 rounded-2xl bg-gradient-to-br flex items-center justify-center shrink-0", phase.color)}>
                      <phase.icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1 flex-wrap">
                        <span className={cn("text-[9px] font-mono font-bold", isDark ? "text-purple-600" : "text-purple-400")}>{phase.phase} · {phase.period}</span>
                        <span className={cn("text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full border inline-flex items-center gap-1", meta.badge)}>
                          <meta.icon className="w-2.5 h-2.5" /> {meta.label}
                        </span>
                      </div>
                      <h2 className={cn("text-xl font-black uppercase tracking-tight", isDark ? "text-white" : "text-purple-950")}>{phase.title}</h2>
                    </div>
                    <div className="shrink-0 flex flex-col items-end gap-2">
                      {phase.status === "In Progress" && (
                        <div>
                          <div className={cn("text-[10px] font-bold uppercase tracking-wider text-right mb-1", isDark ? "text-purple-500" : "text-purple-600")}>
                            {phase.progress}% Complete
                          </div>
                          <div className={cn("w-24 h-1.5 rounded-full overflow-hidden", isDark ? "bg-purple-900" : "bg-violet-100")}>
                            <div className={cn("h-full rounded-full bg-gradient-to-r", phase.color)} style={{ width: `${phase.progress}%` }} />
                          </div>
                        </div>
                      )}
                      <ArrowRight className={cn("w-4 h-4 transition-transform", isDark ? "text-purple-600" : "text-purple-400", isOpen ? "rotate-90" : "")} />
                    </div>
                  </button>

                  {/* Milestones */}
                  {isOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className={cn("border-t px-6 pb-6 pt-5", isDark ? "border-purple-900" : "border-violet-100")}
                    >
                      <div className="grid sm:grid-cols-2 gap-4">
                        {phase.items.map((item, j) => (
                          <div
                            key={j}
                            className={cn(
                              "flex gap-3 p-4 rounded-xl border",
                              isDark ? "bg-purple-900/40 border-purple-800" : "bg-violet-50 border-violet-200"
                            )}
                          >
                            <div className="shrink-0 mt-0.5">
                              {item.done ? (
                                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                              ) : phase.status === "Vision" ? (
                                <Lock className="w-4 h-4 text-purple-600" />
                              ) : (
                                <Circle className="w-4 h-4 text-purple-600" />
                              )}
                            </div>
                            <div>
                              <h4 className={cn("text-xs font-black uppercase tracking-tight mb-1.5", isDark ? "text-white" : "text-purple-950", item.done ? "" : "opacity-80")}>{item.title}</h4>
                              <p className={cn("text-[11px] leading-relaxed", isDark ? "text-purple-500" : "text-purple-600")}>{item.detail}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              );
            })}
          </div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className={cn(
              "mt-12 p-8 rounded-2xl border text-center relative overflow-hidden",
              isDark ? "bg-purple-950/60 border-purple-900" : "bg-white border-violet-200"
            )}
          >
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-violet-500 to-transparent" />
            <Rocket className="w-8 h-8 text-violet-400 mx-auto mb-4" />
            <h2 className={cn("text-2xl font-black uppercase tracking-tight mb-2", isDark ? "text-white" : "text-purple-950")}>
              Help Shape What We Build Next
            </h2>
            <p className={cn("text-sm max-w-lg mx-auto mb-6", isDark ? "text-purple-300" : "text-purple-700")}>
              LinguaLayer is governed by its contributors. Submit a governance proposal, vote on what gets built, and earn royalties for every language contribution.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a href="/governance" className="flex items-center justify-center gap-2 px-8 py-3 rounded-xl font-bold uppercase tracking-widest text-sm bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white shadow-lg shadow-violet-500/20 hover:opacity-90 transition-all">
                Go to Governance <ArrowRight className="w-4 h-4" />
              </a>
              <a href="https://github.com/linguaFoundation/LinguaLayer" target="_blank" rel="noopener noreferrer"
                className={cn(
                  "flex items-center justify-center gap-2 px-8 py-3 rounded-xl font-bold uppercase tracking-widest text-sm border transition-all",
                  isDark ? "border-purple-800 text-purple-400 hover:border-violet-500/30" : "border-violet-300 text-purple-700 hover:border-violet-500"
                )}>
                View on GitHub
              </a>
            </div>
          </motion.div>

        </div>
      </div>
    </PageShell>
  );
}
