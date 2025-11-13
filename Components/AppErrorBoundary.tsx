
'use client';
import { ErrorBoundary } from 'react-error-boundary';
function ErrorFallback({ error, resetErrorBoundary }: any) {
  return (
    <div style={{ padding: 20, background: '#fff5f5', borderRadius: 8 }}>
      <h2>⚠️ Something went wrong in below Component</h2>
      <p>{error.message}</p>
      <button onClick={resetErrorBoundary}>Try again</button>
    </div>
  );
}
export default function AppErrorBoundary({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onReset={() => {
        window.location.reload();
      }}
      onError={(error, info) => {
        console.error('Boundary caught:', error, info);
      }}
    >
      {children}
    </ErrorBoundary>
  );
}
