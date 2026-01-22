"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import {
  Globe, Users, Star, ArrowRight, Sparkles,
  MapPin, Clock, Languages,
} from "lucide-react";
import { PageShell } from "@/components/ui/page-shell";
import { cn } from "@/lib/utils";

const REGIONS = [
  {
    region: "West Africa",
    emoji: "🌍",
    linguists: 2140,
    languages: ["HA", "YO", "IG", "TW", "FF"],
    topDataset: "Agricultural Guides EN→HA",
    quality: 93,
    color: "from-violet-500 to-purple-600",
  },
  {
    region: "East Africa",
    emoji: "🌍",
    linguists: 1820,
    languages: ["SW", "AM", "SO", "LG", "RW"],
    topDataset: "Medical Protocol EN→SW",
    quality: 96,
    color: "from-fuchsia-500 to-violet-600",
  },
  {
    region: "North Africa",
    emoji: "🌍",
    linguists: 980,
    languages: ["AR", "FR", "TZM", "KAB"],
    topDataset: "OpenAI API Docs EN→AR",
    quality: 94,
    color: "from-purple-500 to-fuchsia-600",
  },
  {
    region: "Sub-Saharan Africa",
    emoji: "🌍",
    linguists: 620,
    languages: ["SW", "ZU", "XH", "ST", "TN"],
    topDataset: "Gov Services Glossary EN→YO",
    quality: 91,
    color: "from-violet-600 to-fuchsia-500",
  },
  {
    region: "South Asia",
    emoji: "🌏",
    linguists: 1640,
    languages: ["HI", "BN", "UR", "TA", "TE"],
    topDataset: "UN SDG Reports EN→HI",
    quality: 95,
    color: "from-violet-500 to-purple-600",
  },
  {
    region: "East Asia",
    emoji: "🌏",
    linguists: 890,
    languages: ["ZH", "JA", "KO", "MN"],
    topDataset: "Legal Contracts EN→ZH",
    quality: 98,
    color: "from-fuchsia-500 to-violet-600",
  },
  {
    region: "Southeast Asia",
    emoji: "🌏",
    linguists: 540,
    languages: ["ID", "MS", "TH", "VI", "TL"],
    topDataset: "E-Commerce Catalog EN→ID",
    quality: 90,
    color: "from-purple-500 to-fuchsia-600",
  },
  {
    region: "Middle East",
    emoji: "🌍",
    linguists: 460,
    languages: ["AR", "FA", "HE", "KU"],
    topDataset: "OpenAI API Docs EN→AR",
    quality: 92,
    color: "from-violet-600 to-purple-500",
  },
  {
    region: "LATAM",
    emoji: "🌎",
    linguists: 720,
    languages: ["PT", "ES", "QU", "GN"],
    topDataset: "Startup Pitch Decks EN→PT",
    quality: 89,
    color: "from-fuchsia-500 to-violet-600",
  },
  {
    region: "Europe",
    emoji: "🌍",
    linguists: 410,
    languages: ["FR", "DE", "PL", "RU", "UK"],
    topDataset: "Climate Reports EN→FR",
    quality: 97,
    color: "from-violet-500 to-fuchsia-600",
  },
  {
    region: "North America",
    emoji: "🌎",
    linguists: 280,
    languages: ["ES", "FR", "ZH", "AR"],
    topDataset: "Legal Contracts EN→ES",
    quality: 94,
    color: "from-purple-500 to-violet-600",
  },
  {
    region: "Pacific",
    emoji: "🌏",
    linguists: 120,
    languages: ["MI", "SM", "TO", "FJ"],
    topDataset: "Educational Curriculum EN→MI",
    quality: 87,
    color: "from-fuchsia-600 to-purple-500",
  },
];

const HIGHLIGHTS = [
  {
    id: "CONT-8821-BEN",
    pair: "EN → AR, FR",
    datasets: 14,
    earned: "14,200 XLM",
    bio: "Computational linguist from Cotonou working at the intersection of Arabic NLP and technical documentation. Specializes in developer tooling and API reference translations.",
    region: "West Africa",
  },
  {
    id: "CONT-7721-MUM",
    pair: "EN → HI, BN",
    datasets: 11,
    earned: "10,400 XLM",
    bio: "Former government translator turned decentralized contributor. Has helped localize WHO health guidelines and UN development reports into Hindi for 500M+ readers.",
    region: "South Asia",
  },
  {
    id: "CONT-5512-NAI",
    pair: "EN → SW, YO",
    datasets: 9,
    earned: "8,930 XLM",
    bio: "Linguist and software engineer based in Nairobi. Builds open-source Swahili NLP tooling alongside translation work, contributing to the East African digital language economy.",
    region: "East Africa",
  },
];

export default function CommunitiesPage() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return null;
  const isDark = theme !== "light";

  const totalLinguists = REGIONS.reduce((a, r) => a + r.linguists, 0);
  const totalLanguages = new Set(REGIONS.flatMap((r) => r.languages)).size;

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
              <Globe className="w-3 h-3" />
              Global Linguist Network
            </div>
            <h1 className={cn(
              "text-5xl md:text-7xl font-black uppercase tracking-tight mb-4",
              isDark ? "text-white" : "text-purple-950"
            )}>
              Language<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-fuchsia-400 to-violet-500">
                Everywhere.
              </span>
            </h1>
            <p className={cn("text-lg max-w-2xl mx-auto", isDark ? "text-purple-300" : "text-purple-700")}>
              {totalLinguists.toLocaleString()}+ verified linguists across 12 global regions, working together to build the decentralized internet of language.
            </p>
          </motion.div>

          {/* Community Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            {[
              { label: "Total Linguists", value: `${(totalLinguists / 1000).toFixed(1)}K`, icon: Users, color: "text-violet-400" },
              { label: "Languages", value: `${totalLanguages}+`, icon: Languages, color: "text-fuchsia-400" },
              { label: "Countries", value: "78", icon: MapPin, color: "text-purple-400" },
              { label: "Avg Response Time", value: "4.2h", icon: Clock, color: "text-emerald-400" },
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

          {/* Region Grid */}
          <div className="mb-12">
            <div className={cn("text-[10px] font-bold uppercase tracking-[0.4em] mb-2", isDark ? "text-purple-500" : "text-purple-600")}>Global Coverage</div>
            <h2 className={cn("text-2xl font-black uppercase tracking-tight mb-6", isDark ? "text-white" : "text-purple-950")}>Regions</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {REGIONS.map((region, i) => (
                <motion.div
                  key={region.region}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.06 }}
                  className={cn(
                    "p-5 rounded-2xl border transition-all hover:shadow-xl group cursor-pointer",
                    isDark ? "bg-purple-950/60 border-purple-900 hover:border-violet-500/30" : "bg-white border-violet-200 hover:border-violet-400"
                  )}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="text-2xl mb-1">{region.emoji}</div>
                      <h3 className={cn("font-black text-sm uppercase tracking-tight group-hover:text-violet-400 transition-colors", isDark ? "text-white" : "text-purple-950")}>
                        {region.region}
                      </h3>
                    </div>
                    <div className="text-right">
                      <div className={cn("text-lg font-black", isDark ? "text-white" : "text-purple-950")}>{region.linguists.toLocaleString()}</div>
                      <div className={cn("text-[9px] font-bold uppercase tracking-wider", isDark ? "text-purple-600" : "text-purple-500")}>Linguists</div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1 mb-3">
                    {region.languages.map((lang) => (
                      <span key={lang} className={cn("text-[9px] font-mono font-black px-1.5 py-0.5 rounded-md", isDark ? "bg-violet-500/10 text-violet-400" : "bg-violet-100 text-violet-700")}>{lang}</span>
                    ))}
                  </div>

                  <div className={cn("text-[9px] font-mono mb-3 truncate", isDark ? "text-purple-600" : "text-purple-500")}>{region.topDataset}</div>

                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className={cn("text-[9px] font-bold uppercase tracking-wider flex items-center gap-1", isDark ? "text-purple-600" : "text-purple-500")}>
                        <Star className="w-2.5 h-2.5 text-amber-400" /> Avg Quality
                      </span>
                      <span className={cn("text-[10px] font-black", region.quality >= 95 ? "text-emerald-400" : "text-violet-400")}>{region.quality}</span>
                    </div>
                    <div className={cn("w-full h-1 rounded-full overflow-hidden", isDark ? "bg-purple-900" : "bg-violet-100")}>
                      <div className={cn("h-full rounded-full bg-gradient-to-r", region.color)} style={{ width: `${region.quality}%` }} />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Community Highlights */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <div className={cn("text-[10px] font-bold uppercase tracking-[0.4em] mb-2", isDark ? "text-purple-500" : "text-purple-600")}>Spotlights</div>
            <h2 className={cn("text-2xl font-black uppercase tracking-tight mb-6", isDark ? "text-white" : "text-purple-950")}>Community Highlights</h2>
            <div className="grid md:grid-cols-3 gap-5">
              {HIGHLIGHTS.map((h, i) => (
                <motion.div
                  key={h.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className={cn(
                    "p-6 rounded-2xl border relative overflow-hidden",
                    isDark ? "bg-purple-950/60 border-purple-900" : "bg-white border-violet-200"
                  )}
                >
                  <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-violet-500 to-transparent" />
                  <div className={cn("w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center mb-4")}>
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <div className={cn("font-black text-xs font-mono mb-1", isDark ? "text-violet-400" : "text-violet-600")}>{h.id}</div>
                  <div className={cn("inline-flex text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border mb-3", isDark ? "bg-violet-500/10 border-violet-500/20 text-violet-400" : "bg-violet-100 border-violet-300 text-violet-700")}>
                    {h.region}
                  </div>
                  <div className="flex flex-wrap gap-3 mb-4">
                    <div>
                      <div className={cn("text-[9px] font-bold uppercase tracking-wider", isDark ? "text-purple-600" : "text-purple-500")}>Languages</div>
                      <div className={cn("text-xs font-black font-mono", isDark ? "text-white" : "text-purple-950")}>{h.pair}</div>
                    </div>
                    <div>
                      <div className={cn("text-[9px] font-bold uppercase tracking-wider", isDark ? "text-purple-600" : "text-purple-500")}>Datasets</div>
                      <div className={cn("text-xs font-black", isDark ? "text-white" : "text-purple-950")}>{h.datasets}</div>
                    </div>
                    <div>
                      <div className={cn("text-[9px] font-bold uppercase tracking-wider", isDark ? "text-purple-600" : "text-purple-500")}>Earned</div>
                      <div className="text-xs font-black text-violet-400">{h.earned}</div>
                    </div>
                  </div>
                  <p className={cn("text-xs leading-relaxed", isDark ? "text-purple-400" : "text-purple-600")}>{h.bio}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Join CTA */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className={cn(
              "p-8 rounded-2xl border text-center relative overflow-hidden",
              isDark ? "bg-purple-950/60 border-purple-900" : "bg-white border-violet-200"
            )}
          >
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-fuchsia-500 to-transparent" />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-fuchsia-600/10 rounded-full blur-3xl pointer-events-none" />
            <Sparkles className="w-8 h-8 text-violet-400 mx-auto mb-4" />
            <h2 className={cn("text-3xl font-black uppercase tracking-tight mb-2", isDark ? "text-white" : "text-purple-950")}>
              Join Your Language Community
            </h2>
            <p className={cn("text-sm max-w-lg mx-auto mb-6", isDark ? "text-purple-300" : "text-purple-700")}>
              Connect your Freighter wallet, select your language pair, and start earning royalties for every translation you contribute. Your language is an asset.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button className="flex items-center justify-center gap-2 px-8 py-3 rounded-xl font-bold uppercase tracking-widest text-sm bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white shadow-lg shadow-violet-500/20 hover:opacity-90 transition-all">
                <Globe className="w-4 h-4" /> Find My Region <ArrowRight className="w-4 h-4" />
              </button>
              <button className={cn(
                "flex items-center justify-center gap-2 px-8 py-3 rounded-xl font-bold uppercase tracking-widest text-sm border transition-all",
                isDark ? "border-purple-800 text-purple-400 hover:border-violet-500/30" : "border-violet-300 text-purple-700 hover:border-violet-500"
              )}>
                <Users className="w-4 h-4" /> View All Communities
              </button>
            </div>
          </motion.div>

        </div>
      </div>
    </PageShell>
  );
}
