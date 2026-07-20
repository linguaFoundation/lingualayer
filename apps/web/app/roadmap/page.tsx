import { EmptyState } from "@/components/empty-state";

export default function Page() {
  return (
    <section className="section">
      <span className="tag">Roadmap</span>
      <h2>Milestones tied to protocol releases and grant checkpoints</h2>
      <EmptyState variant="roadmap" />
    </section>
  );
}
