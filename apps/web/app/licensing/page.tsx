"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import {
  Lock, Globe, ArrowRight, Filter, Sparkles, CheckCircle2,
  BookOpen, Building2, Zap, Upload, Star,
} from "lucide-react";
import { PageShell } from "@/components/ui/page-shell";
import { cn } from "@/lib/utils";

const LICENSES = [
  {
    id: 1,
    dataset: "OpenAI API Docs EN→AR",
    pair: "EN → AR",
    useCase: "Developer Documentation",
    price: "480 XLM",
    type: "Commercial",
    licensor: "CONT-8821-BEN",
    quality: 96,
    domain: "Technical",
  },
  {
    id: 2,
    dataset: "Medical Protocol Suite EN→SW",
    pair: "EN → SW",
    useCase: "Clinical & Healthcare",
    price: "Free",
    type: "Research",
    licensor: "CONT-3344-LAG",
    quality: 98,
    domain: "Medical",
  },
  {
    id: 3,
    dataset: "UN SDG Reports EN→HI",
    pair: "EN → HI",
    useCase: "Policy & NGO Research",
    price: "Free",
    type: "Research",
    licensor: "CONT-7721-MUM",
    quality: 94,
    domain: "Academic",
  },
  {
    id: 4,
    dataset: "Legal Contract Templates EN→ZH",
    pair: "EN → ZH",
    useCase: "Legal SaaS & Fintech",
    price: "12,000 XLM/yr",
    type: "Enterprise",
    licensor: "CONT-5512-NAI",
    quality: 99,
    domain: "Legal",
  },
  {
    id: 5,
    dataset: "Agricultural Extension Guides EN→HA",
    pair: "EN → HA",
    useCase: "AgriTech & NGO Programs",
    price: "340 XLM",
    type: "Commercial",
    licensor: "CONT-2298-SAO",
    quality: 91,
    domain: "Technical",
  },
  {
    id: 6,
    dataset: "Climate Science Reports EN→FR",
    pair: "EN → FR",
    useCase: "Climate Policy Research",
    price: "Free",
    type: "Research",
    licensor: "CONT-9934-SHA",
    quality: 97,
    domain: "Academic",
  },
  {
    id: 7,
    dataset: "E-Commerce Product Catalog EN→BN",
    pair: "EN → BN",
    useCase: "E-Commerce Localization",
    price: "8,400 XLM/yr",
    type: "Enterprise",
    licensor: "CONT-1187-CAI",
    quality: 93,
    domain: "Casual",
  },
  {
    id: 8,
    dataset: "Educational Curriculum EN→IG",
    pair: "EN → IG",
    useCase: "EdTech Platforms",
    price: "290 XLM",
    type: "Commercial",
    licensor: "CONT-6623-ACC",
    quality: 89,
    domain: "Academic",
  },
];

const RECENT_LICENSEES = [
  {
    company: "Helio Health Africa",
    useCase: "Localizing patient consent forms and clinical trial documentation into Swahili for East African clinical networks.",
    dataset: "Medical Protocol Suite EN→SW",
    type: "Enterprise",
  },
  {
    company: "Meridian Legal Tech",
    useCase: "Powering their AI-assisted contract review tool for Chinese-speaking SMEs expanding into international markets.",
    dataset: "Legal Contract Templates EN→ZH",
    type: "Enterprise",
  },
  {
    company: "Agora Learning",
    useCase: "Building multilingual STEM courses for Nigerian secondary schools, using verified Igbo curriculum translations.",
    dataset: "Educational Curriculum EN→IG",
    type: "Commercial",
  },
];

const licenseTypeStyle: Record<string, { badge: string; icon: React.ElementType; desc: string; color: string }> = {
  Research: { badge: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20", icon: BookOpen, desc: "Free for academic & non-commercial use", color: "from-emerald-500 to-teal-600" },
  Commercial: { badge: "text-violet-400 bg-violet-400/10 border-violet-400/20", icon: Zap, desc: "Per-use fee, any commercial application", color: "from-violet-500 to-purple-600" },
  Enterprise: { badge: "text-amber-400 bg-amber-400/10 border-amber-400/20", icon: Building2, desc: "Annual subscription, unlimited usage + SLA", color: "from-amber-500 to-orange-600" },
};

const USE_TYPES = ["All", "Research", "Commercial", "Enterprise"];
const DOMAINS = ["All", "Technical", "Legal", "Medical", "Casual", "Academic"];

export default function LicensingPage() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [useType, setUseType] = useState("All");
  const [domain, setDomain] = useState("All");

  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return null;
  const isDark = theme !== "light";

  const filtered = LICENSES.filter((l) => {
    const matchType = useType === "All" || l.type === useType;
    const matchDomain = domain === "All" || l.domain === domain;
    return matchType && matchDomain;
  });

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
              <Lock className="w-3 h-3" />
              License Marketplace
            </div>
            <h1 className={cn(
              "text-5xl md:text-7xl font-black uppercase tracking-tight mb-4",
              isDark ? "text-white" : "text-purple-950"
            )}>
              License a<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-fuchsia-400 to-violet-500">
                Dataset.
              </span>
            </h1>
            <p className={cn("text-lg max-w-2xl mx-auto", isDark ? "text-purple-300" : "text-purple-700")}>
              Access world-class localized datasets with transparent, on-chain licensing. Every license is programmable, auditable, and royalty-distributing.
            </p>
          </motion.div>

          {/* License Type Explainer */}
          <div className="grid md:grid-cols-3 gap-4 mb-10">
            {Object.entries(licenseTypeStyle).map(([type, meta], i) => (
              <motion.div
                key={type}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className={cn("p-5 rounded-2xl border", isDark ? "bg-purple-950/60 border-purple-900" : "bg-white border-violet-200")}
              >
                <div className={cn("w-10 h-10 rounded-xl bg-gradient-to-br flex items-center justify-center mb-3", meta.color)}>
                  <meta.icon className="w-5 h-5 text-white" />
                </div>
                <div className={cn("inline-flex text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full border mb-2", meta.badge)}>{type}</div>
                <p className={cn("text-xs leading-relaxed", isDark ? "text-purple-400" : "text-purple-600")}>{meta.desc}</p>
              </motion.div>
            ))}
          </div>

          {/* Filters */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className={cn("p-5 rounded-2xl border mb-8 flex flex-wrap gap-4 items-center", isDark ? "bg-purple-950/60 border-purple-900" : "bg-white border-violet-200")}
          >
            <div className="flex items-center gap-2">
              <Filter className={cn("w-3.5 h-3.5", isDark ? "text-purple-500" : "text-purple-500")} />
              <span className={cn("text-[10px] font-bold uppercase tracking-widest", isDark ? "text-purple-500" : "text-purple-600")}>Use Type:</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {USE_TYPES.map((t) => (
                <button key={t} onClick={() => setUseType(t)}
                  className={cn(
                    "px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all border",
                    useType === t ? "bg-violet-500 border-violet-500 text-white" : isDark ? "border-purple-800 text-purple-400 hover:border-violet-500/30" : "border-violet-200 text-purple-600 hover:border-violet-400"
                  )}>{t}</button>
              ))}
            </div>
            <div className={cn("w-px h-4", isDark ? "bg-purple-800" : "bg-violet-200")} />
            <span className={cn("text-[10px] font-bold uppercase tracking-widest", isDark ? "text-purple-500" : "text-purple-600")}>Domain:</span>
            <div className="flex flex-wrap gap-1.5">
              {DOMAINS.map((d) => (
                <button key={d} onClick={() => setDomain(d)}
                  className={cn(
                    "px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all border",
                    domain === d ? "bg-fuchsia-500 border-fuchsia-500 text-white" : isDark ? "border-purple-800 text-purple-400 hover:border-fuchsia-500/30" : "border-violet-200 text-purple-600 hover:border-fuchsia-400"
                  )}>{d}</button>
              ))}
            </div>
          </motion.div>

          {/* License Cards */}
          <div className="grid md:grid-cols-2 gap-5 mb-16">
            {filtered.map((lic, i) => {
              const meta = licenseTypeStyle[lic.type];
              return (
                <motion.div
                  key={lic.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.07 }}
                  className={cn(
                    "p-6 rounded-2xl border transition-all hover:shadow-xl group",
                    isDark ? "bg-purple-950/60 border-purple-900 hover:border-violet-500/30" : "bg-white border-violet-200 hover:border-violet-400"
                  )}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1 min-w-0 pr-3">
                      <h3 className={cn("font-black text-base uppercase tracking-tight mb-2 group-hover:text-violet-400 transition-colors", isDark ? "text-white" : "text-purple-950")}>
                        {lic.dataset}
                      </h3>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={cn("inline-flex items-center gap-1 text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full border", meta.badge)}>
                          <meta.icon className="w-2.5 h-2.5" /> {lic.type}
                        </span>
                        <span className={cn("text-[10px] font-mono font-bold px-2 py-0.5 rounded-lg", isDark ? "bg-violet-500/10 text-violet-400" : "bg-violet-100 text-violet-700")}>
                          {lic.pair}
                        </span>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className={cn("text-xl font-black", isDark ? "text-white" : "text-purple-950")}>{lic.price}</div>
                      <div className={cn("text-[10px] font-bold uppercase tracking-wider", isDark ? "text-purple-500" : "text-purple-600")}>{lic.type === "Enterprise" ? "Annual" : lic.price === "Free" ? "No Cost" : "One-time"}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 mb-4">
                    <Globe className={cn("w-3.5 h-3.5", isDark ? "text-purple-500" : "text-purple-500")} />
                    <span className={cn("text-xs", isDark ? "text-purple-400" : "text-purple-600")}>{lic.useCase}</span>
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <span className={cn("text-[10px] font-bold uppercase tracking-wider", isDark ? "text-purple-600" : "text-purple-500")}>Licensor</span>
                    <span className={cn("text-[10px] font-mono font-bold", isDark ? "text-purple-400" : "text-purple-700")}>{lic.licensor}</span>
                  </div>

                  <div className="space-y-1.5 mb-4">
                    <div className="flex items-center justify-between">
                      <span className={cn("text-[10px] font-bold uppercase tracking-wider flex items-center gap-1", isDark ? "text-purple-500" : "text-purple-600")}>
                        <Star className="w-3 h-3 text-amber-400" /> Quality
                      </span>
                      <span className={cn("text-sm font-black", lic.quality >= 95 ? "text-emerald-400" : "text-violet-400")}>{lic.quality}/100</span>
                    </div>
                    <div className={cn("w-full h-1.5 rounded-full overflow-hidden", isDark ? "bg-purple-900" : "bg-violet-100")}>
                      <div className={cn("h-full rounded-full", lic.quality >= 95 ? "bg-emerald-400" : "bg-violet-400")} style={{ width: `${lic.quality}%` }} />
                    </div>
                  </div>

                  <button className={cn(
                    "w-full py-2.5 rounded-xl text-[11px] font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-all",
                    "bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white hover:opacity-90 shadow-lg shadow-violet-500/20"
                  )}>
                    {lic.price === "Free" ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
                    {lic.price === "Free" ? "Access Free" : "Get License"} <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </motion.div>
              );
            })}
          </div>

          {/* Recent Licensees */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className={cn("p-6 rounded-2xl border mb-10", isDark ? "bg-purple-950/60 border-purple-900" : "bg-white border-violet-200")}
          >
            <div className={cn("text-[10px] font-bold uppercase tracking-[0.4em] mb-2", isDark ? "text-purple-500" : "text-purple-600")}>Case Studies</div>
            <h2 className={cn("text-xl font-black uppercase tracking-tight mb-6", isDark ? "text-white" : "text-purple-950")}>Recent Licensees</h2>
            <div className="grid md:grid-cols-3 gap-4">
              {RECENT_LICENSEES.map((l, i) => (
                <div key={i} className={cn("p-5 rounded-xl border", isDark ? "bg-purple-900/40 border-purple-800" : "bg-violet-50 border-violet-200")}>
                  <div className="flex items-start justify-between mb-3">
                    <div className={cn("font-black text-sm uppercase tracking-tight", isDark ? "text-white" : "text-purple-950")}>{l.company}</div>
                    <span className={cn("text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border shrink-0 ml-2", licenseTypeStyle[l.type].badge)}>{l.type}</span>
                  </div>
                  <p className={cn("text-xs leading-relaxed mb-3", isDark ? "text-purple-400" : "text-purple-600")}>{l.useCase}</p>
                  <div className={cn("text-[9px] font-mono font-bold", isDark ? "text-violet-400" : "text-violet-600")}>{l.dataset}</div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* CTA for contributors */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className={cn(
              "p-8 rounded-2xl border text-center relative overflow-hidden",
              isDark ? "bg-purple-950/60 border-purple-900" : "bg-white border-violet-200"
            )}
          >
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-violet-500 to-transparent" />
            <div className={cn("w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center mx-auto mb-4")}>
              <Upload className="w-6 h-6 text-white" />
            </div>
            <h2 className={cn("text-2xl font-black uppercase tracking-tight mb-2", isDark ? "text-white" : "text-purple-950")}>License Your Dataset</h2>
            <p className={cn("text-sm max-w-lg mx-auto mb-6", isDark ? "text-purple-300" : "text-purple-700")}>
              Upload your verified translation dataset to the LinguaLayer registry and start earning royalties automatically every time it&apos;s licensed.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button className="flex items-center justify-center gap-2 px-8 py-3 rounded-xl font-bold uppercase tracking-widest text-sm bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white shadow-lg shadow-violet-500/20 hover:opacity-90 transition-all">
                <Sparkles className="w-4 h-4" /> Submit Dataset
              </button>
              <a href="/" className={cn(
                "flex items-center justify-center gap-2 px-8 py-3 rounded-xl font-bold uppercase tracking-widest text-sm border transition-all",
                isDark ? "border-purple-800 text-purple-400 hover:border-violet-500/30" : "border-violet-300 text-purple-700 hover:border-violet-500"
              )}>
                Read Contributor Docs
              </a>
            </div>
          </motion.div>

        </div>
      </div>
    </PageShell>
  );
}
