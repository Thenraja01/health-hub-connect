import React, { ReactNode, ErrorInfo, Component } from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from './ui/button';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

/**
 * Error Boundary Component
 * Catches React component errors and displays a user-friendly error page
 */
class ErrorBoundary extends Component<Props, State> {
  public constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  public static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error Boundary caught an error:', error, errorInfo);
    
    this.setState({
      error,
      errorInfo,
    });

    // Log error to monitoring service (e.g., Sentry) in production
    if (import.meta.env.PROD) {
      // sentryClient.captureException(error, { contexts: { react: errorInfo } });
    }
  }

  private handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  public render() {
    if (this.state.hasError) {
      return this.state.error ? (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-50 p-4">
          <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 space-y-4">
            {/* Header */}
            <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full">
              <AlertCircle className="w-6 h-6 text-red-600" />
            </div>

            {/* Title and Message */}
            <div className="text-center space-y-2">
              <h1 className="text-xl font-bold text-gray-900">
                Oops! Something went wrong
              </h1>
              <p className="text-sm text-gray-600">
                We're sorry for the inconvenience. The application encountered an unexpected error.
              </p>
            </div>

            {/* Error Details (Development Only) */}
            {import.meta.env.DEV && this.state.errorInfo && (
              <details className="text-left bg-gray-50 p-3 rounded text-xs space-y-2">
                <summary className="font-semibold cursor-pointer text-gray-700 hover:text-gray-900">
                  Error Details
                </summary>
                <div className="space-y-2">
                  <div>
                    <p className="font-mono text-red-600 break-all">
                      {this.state.error?.message}
                    </p>
                  </div>
                  <div className="bg-white p-2 rounded overflow-auto max-h-32">
                    <pre className="text-xs text-gray-700 whitespace-pre-wrap break-words">
                      {this.state.errorInfo.componentStack}
                    </pre>
                  </div>
                </div>
              </details>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <Button
                onClick={this.handleReset}
                className="flex-1 bg-blue-600 hover:bg-blue-700"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Try Again
              </Button>
              <Button
                onClick={() => (window.location.href = '/')}
                variant="outline"
                className="flex-1"
              >
                Go Home
              </Button>
            </div>

            {/* Support Link */}
            <div className="text-center text-xs text-gray-500 pt-2">
              If the problem persists, please{' '}
              <a href="mailto:support@health-hub.com" className="text-blue-600 hover:underline">
                contact support
              </a>
            </div>
          </div>
        </div>
      ) : (
        this.props.fallback || <div>An error occurred</div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
