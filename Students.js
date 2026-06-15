import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { STUDENTS, CLASSES } from '../data/mockData';
import StatusBadge from '../components/StatusBadge';
import { Search, ChevronDown, Download, TrendingUp, TrendingDown } from 'lucide-react';
import { exportToCSV } from '../utils/helpers';

export default function Students() {
  const { user, getStudentStats, attendance } = useApp();
  const [search, setSearch] = useState('');
  const [filterClass, setFilterClass] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [expanded, setExpanded] = useState(null);

  const availableClasses = user.role === 'teacher' ? CLASSES.filter(c => c.id === user.classId) : CLASSES;

  let students = STUDENTS.filter(s => {
    if (user.role === 'teacher' && s.classId !== user.classId) return false;
    if (filterClass !== 'all' && s.classId !== filterClass) return false;
    if (search && !s.name.toLowerCase().includes(search.toLowerCase()) && !s.rollNo.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  students = students.map(s => ({ ...s, stats: getStudentStats(s.id) }));
  students.sort((a, b) => {
    if (sortBy === 'name') return a.name.localeCompare(b.name);
    if (sortBy === 'percentage') return b.stats.percentage - a.stats.percentage;
    if (sortBy === 'absences') return b.stats.absent - a.stats.absent;
    return 0;
  });

  const handleExport = () => {
    const data = students.map(s => ({
      Name: s.name, 'Roll No': s.rollNo,
      Class: CLASSES.find(c => c.id === s.classId)?.name || '',
      Present: s.stats.present, Late: s.stats.late, Absent: s.stats.absent,
      'Attendance %': s.stats.percentage + '%',
      Status: s.stats.percentage >= 75 ? 'On Track' : 'At Risk',
    }));
    exportToCSV(data, 'student-attendance-report.csv');
  };

  const getStudentHistory = (studentId) => {
    return Object.entries(attendance)
      .sort((a, b) => b[0].localeCompare(a[0]))
      .slice(0, 10)
      .map(([date, records]) => ({ date, status: records[studentId] || null }));
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 24, gap: 12, flexWrap: 'wrap' }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: 'var(--gray-800)', letterSpacing: '-0.3px' }}>Students</h1>
          <p style={{ color: 'var(--gray-400)', fontSize: 14, marginTop: 2 }}>{students.length} students found</p>
        </div>
        <button onClick={handleExport} style={{
          display: 'flex', alignItems: 'center', gap: 7, padding: '9px 16px',
          background: '#fff', border: '1px solid var(--gray-200)', borderRadius: 8,
          fontSize: 13, fontWeight: 500, color: 'var(--gray-600)', cursor: 'pointer',
        }}>
          <Download size={15} /> Export CSV
        </button>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 16, flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
          <Search size={15} style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', color: 'var(--gray-400)' }} />
          <input placeholder="Search by name or roll no…" value={search} onChange={e => setSearch(e.target.value)}
            style={{ width: '100%', padding: '9px 12px 9px 34px', border: '1px solid var(--gray-200)', borderRadius: 8, fontSize: 14 }} />
        </div>
        {user.role === 'admin' && (
          <div style={{ position: 'relative' }}>
            <select value={filterClass} onChange={e => setFilterClass(e.target.value)}
              style={{ padding: '9px 32px 9px 12px', border: '1px solid var(--gray-200)', borderRadius: 8, fontSize: 14, appearance: 'none', background: '#fff' }}>
              <option value="all">All classes</option>
              {CLASSES.map(c => <option key={c.id} value={c.id}>{c.name.split('—')[0].trim()}</option>)}
            </select>
            <ChevronDown size={15} style={{ position: 'absolute', right: 9, top: '50%', transform: 'translateY(-50%)', color: 'var(--gray-400)', pointerEvents: 'none' }} />
          </div>
        )}
        <div style={{ position: 'relative' }}>
          <select value={sortBy} onChange={e => setSortBy(e.target.value)}
            style={{ padding: '9px 32px 9px 12px', border: '1px solid var(--gray-200)', borderRadius: 8, fontSize: 14, appearance: 'none', background: '#fff' }}>
            <option value="name">Sort: Name</option>
            <option value="percentage">Sort: Attendance %</option>
            <option value="absences">Sort: Absences</option>
          </select>
          <ChevronDown size={15} style={{ position: 'absolute', right: 9, top: '50%', transform: 'translateY(-50%)', color: 'var(--gray-400)', pointerEvents: 'none' }} />
        </div>
      </div>

      {/* Table */}
      <div style={{ background: '#fff', border: '1px solid var(--gray-200)', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow)', overflow: 'hidden' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 80px 80px 80px 90px', padding: '10px 20px', background: 'var(--gray-50)', borderBottom: '1px solid var(--gray-200)', fontSize: 12, fontWeight: 600, color: 'var(--gray-600)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          <span>Student</span><span>Roll No.</span><span>Class</span>
          <span style={{ textAlign: 'center' }}>Present</span>
          <span style={{ textAlign: 'center' }}>Late</span>
          <span style={{ textAlign: 'center' }}>Absent</span>
          <span style={{ textAlign: 'center' }}>Rate</span>
        </div>

        {students.map((student, i) => {
          const isExpanded = expanded === student.id;
          const history = isExpanded ? getStudentHistory(student.id) : [];
          const isAtRisk = student.stats.percentage < 75;

          return (
            <div key={student.id}>
              <div
                onClick={() => setExpanded(isExpanded ? null : student.id)}
                style={{
                  display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 80px 80px 80px 90px',
                  padding: '13px 20px', borderBottom: '1px solid var(--gray-100)',
                  alignItems: 'center', cursor: 'pointer', transition: 'background 0.1s',
                  background: isExpanded ? 'var(--accent-light)' : '#fff',
                }}
                onMouseEnter={e => { if (!isExpanded) e.currentTarget.style.background = 'var(--gray-50)'; }}
                onMouseLeave={e => { if (!isExpanded) e.currentTarget.style.background = '#fff'; }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 32, height: 32, borderRadius: '50%', background: isAtRisk ? 'var(--danger-light)' : 'var(--accent-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: isAtRisk ? 'var(--danger)' : 'var(--accent)', fontSize: 12, fontWeight: 700, flexShrink: 0 }}>
                    {student.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--gray-800)' }}>{student.name}</div>
                    <div style={{ fontSize: 11, color: 'var(--gray-400)' }}>{student.email}</div>
                  </div>
                </div>
                <span style={{ fontSize: 13, color: 'var(--gray-600)' }}>{student.rollNo}</span>
                <span style={{ fontSize: 12, color: 'var(--gray-500)' }}>{CLASSES.find(c => c.id === student.classId)?.name.split('—')[0].trim()}</span>
                <span style={{ textAlign: 'center', fontSize: 14, fontWeight: 500, color: 'var(--success)' }}>{student.stats.present}</span>
                <span style={{ textAlign: 'center', fontSize: 14, fontWeight: 500, color: 'var(--warning)' }}>{student.stats.late}</span>
                <span style={{ textAlign: 'center', fontSize: 14, fontWeight: 500, color: 'var(--danger)' }}>{student.stats.absent}</span>
                <div style={{ textAlign: 'center' }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: isAtRisk ? 'var(--danger)' : 'var(--success)', background: isAtRisk ? 'var(--danger-light)' : 'var(--success-light)', padding: '3px 8px', borderRadius: 20 }}>
                    {student.stats.percentage}%
                  </span>
                </div>
              </div>

              {isExpanded && (
                <div style={{ padding: '14px 20px 16px', background: '#fafbff', borderBottom: '1px solid var(--gray-200)' }}>
                  <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--gray-600)', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Last 10 sessions</p>
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    {history.map(h => (
                      <div key={h.date} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                        <StatusBadge status={h.status} />
                        <span style={{ fontSize: 10, color: 'var(--gray-400)' }}>{h.date.slice(5)}</span>
                      </div>
                    ))}
                  </div>
                  {isAtRisk && (
                    <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 7, padding: '8px 12px', background: 'var(--danger-light)', borderRadius: 8, fontSize: 13, color: 'var(--danger)', fontWeight: 500 }}>
                      <TrendingDown size={15} /> This student is below the 75% minimum requirement and may face academic consequences.
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
