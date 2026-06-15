import React, { useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { STUDENTS, CLASSES } from '../data/mockData';
import StatCard from '../components/StatCard';
import StatusBadge from '../components/StatusBadge';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Users, CheckCircle, XCircle, Clock, AlertTriangle } from 'lucide-react';
import { getTodayString, formatDate } from '../utils/helpers';

export default function Dashboard() {
  const { user, getStudentStats, getClassAttendance, getMonthlyData } = useApp();
  const today = getTodayString();

  const classId = user.role === 'teacher' ? user.classId : 'cs101';
  const todayRecords = getClassAttendance(today, classId);
  const monthlyData = getMonthlyData(classId);

  const stats = useMemo(() => {
    const allStudents = user.role === 'admin' ? STUDENTS : STUDENTS.filter(s => s.classId === user.classId);
    let totalPresent = 0, totalAbsent = 0, totalLate = 0;
    allStudents.forEach(s => {
      const st = getStudentStats(s.id);
      totalPresent += st.present;
      totalAbsent += st.absent;
      totalLate += st.late;
    });
    return { totalPresent, totalAbsent, totalLate, studentCount: allStudents.length };
  }, [getStudentStats, user]);

  const atRisk = STUDENTS.filter(s => {
    if (user.role === 'teacher' && s.classId !== user.classId) return false;
    return getStudentStats(s.id).percentage < 75;
  });

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: 'var(--gray-800)', letterSpacing: '-0.3px' }}>
          Good {new Date().getHours() < 12 ? 'morning' : 'afternoon'}, {user.name.split(' ')[0]} 👋
        </h1>
        <p style={{ color: 'var(--gray-400)', fontSize: 14, marginTop: 2 }}>{formatDate(today)}</p>
      </div>

      {/* Stat cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 14, marginBottom: 28 }}>
        <StatCard label="Total Students" value={stats.studentCount} icon={Users} color="var(--accent)" bg="var(--accent-light)" sub={user.role === 'admin' ? `${CLASSES.length} classes` : '1 class assigned'} />
        <StatCard label="Present Sessions" value={stats.totalPresent} icon={CheckCircle} color="var(--success)" bg="var(--success-light)" sub="All time" />
        <StatCard label="Absent Sessions" value={stats.totalAbsent} icon={XCircle} color="var(--danger)" bg="var(--danger-light)" sub="All time" />
        <StatCard label="At Risk Students" value={atRisk.length} icon={AlertTriangle} color="var(--warning)" bg="var(--warning-light)" sub="Below 75% attendance" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 18, alignItems: 'start' }}>
        {/* Chart */}
        <div style={{ background: '#fff', border: '1px solid var(--gray-200)', borderRadius: 'var(--radius)', padding: '20px', boxShadow: 'var(--shadow)' }}>
          <h3 style={{ fontSize: 15, fontWeight: 600, color: 'var(--gray-800)', marginBottom: 16 }}>Monthly Attendance Overview</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={monthlyData} barSize={14}>
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#9ca3af' }} />
              <YAxis tick={{ fontSize: 12, fill: '#9ca3af' }} />
              <Tooltip contentStyle={{ fontSize: 13, borderRadius: 8, border: '1px solid var(--gray-200)' }} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Bar dataKey="present" fill="#10b981" name="Present" radius={[3, 3, 0, 0]} />
              <Bar dataKey="late" fill="#f59e0b" name="Late" radius={[3, 3, 0, 0]} />
              <Bar dataKey="absent" fill="#ef4444" name="Absent" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* At risk */}
        <div style={{ background: '#fff', border: '1px solid var(--gray-200)', borderRadius: 'var(--radius)', padding: '20px', boxShadow: 'var(--shadow)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
            <AlertTriangle size={16} color="var(--warning)" />
            <h3 style={{ fontSize: 15, fontWeight: 600, color: 'var(--gray-800)' }}>At-Risk Students</h3>
          </div>
          {atRisk.length === 0 ? (
            <p style={{ color: 'var(--gray-400)', fontSize: 13, textAlign: 'center', padding: '20px 0' }}>All students are above 75% 🎉</p>
          ) : atRisk.map(s => {
            const st = getStudentStats(s.id);
            return (
              <div key={s.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '9px 0', borderBottom: '1px solid var(--gray-100)' }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--gray-800)' }}>{s.name}</div>
                  <div style={{ fontSize: 11, color: 'var(--gray-400)' }}>{s.rollNo}</div>
                </div>
                <div style={{
                  fontSize: 12, fontWeight: 700, color: st.percentage < 60 ? 'var(--danger)' : 'var(--warning)',
                  background: st.percentage < 60 ? 'var(--danger-light)' : 'var(--warning-light)',
                  padding: '3px 8px', borderRadius: 20,
                }}>
                  {st.percentage}%
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Today's snapshot */}
      <div style={{ background: '#fff', border: '1px solid var(--gray-200)', borderRadius: 'var(--radius)', padding: '20px', boxShadow: 'var(--shadow)', marginTop: 18 }}>
        <h3 style={{ fontSize: 15, fontWeight: 600, color: 'var(--gray-800)', marginBottom: 14 }}>
          Today's Attendance — {CLASSES.find(c => c.id === classId)?.name}
        </h3>
        {todayRecords.every(r => !r.status) ? (
          <p style={{ color: 'var(--gray-400)', fontSize: 13 }}>Attendance has not been marked yet today.</p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 8 }}>
            {todayRecords.map(r => (
              <div key={r.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', background: 'var(--gray-50)', borderRadius: 8 }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 500 }}>{r.name}</div>
                  <div style={{ fontSize: 11, color: 'var(--gray-400)' }}>{r.rollNo}</div>
                </div>
                <StatusBadge status={r.status} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
