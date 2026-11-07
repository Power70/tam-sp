interface PaginationProps {
  page: number;
  totalPages: number;
  total: number;
  pageSize: number;
  onChange: (page: number) => void;
}

const BUTTON =
  'h-10 rounded-lg border border-gray-300 bg-white px-4 text-sm font-medium text-gray-700 hover:bg-gray-50';

export default function Pagination({
  page,
  totalPages,
  total,
  pageSize,
  onChange,
}: PaginationProps) {
  if (totalPages <= 1)
    return (
      <p className="hidden text-[13px] text-gray-600 sm:block">
        {total ? 1 : 0} of {total} tasks
      </p>
    );
  const start = (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, total);
  return (
    <div className="flex items-center sm:justify-between sm:gap-3">
      <p className="m-0 hidden text-[13px] text-gray-600 sm:block">
        {start}-{end} of {total} tasks
      </p>
      <nav
        className="flex w-full items-center justify-between gap-2 text-[13px] text-gray-600 sm:w-auto sm:gap-3"
        aria-label="Task pagination"
      >
        {page > 1 ? (
          <button className={BUTTON} type="button" onClick={() => onChange(page - 1)}>
            Previous
          </button>
        ) : (
          <span className="w-22" aria-hidden="true" />
        )}
        <span className="whitespace-nowrap" aria-live="polite">
          Page {page} of {totalPages}
        </span>
        {page < totalPages ? (
          <button className={BUTTON} type="button" onClick={() => onChange(page + 1)}>
            Next
          </button>
        ) : (
          <span className="w-22" aria-hidden="true" />
        )}
      </nav>
    </div>
  );
}
