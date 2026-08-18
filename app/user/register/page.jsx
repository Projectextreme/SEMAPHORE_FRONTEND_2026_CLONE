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

  useEffect(() => {
    if (!scriptReady || !window.google?.accounts?.id || !gisBtnRef.current) return;

    window.google.accounts.id.initialize({
      client_id: GOOGLE_CLIENT_ID,
      callback: (res) => authenticateWithGoogle(res.credential),
    });

    gisBtnRef.current.innerHTML = '';
    window.google.accounts.id.renderButton(gisBtnRef.current, {
      theme: 'filled_black',
      size: 'large',
      width: 320,
      text: 'continue_with',
    });
  }, [scriptReady, finalCollegeName]);

  const canContinue = Boolean(finalCollegeName) && !loading;

  return (
    <div style={styles.page}>
      {/* ambient glow blobs */}
      <div style={styles.glowTop} />
      <div style={styles.glowBottom} />

      <div style={styles.card}>
        <div style={styles.cardInnerGlow} />

        <div style={styles.badge}>SEMAPHORE 2K26</div>
        <h2 style={styles.title}> Register/Signin </h2>
        <p style={styles.subtitle}>Select your college, then continue with Google</p>

        <label style={styles.label}>
          <span style={styles.labelIndex}>01</span> Select college name
        </label>

        {!isCustom ? (
          <select
            style={styles.select}
            value={collegeName}
            onChange={(e) => setCollegeName(e.target.value)}
          >
            {COLLEGES.map((c) => (
              <option key={c} value={c} style={{ background: '#0a1420', color: '#f2f2f5' }}>
                {c}
              </option>
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

        <label style={{ ...styles.label, marginTop: 24 }}>
          <span style={styles.labelIndex}>02</span> Authenticate with Google
        </label>

        <div style={styles.googleBtnWrap}>
          <div
            ref={gisBtnRef}
            style={{ opacity: canContinue ? 1 : 0.35, pointerEvents: canContinue ? 'auto' : 'none' }}
          />
        </div>

        {!canContinue && !loading && (
          <p style={styles.hint}>
            <span style={styles.hintDot} /> Enter a college name to enable Google sign-in.
          </p>
        )}
        {loading && (
          <p style={styles.hint}>
            <span style={{ ...styles.hintDot, background: '#22d3ee' }} /> Signing you in…
          </p>
        )}
        {error && <p style={styles.error}>⚠ {error}</p>}

        <div style={styles.footerMeta}>
          <span>DEPTH: SIGN-IN</span>
          <span>STATUS: {loading ? 'CONNECTING' : canContinue ? 'READY' : 'STANDBY'}</span>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: '100vh',
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
    padding: 24,
    boxSizing: 'border-box',
    background:
      'radial-gradient(ellipse at 50% 0%, #2696f9 0%, rgb(20 80 139) 35%, #051220 70%, #000205 100%)',
    
  },

  glowTop: {
    position: 'absolute',
    top: '-15%',
    left: '50%',
    transform: 'translateX(-50%)',
    width: 700,
    height: 700,
    background: 'radial-gradient(circle, rgba(34,211,238,0.18) 0%, rgba(34,211,238,0) 70%)',
    filter: 'blur(10px)',
    pointerEvents: 'none',
  },
  glowBottom: {
    position: 'absolute',
    bottom: '-20%',
    right: '-10%',
    width: 600,
    height: 600,
    background: 'radial-gradient(circle, rgba(56,189,248,0.12) 0%, rgba(56,189,248,0) 70%)',
    filter: 'blur(10px)',
    pointerEvents: 'none',
  },

  card: {
    position: 'relative',
    maxWidth: 400,
    width: '100%',
    margin: '0 auto',
    padding: 32,
    borderRadius: 20,
    background: 'linear-gradient(180deg, rgba(20,40,60,0.55) 0%, rgba(10,25,40,0.65) 100%)',
    backdropFilter: 'blur(18px) saturate(140%)',
    WebkitBackdropFilter: 'blur(18px) saturate(140%)',
    border: '1px solid rgba(42, 87, 219, 0.18)',
    boxShadow:
      '0 8px 40px rgba(0,0,0,0.45), 0 0 0 1px rgba(255,255,255,0.03) inset, 0 1px 0 rgba(255,255,255,0.06) inset',
    color: '#eef6fb',
    textAlign: 'center',
    overflow: 'hidden',
  },
  cardInnerGlow: {
    position: 'absolute',
    top: -60,
    left: '50%',
    transform: 'translateX(-50%)',
    width: 260,
    height: 160,
    background: 'radial-gradient(ellipse, rgba(34,211,238,0.25) 0%, rgba(34,211,238,0) 70%)',
    pointerEvents: 'none',
  },

  badge: {
    display: 'inline-block',
    fontSize: 10,
    letterSpacing: 2,
    fontWeight: 700,
    color: '#67e8f9',
    background: 'rgba(34,211,238,0.08)',
    border: '1px solid rgba(34,211,238,0.3)',
    borderRadius: 999,
    padding: '5px 12px',
    marginBottom: 16,
  },

  title: {
    fontSize: 26,
    fontWeight: 800,
    margin: '0 0 6px',
    letterSpacing: 1,
    background: 'linear-gradient(180deg, #ffffff 0%, #b8e6f5 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  subtitle: {
    fontSize: 13,
    color: '#8fb3c7',
    margin: '0 0 28px',
    lineHeight: 1.5,
  },

  label: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    textAlign: 'left',
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: '#a9cddd',
    marginBottom: 10,
  },
  labelIndex: {
    fontSize: 10,
    color: '#051220',
    background: '#67e8f9',
    borderRadius: 4,
    padding: '2px 5px',
    fontWeight: 800,
  },

  select: {
    width: '100%',
    padding: '12px 14px',
    borderRadius: 10,
    border: '1px solid rgba(103,232,249,0.2)',
    background: 'rgba(4,15,26,0.55)',
    color: '#eef6fb',
    fontSize: 14,
    boxSizing: 'border-box',
    outline: 'none',
    transition: 'border-color 0.2s, box-shadow 0.2s',
  },

  linkBtn: {
    background: 'none',
    border: 'none',
    color: '#5eead4',
    fontSize: 12,
    cursor: 'pointer',
    padding: '10px 0 0',
    textAlign: 'left',
    width: '100%',
    letterSpacing: 0.2,
  },

  googleBtnWrap: {
    display: 'flex',
    justifyContent: 'center',
    padding: '4px 0 2px',
   },

  hint: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    fontSize: 12,
    color: '#7fa3b8',
    marginTop: 12,
  },
  hintDot: {
    width: 6,
    height: 6,
    borderRadius: '50%',
    background: '#5b7a8c',
    display: 'inline-block',
  },

  error: {
    fontSize: 12,
    color: '#fca5a5',
    marginTop: 12,
    background: 'rgba(248,113,113,0.08)',
    border: '1px solid rgba(248,113,113,0.25)',
    borderRadius: 8,
    padding: '8px 10px',
  },

  footerMeta: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: 9,
    letterSpacing: 1,
    color: '#3d5c6e',
    marginTop: 26,
    paddingTop: 14,
    borderTop: '1px solid rgba(103,232,249,0.1)',
    textTransform: 'uppercase',
  },
};