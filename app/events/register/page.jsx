"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://13.201.89.79';

export default function EventsPage() {
  const router = useRouter();

  const [events, setEvents] = useState([]);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [registeredEventIds, setRegisteredEventIds] = useState([]);

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
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={styles.pageTitle}>Events</h1>
          <p style={styles.pageSubtitle}>Discover and register for the latest events.</p>
        </div>

        {loadingEvents ? (
          <p style={{ color: '#8fb3c7', textAlign: 'center', marginTop: 40 }}>Loading events...</p>
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
                    {isValid && !isRegistered && <span style={{ ...styles.detailTag, backgroundColor: 'rgba(16, 185, 129, 0.1)', color: '#10b981' }}>✓ Ready to Checkout</span>}
                  </div>

                  {isRegistered ? (
                    <button
                      disabled
                      style={{ ...styles.actionBtn, backgroundColor: '#10b981', opacity: 0.8, cursor: 'not-allowed' }}
                    >
                      Already Registered
                    </button>
                  ) : !isExpanded ? (
                    <button
                      onClick={() => toggleEventForm(event)}
                      style={{ ...styles.actionBtn, backgroundColor: participants.length > 0 ? '#1e293b' : '#3b82f6' }}
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
      </div>

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
  );
}

const styles = {
  page: {
    minHeight: '100vh',
    width: '100%',
    background: 'radial-gradient(circle at center, lightblue 0%, lightblue 50%, white 100%)',
    color: '#0f172a',
    padding: '40px 24px 140px', // Extra padding at bottom for fixed footer
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
    gridTemplateColumns: 'repeat(auto-fill, minmax(500px, 1fr))',
    gap: 24,
    alignItems: 'start',
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    border: '1px solid rgba(255, 255, 255, 0.8)',
    borderRadius: 16,
    padding: 24,
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
    backgroundColor: 'rgba(14, 165, 233, 0.15)',
    color: '#0369a1',
    padding: '4px 10px',
    borderRadius: 99,
    fontSize: 13,
    fontWeight: 600,
    border: '1px solid rgba(14, 165, 233, 0.3)',
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
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    padding: '4px 8px',
    borderRadius: 6,
    fontWeight: 600,
    border: '1px solid #e2e8f0',
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
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    borderTop: '1px solid rgba(255, 255, 255, 0.9)',
    padding: '20px 24px',
    zIndex: 100,
    boxShadow: '0 -4px 30px rgba(0,0,0,0.05)',
    backdropFilter: 'blur(16px)',
  },
  footerContainer: {
    maxWidth: 1200,
    margin: '0 auto',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 20,
  },
  footerInfo: {
    display: 'flex',
    flexDirection: 'column',
  },
  footerTotal: {
    margin: 0,
    fontSize: 24,
    fontWeight: 700,
    color: '#0f172a',
  },
  footerSub: {
    margin: '4px 0 0',
    fontSize: 13,
    color: '#475569',
  },
  footerActions: {
    display: 'flex',
    gap: 12,
  },
  draftBtn: {
    padding: '12px 24px',
    backgroundColor: 'rgba(14, 165, 233, 0.1)',
    color: '#0284c7',
    border: '1px solid rgba(14, 165, 233, 0.3)',
    borderRadius: 10,
    fontSize: 15,
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
  checkoutBtn: {
    padding: '12px 24px',
    backgroundColor: '#10b981',
    color: 'white',
    border: 'none',
    borderRadius: 10,
    fontSize: 15,
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'opacity 0.2s',
  },
  globalError: {
    maxWidth: 1200,
    margin: '12px auto 0',
    padding: '10px 14px',
    backgroundColor: 'rgba(248,113,113,0.1)',
    border: '1px solid rgba(248,113,113,0.2)',
    borderRadius: 8,
    color: '#ef4444',
    fontSize: 14,
  },
  globalSuccess: {
    maxWidth: 1200,
    margin: '12px auto 0',
    padding: '10px 14px',
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    border: '1px solid rgba(16, 185, 129, 0.2)',
    borderRadius: 8,
    color: '#10b981',
    fontSize: 14,
  }
};
