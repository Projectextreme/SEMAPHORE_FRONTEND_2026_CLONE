"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from 'next/navigation';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://13.201.89.79';

export default function MyRegistration({ user: initialUser }) {
  const [fetchedUserData, setFetchedUserData] = useState(null);
  const [fetchedEvents, setFetchedEvents] = useState(null);
  const [loading, setLoading] = useState(!initialUser);
  const [error, setError] = useState(null);

  // Modal state for viewing payment screenshot & details
  const [activeProofModal, setActiveProofModal] = useState(null);

  const router = useRouter();

  const userData = fetchedUserData || initialUser || null;
  const events = useMemo(
    () => (fetchedEvents !== null ? fetchedEvents : (initialUser?.registeredEvents || initialUser?.registrations || [])),
    [fetchedEvents, initialUser]
  );

  // Fetch verifyuser to get full populated registration & payment details
  useEffect(() => {
    const fetchVerifiedUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error("No authorization token found");

        const response = await fetch(`${API_BASE_URL}/api/auth/verifyuser`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to verify user registrations");
        }

        const verifiedUserObj = data.user || data;
        setFetchedUserData(verifiedUserObj);

        const regEvents = verifiedUserObj.registeredEvents || data.registeredEvents || data.registrations || [];
        setFetchedEvents(regEvents);
      } catch (err) {
        console.error("verifyuser fetch error:", err);
        // Fallback to /api/registrations if verifyuser fails or doesn't have events
        try {
          const token = localStorage.getItem('token');
          if (token) {
            const fallbackRes = await fetch(`${API_BASE_URL}/api/registrations`, {
              headers: { Authorization: `Bearer ${token}` }
            });
            const fallbackData = await fallbackRes.json();
            if (fallbackRes.ok && fallbackData.registration) {
              setFetchedEvents(fallbackData.registration.events || []);
            }
          }
        } catch (fallbackErr) {
          setError(err.message);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchVerifiedUserData();
  }, []);

  // Helper to extract clean payment info from a registration item
  const getPaymentInfo = (item) => {
    if (!item || !item.paymentId) return null;
    let p = item.paymentId;
    if (Array.isArray(p)) {
      p = p[0];
    }
    if (!p) return null;

    if (typeof p === 'string') {
      return {
        id: p,
        amount: null,
        utr: null,
        imageUrl: null,
        status: 'pending',
        message: ''
      };
    }

    return {
      id: p._id || p.id,
      amount: p.amount,
      utr: p.utr,
      imageUrl: p.imageUrl || p.imageurl,
      status: p.status || 'pending',
      message: p.message || ''
    };
  };

  // Group registrations by paymentId so multiple events sharing one payment are grouped together
  const { paidGroups, unpaidEvents } = useMemo(() => {
    const paidGroupsMap = {};
    const unpaidList = [];

    events.forEach(item => {
      const pInfo = getPaymentInfo(item);
      if (pInfo && pInfo.id) {
        if (!paidGroupsMap[pInfo.id]) {
          paidGroupsMap[pInfo.id] = {
            payment: pInfo,
            events: []
          };
        }
        // Avoid duplicate event entries in same payment group
        const exists = paidGroupsMap[pInfo.id].events.some(
          e => (e._id || e.eventId?._id) === (item._id || item.eventId?._id)
        );
        if (!exists) {
          paidGroupsMap[pInfo.id].events.push(item);
        }
      } else {
        unpaidList.push(item);
      }
    });

    return {
      paidGroups: Object.values(paidGroupsMap),
      unpaidEvents: unpaidList
    };
  }, [events]);

  const totalUnpaidAmount = unpaidEvents.reduce((sum, item) => {
    return sum + (item.eventId?.registrationFee || 0);
  }, 0);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center p-12">
        <p className="text-cyan-800 font-bold animate-pulse uppercase tracking-widest text-sm">Verifying User & Registrations...</p>
      </div>
    );
  }

  if (error && events.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="bg-white/40 backdrop-blur-md p-6 rounded-3xl border border-red-300 text-center shadow-lg max-w-md w-full">
          <p className="text-red-600 font-bold mb-2">Error loading registrations</p>
          <p className="text-xs text-red-500/80">{error}</p>
        </div>
      </div>
    );
  }

  const teamNameStr = userData?.teamName || userData?.team?.name;
  const teamCodeStr = userData?.teamIdString || userData?.team?.teamid;

  return (
    <div className="flex-1 flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-1">
        <h1 className="text-2xl md:text-3xl font-extrabold text-cyan-950 tracking-wide">
          Events Registered ({events.length})
        </h1>
        {teamNameStr && (
          <div className="inline-flex items-center gap-2 bg-white/60 border border-cyan-300 px-3.5 py-1.5 rounded-2xl text-xs font-bold text-cyan-900 shadow-sm">
            <svg className="w-4 h-4 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span>Team: {teamNameStr}</span>
            {teamCodeStr && (
              <span className="text-[10px] font-mono text-teal-700 bg-teal-50 px-1.5 py-0.5 rounded border border-teal-200">
                {teamCodeStr}
              </span>
            )}
          </div>
        )}
      </div>

      {events.length === 0 ? (
        <div className="bg-white/40 backdrop-blur-xl border border-white/60 rounded-3xl p-10 text-center text-cyan-800 font-medium">
          You haven&apos;t registered for any events yet.
        </div>
      ) : (
        <div className="flex flex-col gap-6">

          {/* Render Paid Event Groups (Events sharing the same paymentId grouped together) */}
          {paidGroups.map((group, idx) => {
            const { payment, events: groupEvents } = group;
            const isApproved = payment.status === 'approved' || payment.status === 'verified';
            const isPending = payment.status === 'pending' || payment.status === 'submitted';

            return (
              <div
                key={payment.id || idx}
                className="bg-white/50 backdrop-blur-xl border border-cyan-200/80 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col gap-5 relative overflow-hidden"
              >
                {/* Group Header: Payment Summary & Proof CTA */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-cyan-200/50">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-bold uppercase tracking-wider text-cyan-900">
                        Payment Transaction ({groupEvents.length} Event{groupEvents.length > 1 ? 's' : ''})
                      </span>
                      {isApproved ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold bg-green-100 text-green-700 px-2.5 py-0.5 rounded-full border border-green-200">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                          Verified & Approved
                        </span>
                      ) : isPending ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold bg-yellow-100 text-yellow-700 px-2.5 py-0.5 rounded-full border border-yellow-200">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                          Verification Pending
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold bg-red-100 text-red-700 px-2.5 py-0.5 rounded-full border border-red-200">
                          Payment Status: {payment.status}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-3 text-xs font-medium text-cyan-800 flex-wrap mt-1">
                      {payment.utr && (
                        <span><strong className="text-cyan-950">UTR:</strong> <code className="bg-cyan-100/70 px-1.5 py-0.5 rounded text-cyan-900 font-mono font-bold">{payment.utr}</code></span>
                      )}
                      {payment.amount && (
                        <span><strong className="text-cyan-950">Amount:</strong> ₹{payment.amount}</span>
                      )}
                    </div>
                  </div>

                  {/* Payment Image Proof Thumbnail / View Button */}
                  {payment.imageUrl && (
                    <button
                      onClick={() => setActiveProofModal({ imageUrl: payment.imageUrl, utr: payment.utr, amount: payment.amount, status: payment.status, message: payment.message })}
                      className="flex items-center gap-2 px-3.5 py-2 bg-cyan-100/80 hover:bg-cyan-200/80 text-cyan-900 rounded-2xl text-xs font-bold transition-all border border-cyan-300/60 shadow-sm shrink-0"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={payment.imageUrl}
                        alt="Proof Thumbnail"
                        className="w-6 h-6 object-cover rounded-lg border border-white shadow-xs"
                      />
                      <span>View Payment Proof</span>
                      <svg className="w-3.5 h-3.5 text-cyan-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </button>
                  )}
                </div>

                {/* List of Events sharing this payment */}
                <div className="flex flex-col gap-3">
                  {groupEvents.map((item, eIdx) => {
                    const ev = item.eventId || {};
                    const dateStr = item.createdAt || item.addedAt 
                      ? new Date(item.createdAt || item.addedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
                      : null;

                    return (
                      <div key={item._id || eIdx} className="bg-white/60 rounded-2xl p-4 border border-white/80 flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-cyan-100/90 text-cyan-700 font-extrabold flex items-center justify-center text-lg shrink-0 border border-white">
                            {ev.title ? ev.title.charAt(0).toUpperCase() : '?'}
                          </div>
                          <div>
                            <h4 className="text-base font-extrabold text-cyan-950">{ev.title || 'Event Registration'}</h4>
                            <p className="text-xs text-cyan-800/80 font-medium">
                              {ev.registrationFee ? `Fee: ₹${ev.registrationFee}` : 'Registered Event'}
                              {dateStr ? ` • ${dateStr}` : ''}
                            </p>
                          </div>
                        </div>
                        <span className="text-xs font-bold text-teal-800 bg-teal-50 px-2.5 py-1 rounded-lg border border-teal-200/60 shrink-0">
                          Linked to Payment
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}

          {/* Render Unpaid Events Section */}
          {unpaidEvents.map((eventItem, index) => {
            const ev = eventItem.eventId || {};
            const dateStr = eventItem.addedAt || eventItem.createdAt
              ? new Date(eventItem.addedAt || eventItem.createdAt).toLocaleDateString('en-US', {
                year: 'numeric', month: 'long', day: 'numeric'
              })
              : null;

            return (
              <div key={ev._id || index} className="bg-white/40 backdrop-blur-xl border border-white/60 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col sm:flex-row sm:items-center gap-6">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-100 to-blue-50 flex items-center justify-center text-cyan-600 font-extrabold text-2xl border border-white shadow-inner shrink-0">
                  {ev.title ? ev.title.charAt(0).toUpperCase() : '?'}
                </div>
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-1.5 gap-2">
                    <h3 className="text-lg font-extrabold text-cyan-950">{ev.title || 'Unknown Event'}</h3>
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold bg-red-100 text-red-700 px-3 py-1 rounded-full border border-red-200 whitespace-nowrap self-start">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                      Payment Required
                    </span>
                  </div>
                  {dateStr && (
                    <p className="text-sm text-cyan-800/90 flex items-center gap-2.5 mb-1.5 font-medium">
                      <svg className="w-4 h-4 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                      Registered: {dateStr}
                    </p>
                  )}
                  <p className="text-sm text-cyan-800/90 flex items-center gap-2.5 font-medium">
                    <svg className="w-4 h-4 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                    {ev.location || 'TBA'} {ev.registrationFee ? `| Fee: ₹${ev.registrationFee}` : ''}
                  </p>
                </div>
              </div>
            );
          })}

        </div>
      )}

      {/* Summary & Checkout Section */}
      <div className="bg-white/40 backdrop-blur-xl border border-white/60 rounded-3xl p-6 mt-2 shadow-sm">
        <div className="flex justify-between items-start mb-5">
          <h3 className="text-lg font-extrabold text-cyan-950 mt-1">Registration Dues Summary</h3>
          <div className="flex flex-col items-end gap-2">
            <span className="text-lg font-extrabold text-teal-700 bg-white/50 px-4 py-1.5 rounded-xl border border-white shadow-sm">
              Total Due: ₹{totalUnpaidAmount}
            </span>
          </div>
        </div>
        
        {totalUnpaidAmount > 0 ? (
          <button
            className="w-full py-3.5 rounded-xl border mb-5 uppercase tracking-widest text-sm shadow-inner transition-all bg-gradient-to-r from-cyan-500 to-blue-500 text-white cursor-pointer hover:shadow-md border-transparent hover:from-cyan-400 hover:to-blue-400 font-bold"
            onClick={() => {
              const unpaidIds = unpaidEvents.map(item => item.eventId?._id || item.eventId).filter(Boolean);
              sessionStorage.setItem('pendingPaymentAmount', totalUnpaidAmount);
              sessionStorage.setItem('pendingEventIds', JSON.stringify(unpaidIds));
              router.push('/user/account/payment');
            }}
          >
            <span className="flex items-center justify-center gap-2 font-bold">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"></path></svg>
              Pay Dues to Confirm Registrations (₹{totalUnpaidAmount})
            </span>
          </button>
        ) : (
          <button
            className="w-full py-3.5 rounded-xl border mb-5 uppercase tracking-widest text-sm shadow-inner transition-all bg-cyan-700/10 text-cyan-800/50 border-white/40 cursor-not-allowed font-bold"
            disabled
          >
            <span className="flex items-center justify-center gap-2 font-bold">
              All Registrations Paid & Up to Date
            </span>
          </button>
        )}
      </div>

      {/* Payment Proof Modal Lightbox */}
      {activeProofModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white/95 backdrop-blur-2xl border border-white rounded-3xl max-w-lg w-full p-6 shadow-2xl relative flex flex-col gap-4">
            <div className="flex justify-between items-center border-b border-cyan-100 pb-3">
              <h3 className="text-lg font-extrabold text-cyan-950 uppercase tracking-wide">
                Payment Proof Screenshot
              </h3>
              <button
                onClick={() => setActiveProofModal(null)}
                className="w-8 h-8 rounded-full bg-cyan-100/80 hover:bg-cyan-200 text-cyan-900 font-bold flex items-center justify-center transition-all"
              >
                ✕
              </button>
            </div>

            {/* Screenshot Display */}
            <div className="relative w-full max-h-80 overflow-hidden rounded-2xl bg-cyan-950/5 border border-cyan-200 flex items-center justify-center p-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={activeProofModal.imageUrl}
                alt="Payment Proof Screenshot"
                className="max-h-72 w-auto object-contain rounded-xl shadow-md"
              />
            </div>

            {/* Proof Metadata */}
            <div className="bg-cyan-50/80 border border-cyan-200/80 rounded-2xl p-4 flex flex-col gap-2 text-xs text-cyan-900 font-medium">
              {activeProofModal.utr && (
                <div className="flex justify-between items-center">
                  <span className="font-bold uppercase tracking-wider text-cyan-800">UTR Number:</span>
                  <code className="bg-white px-2 py-0.5 rounded border border-cyan-200 font-mono font-bold text-cyan-950">{activeProofModal.utr}</code>
                </div>
              )}
              {activeProofModal.amount && (
                <div className="flex justify-between items-center">
                  <span className="font-bold uppercase tracking-wider text-cyan-800">Amount Paid:</span>
                  <span className="font-extrabold text-teal-800 text-sm">₹{activeProofModal.amount}</span>
                </div>
              )}
              {activeProofModal.status && (
                <div className="flex justify-between items-center">
                  <span className="font-bold uppercase tracking-wider text-cyan-800">Status:</span>
                  <span className={`font-bold px-2 py-0.5 rounded text-[11px] uppercase ${
                    ['approved', 'verified'].includes(activeProofModal.status) 
                      ? 'bg-green-100 text-green-800 border border-green-200' 
                      : 'bg-yellow-100 text-yellow-800 border border-yellow-200'
                  }`}>
                    {activeProofModal.status}
                  </span>
                </div>
              )}
              {activeProofModal.message && (
                <div className="flex flex-col gap-0.5 pt-1 border-t border-cyan-200/60">
                  <span className="font-bold uppercase tracking-wider text-cyan-800">Remarks:</span>
                  <p className="text-cyan-950 font-normal">{activeProofModal.message}</p>
                </div>
              )}
            </div>

            <div className="flex justify-between items-center gap-3 pt-2">
              <a
                href={activeProofModal.imageUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 text-center py-2.5 bg-cyan-100 hover:bg-cyan-200 text-cyan-900 rounded-xl font-bold text-xs uppercase tracking-wider border border-cyan-300/60 transition-all"
              >
                Open Original Image ↗
              </a>
              <button
                onClick={() => setActiveProofModal(null)}
                className="py-2.5 px-6 bg-cyan-900 hover:bg-cyan-950 text-white rounded-xl font-bold text-xs uppercase tracking-wider transition-all"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
