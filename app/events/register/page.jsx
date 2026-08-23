"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import WaterWave from '@/components/WaterWaveWrapper';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://13.201.89.79';

export default function EventsPage() {
  const router = useRouter();

  const [events, setEvents] = useState([]);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [registeredEventIds, setRegisteredEventIds] = useState([]);
  const [globalPaymentStatus, setGlobalPaymentStatus] = useState(null);
  const [globalPendingAmount, setGlobalPendingAmount] = useState(0);

  // Track which event has its registration form open
  const [expandedEventId, setExpandedEventId] = useState(null);

  // Registration form state for all events (Dictionary: eventId -> participants array)
  const [formsData, setFormsData] = useState({});

  // Global submit state
  const [submitting, setSubmitting] = useState(false);
  const [globalError, setGlobalError] = useState(null);
  const [globalSuccess, setGlobalSuccess] = useState(null);

  useEffect(() => {
    // Auth check
    const token = localStorage.getItem('token');
    if (!token) {
      const redirectUrl = encodeURIComponent(window.location.pathname);
      router.push(`/user/register?redirect=${redirectUrl}`);
      return;
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsAuthorized(true);

    async function fetchEvents() {
      try {
        const res = await fetch(`${API_BASE_URL}/api/events`);
        const data = await res.json();

        if (res.ok) {
          setEvents(data.data || data.events || []);
        } else {
          setEvents([]);
          console.error("Failed to load events", data);
        }

        // Check for global draft in localStorage
        const savedDraft = localStorage.getItem('event_cart_draft');
        if (savedDraft) {
          try {
            const parsed = JSON.parse(savedDraft);
            if (typeof parsed === 'object') {
              setFormsData(parsed);
            }
          } catch (err) {
            console.error("Failed to parse draft", err);
          }
        }

        // Fetch user registrations
        try {
          const regRes = await fetch(`${API_BASE_URL}/api/registrations`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          if (regRes.ok) {
            const regData = await regRes.json();
            if (regData.registration && regData.registration.events) {
              const ids = regData.registration.events.map(e => e.eventId._id || e.eventId);
              setRegisteredEventIds(ids);
              setGlobalPaymentStatus(regData.registration.paymentStatus);
              
              if (regData.registration.paymentStatus === 'pending') {
                // Try to sum registrationFee from populated events if available
                const total = regData.registration.events.reduce((sum, e) => {
                  if (e.paymentId) return sum; // Skip if already paid
                  return sum + (e.eventId.registrationFee || 0);
                }, 0);
                setGlobalPendingAmount(total);
              }
            }
          }
        } catch (err) {
          console.error("Failed to fetch registrations", err);
        }
      } catch (err) {
        console.error("Failed to load events", err);
      } finally {
        setLoadingEvents(false);
      }
    }
    fetchEvents();
  }, [router]);

  if (!isAuthorized) {
    return (
      <div style={styles.page}>
        <div style={styles.container}>
          <p style={{ color: '#8fb3c7', textAlign: 'center', marginTop: 40 }}>Redirecting to login...</p>
        </div>
      </div>
    );
  }

  const toggleEventForm = (event) => {
    if (expandedEventId === event._id) {
      setExpandedEventId(null);
    } else {
      setExpandedEventId(event._id);

      // Initialize participants if not already present in formsData
      if (!formsData[event._id]) {
        const initialParticipants = Array.from({ length: event.minParticipants || 1 }).map(() => ({
          name: '', email: '', phone: ''
        }));
        setFormsData(prev => ({
          ...prev,
          [event._id]: initialParticipants
        }));
      }
    }
  };

  const handleAddParticipant = (event) => {
    const currentList = formsData[event._id] || [];
    if (currentList.length < event.maxParticipants) {
      setFormsData({
        ...formsData,
        [event._id]: [...currentList, { name: '', email: '', phone: '' }]
      });
    }
  };

  const handleRemoveParticipant = (index, event) => {
    const currentList = formsData[event._id] || [];
    if (currentList.length > event.minParticipants) {
      const updated = [...currentList];
      updated.splice(index, 1);
      setFormsData({
        ...formsData,
        [event._id]: updated
      });
    }
  };

  const handleChange = (index, field, value, eventId) => {
    const currentList = formsData[eventId] || [];
    const updated = [...currentList];
    updated[index][field] = value;
    setFormsData({
      ...formsData,
      [eventId]: updated
    });
  };

  const handleSaveDraft = () => {
    localStorage.setItem('event_cart_draft', JSON.stringify(formsData));
    setGlobalSuccess("Draft saved securely to your browser.");
    setTimeout(() => setGlobalSuccess(null), 3000);
  };

  // Validation function for a single event form
  const isFormValid = (eventId) => {
    const participants = formsData[eventId];
    if (!participants || !Array.isArray(participants)) return false;

    const event = events.find(e => e._id === eventId);
    if (!event) return false;

    if (participants.length < event.minParticipants || participants.length > event.maxParticipants) return false;

    for (let p of participants) {
      if (!p.name.trim() || !p.email.trim() || !p.phone.trim()) {
        return false;
      }
    }
    return true;
  };

  // Calculate Total Amount based on correctly filled events
  const calculateTotal = () => {
    let total = 0;
    for (const event of events) {
      if (!registeredEventIds.includes(event._id) && isFormValid(event._id)) {
        total += (event.registrationFee || 0);
      }
    }
    return total;
  };

  const getValidForms = () => {
    const valid = [];
    for (const event of events) {
      if (!registeredEventIds.includes(event._id) && isFormValid(event._id)) {
        valid.push({ event, participants: formsData[event._id] });
      }
    }
    return valid;
  };

  const handleCheckout = async () => {
    setSubmitting(true);
    setGlobalError(null);
    setGlobalSuccess(null);

    const validForms = getValidForms();

    if (validForms.length === 0) {
      setGlobalError("You haven't correctly filled out any event registrations. Please complete at least one form.");
      setSubmitting(false);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error("You must be logged in to register.");

      // Submit each valid form sequentially
      // This is safer than bundling if the backend applies the SAME participants array to multiple eventIds
      for (const { event, participants } of validForms) {
        const formattedParticipants = participants.map(p => ({
          name: p.name.trim(),
          email: p.email.trim(),
          phone: p.phone.trim(),
        }));

        const payload = {
          eventId: event._id,
          participants: formattedParticipants,
        };

        const response = await fetch(`${API_BASE_URL}/api/registrations/register`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(payload),
        });

        const data = await response.json();
        if (!response.ok) {
          throw new Error(`Failed to register for ${event.title}: ${data.message || 'Unknown error'}`);
        }
      }

      setGlobalSuccess(`Successfully registered for ${validForms.length} event(s)! Redirecting to payment...`);
      localStorage.removeItem('event_cart_draft'); // Clear global draft
      setTimeout(() => {
        const validEventIds = validForms.map(f => f.event._id);
        sessionStorage.setItem('pendingPaymentAmount', calculateTotal());
        sessionStorage.setItem('pendingEventIds', JSON.stringify(validEventIds));
        router.push('/user/account/payment');
      }, 1500);

    } catch (err) {
      setGlobalError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const totalAmount = calculateTotal();
  const validFormsCount = getValidForms().length;

  return (
    <div style={styles.page} className="p-4 sm:p-6 md:p-10">
      {/* Water Wave Background Layer */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-auto">
        <WaterWave
          imageUrl="/water.jpg"
          dropRadius={25}
          perturbance={0.03}
          resolution={512}
          className="absolute inset-0 w-full h-full  bg-cover bg-center"
          style={{ backgroundSize: 'cover', backgroundPosition: 'center' }}
        >
          {() => <div className="w-full h-full" />}
        </WaterWave>
      </div>

      {/* Existing radial gradient as a semi-transparent overlay to preserve the theme's colors slightly */}
      <div
        className="fixed inset-0 z-0 pointer-events-none"
      />

      <div style={{ ...styles.container, position: 'relative', zIndex: 10 }}>
        <div style={styles.header}>
          <h1 style={styles.pageTitle}>Events</h1>
          <p style={styles.pageSubtitle}>Discover and register for the latest events.</p>
        </div>

        {loadingEvents ? (
          <p style={{ color: '#ffffffff', textAlign: 'center', marginTop: 40 }}>Loading events...</p>
        ) : (
          <div style={styles.grid}>
            {events.map((event) => {
              const isExpanded = expandedEventId === event._id;
              const participants = formsData[event._id] || [];
              const isValid = isFormValid(event._id);
              const isRegistered = registeredEventIds.includes(event._id);

              return (
                <div key={event._id} style={{ ...styles.card, borderColor: isValid ? '#10b981' : '#1e293b' }}>
                  <div style={styles.cardHeader}>
                    <h2 style={styles.cardTitle}>{event.title}</h2>
                    <span style={styles.feeBadge}>
                      {event.registrationFee > 0 ? `₹${event.registrationFee}` : 'Free'}
                    </span>
                  </div>

                  <p style={styles.description}>{event.description}</p>

                  <div style={styles.detailsRow}>
                    <span style={styles.detailTag}>
                      {event.minParticipants === event.maxParticipants
                        ? `Team Size: ${event.minParticipants}`
                        : `Team Size: ${event.minParticipants} - ${event.maxParticipants}`}
                    </span>
                    {isValid && !isRegistered && <span style={{ ...styles.detailTag, backgroundColor: 'rgba(175, 247, 223, 0.89)', color: '#067651ff' }}>✓ Ready to Checkout</span>}
                  </div>

                  {isRegistered && globalPaymentStatus !== 'pending' ? (
                    <button
                      disabled
                      style={{ ...styles.actionBtn, backgroundColor: '#024c33ff', opacity: 0.8, cursor: 'not-allowed' }}
                    >
                      Already Registered
                    </button>
                  ) : isRegistered && globalPaymentStatus === 'pending' ? (
                    <button
                      onClick={() => {
                        // Use calculated pending amount, or fallback to the event list's fee if we couldn't calculate it properly
                        let amountToPay = globalPendingAmount;
                        if (amountToPay === 0) {
                          amountToPay = events.filter(e => registeredEventIds.includes(e._id)).reduce((sum, e) => sum + (e.registrationFee || 0), 0);
                        }
                        sessionStorage.setItem('pendingPaymentAmount', amountToPay);
                        sessionStorage.setItem('pendingEventIds', JSON.stringify(registeredEventIds));
                        router.push('/user/account/payment');
                      }}
                      style={{ ...styles.actionBtn, backgroundColor: '#b45309', opacity: 1, cursor: 'pointer' }}
                    >
                      Complete Payment
                    </button>
                  ) : !isExpanded ? (
                    <button
                      onClick={() => toggleEventForm(event)}
                      style={{ ...styles.actionBtn, backgroundColor: participants.length > 0 ? '#1e293b' : '#0c4db5ff' }}
                    >
                      {participants.length > 0 ? 'Edit Registration' : 'Register Now'}
                    </button>
                  ) : (
                    <div style={styles.formContainer}>
                      <div style={styles.formDivider} />
                      <h3 style={styles.formTitle}>Registration Details</h3>

                      <div style={styles.form}>
                        {participants.map((p, index) => (
                          <div key={index} style={styles.participantBlock}>
                            <div style={styles.participantHeader}>
                              <span style={styles.participantLabel}>
                                Participant {index + 1} {index === 0 && "(Lead)"}
                              </span>
                              {participants.length > event.minParticipants && (
                                <button
                                  type="button"
                                  onClick={() => handleRemoveParticipant(index, event)}
                                  style={styles.removeBtn}
                                >
                                  Remove
                                </button>
                              )}
                            </div>

                            <input
                              style={styles.input}
                              placeholder="Full Name"
                              value={p.name}
                              onChange={(e) => handleChange(index, 'name', e.target.value, event._id)}
                            />
                            <div style={styles.row}>
                              <input
                                style={styles.inputHalf}
                                type="email"
                                placeholder="Email"
                                value={p.email}
                                onChange={(e) => handleChange(index, 'email', e.target.value, event._id)}
                              />
                              <input
                                style={styles.inputHalf}
                                type="tel"
                                placeholder="Phone"
                                value={p.phone}
                                onChange={(e) => handleChange(index, 'phone', e.target.value, event._id)}
                              />
                            </div>
                          </div>
                        ))}

                        {participants.length < event.maxParticipants && (
                          <button
                            type="button"
                            onClick={() => handleAddParticipant(event)}
                            style={styles.addBtn}
                          >
                            + Add Team Member
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => setExpandedEventId(null)}
                          style={styles.collapseBtn}
                        >
                          Minimize Event Form
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Global Footer Checkout Bar */}
        {!loadingEvents && (
          <div style={styles.footerBar}>
            <div style={styles.footerContainer}>
              <div style={styles.footerInfo}>
                <h3 style={styles.footerTotal}>Total Amount: <span>₹{totalAmount}</span></h3>
                <p style={styles.footerSub}>({validFormsCount} event(s) ready for checkout)</p>
              </div>

              <div style={styles.footerActions}>
                <button
                  type="button"
                  onClick={handleSaveDraft}
                  style={styles.draftBtn}
                  className="text-sm sm:text-[15px] px-3 sm:px-6 py-2.5 sm:py-3"
                >
                  Save Draft
                </button>
                <button
                  onClick={handleCheckout}
                  style={{
                    ...styles.checkoutBtn,
                    opacity: submitting || validFormsCount === 0 ? 0.6 : 1,
                    pointerEvents: submitting || validFormsCount === 0 ? 'none' : 'auto',
                  }}
                  className="text-sm sm:text-[15px] px-3 sm:px-6 py-2.5 sm:py-3"
                >
                  {submitting ? 'Processing...' : 'Save & Make Payment'}
                </button>
              </div>
            </div>

            {globalError && <div style={styles.globalError}>⚠ {globalError}</div>}
            {globalSuccess && <div style={styles.globalSuccess}>✓ {globalSuccess}</div>}
          </div>
        )}

      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: '100vh',
    width: '100%',
    color: '#0f172a',
    boxSizing: 'border-box',
    fontFamily: 'system-ui, -apple-system, sans-serif',
  },
  container: {
    maxWidth: 1200,
    margin: '0 auto',
  },
  header: {
    textAlign: 'center',
    marginBottom: 48,
    marginTop: 40,
  },
  pageTitle: {
    fontSize: 36,
    fontWeight: 800,
    margin: '0 0 12px',
    letterSpacing: -0.5,
  },
  pageSubtitle: {
    fontSize: 16,
    color: '#334155',
    margin: 0,
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 500px), 1fr))',
    gap: 24,
    alignItems: 'start',
  },
  card: {
    backgroundColor: 'rgba(229, 252, 251, 0.88)',
    border: '1px solid rgba(255, 255, 255, 0.8)',
    borderRadius: 16,
    padding: '16px', // Reduced padding for mobile
    display: 'flex',
    flexDirection: 'column',
    transition: 'all 0.2s',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
    backdropFilter: 'blur(16px)',
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 700,
    margin: 0,
    color: '#0f172a',
  },
  feeBadge: {
    backgroundColor: 'rgba(14, 218, 233, 0.5)',
    color: '#014062ff',
    padding: '4px 10px',
    borderRadius: '20%',
    fontSize: 13,
    fontWeight: 600,
    border: '1px solid rgba(3, 54, 78, 0.3)',
  },
  description: {
    fontSize: 14,
    color: '#475569',
    lineHeight: 1.5,
    margin: '0 0 20px',
  },
  detailsRow: {
    display: 'flex',
    gap: 12,
    marginBottom: 24,
  },
  detailTag: {
    fontSize: 12,
    color: '#0f172a',
    backgroundColor: 'rgba(220, 232, 111, 0.96)',
    padding: '4px 8px',
    borderRadius: 6,
    fontWeight: 600,
  },
  actionBtn: {
    width: '100%',
    padding: '12px',
    backgroundColor: '#0ea5e9',
    color: 'white',
    border: 'none',
    borderRadius: 10,
    fontSize: 15,
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'background-color 0.2s',
    marginTop: 'auto',
  },

  // Inline Form Styles
  formContainer: {
    marginTop: 'auto',
  },
  formDivider: {
    height: 1,
    backgroundColor: 'rgba(148, 163, 184, 0.3)',
    margin: '0 0 20px 0',
  },
  formTitle: {
    fontSize: 15,
    fontWeight: 600,
    color: '#0f172a',
    margin: '0 0 16px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
  },
  participantBlock: {
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    padding: 16,
    borderRadius: 10,
    border: '1px solid rgba(148, 163, 184, 0.4)',
  },
  participantHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  participantLabel: {
    fontSize: 12,
    fontWeight: 600,
    color: '#475569',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  removeBtn: {
    background: 'none',
    border: 'none',
    color: '#ef4444',
    fontSize: 12,
    cursor: 'pointer',
    padding: 0,
  },
  input: {
    width: '100%',
    padding: '10px 14px',
    borderRadius: 8,
    border: '1px solid rgba(148, 163, 184, 0.5)',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    color: '#0f172a',
    fontSize: 14,
    boxSizing: 'border-box',
    outline: 'none',
  },
  row: {
    display: 'flex',
    gap: 10,
  },
  inputHalf: {
    width: '100%',
    flex: 1,
    padding: '10px 14px',
    borderRadius: 8,
    border: '1px solid rgba(148, 163, 184, 0.5)',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    color: '#0f172a',
    fontSize: 14,
    boxSizing: 'border-box',
    outline: 'none',
  },
  addBtn: {
    background: 'none',
    color: '#0284c7',
    border: '1px dashed #94a3b8',
    borderRadius: 8,
    padding: '10px',
    fontSize: 13,
    fontWeight: 600,
    cursor: 'pointer',
  },
  collapseBtn: {
    padding: '10px',
    backgroundColor: 'transparent',
    color: '#475569',
    border: '1px solid #94a3b8',
    borderRadius: 8,
    fontSize: 13,
    fontWeight: 600,
    cursor: 'pointer',
    marginTop: 8,
  },

  // Footer Styles
  footerBar: {
    marginTop: 40,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    width: '100%',
  },
  footerContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    border: '1px solid rgba(255, 255, 255, 0.9)',
    padding: '16px 20px', // Reduced from 24px 32px
    borderRadius: 16,
    boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
    backdropFilter: 'blur(16px)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    gap: 16,
    width: 450,
    maxWidth: '100%',
    boxSizing: 'border-box',
  },
  footerInfo: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    textAlign: 'right',
  },
  footerTotal: {
    margin: 0,
    fontSize: 24,
    fontWeight: 700,
    color: '#070124ff',
  },
  footerSub: {
    margin: '4px 0 0',
    fontSize: 13,
    color: '#475569',
  },
  footerActions: {
    display: 'flex',
    gap: 12,
    width: '100%',
  },
  draftBtn: {
    backgroundColor: 'rgba(27, 110, 149, 0.36)',
    color: '#042332ff',
    border: '1px solid rgba(1, 36, 52, 0.41)',
    borderRadius: 10,
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'background-color 0.2s',
    flex: '1 1 100px',
    textAlign: 'center',
  },
  checkoutBtn: {
    backgroundColor: '#006443ff',
    color: 'white',
    border: 'none',
    borderRadius: 10,
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'opacity 0.2s',
    flex: '2 1 160px',
    textAlign: 'center',
  },
  globalError: {
    width: '100%',
    margin: '8px 0 0',
    padding: '10px 14px',
    backgroundColor: 'rgba(248,113,113,0.1)',
    border: '1px solid rgba(248,113,113,0.2)',
    borderRadius: 8,
    color: '#ef4444',
    fontSize: 14,
    textAlign: 'center',
    boxSizing: 'border-box',
    wordWrap: 'break-word',
  },
  globalSuccess: {
    width: '100%',
    margin: '8px 0 0',
    padding: '10px 14px',
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    border: '1px solid rgba(16, 185, 129, 0.2)',
    borderRadius: 8,
    color: '#10b981',
    fontSize: 14,
    textAlign: 'center',
    boxSizing: 'border-box',
    wordWrap: 'break-word',
  }
};
