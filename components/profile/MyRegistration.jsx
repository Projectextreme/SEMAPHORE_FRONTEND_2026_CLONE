"use client";

import React, { useState, useEffect } from "react";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://13.201.89.79';

export default function MyRegistration() {
  const [events, setEvents] = useState([]);
  const [paymentStatus, setPaymentStatus] = useState("pending");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showQRModal, setShowQRModal] = useState(false);

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

  const totalAmount = events.reduce((sum, item) => sum + (item.eventId?.registrationFee || 0), 0);

  const getStatusDisplay = (status, amount) => {
    switch (status) {
      case 'submitted':
        return {
          title: "Payment Submitted (Pending Verification)",
          desc: "Your payment screenshot has been uploaded and is waiting for admin approval.",
          btnText: "Verification Pending",
          btnColor: "bg-yellow-600/10 text-yellow-700/80 border-yellow-400/40 cursor-not-allowed"
        };
      case 'verified':
        return {
          title: "Overall Payment Status: All Payments Completed. Thank you for your registrations.",
          desc: "Payment status: Fully Paid. No outstanding dues.",
          btnText: "Complete Payment (No Action Needed)",
          btnColor: "bg-cyan-700/10 text-cyan-800/50 border-white/40 cursor-not-allowed"
        };
      default:
        return {
          title: amount > 0 ? `Payment Required: ₹${amount}` : "Payment Required",
          desc: "Please complete your payment to finalize registration.",
          btnText: "Pay to Confirm Registration",
          btnColor: "bg-gradient-to-r from-cyan-500 to-blue-500 text-white cursor-pointer hover:shadow-md border-transparent hover:from-cyan-400 hover:to-blue-400"
        };
    }
  };

  let statusInfo;
  if (!loading && events.length === 0) {
    statusInfo = {
      title: "No Events Registered",
      desc: "Register for an event to generate a payment summary.",
      btnText: "No Payment Required",
      btnColor: "bg-cyan-700/10 text-cyan-800/50 border-white/40 cursor-not-allowed"
    };
  } else {
    statusInfo = getStatusDisplay(paymentStatus, totalAmount);
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
                  <h3 className="text-lg font-extrabold text-cyan-950 mb-1.5">{ev.title || 'Unknown Event'}</h3>
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
        <div className="flex justify-between items-center mb-5">
          <h3 className="text-lg font-extrabold text-cyan-950">Registration Payment Summary</h3>
          <span className="text-lg font-extrabold text-teal-700 bg-white/50 px-4 py-1.5 rounded-xl border border-white shadow-sm">
            Total: ₹{totalAmount}
          </span>
        </div>
        <button
          className={`w-full py-3.5 rounded-xl border mb-5 uppercase tracking-widest text-sm shadow-inner transition-all ${statusInfo.btnColor}`}
          disabled={paymentStatus !== 'pending' || events.length === 0}
          onClick={() => {
            if (paymentStatus === 'pending' && events.length > 0) {
              setShowQRModal(true);
            }
          }}
        >
          <span className="flex items-center justify-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"></path></svg>
            {statusInfo.btnText}
          </span>
        </button>
        <p className="font-bold text-cyan-950 text-sm mb-1">{statusInfo.title}</p>
        <p className="text-xs text-cyan-800/80 font-medium">{statusInfo.desc}</p>
      </div>

      {showQRModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-cyan-950/40 backdrop-blur-md">
          <div className="bg-white/90 backdrop-blur-xl border border-white/80 rounded-3xl p-8 max-w-sm w-full shadow-[0_20px_60px_rgba(0,100,150,0.2)] flex flex-col items-center">
            <h3 className="text-xl font-extrabold text-cyan-950 mb-2">Scan to Pay</h3>
            <p className="text-sm text-cyan-800 mb-6 text-center font-medium">
              Scan the QR code below to make a payment of <span className="font-bold text-teal-700">₹{totalAmount}</span> using any UPI app.
            </p>

            <div className="bg-white p-3 rounded-2xl shadow-sm border border-cyan-100 mb-6">
              <img
                src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=upi://pay?pa=semaphore@upi&pn=Semaphore&cu=INR"
                alt="Payment QR Code"
                className="w-48 h-48 object-contain"
              />
            </div>

            <button
              onClick={() => {
                setShowQRModal(false);
                window.location.href = '/user/account/payment';
              }}
              className="w-full py-3 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-500 hover:to-cyan-500 text-white font-bold rounded-xl shadow-md transition-all uppercase tracking-wider text-sm"
            >
              Done
            </button>
            <button
              onClick={() => setShowQRModal(false)}
              className="mt-4 text-sm font-bold text-cyan-700/70 hover:text-cyan-900 transition-all uppercase tracking-wider"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
