"use client";

import React, { useState, useEffect } from "react";
// import { useRouter } from 'next/navigation';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://13.201.89.79';

export default function PaymentSubmission() {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [amount, setAmount] = useState("");
  const [utr, setUtr] = useState("");
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  // const router = useRouter(); 

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      const fileUrl = URL.createObjectURL(selectedFile);
      setPreviewUrl(fileUrl);
    } else {
      setFile(null);
      setPreviewUrl(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    if (!file || !amount || !utr) {
      setError("Please fill in all required fields (Screenshot, Amount, and UTR).");
      setLoading(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("image", file);
      if (amount) formData.append("amount", amount);
      if (utr) formData.append("utr", utr);

      const token = localStorage.getItem("token") || "your_jwt_token_here";

      const response = await fetch(`${API_BASE_URL}/api/registrations/payment`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (response.status === 201) {
        setSuccess("Payment submitted successfully! Redirecting back to dashboard...");
        setFile(null);
        setPreviewUrl(null);
        setAmount("");
        setUtr("");
        
        setTimeout(() => {
          window.location.href = '/user/account';
        }, 2000);
      } else {
        const errorData = await response.json().catch(() => null);
        setError(errorData?.message || `Error: ${response.status} ${response.statusText}`);
      }
    } catch (err) {
      console.error("Payment submission failed:", err);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-full p-8 bg-white/40 backdrop-blur-xl border border-white/60 rounded-3xl shadow-[0_8px_32px_rgba(0,100,150,0.15)] relative flex flex-col">
      <h2 className="text-2xl md:text-3xl font-extrabold text-cyan-950 mb-8 tracking-wide text-center uppercase">
        Payment Submission
      </h2>
      
      {error && (
        <div className="mb-6 p-4 text-sm text-red-700 bg-red-100/70 backdrop-blur-sm border border-red-300 rounded-xl flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
          {error}
        </div>
      )}
      
      {success && (
        <div className="mb-6 p-4 text-sm text-teal-800 bg-teal-100/70 backdrop-blur-sm border border-teal-300 rounded-xl flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-teal-500 animate-pulse"></div>
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* File Upload Field */}
        <div className="relative">
          <label className="block text-sm font-semibold text-cyan-900 mb-2 uppercase tracking-wider">
            Payment Screenshot (Required)
          </label>
          <div className="flex items-center justify-center w-full relative group/upload">
            <label
              htmlFor="dropzone-file"
              className={`flex flex-col items-center justify-center w-full h-56 border-2 border-dashed cursor-pointer rounded-2xl bg-white/30 hover:bg-white/50 transition-all duration-300 ${
                previewUrl ? "border-cyan-400 bg-cyan-50/50" : "border-cyan-400/40 hover:border-cyan-500"
              }`}
            >
              {previewUrl ? (
                <div className="relative w-full h-full p-2">
                  <img
                    src={previewUrl}
                    alt="Payment Preview"
                    className="w-full h-full object-contain rounded-xl drop-shadow-md"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-cyan-900/40 opacity-0 group-hover/upload:opacity-100 transition-opacity duration-300 rounded-xl backdrop-blur-sm">
                    <span className="text-white text-sm font-semibold tracking-wider">Change Image</span>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center pt-5 pb-6 text-cyan-800 group-hover/upload:text-cyan-900 transition-colors">
                  <svg
                    className="w-10 h-10 mb-4 opacity-70 group-hover/upload:opacity-100 transition-opacity text-cyan-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path>
                  </svg>
                  <p className="mb-2 text-sm font-semibold tracking-wide">Click to upload screenshot</p>
                  <p className="text-xs text-cyan-700/80">JPG, PNG or JPEG</p>
                </div>
              )}
              <input
                id="dropzone-file"
                type="file"
                accept=".jpg, .jpeg, .png"
                className="hidden"
                onChange={handleFileChange}
              />
            </label>
          </div>
        </div>

        {/* Amount Field */}
        <div>
          <label htmlFor="amount" className="block text-sm font-semibold text-cyan-900 mb-2 uppercase tracking-wider">
            Amount Paid (Required)
          </label>
          <div className="relative flex items-center bg-white/40 hover:bg-white/60 focus-within:bg-white/70 border border-white/60 focus-within:border-cyan-400 rounded-xl transition-all duration-300 shadow-sm">
             <div className="pl-4 pr-2 text-cyan-700 font-bold">₹</div>
            <input
              type="number"
              name="amount"
              id="amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="block w-full py-3.5 bg-transparent text-cyan-950 focus:outline-none focus:ring-0 font-medium sm:text-sm placeholder-cyan-800/40"
              placeholder="0.00"
              min="0"
              step="any"
              required
            />
          </div>
        </div>

        {/* UTR Field */}
        <div>
          <label htmlFor="utr" className="block text-sm font-semibold text-cyan-900 mb-2 uppercase tracking-wider">
            UTR Number (Required)
          </label>
          <div className="relative flex items-center bg-white/40 hover:bg-white/60 focus-within:bg-white/70 border border-white/60 focus-within:border-cyan-400 rounded-xl transition-all duration-300 shadow-sm">
            <input
              type="text"
              name="utr"
              id="utr"
              value={utr}
              onChange={(e) => setUtr(e.target.value)}
              className="block w-full px-4 py-3.5 bg-transparent text-cyan-950 focus:outline-none focus:ring-0 font-medium sm:text-sm placeholder-cyan-800/40"
              placeholder="e.g. 123456789012"
              required
            />
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading || !file || !amount || !utr}
          className={`w-full py-4 px-6 rounded-xl flex items-center justify-center font-bold tracking-widest uppercase transition-all duration-300 shadow-md border ${
            loading || !file || !amount || !utr
              ? "bg-teal-800/40 border-teal-700/30 text-teal-100/50 cursor-not-allowed"
              : "bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-500 hover:to-cyan-500 border-teal-500/50 text-white shadow-[0_4px_15px_rgba(13,148,136,0.4)] hover:shadow-[0_6px_20px_rgba(13,148,136,0.6)]"
          }`}
        >
          {loading ? (
            <span className="flex items-center gap-3">
              <svg className="animate-spin h-5 w-5 text-teal-200" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Submitting...
            </span>
          ) : (
            "Submit Payment"
          )}
        </button>
      </form>
    </div>
  );
}
