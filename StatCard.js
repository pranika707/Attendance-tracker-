import React from 'react';

export default function StatCard({ label, value, icon: Icon, color = 'var(--accent)', bg = 'var(--accent-light)', sub }) {
  return (
    <div style={{
      background: '#fff', border: '1px solid var(--gray-200)', borderRadius: 'var(--radius)',
      padding: '18px 20px', boxShadow: 'var(--shadow)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
        <span style={{ fontSize: 13, color: 'var(--gray-600)', fontWeight: 500 }}>{label}</span>
        <div style={{ background: bg, borderRadius: 8, padding: 7, display: 'flex' }}>
          <Icon size={18} color={color} />
        </div>
      </div>
      <div style={{ fontSize: 28, fontWeight: 700, color: 'var(--gray-800)', lineHeight: 1 }}>{value}</div>
      {sub && <div style={{ fontSize: 12, color: 'var(--gray-400)', marginTop: 6 }}>{sub}</div>}
    </div>
  );
}
