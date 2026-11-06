export default function SkeletonCard() {
  return (
    <article className="task-card skeleton-card" aria-hidden="true">
      <span className="skeleton skeleton-title" />
      <span className="skeleton skeleton-line" />
      <span className="skeleton skeleton-line short" />
      <span className="skeleton skeleton-footer" />
    </article>
  );
}
