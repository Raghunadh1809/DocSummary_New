import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import axios from "axios";

// Use environment variable or fallback to direct URL
const API_BASE =
  import.meta.env.VITE_API_URL || "https://doc-summary-backend.vercel.app/api";

const DocumentUpload = ({ onSummaryGenerated, onLoading, onError }) => {
  const [uploadedFile, setUploadedFile] = useState(null);
  const [extractedText, setExtractedText] = useState("");
  const [summaryLength, setSummaryLength] = useState("medium");

  const onDrop = useCallback(
    async (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (!file) return;

      setUploadedFile(file);
      onError("");
      onLoading(true);

      const formData = new FormData();
      formData.append("document", file);

      try {
        // Upload document
        const uploadResponse = await axios.post(
          `${API_BASE}/upload`,
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
            timeout: 30000, // 30 second timeout
          }
        );

        setExtractedText(uploadResponse.data.extractedText);

        // Generate summary
        const summaryResponse = await axios.post(
          `${API_BASE}/summarize`,
          {
            text: uploadResponse.data.extractedText,
            length: summaryLength,
            filename: uploadResponse.data.filename,
            originalName: uploadResponse.data.originalName,
            fileType: uploadResponse.data.fileType,
          },
          {
            timeout: 30000,
          }
        );

        onSummaryGenerated(summaryResponse.data);
      } catch (error) {
        console.error("Upload error:", error);
        if (error.code === "ECONNABORTED") {
          onError("Request timeout. Please try again.");
        } else if (error.response?.data?.error) {
          onError(error.response.data.error);
        } else if (error.message.includes("Network Error")) {
          onError(
            "Cannot connect to server. Please check your internet connection and ensure the backend is running."
          );
        } else {
          onError("Failed to process document. Please try again.");
        }
      } finally {
        onLoading(false);
      }
    },
    [onSummaryGenerated, onLoading, onError, summaryLength]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
      "image/*": [".jpeg", ".jpg", ".png"],
    },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024, // 10MB
  });

  return (
    <div className="document-upload animate-fade-in-up">
      <div
        {...getRootProps()}
        className={`
          relative border-2 border-dashed rounded-2xl p-8 transition-all duration-300 ease-in-out
          ${
            isDragActive
              ? "border-blue-500 bg-blue-50/50 scale-[1.02] shadow-lg"
              : "border-gray-300 bg-white/80 hover:border-blue-400 hover:bg-blue-50/30 hover:shadow-md"
          }
          cursor-pointer group backdrop-blur-sm
        `}
      >
        <input {...getInputProps()} />
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div
              className="
              w-16 h-16 rounded-full bg-linear-to-r from-blue-500 to-purple-500 
              flex items-center justify-center text-white text-2xl
              transition-transform duration-300 group-hover:scale-110
              shadow-lg
            "
            >
              📄
            </div>
          </div>
          {isDragActive ? (
            <div className="space-y-2">
              <p className="text-lg font-semibold text-blue-600">
                Drop the document here...
              </p>
              <p className="text-sm text-blue-500">Release to upload</p>
            </div>
          ) : (
            <div className="space-y-2">
              <p className="text-lg font-semibold text-gray-700">
                Drag & drop a PDF or image file here
              </p>
              <p className="text-gray-500">or click to select</p>
              <p className="text-xs text-gray-400 mt-2">
                Supports PDF, JPG, PNG (Max 10MB)
              </p>
            </div>
          )}
        </div>

        <div
          className="
          absolute inset-0 rounded-2xl bg-linear-to-r from-blue-500/0 to-purple-500/0 
          group-hover:from-blue-500/5 group-hover:to-purple-500/5
          transition-all duration-500 opacity-0 group-hover:opacity-100
        "
        ></div>
      </div>

      <div className="mt-6 animate-slide-down">
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200/50">
          <div className="summary-controls">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Summary Length:
            </label>
            <select
              value={summaryLength}
              onChange={(e) => setSummaryLength(e.target.value)}
              className="
                w-full px-4 py-2 border border-gray-300 rounded-lg
                focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                transition-all duration-200 bg-white
                hover:border-gray-400
              "
            >
              <option value="short">Short (2-3 Paragraphs)</option>
              <option value="medium">Medium (4-6 Paragraphs)</option>
              <option value="long">Long (7-9 Paragraphs)</option>
            </select>
            <p className="text-xs text-gray-500 mt-2">
              Selected length will be used for all summaries
            </p>
          </div>
        </div>
      </div>

      {uploadedFile && (
        <div className="mt-6 animate-slide-down">
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200/50">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-semibold text-gray-800">
                Uploaded File
              </h4>
              <div className="flex items-center space-x-2 text-green-600">
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-sm font-medium">Ready</span>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg mb-4">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-blue-600 text-lg">📄</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {uploadedFile.name}
                </p>
                <p className="text-xs text-gray-500">
                  {(uploadedFile.size / (1024 * 1024)).toFixed(2)} MB
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentUpload;
