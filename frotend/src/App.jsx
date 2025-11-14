import React, { useState } from "react";
import DocumentUpload from "./components/DocumentUpload";
import SummaryResult from "./components/SummaryResult";
import HistoryPanel from "./components/HistoryPanel";
import ErrorBoundary from "./components/ErrorBoundary";

function App() {
  const [currentSummary, setCurrentSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100">
        <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200/50 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="text-center animate-fade-in">
              <h1 className="text-4xl font-bold bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-3">
                Document Summary Assistant
              </h1>
              <p className="text-gray-600 text-lg">
                Upload PDFs or images to generate smart summaries
              </p>
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {error && (
            <div className="mb-6 animate-slide-down">
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center justify-between shadow-sm">
                <div className="flex items-center">
                  <div className="shrink-0">
                    <svg
                      className="h-5 w-5 text-red-400"
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
                  <div className="ml-3">
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                </div>
                <button
                  onClick={() => setError("")}
                  className="text-red-400 hover:text-red-600 transition-colors duration-200"
                >
                  <svg
                    className="h-5 w-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <DocumentUpload
                onSummaryGenerated={setCurrentSummary}
                onLoading={setLoading}
                onError={setError}
              />

              {(loading || currentSummary) && (
                <SummaryResult summary={currentSummary} loading={loading} />
              )}
            </div>

            <div className="lg:col-span-1">
              <HistoryPanel onSelectSummary={setCurrentSummary} />
            </div>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
}

export default App;
