"use client";

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://13.201.89.79';
const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '168801764074-kcn9c9to0daenc3o5pn9nfutgho8pcin.apps.googleusercontent.com';

const COLLEGES = [
  'BMS Institute of Technology',
  'BMS College of Engineering',
  'RV College of Engineering',
  'PES University',
  'MS Ramaiah Institute of Technology',
];

export default function UserRegisterPage() {
  const [collegeName, setCollegeName] = useState(COLLEGES[0]);
  const [isCustom, setIsCustom] = useState(false);
  const [customCollege, setCustomCollege] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [scriptReady, setScriptReady] = useState(false);
  const gisBtnRef = useRef(null);
  const router = useRouter();

  const finalCollegeName = isCustom ? customCollege.trim() : collegeName;

  const authenticateWithGoogle = async (credential) => {
    if (!finalCollegeName) {
      setError('Please select or enter your college name first.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ credential, collegeName: finalCollegeName }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Authentication failed');

      if (data.token) localStorage.setItem('token', data.token);
      router.push('/user/account');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Load Google Identity Services script once
  useEffect(() => {
    if (window.google?.accounts?.id) {
      setScriptReady(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => setScriptReady(true);
    document.body.appendChild(script);
  }, []);

  // Init + render the Google button
  useEffect(() => {
    if (!scriptReady || !window.google?.accounts?.id || !gisBtnRef.current) return;

    window.google.accounts.id.initialize({
      client_id: GOOGLE_CLIENT_ID,
      callback: (res) => authenticateWithGoogle(res.credential),
    });

    gisBtnRef.current.innerHTML = '';
    window.google.accounts.id.renderButton(gisBtnRef.current, {
      theme: 'outline',
      size: 'large',
      width: 320,
      text: 'continue_with',
    });
  }, [scriptReady, finalCollegeName]);

  const canContinue = Boolean(finalCollegeName) && !loading;

  return (
    <div style={styles.card}>
      <h2 style={styles.title}>Google Signup / Login</h2>
      <p style={styles.subtitle}>Select your college name first, then continue with Google</p>

      <label style={styles.label}>1. Select college name</label>
      {!isCustom ? (
        <select
          style={styles.select}
          value={collegeName}
          onChange={(e) => setCollegeName(e.target.value)}
        >
          {COLLEGES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      ) : (
        <input
          style={styles.select}
          placeholder="Type your college name"
          value={customCollege}
          onChange={(e) => setCustomCollege(e.target.value)}
          autoFocus
        />
      )}
      <button type="button" onClick={() => setIsCustom((v) => !v)} style={styles.linkBtn}>
        {isCustom ? '← Choose from list instead' : "Can't find your college? Type custom name"}
      </button>

      <label style={{ ...styles.label, marginTop: 20 }}>2. Authenticate with Google</label>
      <div
        ref={gisBtnRef}
        style={{ opacity: canContinue ? 1 : 0.4, pointerEvents: canContinue ? 'auto' : 'none' }}
      />
      {!canContinue && !loading && (
        <p style={styles.hint}>Enter a college name to enable Google sign-in.</p>
      )}
      {loading && <p style={styles.hint}>Signing you in…</p>}
      {error && <p style={styles.error}>{error}</p>}
    </div>
  );
}

const styles = {
  card: {
    maxWidth: 380,
    margin: '40px auto',
    padding: 28,
    borderRadius: 16,
    background: '#15151a',
    border: '1px solid #2a2a33',
    color: '#f2f2f5',
    fontFamily: 'system-ui, sans-serif',
    textAlign: 'center',
  },
  title: { fontSize: 22, fontWeight: 700, margin: '0 0 6px' },
  subtitle: { fontSize: 14, color: '#a3a3ad', margin: '0 0 24px' },
  label: {
    display: 'block',
    textAlign: 'left',
    fontSize: 12,
    fontWeight: 700,
    letterSpacing: 0.4,
    color: '#c9c9d3',
    marginBottom: 8,
  },
  select: {
    width: '100%',
    padding: '10px 12px',
    borderRadius: 8,
    border: '1px solid #33333d',
    background: '#1d1d24',
    color: '#f2f2f5',
    fontSize: 14,
    boxSizing: 'border-box',
  },
  linkBtn: {
    background: 'none',
    border: 'none',
    color: '#a78bfa',
    fontSize: 13,
    cursor: 'pointer',
    padding: '8px 0 0',
    textAlign: 'left',
    width: '100%',
  },
  hint: { fontSize: 12, color: '#8a8a94', marginTop: 10 },
  error: { fontSize: 12, color: '#f87171', marginTop: 10 },
};