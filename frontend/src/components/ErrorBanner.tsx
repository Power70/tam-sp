interface ErrorBannerProps {
  message: string;
  onRetry: () => void;
}

export default function ErrorBanner({ message, onRetry }: ErrorBannerProps) {
  return (
    <div
      className="mb-5 flex items-center justify-between gap-3 rounded-[10px] border border-red-300 bg-red-100 px-3.5 py-3 text-sm text-red-800"
      role="alert"
    >
      <span>{message}</span>
      <button
        className="h-9 shrink-0 rounded-lg border border-red-800 bg-white px-3 text-sm font-semibold text-red-800"
        type="button"
        onClick={onRetry}
      >
        Retry
      </button>
    </div>
  );
}
