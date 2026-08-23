"use client";

import React, { useState, useEffect } from "react";

import { useRouter } from 'next/navigation';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://13.201.89.79';

export default function MyRegistration() {
  const [events, setEvents] = useState([]);
  const [paymentStatus, setPaymentStatus] = useState("pending");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchRegistrations = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error("No authorization token found");

        const response = await fetch(`${API_BASE_URL}/api/registrations`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch registrations");
        }

        if (data.registration) {
          setEvents(data.registration.events || []);
          setPaymentStatus(data.registration.paymentStatus || "pending");
        } else {
          setEvents([]);
          setPaymentStatus("pending");
        }
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRegistrations();
  }, []);

  const totalAmount = events.reduce((sum, item) => {
    // Exclude events that already have a paymentId (already paid for)
    if (item.paymentId) return sum;
    return sum + (item.eventId?.registrationFee || 0);
  }, 0);

  // Status info is now simplified as we always show the Pay button if amount > 0
  let statusInfo = {
    title: totalAmount > 0 ? `Payment Required: ₹${totalAmount}` : "All Caught Up!",
    desc: totalAmount > 0 
      ? "Please complete your payment to finalize registration." 
      : "You have no outstanding dues for your registered events."
  };

  if (!loading && events.length === 0) {
    statusInfo = {
      title: "No Events Registered",
      desc: "Register for an event to generate a payment summary."
    };
  }

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-cyan-800 font-bold animate-pulse uppercase tracking-widest">Loading Events...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="bg-white/40 backdrop-blur-md p-6 rounded-3xl border border-red-300 text-center shadow-lg">
          <p className="text-red-600 font-bold mb-2">Error loading events</p>
          <p className="text-sm text-red-500/80">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col gap-6">
      <div className="flex justify-between items-center mb-2">
        <h1 className="text-2xl md:text-3xl font-extrabold text-cyan-950 tracking-wide">
          Events Registered ({events.length})
        </h1>
      </div>

      <div className="flex flex-col gap-5">
        {events.length === 0 ? (
          <div className="bg-white/40 backdrop-blur-xl border border-white/60 rounded-3xl p-10 text-center text-cyan-800 font-medium">
            You haven&apos;t registered for any events yet.
          </div>
        ) : (
          events.map((eventItem, index) => {
            const ev = eventItem.eventId || {};
            const dateStr = new Date(eventItem.addedAt).toLocaleDateString('en-US', {
              year: 'numeric', month: 'long', day: 'numeric',
              hour: '2-digit', minute: '2-digit'
            });

            return (
              <div key={ev._id || index} className="bg-white/40 backdrop-blur-xl border border-white/60 rounded-3xl p-6 shadow-sm hover:shadow-[0_8px_24px_rgba(0,100,150,0.1)] transition-all flex flex-col sm:flex-row sm:items-center gap-6">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-100 to-blue-50 flex items-center justify-center text-cyan-600 font-extrabold text-2xl border border-white shadow-inner shrink-0">
                  {ev.title ? ev.title.charAt(0).toUpperCase() : '?'}
                </div>
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-1.5 gap-2">
                    <h3 className="text-lg font-extrabold text-cyan-950">{ev.title || 'Unknown Event'}</h3>
                    {(() => {
                      // If there's a payment attached
                      if (eventItem.paymentId) {
                        // Check if the individual payment is verified or the overall status is verified
                        const isVerified = 
                          (eventItem.paymentId.status === 'verified' || eventItem.paymentId.status === 'approved') || 
                          (paymentStatus === 'verified' || paymentStatus === 'approved');
                        
                        if (isVerified) {
                          return (
                            <span className="inline-flex items-center gap-1.5 text-xs font-bold bg-green-100 text-green-700 px-3 py-1 rounded-full border border-green-200 whitespace-nowrap self-start">
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                              Paid & Verified
                            </span>
                          );
                        } else {
                          return (
                            <span className="inline-flex items-center gap-1.5 text-xs font-bold bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full border border-yellow-200 whitespace-nowrap self-start">
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                              Verification Pending
                            </span>
                          );
                        }
                      }
                      
                      // If no payment attached at all
                      return (
                        <span className="inline-flex items-center gap-1.5 text-xs font-bold bg-red-100 text-red-700 px-3 py-1 rounded-full border border-red-200 whitespace-nowrap self-start">
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                          Payment Required
                        </span>
                      );
                    })()}
                  </div>
                  <p className="text-sm text-cyan-800/90 flex items-center gap-2.5 mb-1.5 font-medium">
                    <svg className="w-4 h-4 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                    Registered: {dateStr}
                  </p>
                  <p className="text-sm text-cyan-800/90 flex items-center gap-2.5 font-medium">
                    <svg className="w-4 h-4 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                    {ev.location || 'TBA'} {ev.registrationFee ? `| Fee: ₹${ev.registrationFee}` : ''}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>

      <div className="bg-white/40 backdrop-blur-xl border border-white/60 rounded-3xl p-6 mt-2 shadow-sm">
        <div className="flex justify-between items-start mb-5">
          <h3 className="text-lg font-extrabold text-cyan-950 mt-1">Registration Payment Summary</h3>
          <div className="flex flex-col items-end gap-2">
            <span className="text-lg font-extrabold text-teal-700 bg-white/50 px-4 py-1.5 rounded-xl border border-white shadow-sm">
              Total Due: ₹{totalAmount}
            </span>
            {['submitted', 'approved'].includes(paymentStatus) && (
              <span className="text-xs font-bold bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full border border-yellow-200">
                Verification Pending
              </span>
            )}
            {paymentStatus === 'verified' && (
              <span className="text-xs font-bold bg-green-100 text-green-700 px-3 py-1 rounded-full border border-green-200">
                Verified
              </span>
            )}
          </div>
        </div>
        
        {totalAmount > 0 ? (
          <button
            className="w-full py-3.5 rounded-xl border mb-5 uppercase tracking-widest text-sm shadow-inner transition-all bg-gradient-to-r from-cyan-500 to-blue-500 text-white cursor-pointer hover:shadow-md border-transparent hover:from-cyan-400 hover:to-blue-400"
            onClick={() => {
              const unpaidEventIds = events.filter(item => !item.paymentId).map(item => item.eventId?._id || item.eventId).filter(Boolean);
              sessionStorage.setItem('pendingPaymentAmount', totalAmount);
              sessionStorage.setItem('pendingEventIds', JSON.stringify(unpaidEventIds));
              router.push('/user/account/payment');
            }}
          >
            <span className="flex items-center justify-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"></path></svg>
              Pay to Confirm Registration
            </span>
          </button>
        ) : (
          <button
            className="w-full py-3.5 rounded-xl border mb-5 uppercase tracking-widest text-sm shadow-inner transition-all bg-cyan-700/10 text-cyan-800/50 border-white/40 cursor-not-allowed"
            disabled
          >
            <span className="flex items-center justify-center gap-2">
              No Action Needed
            </span>
          </button>
        )}
        <p className="font-bold text-cyan-950 text-sm mb-1">{statusInfo.title}</p>
        <p className="text-xs text-cyan-800/80 font-medium">{statusInfo.desc}</p>
      </div>


    </div>
  );
}
