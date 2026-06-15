import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { STUDENTS, CLASSES } from '../data/mockData';
import StatusBadge from '../components/StatusBadge';
import { Save, CheckCheck, XCircle, Clock, ChevronDown } from 'lucide-react';
import { getTodayString, formatDate } from '../utils/helpers';

const STATUS_OPTIONS = ['present', 'absent', 'late'];

export default function MarkAttendance() {
  const { user, getClassAttendance, markAttendance } = useApp();
  const [selectedClass, setSelectedClass] = useState(user.role === 'teacher' ? user.classId : 'cs101');
  const [date, setDate] = useState(getTodayString());
  const [records, setRecords] = useState({});
  const [saved, setSaved] = useState(false);

  const classStudents = STUDENTS.filter(s => s.classId === selectedClass);
  const availableClasses = user.role === 'teacher' ? CLASSES.filter(c => c.id === user.classId) : CLASSES;

  useEffect(() => {
    const existing = getClassAttendance(date, selectedClass);
    const init = {};
    existing.forEach(r => { init[r.id] = r.status || 'present'; });
    setRecords(init);
    setSaved(false);
  }, [date, selectedClass]);

  const setAll = (status) => {
    const all = {};
    classStudents.forEach(s => { all[s.id] = status; });
    setRecords(all);
  };

  const handleSave = () => {
    markAttendance(date, selectedClass, records);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const counts = classStudents.reduce((acc, s) => {
    const st = records[s.id] || 'present';
    acc[st] = (acc[st] || 0) + 1;
    return acc;
  }, {});

  const btnStyle = (active, color, bg) => ({
    padding: '5px 12px', borderRadius: 20, border: `1px solid ${active ? color : 'var(--gray-200)'}`,
    background: active ? bg : '#fff', color: active ? color : 'var(--gray-400)',
    fontSize: 12, fontWeight: 600, cursor: 'pointer', transition: 'all 0.12s',
    textTransform: 'capitalize',
  });

  const colorMap = { present: ['#10b981', '#ecfdf5'], absent: ['#ef4444', '#fef2f2'], late: ['#f59e0b', '#fffbeb'] };

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: 'var(--gray-800)', letterSpacing: '-0.3px' }}>Mark Attendance</h1>
        <p style={{ color: 'var(--gray-400)', fontSize: 14, marginTop: 2 }}>Record daily attendance for your class</p>
      </div>

      {/* Controls */}
      <div style={{ background: '#fff', border: '1px solid var(--gray-200)', borderRadius: 'var(--radius)', padding: '16px 20px', boxShadow: 'var(--shadow)', marginBottom: 18 }}>
        <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', alignItems: 'flex-end' }}>
          <div style={{ flex: 1, minWidth: 200 }}>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: 'var(--gray-600)', marginBottom: 6 }}>Class</label>
            <div style={{ position: 'relative' }}>
              <select value={selectedClass} onChange={e => setSelectedClass(e.target.value)} disabled={user.role === 'teacher'}
                style={{ width: '100%', padding: '9px 36px 9px 12px', border: '1px solid var(--gray-200)', borderRadius: 8, fontSize: 14, appearance: 'none', background: '#fff', color: 'var(--gray-800)' }}>
                {availableClasses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
              <ChevronDown size={16} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--gray-400)', pointerEvents: 'none' }} />
            </div>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: 'var(--gray-600)', marginBottom: 6 }}>Date</label>
            <input type="date" value={date} onChange={e => setDate(e.target.value)} max={getTodayString()}
              style={{ padding: '9px 12px', border: '1px solid var(--gray-200)', borderRadius: 8, fontSize: 14 }} />
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={() => setAll('present')} style={{ padding: '9px 14px', background: 'var(--success-light)', border: '1px solid #a7f3d0', color: 'var(--success)', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
              ✓ All Present
            </button>
          </div>
        </div>
      </div>

      {/* Summary pills */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
        {STATUS_OPTIONS.map(s => (
          <div key={s} style={{ padding: '5px 14px', borderRadius: 20, background: colorMap[s][1], color: colorMap[s][0], fontSize: 13, fontWeight: 600 }}>
            {counts[s] || 0} {s}
          </div>
        ))}
        <div style={{ marginLeft: 'auto', fontSize: 13, color: 'var(--gray-400)', display: 'flex', alignItems: 'center' }}>
          {formatDate(date)}
        </div>
      </div>

      {/* Student list */}
      <div style={{ background: '#fff', border: '1px solid var(--gray-200)', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow)', overflow: 'hidden' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', padding: '10px 20px', background: 'var(--gray-50)', borderBottom: '1px solid var(--gray-200)', fontSize: 12, fontWeight: 600, color: 'var(--gray-600)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          <span>Student</span>
          <span>Roll No.</span>
          <span>Status</span>
        </div>
        {classStudents.map((student, i) => (
          <div key={student.id} style={{
            display: 'grid', gridTemplateColumns: '1fr 1fr auto',
            padding: '13px 20px', borderBottom: i < classStudents.length - 1 ? '1px solid var(--gray-100)' : 'none',
            alignItems: 'center', transition: 'background 0.1s',
          }}
            onMouseEnter={e => e.currentTarget.style.background = 'var(--gray-50)'}
            onMouseLeave={e => e.currentTarget.style.background = '#fff'}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{
                width: 32, height: 32, borderRadius: '50%', background: 'var(--accent-light)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'var(--accent)', fontSize: 12, fontWeight: 700, flexShrink: 0,
              }}>
                {student.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
              </div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--gray-800)' }}>{student.name}</div>
                <div style={{ fontSize: 12, color: 'var(--gray-400)' }}>{student.email}</div>
              </div>
            </div>
            <span style={{ fontSize: 13, color: 'var(--gray-600)' }}>{student.rollNo}</span>
            <div style={{ display: 'flex', gap: 6 }}>
              {STATUS_OPTIONS.map(status => (
                <button key={status} onClick={() => setRecords(prev => ({ ...prev, [student.id]: status }))}
                  style={btnStyle(records[student.id] === status, colorMap[status][0], colorMap[status][1])}>
                  {status}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Save button */}
      <div style={{ marginTop: 16, display: 'flex', justifyContent: 'flex-end' }}>
        <button onClick={handleSave} style={{
          display: 'flex', alignItems: 'center', gap: 8,
          padding: '11px 24px', background: saved ? 'var(--success)' : 'var(--accent)',
          color: '#fff', border: 'none', borderRadius: 8, fontSize: 15, fontWeight: 600, cursor: 'pointer',
          transition: 'background 0.2s',
        }}>
          {saved ? <><CheckCheck size={18} /> Saved!</> : <><Save size={18} /> Save Attendance</>}
        </button>
      </div>
    </div>
  );
}
