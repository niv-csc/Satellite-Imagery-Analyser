import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-bg-primary flex flex-col items-center justify-center p-6 text-center">
          <h1 className="text-4xl font-bold text-red-500 mb-4">⚠️ Something went wrong</h1>
          <p className="text-gray-400 mb-8 max-w-md">
            The application encountered an unexpected error. Please try refreshing the page.
          </p>
          <div className="bg-bg-secondary p-4 rounded-xl border border-border-color text-left mb-8 max-w-2xl overflow-auto">
            <pre className="text-xs text-red-400 font-mono">
              {this.state.error?.toString()}
            </pre>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="bg-accent-primary hover:bg-accent-secondary text-white px-8 py-3 rounded-2xl font-semibold transition-all"
          >
            Refresh Application
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
