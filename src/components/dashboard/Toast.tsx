import { useEffect } from 'react';

type ToastProps = {
  message: string | null;
  variant?: 'success' | 'error';
  onDismiss: () => void;
};

export function Toast({ message, variant = 'success', onDismiss }: ToastProps) {
  useEffect(() => {
    if (!message) return;
    const t = window.setTimeout(() => onDismiss(), 4500);
    return () => window.clearTimeout(t);
  }, [message, onDismiss]);

  if (!message) return null;
  return (
    <div className={`dash-toast dash-toast--${variant}`} role="status">
      {message}
    </div>
  );
}
