import { EmptyState } from "@/components/empty-state";

export default function Page() {
  return (
    <section className="section">
      <span className="tag">Communities</span>
      <h2>Language community onboarding</h2>
      <EmptyState variant="communities" />
    </section>
  );
}
