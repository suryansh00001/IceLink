import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            hasError: false,
            error: null
        };
    }

    static getDerivedStateFromError(error: Error): State {
        return {
            hasError: true,
            error
        };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('Error caught by boundary:', error, errorInfo);
        // TODO: Send to error tracking service like Sentry
    }

    render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback;
            }

            return (
                <div className="min-h-screen bg-gradient-to-br from-ice-900 via-ice-800 to-ice-900 flex items-center justify-center p-4">
                    <div className="bg-ice-900/80 backdrop-blur-xl border border-ice-700/30 rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
                        <div className="mb-6">
                            <svg className="w-20 h-20 mx-auto text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        </div>
                        <h1 className="text-2xl font-bold text-white mb-3">
                            Oops! Something went wrong
                        </h1>
                        <p className="text-ice-300 mb-6">
                            We're sorry for the inconvenience. Please try refreshing the page.
                        </p>
                        {process.env.NODE_ENV === 'development' && this.state.error && (
                            <div className="bg-red-900/20 border border-red-700/30 rounded-lg p-4 mb-6 text-left">
                                <p className="text-red-400 text-sm font-mono">
                                    {this.state.error.toString()}
                                </p>
                            </div>
                        )}
                        <button
                            onClick={() => window.location.href = '/'}
                            className="px-6 py-3 bg-ice-600 hover:bg-ice-700 text-white rounded-lg font-medium transition-colors"
                        >
                            Go to Home
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
