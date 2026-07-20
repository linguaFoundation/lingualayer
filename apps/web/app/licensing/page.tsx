import { EmptyState } from "@/components/empty-state";

export default function Page() {
  return (
    <section className="section">
      <span className="tag">Licensing</span>
      <h2>Buyer flows and license SKUs</h2>
      <EmptyState variant="licensing" />
    </section>
  );
}
