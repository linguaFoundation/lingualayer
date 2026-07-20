import { EmptyState } from "@/components/empty-state";

export default function Page() {
  return (
    <section className="section">
      <span className="tag">Documentation</span>
      <h2>Contributor and curator handbook</h2>
      <EmptyState variant="docs" />
    </section>
  );
}
