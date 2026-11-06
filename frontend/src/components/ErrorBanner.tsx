interface ErrorBannerProps {
  message: string;
  onRetry: () => void;
}

export default function ErrorBanner({ message, onRetry }: ErrorBannerProps) {
  return (
    <div
      className="mb-4 flex items-center justify-between gap-4 rounded-lg border border-red-300 bg-red-100 px-4 py-3 text-red-800"
      role="alert"
    >
      <span>{message}</span>
      <button
        className="min-h-10 rounded-lg border border-red-800 bg-white px-3 font-semibold"
        type="button"
        onClick={onRetry}
      >
        Retry
      </button>
    </div>
  );
}
