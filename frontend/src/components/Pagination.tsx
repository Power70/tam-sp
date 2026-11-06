interface PaginationProps {
  page: number;
  totalPages: number;
  total: number;
  pageSize: number;
  onChange: (page: number) => void;
}

export default function Pagination({
  page,
  totalPages,
  total,
  pageSize,
  onChange,
}: PaginationProps) {
  if (totalPages <= 1)
    return (
      <p className="text-xs text-gray-500">
        Showing {total ? 1 : 0}–{Math.min(total, pageSize)} of {total} tasks
      </p>
    );
  const start = (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, total);
  return (
    <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <p className="m-0 text-xs text-gray-500">
        Showing {start}–{end} of {total} tasks
      </p>
      <nav
        className="flex items-center justify-between gap-4 text-sm text-gray-600 sm:justify-end"
        aria-label="Task pagination"
      >
        {page > 1 ? (
          <button
            className="min-h-10 rounded-lg border border-gray-200 bg-white px-3"
            type="button"
            onClick={() => onChange(page - 1)}
          >
            Previous
          </button>
        ) : (
          <span className="w-20" />
        )}
        <span>
          Page {page} of {totalPages}
        </span>
        {page < totalPages ? (
          <button
            className="min-h-10 rounded-lg border border-gray-200 bg-white px-3"
            type="button"
            onClick={() => onChange(page + 1)}
          >
            Next
          </button>
        ) : (
          <span className="w-20" />
        )}
      </nav>
    </div>
  );
}
