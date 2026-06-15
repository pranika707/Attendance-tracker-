import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { GraduationCap, Mail, Lock, AlertCircle } from 'lucide-react';

export default function Login() {
  const { login } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    await new Promise(r => setTimeout(r, 400));
    const result = login(email, password);
    if (!result.success) setError(result.error);
    setLoading(false);
  };

  const fillDemo = (role) => {
    if (role === 'admin') { setEmail('admin@university.edu'); setPassword('admin123'); }
    else { setEmail('teacher@university.edu'); setPassword('teacher123'); }
  };

  const inputStyle = {
    width: '100%', padding: '11px 14px 11px 40px', border: '1px solid var(--gray-200)',
    borderRadius: 8, fontSize: 14, outline: 'none', background: '#fff',
    transition: 'border-color 0.15s',
  };

  return (
    <div style={{
      minHeight: '100vh', background: 'linear-gradient(135deg, #1e3a5f 0%, #2a4f82 50%, #1e3a5f 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20,
    }}>
      <div style={{ width: '100%', maxWidth: 420 }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{
            display: 'inline-flex', background: 'var(--accent)', borderRadius: 16,
            padding: 14, marginBottom: 12,
          }}>
            <GraduationCap size={28} color="#fff" />
          </div>
          <h1 style={{ color: '#fff', fontSize: 24, fontWeight: 700, letterSpacing: '-0.3px' }}>EduTrack</h1>
          <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: 14, marginTop: 4 }}>Attendance Management System</p>
        </div>

        {/* Card */}
        <div style={{ background: '#fff', borderRadius: 16, padding: '32px 28px', boxShadow: '0 20px 60px rgba(0,0,0,0.25)' }}>
          <h2 style={{ fontSize: 18, fontWeight: 600, color: 'var(--gray-800)', marginBottom: 6 }}>Sign in</h2>
          <p style={{ fontSize: 13, color: 'var(--gray-400)', marginBottom: 24 }}>Use a demo account below to get started</p>

          {/* Demo pills */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
            {['admin', 'teacher'].map(role => (
              <button key={role} onClick={() => fillDemo(role)} style={{
                flex: 1, padding: '7px 12px', border: '1px solid var(--gray-200)',
                borderRadius: 8, fontSize: 12, fontWeight: 500, background: 'var(--gray-50)',
                color: 'var(--gray-600)', cursor: 'pointer', textTransform: 'capitalize',
                transition: 'all 0.15s',
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.color = 'var(--accent)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--gray-200)'; e.currentTarget.style.color = 'var(--gray-600)'; }}
              >
                Demo {role}
              </button>
            ))}
          </div>

          {error && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px',
              background: 'var(--danger-light)', borderRadius: 8, marginBottom: 16,
              color: 'var(--danger)', fontSize: 13,
            }}>
              <AlertCircle size={16} /> {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 14, position: 'relative' }}>
              <Mail size={16} style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', color: 'var(--gray-400)' }} />
              <input type="email" placeholder="Email address" value={email} onChange={e => setEmail(e.target.value)}
                required style={inputStyle}
                onFocus={e => e.target.style.borderColor = 'var(--accent)'}
                onBlur={e => e.target.style.borderColor = 'var(--gray-200)'}
              />
            </div>
            <div style={{ marginBottom: 20, position: 'relative' }}>
              <Lock size={16} style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', color: 'var(--gray-400)' }} />
              <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)}
                required style={inputStyle}
                onFocus={e => e.target.style.borderColor = 'var(--accent)'}
                onBlur={e => e.target.style.borderColor = 'var(--gray-200)'}
              />
            </div>
            <button type="submit" disabled={loading} style={{
              width: '100%', padding: '12px', background: loading ? 'var(--gray-200)' : 'var(--accent)',
              color: '#fff', border: 'none', borderRadius: 8, fontSize: 15, fontWeight: 600,
              cursor: loading ? 'not-allowed' : 'pointer', transition: 'background 0.15s',
            }}>
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
          </form>
        </div>

        <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.35)', fontSize: 12, marginTop: 20 }}>
          Demo project — no real data stored server-side
        </p>
      </div>
    </div>
  );
}
