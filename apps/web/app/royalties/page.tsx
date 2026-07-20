import { EmptyState } from "@/components/empty-state";

export default function Page() {
  return (
    <section className="section">
      <span className="tag">Royalties</span>
      <h2>Payout transparency dashboard</h2>
      <EmptyState variant="royalties" />
    </section>
  );
}
