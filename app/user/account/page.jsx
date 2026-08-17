"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://13.201.89.79';

export default function UserAccountPage() {
  const [user, setUser] = useState(null);
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
        setUser(data);
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

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/user/register');
  };

  if (loading) {
    return (
      <div style={styles.wrapper}>
        <p style={styles.hint}>Loading your account…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.wrapper}>
        <p style={styles.error}>{error}</p>
        <p style={styles.hint}>Redirecting to registration…</p>
      </div>
    );
  }

  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>
        <img src={user.avatar} alt={user.name} style={styles.avatar} />
        <h2 style={styles.title}>{user.name}</h2>
        <p style={styles.email}>{user.email}</p>

        <div style={styles.detailsBox}>
          <Detail label="Role" value={user.role} />
          <Detail label="College" value={user.collegeName || user.college?.collegeName} />
          {user.college?.totalTeams !== undefined && (
            <Detail label="Total Teams" value={user.college.totalTeams} />
          )}
          <Detail label="Google ID" value={user.googleId} mono />
          <Detail label="User ID" value={user._id} mono />
        </div>

        <button onClick={handleLogout} style={styles.logoutBtn}>
          Log out
        </button>
      </div>
    </div>
  );
}

function Detail({ label, value, mono }) {
  if (!value) return null;
  return (
    <div style={styles.detailRow}>
      <span style={styles.detailLabel}>{label}</span>
      <span style={{ ...styles.detailValue, ...(mono ? styles.mono : {}) }}>{value}</span>
    </div>
  );
}

const styles = {
  wrapper: {
    minHeight: '60vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: 'system-ui, sans-serif',
  },
  card: {
    maxWidth: 380,
    width: '100%',
    padding: 28,
    borderRadius: 16,
    background: '#15151a',
    border: '1px solid #2a2a33',
    color: '#f2f2f5',
    textAlign: 'center',
  },
  avatar: { width: 72, height: 72, borderRadius: '50%', marginBottom: 12 },
  title: { fontSize: 22, fontWeight: 700, margin: '0 0 4px' },
  email: { fontSize: 14, color: '#a3a3ad', margin: '0 0 24px' },
  detailsBox: {
    textAlign: 'left',
    borderTop: '1px solid #2a2a33',
    paddingTop: 16,
  },
  detailRow: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: 12,
    padding: '8px 0',
    borderBottom: '1px solid #202027',
  },
  detailLabel: { fontSize: 12, color: '#8a8a94', fontWeight: 600 },
  detailValue: { fontSize: 13, color: '#f2f2f5', textAlign: 'right', wordBreak: 'break-all' },
  mono: { fontFamily: 'monospace', fontSize: 11, color: '#a3a3ad' },
  logoutBtn: {
    marginTop: 24,
    width: '100%',
    padding: '10px 14px',
    borderRadius: 8,
    border: '1px solid #33333d',
    background: 'transparent',
    color: '#f87171',
    fontSize: 14,
    cursor: 'pointer',
  },
  hint: { fontSize: 14, color: '#8a8a94' },
  error: { fontSize: 14, color: '#f87171', marginBottom: 8 },
};