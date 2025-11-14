import React, { useState } from "react";

const SummaryResult = ({ summary, loading }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!summary?.summary) return;

    try {
      await navigator.clipboard.writeText(summary.summary);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  if (loading) {
    return (
      <div className="summary-result bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-8 text-center animate-fade-in-up">
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-8 h-8 bg-linear-to-r from-blue-500 to-purple-500 rounded-full animate-pulse"></div>
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-lg font-semibold text-gray-800">
              Processing your document
            </p>
            <p className="text-gray-600 text-sm">Generating smart summary...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!summary) return null;

  return (
    <div className="summary-result bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-8 animate-fade-in-up">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
        <div>
          <h3 className="text-2xl font-bold bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Generated Summary
          </h3>
          {summary.originalName && (
            <p className="text-sm text-gray-600 mt-1">
              From: {summary.originalName}
            </p>
          )}
        </div>

        <div className="flex items-center space-x-2">
          {summary.summaryLength && (
            <span
              className={`text-xs font-medium px-3 py-1 rounded-full ${
                summary.summaryLength === "short"
                  ? "bg-green-100 text-green-800"
                  : summary.summaryLength === "medium"
                  ? "bg-blue-100 text-blue-800"
                  : "bg-purple-100 text-purple-800"
              }`}
            >
              {summary.summaryLength} summary
            </span>
          )}
          {summary.aiProvider && (
            <span className="text-xs font-medium px-3 py-1 rounded-full bg-gray-100 text-gray-800">
              {summary.aiProvider === "gemini" ? "AI Powered" : "Local"}
            </span>
          )}
        </div>
      </div>

      <div className="summary-content bg-gray-50/50 rounded-xl p-6 mb-6 border border-gray-200/50 min-h-[200px]">
        {summary.summary ? (
          <p className="text-gray-700 leading-relaxed text-lg whitespace-pre-line">
            {summary.summary}
          </p>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <svg
              className="w-12 h-12 mx-auto mb-3 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <p>No summary available</p>
          </div>
        )}
      </div>

      <div className="summary-actions flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="text-sm text-gray-500">
          {summary.createdAt && (
            <span>
              Generated on {new Date(summary.createdAt).toLocaleDateString()}
            </span>
          )}
        </div>

        <button
          onClick={handleCopy}
          className={`
            flex items-center space-x-2 px-6 py-3 rounded-lg font-semibold
            transition-all duration-200 transform hover:scale-105
            ${
              copied
                ? "bg-green-500 text-white shadow-lg"
                : "bg-linear-to-r from-blue-500 to-purple-500 text-white hover:shadow-xl"
            }
          `}
        >
          {copied ? (
            <>
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              <span>Copied!</span>
            </>
          ) : (
            <>
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
                  d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              </svg>
              <span>Copy to Clipboard</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default SummaryResult;
