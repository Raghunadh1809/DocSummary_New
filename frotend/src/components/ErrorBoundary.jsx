import React from "react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error caught by boundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-linear-to-br from-red-50 to-orange-100 flex items-center justify-center p-4 animate-fade-in">
          <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg
                className="w-10 h-10 text-red-500"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              Something went wrong
            </h2>
            <p className="text-gray-600 mb-6">
              We encountered an unexpected error. Please try again.
            </p>

            <details className="text-left bg-gray-50 rounded-lg p-4 mb-6">
              <summary className="cursor-pointer font-medium text-gray-700 hover:text-gray-900">
                Error Details
              </summary>
              <pre className="mt-2 text-sm text-gray-600 whitespace-pre-wrap">
                {this.state.error && this.state.error.toString()}
              </pre>
            </details>

            <button
              onClick={() => this.setState({ hasError: false })}
              className="
                w-full bg-linear-to-r from-blue-500 to-purple-500 text-white
                py-3 px-6 rounded-lg font-semibold
                hover:from-blue-600 hover:to-purple-600
                transform hover:scale-105
                transition-all duration-200
                shadow-lg hover:shadow-xl
              "
            >
              Try Again
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
