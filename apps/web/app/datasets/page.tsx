"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import {
  Search, Database, Globe, Users, Star, Filter,
  CheckCircle2, Clock, Lock, ArrowRight, Sparkles, BarChart3,
} from "lucide-react";
import { PageShell } from "@/components/ui/page-shell";
import { cn } from "@/lib/utils";

const DATASETS = [
  {
    id: 1,
    name: "OpenAI API Docs EN→AR",
    pair: "EN → AR",
    domain: "Technical",
    strings: 14200,
    contributors: 38,
    quality: 96,
    status: "Verified",
    updated: "2026-05-10",
    price: "480 XLM",
    description: "Comprehensive API documentation translated from English to Modern Standard Arabic, covering all endpoints, SDKs, and code samples.",
  },
  {
    id: 2,
    name: "Medical Protocol Suite EN→SW",
    pair: "EN → SW",
    domain: "Medical",
    strings: 8750,
    contributors: 22,
    quality: 98,
    status: "Verified",
    updated: "2026-05-08",
    price: "720 XLM",
    description: "Clinical trial protocols, patient consent forms, and WHO treatment guidelines translated into Swahili for East African healthcare systems.",
  },
  {
    id: 3,
    name: "UN SDG Reports EN→HI",
    pair: "EN → HI",
    domain: "Academic",
    strings: 21400,
    contributors: 61,
    quality: 94,
    status: "Verified",
    updated: "2026-05-05",
    price: "1,200 XLM",
    description: "All 17 Sustainable Development Goal progress reports in Hindi, with regional statistics and government action plans for South Asian audiences.",
  },
  {
    id: 4,
    name: "Legal Contract Templates EN→ZH",
    pair: "EN → ZH",
    domain: "Legal",
    strings: 6300,
    contributors: 17,
    quality: 99,
    status: "Licensed",
    updated: "2026-04-28",
    price: "950 XLM",
    description: "Commercial and employment contract templates, NDAs, and SaaS agreements translated into Simplified Chinese by certified legal linguists.",
  },
  {
    id: 5,
    name: "Agricultural Extension Guides EN→HA",
    pair: "EN → HA",
    domain: "Technical",
    strings: 11800,
    contributors: 29,
    quality: 91,
    status: "Verified",
    updated: "2026-04-22",
    price: "340 XLM",
    description: "FAO-approved crop management, irrigation, and pest control guides translated into Hausa for farmers across Nigeria, Niger, and Chad.",
  },
  {
    id: 6,
    name: "Tech Startup Pitch Decks EN→PT",
    pair: "EN → PT",
    domain: "Casual",
    strings: 4200,
    contributors: 11,
    quality: 88,
    status: "Open",
    updated: "2026-05-12",
    price: "180 XLM",
    description: "A curated dataset of 120 Y Combinator and LATAM startup pitch decks translated into Brazilian Portuguese for the emerging VC ecosystem.",
  },
  {
    id: 7,
    name: "Climate Science Reports EN→FR",
    pair: "EN → FR",
    domain: "Academic",
    strings: 18900,
    contributors: 44,
    quality: 97,
    status: "Verified",
    updated: "2026-04-30",
    price: "860 XLM",
    description: "IPCC assessment reports, COP summit declarations, and climate policy briefs in French, covering Francophone Africa and European markets.",
  },
  {
    id: 8,
    name: "Educational Curriculum EN→IG",
    pair: "EN → IG",
    domain: "Academic",
    strings: 9400,
    contributors: 19,
    quality: 89,
    status: "Open",
    updated: "2026-05-11",
    price: "290 XLM",
    description: "K-12 curriculum materials, STEM textbooks, and standardized assessment content translated into Igbo for southeastern Nigerian schools.",
  },
  {
    id: 9,
    name: "E-Commerce Product Catalog EN→BN",
    pair: "EN → BN",
    domain: "Casual",
    strings: 32500,
    contributors: 52,
    quality: 93,
    status: "Licensed",
    updated: "2026-05-03",
    price: "620 XLM",
    description: "Over 32,000 product descriptions, category labels, and customer review templates localized into Bengali for the South Asian e-commerce boom.",
  },
  {
    id: 10,
    name: "Government Services Glossary EN→YO",
    pair: "EN → YO",
    domain: "Legal",
    strings: 5100,
    contributors: 14,
    quality: 92,
    status: "Verified",
    updated: "2026-05-07",
    price: "240 XLM",
    description: "Official government terminology, civil service forms, and public health communications translated into Yoruba for southwestern Nigeria and Benin Republic.",
  },
];

const DOMAINS = ["All", "Technical", "Legal", "Medical", "Casual", "Academic"];
const STATUSES = ["All", "Open", "Verified", "Licensed"];

const statusColor: Record<string, string> = {
  Verified: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
  Open: "text-violet-400 bg-violet-400/10 border-violet-400/20",
  Licensed: "text-amber-400 bg-amber-400/10 border-amber-400/20",
};

const domainColor: Record<string, string> = {
  Technical: "text-blue-400 bg-blue-400/10",
  Legal: "text-amber-400 bg-amber-400/10",
  Medical: "text-emerald-400 bg-emerald-400/10",
  Casual: "text-fuchsia-400 bg-fuchsia-400/10",
  Academic: "text-violet-400 bg-violet-400/10",
};

export default function DatasetsPage() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [search, setSearch] = useState("");
  const [domain, setDomain] = useState("All");
  const [status, setStatus] = useState("All");
  const [minQuality, setMinQuality] = useState(0);

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;
  const isDark = theme !== "light";

  const filtered = DATASETS.filter((d) => {
    const matchSearch =
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.pair.toLowerCase().includes(search.toLowerCase());
    const matchDomain = domain === "All" || d.domain === domain;
    const matchStatus = status === "All" || d.status === status;
    const matchQuality = d.quality >= minQuality;
    return matchSearch && matchDomain && matchStatus && matchQuality;
  });

  const totalStrings = DATASETS.reduce((a, d) => a + d.strings, 0);
  const verifiedCount = DATASETS.filter((d) => d.status === "Verified").length;
  const uniqueLangs = new Set(DATASETS.flatMap((d) => d.pair.replace(" → ", ",").split(","))).size;

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
              <Database className="w-3 h-3" />
              Dataset Catalog
            </div>
            <h1 className={cn(
              "text-5xl md:text-7xl font-black uppercase tracking-tight mb-4",
              isDark ? "text-white" : "text-purple-950"
            )}>
              Language<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-fuchsia-400 to-violet-500">
                Datasets.
              </span>
            </h1>
            <p className={cn(
              "text-lg max-w-2xl mx-auto",
              isDark ? "text-purple-300" : "text-purple-700"
            )}>
              Browse, license, and contribute to the world&apos;s most diverse on-chain linguistic dataset registry. Every string pair is verifiable, versioned, and royalty-enabled.
            </p>
          </motion.div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
            {[
              { label: "Total Datasets", value: DATASETS.length.toString(), icon: Database, color: "text-violet-400" },
              { label: "String Pairs", value: `${(totalStrings / 1000).toFixed(0)}K+`, icon: BarChart3, color: "text-fuchsia-400" },
              { label: "Languages", value: uniqueLangs.toString(), icon: Globe, color: "text-purple-400" },
              { label: "Verified", value: verifiedCount.toString(), icon: CheckCircle2, color: "text-emerald-400" },
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
                <div className={cn("text-3xl font-black tracking-tight mb-1", isDark ? "text-white" : "text-purple-950")}>{s.value}</div>
                <div className={cn("text-[10px] font-bold uppercase tracking-widest", isDark ? "text-purple-500" : "text-purple-600")}>{s.label}</div>
              </motion.div>
            ))}
          </div>

          {/* Search & Filters */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className={cn(
              "p-5 rounded-2xl border mb-8 flex flex-col gap-4",
              isDark ? "bg-purple-950/60 border-purple-900" : "bg-white border-violet-200"
            )}
          >
            {/* Search */}
            <div className="relative">
              <Search className={cn("absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4", isDark ? "text-purple-500" : "text-purple-400")} />
              <input
                type="text"
                placeholder="Search datasets, language pairs..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className={cn(
                  "w-full pl-11 pr-4 py-3 rounded-xl text-sm font-medium outline-none transition-all border",
                  isDark
                    ? "bg-purple-900/50 border-purple-800 text-white placeholder-purple-600 focus:border-violet-500/50"
                    : "bg-violet-50 border-violet-200 text-purple-950 placeholder-purple-400 focus:border-violet-400"
                )}
              />
            </div>

            {/* Filter row */}
            <div className="flex flex-wrap gap-3 items-center">
              <div className="flex items-center gap-2">
                <Filter className={cn("w-3.5 h-3.5", isDark ? "text-purple-500" : "text-purple-500")} />
                <span className={cn("text-[10px] font-bold uppercase tracking-widest", isDark ? "text-purple-500" : "text-purple-600")}>Filters:</span>
              </div>

              {/* Domain filter */}
              <div className="flex flex-wrap gap-1.5">
                {DOMAINS.map((d) => (
                  <button
                    key={d}
                    onClick={() => setDomain(d)}
                    className={cn(
                      "px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all border",
                      domain === d
                        ? "bg-violet-500 border-violet-500 text-white"
                        : isDark
                        ? "border-purple-800 text-purple-400 hover:border-violet-500/30"
                        : "border-violet-200 text-purple-600 hover:border-violet-400"
                    )}
                  >
                    {d}
                  </button>
                ))}
              </div>

              <div className={cn("w-px h-4", isDark ? "bg-purple-800" : "bg-violet-200")} />

              {/* Status filter */}
              <div className="flex flex-wrap gap-1.5">
                {STATUSES.map((s) => (
                  <button
                    key={s}
                    onClick={() => setStatus(s)}
                    className={cn(
                      "px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all border",
                      status === s
                        ? "bg-fuchsia-500 border-fuchsia-500 text-white"
                        : isDark
                        ? "border-purple-800 text-purple-400 hover:border-fuchsia-500/30"
                        : "border-violet-200 text-purple-600 hover:border-fuchsia-400"
                    )}
                  >
                    {s}
                  </button>
                ))}
              </div>

              <div className={cn("w-px h-4", isDark ? "bg-purple-800" : "bg-violet-200")} />

              {/* Quality slider */}
              <div className="flex items-center gap-3">
                <span className={cn("text-[10px] font-bold uppercase tracking-wider", isDark ? "text-purple-500" : "text-purple-600")}>Quality ≥ {minQuality}</span>
                <input
                  type="range"
                  min={0}
                  max={100}
                  step={5}
                  value={minQuality}
                  onChange={(e) => setMinQuality(Number(e.target.value))}
                  className="w-24 accent-violet-500"
                />
              </div>
            </div>
          </motion.div>

          {/* Results count */}
          <div className="flex items-center justify-between mb-5">
            <p className={cn("text-[11px] font-bold uppercase tracking-widest", isDark ? "text-purple-500" : "text-purple-600")}>
              {filtered.length} dataset{filtered.length !== 1 ? "s" : ""} found
            </p>
            <div className={cn("flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider", isDark ? "text-purple-600" : "text-purple-500")}>
              <Sparkles className="w-3 h-3 text-violet-400" />
              Updated daily · On-chain data
            </div>
          </div>

          {/* Dataset Cards */}
          <div className="grid md:grid-cols-2 gap-5">
            {filtered.map((dataset, i) => (
              <motion.div
                key={dataset.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                className={cn(
                  "p-6 rounded-2xl border transition-all hover:shadow-xl group cursor-pointer",
                  isDark
                    ? "bg-purple-950/60 border-purple-900 hover:border-violet-500/30"
                    : "bg-white border-violet-200 hover:border-violet-400"
                )}
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1 min-w-0 pr-3">
                    <h3 className={cn("font-black text-base uppercase tracking-tight mb-1 group-hover:text-violet-400 transition-colors", isDark ? "text-white" : "text-purple-950")}>
                      {dataset.name}
                    </h3>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={cn("text-[10px] font-black font-mono px-2 py-0.5 rounded-md", domainColor[dataset.domain])}>
                        {dataset.domain}
                      </span>
                      <span className={cn("text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border", statusColor[dataset.status])}>
                        {dataset.status === "Verified" && <CheckCircle2 className="w-2.5 h-2.5 inline mr-1" />}
                        {dataset.status === "Open" && <Clock className="w-2.5 h-2.5 inline mr-1" />}
                        {dataset.status === "Licensed" && <Lock className="w-2.5 h-2.5 inline mr-1" />}
                        {dataset.status}
                      </span>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className={cn("text-lg font-black", isDark ? "text-white" : "text-purple-950")}>{dataset.price}</div>
                    <div className={cn("text-[10px] font-bold uppercase tracking-wider", isDark ? "text-purple-500" : "text-purple-600")}>License</div>
                  </div>
                </div>

                {/* Language pair */}
                <div className={cn("inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-sm font-black font-mono mb-4 border", isDark ? "bg-violet-500/10 border-violet-500/20 text-violet-300" : "bg-violet-100 border-violet-300 text-violet-700")}>
                  <Globe className="w-3.5 h-3.5" />
                  {dataset.pair}
                </div>

                {/* Description */}
                <p className={cn("text-xs leading-relaxed mb-4", isDark ? "text-purple-400" : "text-purple-600")}>
                  {dataset.description}
                </p>

                {/* Stats row */}
                <div className="grid grid-cols-3 gap-3 mb-4">
                  {[
                    { label: "Strings", value: dataset.strings.toLocaleString() },
                    { label: "Contributors", value: dataset.contributors.toString() },
                    { label: "Updated", value: dataset.updated.slice(5) },
                  ].map((stat) => (
                    <div key={stat.label} className={cn("p-2.5 rounded-xl text-center", isDark ? "bg-purple-900/50" : "bg-violet-50")}>
                      <div className={cn("text-sm font-black", isDark ? "text-white" : "text-purple-950")}>{stat.value}</div>
                      <div className={cn("text-[9px] font-bold uppercase tracking-wider mt-0.5", isDark ? "text-purple-500" : "text-purple-600")}>{stat.label}</div>
                    </div>
                  ))}
                </div>

                {/* Quality Score */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className={cn("text-[10px] font-bold uppercase tracking-wider flex items-center gap-1", isDark ? "text-purple-500" : "text-purple-600")}>
                      <Star className="w-3 h-3 text-amber-400" />
                      Quality Score
                    </span>
                    <span className={cn("text-sm font-black", dataset.quality >= 95 ? "text-emerald-400" : dataset.quality >= 85 ? "text-violet-400" : "text-amber-400")}>
                      {dataset.quality}/100
                    </span>
                  </div>
                  <div className={cn("w-full h-1.5 rounded-full overflow-hidden", isDark ? "bg-purple-900" : "bg-violet-100")}>
                    <div
                      className={cn("h-full rounded-full", dataset.quality >= 95 ? "bg-emerald-400" : dataset.quality >= 85 ? "bg-violet-400" : "bg-amber-400")}
                      style={{ width: `${dataset.quality}%` }}
                    />
                  </div>
                </div>

                {/* CTA */}
                <button className={cn(
                  "w-full mt-4 py-2.5 rounded-xl text-[11px] font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-all",
                  isDark
                    ? "bg-violet-500/10 border border-violet-500/20 text-violet-400 hover:bg-violet-500/20"
                    : "bg-violet-100 border border-violet-300 text-violet-700 hover:bg-violet-200"
                )}>
                  License Dataset <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </motion.div>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className={cn("text-center py-24 rounded-2xl border", isDark ? "border-purple-900" : "border-violet-200")}>
              <Database className={cn("w-12 h-12 mx-auto mb-4 opacity-30", isDark ? "text-purple-400" : "text-purple-600")} />
              <p className={cn("font-black uppercase tracking-tight", isDark ? "text-purple-400" : "text-purple-600")}>No datasets match your filters</p>
            </div>
          )}
        </div>
      </div>
    </PageShell>
  );
}
