import { EmptyState } from "@/components/empty-state";

export default function Page() {
  return (
    <section className="section">
      <span className="tag">Governance</span>
      <h2>Council and moderation policy</h2>
      <EmptyState variant="governance" />
    </section>
  );
}
