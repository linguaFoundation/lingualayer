import type { ReactNode } from "react";

export type EmptyStateVariant =
  | "communities"
  | "licensing"
  | "royalties"
  | "governance"
  | "roadmap"
  | "docs"
  | "generic";

const illustrations: Record<EmptyStateVariant, ReactNode> = {
  communities: (
    <svg width="120" height="120" viewBox="0 0 120 120" fill="none" aria-hidden="true">
      <circle cx="60" cy="44" r="18" stroke="var(--accent)" strokeWidth="2.5" fill="none" />
      <circle cx="28" cy="72" r="13" stroke="var(--muted)" strokeWidth="2" fill="none" />
      <circle cx="92" cy="72" r="13" stroke="var(--muted)" strokeWidth="2" fill="none" />
      <path d="M42 62 Q60 54 78 62" stroke="var(--accent)" strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d="M15 85 Q28 77 41 85" stroke="var(--muted)" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      <path d="M79 85 Q92 77 105 85" stroke="var(--muted)" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      <circle cx="60" cy="44" r="6" fill="var(--accent)" opacity="0.25" />
      <circle cx="28" cy="72" r="4" fill="var(--muted)" opacity="0.2" />
      <circle cx="92" cy="72" r="4" fill="var(--muted)" opacity="0.2" />
    </svg>
  ),
  licensing: (
    <svg width="120" height="120" viewBox="0 0 120 120" fill="none" aria-hidden="true">
      <rect x="28" y="18" width="64" height="84" rx="8" stroke="var(--accent)" strokeWidth="2.5" fill="none" />
      <path d="M40 42h40M40 54h40M40 66h28" stroke="var(--muted)" strokeWidth="2" strokeLinecap="round" />
      <circle cx="60" cy="86" r="10" fill="none" stroke="var(--accent)" strokeWidth="2" />
      <path d="M56 86l3 3 6-6" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="28" y="18" width="64" height="84" rx="8" fill="var(--accent)" opacity="0.04" />
    </svg>
  ),
  royalties: (
    <svg width="120" height="120" viewBox="0 0 120 120" fill="none" aria-hidden="true">
      <circle cx="60" cy="60" r="36" stroke="var(--accent)" strokeWidth="2.5" fill="none" />
      <circle cx="60" cy="60" r="36" fill="var(--accent)" opacity="0.06" />
      <text x="60" y="54" textAnchor="middle" fontSize="22" fontWeight="700" fill="var(--accent)" fontFamily="Inter, sans-serif">₹</text>
      <path d="M48 68h24" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" />
      <path d="M52 74h16" stroke="var(--muted)" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="60" cy="60" r="28" stroke="var(--muted)" strokeWidth="1" opacity="0.35" fill="none" />
    </svg>
  ),
  governance: (
    <svg width="120" height="120" viewBox="0 0 120 120" fill="none" aria-hidden="true">
      <path d="M60 18L94 36v22c0 18-14 34-34 40C40 112 26 96 26 78V36L60 18z" stroke="var(--accent)" strokeWidth="2.5" fill="none" />
      <path d="M60 18L94 36v22c0 18-14 34-34 40C40 112 26 96 26 78V36L60 18z" fill="var(--accent)" opacity="0.06" />
      <path d="M46 62l10 10 18-18" stroke="var(--accent)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  roadmap: (
    <svg width="120" height="120" viewBox="0 0 120 120" fill="none" aria-hidden="true">
      <path d="M20 90 Q35 60 60 60 Q85 60 100 30" stroke="var(--muted)" strokeWidth="2" fill="none" strokeDasharray="5 4" />
      <circle cx="20" cy="90" r="6" fill="var(--accent)" />
      <circle cx="60" cy="60" r="6" fill="var(--muted)" opacity="0.5" />
      <circle cx="100" cy="30" r="6" fill="var(--muted)" opacity="0.25" />
      <circle cx="20" cy="90" r="12" stroke="var(--accent)" strokeWidth="1.5" fill="none" opacity="0.3" />
      <path d="M56 56l4 4 8-8" stroke="var(--muted)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.5" />
    </svg>
  ),
  docs: (
    <svg width="120" height="120" viewBox="0 0 120 120" fill="none" aria-hidden="true">
      <rect x="24" y="14" width="56" height="72" rx="6" stroke="var(--muted)" strokeWidth="2" fill="none" />
      <rect x="32" y="22" width="56" height="72" rx="6" stroke="var(--accent)" strokeWidth="2.5" fill="none" />
      <rect x="32" y="22" width="56" height="72" rx="6" fill="var(--accent)" opacity="0.05" />
      <path d="M44 44h32M44 54h32M44 64h20" stroke="var(--muted)" strokeWidth="2" strokeLinecap="round" />
      <circle cx="76" cy="78" r="12" fill="var(--surface)" stroke="var(--accent)" strokeWidth="2" />
      <path d="M76 73v5h4" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  generic: (
    <svg width="120" height="120" viewBox="0 0 120 120" fill="none" aria-hidden="true">
      <rect x="24" y="24" width="72" height="72" rx="16" stroke="var(--muted)" strokeWidth="2" fill="none" opacity="0.5" />
      <circle cx="60" cy="60" r="16" stroke="var(--accent)" strokeWidth="2.5" fill="none" />
      <path d="M60 52v8M60 64v4" stroke="var(--accent)" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  ),
};

const labels: Record<EmptyStateVariant, { heading: string; body: string }> = {
  communities: {
    heading: "No communities yet",
    body: "Language communities will appear here once onboarding is open.",
  },
  licensing: {
    heading: "No licenses found",
    body: "License SKUs and buyer flows will be listed here when available.",
  },
  royalties: {
    heading: "No payouts yet",
    body: "Royalty splits and payout history will appear here once data is available.",
  },
  governance: {
    heading: "No proposals yet",
    body: "Council decisions and moderation policy will be listed here.",
  },
  roadmap: {
    heading: "Milestones coming soon",
    body: "Delivery milestones and protocol releases will be tracked here.",
  },
  docs: {
    heading: "Documentation incoming",
    body: "Contributor and curator guides will appear here.",
  },
  generic: {
    heading: "Nothing here yet",
    body: "Content will appear here when it becomes available.",
  },
};

interface EmptyStateProps {
  variant?: EmptyStateVariant;
  heading?: string;
  body?: string;
}

export function EmptyState({ variant = "generic", heading, body }: EmptyStateProps) {
  const label = labels[variant];
  return (
    <div className="empty-state">
      <div className="empty-state-illustration">{illustrations[variant]}</div>
      <p className="empty-state-heading">{heading ?? label.heading}</p>
      <p className="empty-state-body">{body ?? label.body}</p>
    </div>
  );
}
