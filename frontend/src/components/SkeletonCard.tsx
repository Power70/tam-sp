export default function SkeletonCard() {
  return (
    <article
      className="flex flex-col gap-3 rounded-xl border border-gray-200 bg-white p-4 sm:p-5"
      aria-hidden="true"
    >
      <div className="flex items-start justify-between gap-3">
        <span className="block h-[18px] w-3/5 animate-pulse rounded bg-gray-200" />
        <span className="block h-6 w-[84px] animate-pulse rounded-full bg-gray-200" />
      </div>
      <span className="block h-3.5 w-11/12 animate-pulse rounded bg-gray-200" />
      <span className="block h-3.5 w-2/3 animate-pulse rounded bg-gray-200" />
      <div className="flex items-center justify-between gap-3 border-t border-[#F0F1F4] pt-3.5">
        <span className="block h-3 w-36 animate-pulse rounded bg-gray-200" />
        <span className="block h-10 w-[120px] animate-pulse rounded-lg bg-gray-200" />
      </div>
    </article>
  );
}
