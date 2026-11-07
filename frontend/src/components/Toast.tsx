interface ToastProps {
  message: string;
  type: 'error' | 'success';
}

export default function Toast({ message, type }: ToastProps) {
  return (
    <div
      className={`pointer-events-auto rounded-lg border px-4 py-3 text-sm font-medium shadow-lg ${
        type === 'error'
          ? 'border-red-300 bg-red-100 text-red-800'
          : 'border-green-300 bg-green-100 text-green-800'
      }`}
      role={type === 'error' ? 'alert' : 'status'}
    >
      {message}
    </div>
  );
}
