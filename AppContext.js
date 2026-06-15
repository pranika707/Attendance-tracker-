import React, { createContext, useContext, useState, useEffect } from 'react';
import { USERS, SEED_ATTENDANCE, STUDENTS } from '../data/mockData';

const AppContext = createContext();
export const useApp = () => useContext(AppContext);

export function AppProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('edu_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [attendance, setAttendance] = useState(() => {
    const saved = localStorage.getItem('edu_attendance');
    return saved ? JSON.parse(saved) : SEED_ATTENDANCE;
  });

  useEffect(() => {
    localStorage.setItem('edu_attendance', JSON.stringify(attendance));
  }, [attendance]);

  const login = (email, password) => {
    const found = USERS.find(u => u.email === email && u.password === password);
    if (found) {
      const { password: _, ...safeUser } = found;
      setUser(safeUser);
      localStorage.setItem('edu_user', JSON.stringify(safeUser));
      return { success: true };
    }
    return { success: false, error: 'Invalid email or password.' };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('edu_user');
  };

  const markAttendance = (date, classId, records) => {
    setAttendance(prev => ({
      ...prev,
      [date]: { ...(prev[date] || {}), ...records },
    }));
  };

  // Returns { present, absent, late, total, percentage } for a student
  const getStudentStats = (studentId) => {
    let present = 0, absent = 0, late = 0;
    Object.values(attendance).forEach(dayRecord => {
      const status = dayRecord[studentId];
      if (status === 'present') present++;
      else if (status === 'absent') absent++;
      else if (status === 'late') late++;
    });
    const total = present + absent + late;
    const percentage = total > 0 ? Math.round(((present + late * 0.5) / total) * 100) : 0;
    return { present, absent, late, total, percentage };
  };

  // Returns attendance for a specific date and class
  const getClassAttendance = (date, classId) => {
    const classStudents = STUDENTS.filter(s => s.classId === classId);
    const dayRecord = attendance[date] || {};
    return classStudents.map(s => ({ ...s, status: dayRecord[s.id] || null }));
  };

  // Monthly summary for charts
  const getMonthlyData = (classId) => {
    const classStudents = STUDENTS.filter(s => s.classId === classId);
    const months = {};
    Object.entries(attendance).forEach(([date, records]) => {
      const month = date.slice(0, 7);
      if (!months[month]) months[month] = { present: 0, absent: 0, late: 0, days: 0 };
      const dayPresent = classStudents.filter(s => records[s.id] === 'present').length;
      const dayAbsent = classStudents.filter(s => records[s.id] === 'absent').length;
      const dayLate = classStudents.filter(s => records[s.id] === 'late').length;
      months[month].present += dayPresent;
      months[month].absent += dayAbsent;
      months[month].late += dayLate;
      months[month].days += 1;
    });
    return Object.entries(months).map(([month, data]) => ({
      month: new Date(month + '-01').toLocaleString('default', { month: 'short', year: '2-digit' }),
      ...data,
    }));
  };

  return (
    <AppContext.Provider value={{ user, login, logout, attendance, markAttendance, getStudentStats, getClassAttendance, getMonthlyData }}>
      {children}
    </AppContext.Provider>
  );
}
