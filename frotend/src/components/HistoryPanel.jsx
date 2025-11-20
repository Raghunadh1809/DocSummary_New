import React, { useState, useEffect } from "react";
import axios from "axios";

// Use environment variable or fallback to direct URL
const API_BASE =
  import.meta.env.VITE_API_URL || "https://doc-summary-backend.vercel.app/api";

const HistoryPanel = ({ onSelectSummary }) => {
  const [summaries, setSummaries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSummaries();
  }, []);

  const fetchSummaries = async () => {
    try {
      setError(null);
      setLoading(true);

      const response = await axios.get(`${API_BASE}/summaries`, {
        timeout: 10000,
      });

      const summariesData = response.data?.data || response.data || [];
      setSummaries(Array.isArray(summariesData) ? summariesData : []);
    } catch (error) {
      console.error("Failed to fetch summaries:", error);
      setError(
        "Failed to load history. Please check if the backend is running."
      );
      setSummaries([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="history-panel bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-6 animate-fade-in">
        <h3 className="text-xl font-bold text-gray-800 mb-4">History</h3>
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <span className="ml-3 text-gray-600">Loading history...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="history-panel bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-6 animate-fade-in">
        <h3 className="text-xl font-bold text-gray-800 mb-4">History</h3>
        <div className="text-center py-8">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-6 h-6 text-red-500"
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
          <p className="text-red-600 mb-2 font-medium">Connection Error</p>
          <p className="text-gray-600 text-sm mb-4">{error}</p>
          <button
            onClick={fetchSummaries}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-600 transition-colors duration-200"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="history-panel bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-6 animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-800">Summary History</h3>
        <button
          onClick={fetchSummaries}
          className="text-gray-500 hover:text-gray-700 transition-colors duration-200"
          title="Refresh history"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
        </button>
      </div>

      <div className="history-list space-y-3 max-h-96 overflow-y-auto">
        {summaries.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <p className="text-gray-500">
              No summaries yet. Upload a document to get started!
            </p>
          </div>
        ) : (
          summaries.map((summary, index) => (
            <div
              key={summary._id || summary.id || `summary-${index}`}
              className="history-item bg-white rounded-xl p-4 border border-gray-200/50 hover:border-blue-300 hover:shadow-md cursor-pointer transform hover:scale-[1.02] transition-all duration-200 animate-fade-in-up"
              style={{ animationDelay: `${index * 100}ms` }}
              onClick={() => onSelectSummary(summary)}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="history-filename font-semibold text-gray-800 text-sm truncate flex-1">
                  {summary.originalName || "Unknown Document"}
                </div>
                <span
                  className={`text-xs font-medium px-2 py-1 rounded-full ml-2 ${
                    summary.summaryLength === "short"
                      ? "bg-green-100 text-green-800"
                      : summary.summaryLength === "medium"
                      ? "bg-blue-100 text-blue-800"
                      : "bg-purple-100 text-purple-800"
                  }`}
                >
                  {summary.summaryLength || "medium"}
                </span>
              </div>

              <div className="history-preview text-gray-600 text-sm mb-3 line-clamp-2">
                {summary.summary?.substring(0, 100) || "No summary available"}
                ...
              </div>

              <div className="history-meta flex items-center justify-between text-xs text-gray-500">
                <span className="history-date">
                  {summary.createdAt
                    ? new Date(summary.createdAt).toLocaleDateString()
                    : "Unknown date"}
                </span>
                <span className="text-blue-500 hover:text-blue-700 transition-colors">
                  View →
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default HistoryPanel;
