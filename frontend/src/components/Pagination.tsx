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
      <p className="task-range">
        Showing {total ? 1 : 0}–{Math.min(total, pageSize)} of {total} tasks
      </p>
    );
  const start = (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, total);
  return (
    <div className="pagination-wrap">
      <p className="task-range">
        Showing {start}–{end} of {total} tasks
      </p>
      <nav className="pagination" aria-label="Task pagination">
        {page > 1 ? (
          <button type="button" onClick={() => onChange(page - 1)}>
            Previous
          </button>
        ) : (
          <span />
        )}
        <span>
          Page {page} of {totalPages}
        </span>
        {page < totalPages ? (
          <button type="button" onClick={() => onChange(page + 1)}>
            Next
          </button>
        ) : (
          <span />
        )}
      </nav>
    </div>
  );
}
