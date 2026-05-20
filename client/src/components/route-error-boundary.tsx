import { Component, type ReactNode, type ErrorInfo, useState, useEffect } from "react";

interface RouteErrorBoundaryProps {
  children: ReactNode;
  groupName: string;
}

interface RouteErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

function is503Error(error: Error | null): boolean {
  if (!error) return false;
  return error.message?.includes("503") || (error as any)?.status === 503;
}

export function ServiceUnavailableFallback({ retryAfter, onRetry }: { retryAfter?: number; onRetry?: () => void }) {
  const [countdown, setCountdown] = useState(retryAfter || 30);

  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setInterval(() => setCountdown(c => Math.max(0, c - 1)), 1000);
    return () => clearInterval(timer);
  }, [countdown]);

  return (
    <div
      className="min-h-[40vh] flex items-center justify-center p-8"
      data-testid="service-unavailable-fallback"
    >
      <div className="max-w-md text-center space-y-4">
        <div className="w-12 h-12 mx-auto rounded-full bg-amber-100 flex items-center justify-center">
          <svg className="w-6 h-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h2 className="text-lg font-semibold text-gray-900">
          Temporarily Unavailable
        </h2>
        <p className="text-sm text-gray-500">
          This feature is experiencing high demand. Please try again shortly.
        </p>
        {countdown > 0 && (
          <p className="text-xs text-gray-400" data-testid="text-retry-countdown">
            Auto-retry in {countdown}s
          </p>
        )}
        <button
          onClick={() => {
            setCountdown(retryAfter || 30);
            if (onRetry) onRetry();
            else window.location.reload();
          }}
          className="mt-4 px-4 py-2 bg-amber-600 text-white rounded-lg text-sm font-medium hover:bg-amber-700 transition-colors"
          data-testid="button-retry-unavailable"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}

export class RouteErrorBoundary extends Component<RouteErrorBoundaryProps, RouteErrorBoundaryState> {
  constructor(props: RouteErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error(
      `[RouteErrorBoundary] ${this.props.groupName} crashed:`,
      error.message,
      info.componentStack,
    );
  }

  render() {
    if (this.state.hasError) {
      if (is503Error(this.state.error)) {
        const retryAfter = (this.state.error as any)?.retryAfter || 30;
        return (
          <ServiceUnavailableFallback
            retryAfter={retryAfter}
            onRetry={() => this.setState({ hasError: false, error: null })}
          />
        );
      }

      return (
        <div
          className="min-h-[60vh] flex items-center justify-center p-8"
          data-testid={`error-boundary-${this.props.groupName}`}
        >
          <div className="max-w-md text-center space-y-4">
            <div className="w-12 h-12 mx-auto rounded-full bg-red-100 flex items-center justify-center">
              <svg className="w-6 h-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h2 className="text-lg font-semibold text-gray-900">
              Something went wrong
            </h2>
            <p className="text-sm text-gray-500">
              This section failed to load. Please try refreshing the page.
            </p>
            {import.meta.env.DEV && this.state.error && (
              <pre className="mt-2 p-3 bg-gray-100 rounded text-xs text-left overflow-auto max-h-40">
                {this.state.error.message}
              </pre>
            )}
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors"
              data-testid={`button-reload-${this.props.groupName}`}
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
