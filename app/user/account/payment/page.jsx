"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import PaymentSubmission from '@/components/payment/PaymentSubmission';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://13.201.89.79';

export default function PaymentPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      router.push('/user/register');
      return;
    }

    const verifyUser = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/auth/verifyuser`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();

        if (!response.ok) throw new Error(data.message || 'Session expired');
      } catch (err) {
        setError(err.message);
        localStorage.removeItem('token');
        setTimeout(() => router.push('/user/register'), 1500);
      } finally {
        setLoading(false);
      }
    };

    verifyUser();
  }, [router]);

  if (loading) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-cyan-100 via-blue-50 to-teal-50 flex items-center justify-center">
        <p className="text-cyan-800 font-bold tracking-widest uppercase animate-pulse">Verifying Access...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-cyan-100 via-blue-50 to-teal-50 flex items-center justify-center p-4">
        <div className="bg-white/40 backdrop-blur-xl p-8 rounded-3xl border border-white/60 text-center max-w-sm w-full shadow-lg">
          <p className="text-red-600 font-bold mb-3">{error}</p>
          <p className="text-cyan-800 font-medium text-sm">Redirecting to login...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen bg-gradient-to-br from-cyan-100 via-blue-50 to-teal-50 overflow-hidden flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      {/* Decorative noise/texture overlay for the background */}
      <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] mix-blend-overlay pointer-events-none"></div>
      
      <div className="w-full max-w-2xl relative z-10">
        <PaymentSubmission />
      </div>
    </main>
  );
}
