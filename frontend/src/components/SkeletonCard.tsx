export default function SkeletonCard() {
  return (
    <article className="rounded-xl border border-gray-200 bg-white p-4" aria-hidden="true">
      <span className="block h-5 w-2/5 animate-pulse rounded bg-gray-200" />
      <span className="mt-4 block h-3 w-11/12 animate-pulse rounded bg-gray-200" />
      <span className="mt-2 block h-3 w-2/3 animate-pulse rounded bg-gray-200" />
      <span className="mt-5 block h-8 w-full animate-pulse rounded bg-gray-200" />
    </article>
  );
}
