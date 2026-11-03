import { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error in component:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      return (
        <div className="p-6 rounded-xl border border-red-300 bg-red-50 text-red-900 text-sm font-mono my-4">
          <p className="font-bold mb-1">⚠️ 3D Component Error:</p>
          <p className="text-xs text-red-700">{this.state.error?.message || 'Failed to render 3D canvas.'}</p>
          <button
            type="button"
            onClick={() => this.setState({ hasError: false })}
            className="mt-3 px-3 py-1 bg-red-600 text-white rounded text-xs"
          >
            Retry
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
