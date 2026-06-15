import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { STUDENTS, CLASSES } from '../data/mockData';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Download, ChevronDown } from 'lucide-react';
import { exportToCSV } from '../utils/helpers';

const COLORS = ['#10b981', '#f59e0b', '#ef4444'];

export default function Reports() {
  const { getStudentStats, getMonthlyData } = useApp();
  const [selectedClass, setSelectedClass] = useState('cs101');

  const classStudents = STUDENTS.filter(s => s.classId === selectedClass);
  const monthlyData = getMonthlyData(selectedClass);

  const totals = classStudents.reduce((acc, s) => {
    const st = getStudentStats(s.id);
    acc.present += st.present;
    acc.absent += st.absent;
    acc.late += st.late;
    return acc;
  }, { present: 0, absent: 0, late: 0 });

  const pieData = [
    { name: 'Present', value: totals.present },
    { name: 'Late', value: totals.late },
    { name: 'Absent', value: totals.absent },
  ];

  const topAttendees = [...classStudents]
    .map(s => ({ ...s, ...getStudentStats(s.id) }))
    .sort((a, b) => b.percentage - a.percentage)
    .slice(0, 5);

  const bottomAttendees = [...classStudents]
    .map(s => ({ ...s, ...getStudentStats(s.id) }))
    .sort((a, b) => a.percentage - b.percentage)
    .slice(0, 5);

  const handleExport = () => {
    const data = classStudents.map(s => {
      const st = getStudentStats(s.id);
      return {
        Name: s.name, 'Roll No': s.rollNo, Email: s.email,
        Present: st.present, Late: st.late, Absent: st.absent,
        Total: st.total, 'Attendance %': st.percentage + '%',
        Status: st.percentage >= 75 ? 'On Track' : 'At Risk',
      };
    });
    exportToCSV(data, `${selectedClass}-attendance-report.csv`);
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: 'var(--gray-800)', letterSpacing: '-0.3px' }}>Reports</h1>
          <p style={{ color: 'var(--gray-400)', fontSize: 14, marginTop: 2 }}>Analytics and export for each class</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <div style={{ position: 'relative' }}>
            <select value={selectedClass} onChange={e => setSelectedClass(e.target.value)}
              style={{ padding: '9px 32px 9px 12px', border: '1px solid var(--gray-200)', borderRadius: 8, fontSize: 14, appearance: 'none', background: '#fff' }}>
              {CLASSES.map(c => <option key={c.id} value={c.id}>{c.name.split('—')[0].trim()}</option>)}
            </select>
            <ChevronDown size={15} style={{ position: 'absolute', right: 9, top: '50%', transform: 'translateY(-50%)', color: 'var(--gray-400)', pointerEvents: 'none' }} />
          </div>
          <button onClick={handleExport} style={{
            display: 'flex', alignItems: 'center', gap: 7, padding: '9px 16px',
            background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: 8,
            fontSize: 13, fontWeight: 600, cursor: 'pointer',
          }}>
            <Download size={15} /> Export CSV
          </button>
        </div>
      </div>

      {/* Summary cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, marginBottom: 20 }}>
        {[
          { label: 'Total Present', value: totals.present, color: '#10b981', bg: '#ecfdf5' },
          { label: 'Total Late', value: totals.late, color: '#f59e0b', bg: '#fffbeb' },
          { label: 'Total Absent', value: totals.absent, color: '#ef4444', bg: '#fef2f2' },
        ].map(item => (
          <div key={item.label} style={{ background: '#fff', border: '1px solid var(--gray-200)', borderRadius: 'var(--radius)', padding: '16px 20px' }}>
            <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--gray-600)', marginBottom: 6 }}>{item.label}</div>
            <div style={{ fontSize: 28, fontWeight: 700, color: item.color }}>{item.value}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 18, marginBottom: 18 }}>
        {/* Monthly bar chart */}
        <div style={{ background: '#fff', border: '1px solid var(--gray-200)', borderRadius: 'var(--radius)', padding: '20px', boxShadow: 'var(--shadow)' }}>
          <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 16 }}>Monthly Breakdown</h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={monthlyData} barSize={14}>
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#9ca3af' }} />
              <YAxis tick={{ fontSize: 12, fill: '#9ca3af' }} />
              <Tooltip contentStyle={{ fontSize: 13, borderRadius: 8 }} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Bar dataKey="present" fill="#10b981" name="Present" radius={[3, 3, 0, 0]} />
              <Bar dataKey="late" fill="#f59e0b" name="Late" radius={[3, 3, 0, 0]} />
              <Bar dataKey="absent" fill="#ef4444" name="Absent" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie chart */}
        <div style={{ background: '#fff', border: '1px solid var(--gray-200)', borderRadius: 'var(--radius)', padding: '20px', boxShadow: 'var(--shadow)' }}>
          <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 16 }}>Overall Distribution</h3>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" paddingAngle={3}>
                {pieData.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
              </Pie>
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top & bottom */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
        {[{ title: '🏆 Best Attendance', data: topAttendees, color: 'var(--success)' },
          { title: '⚠️ Needs Attention', data: bottomAttendees, color: 'var(--danger)' }]
          .map(({ title, data, color }) => (
            <div key={title} style={{ background: '#fff', border: '1px solid var(--gray-200)', borderRadius: 'var(--radius)', padding: '20px', boxShadow: 'var(--shadow)' }}>
              <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 14 }}>{title}</h3>
              {data.map((s, i) => (
                <div key={s.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 0', borderBottom: i < data.length - 1 ? '1px solid var(--gray-100)' : 'none' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ fontSize: 12, color: 'var(--gray-400)', minWidth: 16 }}>{i + 1}</span>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 500 }}>{s.name}</div>
                      <div style={{ fontSize: 11, color: 'var(--gray-400)' }}>{s.rollNo}</div>
                    </div>
                  </div>
                  <span style={{ fontWeight: 700, fontSize: 13, color, background: color === 'var(--success)' ? 'var(--success-light)' : 'var(--danger-light)', padding: '3px 8px', borderRadius: 20 }}>
                    {s.percentage}%
                  </span>
                </div>
              ))}
            </div>
          ))}
      </div>
    </div>
  );
}
