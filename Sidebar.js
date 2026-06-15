import React from 'react';
import { NavLink } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { LayoutDashboard, ClipboardList, Users, BarChart2, LogOut, GraduationCap } from 'lucide-react';

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard', roles: ['admin', 'teacher'] },
  { to: '/mark', icon: ClipboardList, label: 'Mark Attendance', roles: ['admin', 'teacher'] },
  { to: '/students', icon: Users, label: 'Students', roles: ['admin', 'teacher'] },
  { to: '/reports', icon: BarChart2, label: 'Reports', roles: ['admin'] },
];

export default function Sidebar() {
  const { user, logout } = useApp();

  return (
    <aside style={{
      width: 240, minHeight: '100vh', background: 'var(--navy)',
      display: 'flex', flexDirection: 'column', position: 'fixed', left: 0, top: 0, zIndex: 100,
    }}>
      {/* Logo */}
      <div style={{ padding: '24px 20px 20px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ background: 'var(--accent)', borderRadius: 8, padding: 6, display: 'flex' }}>
            <GraduationCap size={20} color="#fff" />
          </div>
          <div>
            <div style={{ color: '#fff', fontWeight: 700, fontSize: 15, letterSpacing: '-0.2px' }}>EduTrack</div>
            <div style={{ color: 'rgba(255,255,255,0.45)', fontSize: 11 }}>Attendance System</div>
          </div>
        </div>
      </div>

      {/* User pill */}
      <div style={{ padding: '14px 20px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 34, height: 34, borderRadius: '50%',
            background: 'var(--accent)', display: 'flex', alignItems: 'center',
            justifyContent: 'center', color: '#fff', fontWeight: 600, fontSize: 13, flexShrink: 0,
          }}>
            {user?.name?.split(' ').map(n => n[0]).join('').slice(0, 2)}
          </div>
          <div style={{ overflow: 'hidden' }}>
            <div style={{ color: '#fff', fontSize: 13, fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.name}</div>
            <div style={{ color: 'rgba(255,255,255,0.45)', fontSize: 11, textTransform: 'capitalize' }}>{user?.role}</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '12px 12px' }}>
        {navItems.filter(i => i.roles.includes(user?.role)).map(({ to, icon: Icon, label }) => (
          <NavLink key={to} to={to} end={to === '/'} style={({ isActive }) => ({
            display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px',
            borderRadius: 8, marginBottom: 2, fontSize: 14, fontWeight: 500, transition: 'all 0.15s',
            background: isActive ? 'rgba(59,130,246,0.2)' : 'transparent',
            color: isActive ? '#93c5fd' : 'rgba(255,255,255,0.6)',
          })}>
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div style={{ padding: '12px 12px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
        <button onClick={logout} style={{
          width: '100%', display: 'flex', alignItems: 'center', gap: 10,
          padding: '10px 12px', borderRadius: 8, background: 'transparent',
          border: 'none', color: 'rgba(255,255,255,0.5)', fontSize: 14, fontWeight: 500,
          cursor: 'pointer', transition: 'all 0.15s',
        }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.15)'; e.currentTarget.style.color = '#fca5a5'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(255,255,255,0.5)'; }}
        >
          <LogOut size={18} />
          Sign out
        </button>
      </div>
    </aside>
  );
}
