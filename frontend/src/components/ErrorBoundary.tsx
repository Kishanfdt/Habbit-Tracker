import { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log error for diagnostics
    if (import.meta.env.DEV) {
      // eslint-disable-next-line no-console
      console.error('Unhandled render error caught by ErrorBoundary:', error, errorInfo);
    }
  }

  private handleReload = (): void => {
    window.location.reload();
  };

  public render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#fbfbfa] flex items-center justify-center p-6">
          <div className="max-w-md w-full rounded-lg border border-[#e9e9e7] bg-white p-8 text-center shadow-sm">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600 text-xl font-bold">
              ⚠️
            </div>
            <h1 className="mt-4 text-lg font-semibold text-[#37352f]">
              Something went wrong
            </h1>
            <p className="mt-2 text-xs text-[#787774] leading-relaxed">
              An unexpected error occurred while rendering the application. You can reload the page to continue.
            </p>
            {this.state.error && import.meta.env.DEV && (
              <div className="mt-4 p-3 rounded bg-red-50 text-left overflow-x-auto text-[11px] text-red-700 font-mono">
                {this.state.error.message}
              </div>
            )}
            <button
              onClick={this.handleReload}
              className="mt-6 inline-flex items-center justify-center rounded-md bg-[#2383e2] px-4 py-2 text-xs font-medium text-white hover:bg-[#1d6bf3] transition-colors"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
