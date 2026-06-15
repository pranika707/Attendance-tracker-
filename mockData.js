export const CLASSES = [
  { id: 'cs101', name: 'CS 101 — Intro to Programming', teacher: 'Dr. Sarah Ahmed', students: 28 },
  { id: 'math201', name: 'Math 201 — Calculus II', teacher: 'Prof. James Liu', students: 32 },
  { id: 'eng301', name: 'ENG 301 — Technical Writing', teacher: 'Dr. Nora Hassan', students: 24 },
  { id: 'phy102', name: 'PHY 102 — Physics I', teacher: 'Prof. Kevin Park', students: 30 },
];

export const STUDENTS = [
  { id: 's001', name: 'Aisha Rahman', rollNo: 'CS-001', classId: 'cs101', email: 'aisha@university.edu' },
  { id: 's002', name: 'Omar Khalid', rollNo: 'CS-002', classId: 'cs101', email: 'omar@university.edu' },
  { id: 's003', name: 'Fatima Malik', rollNo: 'CS-003', classId: 'cs101', email: 'fatima@university.edu' },
  { id: 's004', name: 'Bilal Hassan', rollNo: 'CS-004', classId: 'cs101', email: 'bilal@university.edu' },
  { id: 's005', name: 'Zara Ahmed', rollNo: 'CS-005', classId: 'cs101', email: 'zara@university.edu' },
  { id: 's006', name: 'Tariq Siddiqui', rollNo: 'CS-006', classId: 'cs101', email: 'tariq@university.edu' },
  { id: 's007', name: 'Hana Yousuf', rollNo: 'CS-007', classId: 'cs101', email: 'hana@university.edu' },
  { id: 's008', name: 'Imran Sheikh', rollNo: 'CS-008', classId: 'cs101', email: 'imran@university.edu' },
  { id: 's009', name: 'Layla Noor', rollNo: 'MT-001', classId: 'math201', email: 'layla@university.edu' },
  { id: 's010', name: 'Yousef Amin', rollNo: 'MT-002', classId: 'math201', email: 'yousef@university.edu' },
  { id: 's011', name: 'Sara Javed', rollNo: 'MT-003', classId: 'math201', email: 'sara@university.edu' },
  { id: 's012', name: 'Ali Raza', rollNo: 'MT-004', classId: 'math201', email: 'ali@university.edu' },
  { id: 's013', name: 'Dina Farhat', rollNo: 'EN-001', classId: 'eng301', email: 'dina@university.edu' },
  { id: 's014', name: 'Kareem Saleh', rollNo: 'EN-002', classId: 'eng301', email: 'kareem@university.edu' },
  { id: 's015', name: 'Mariam Tahir', rollNo: 'PH-001', classId: 'phy102', email: 'mariam@university.edu' },
  { id: 's016', name: 'Hassan Mirza', rollNo: 'PH-002', classId: 'phy102', email: 'hassan@university.edu' },
];

// Generate seed attendance records for the past 20 days
function generateSeedAttendance() {
  const records = {};
  const today = new Date();

  for (let d = 19; d >= 0; d--) {
    const date = new Date(today);
    date.setDate(today.getDate() - d);
    if (date.getDay() === 0 || date.getDay() === 6) continue; // skip weekends

    const dateStr = date.toISOString().split('T')[0];
    records[dateStr] = {};

    STUDENTS.forEach((student) => {
      const rand = Math.random();
      records[dateStr][student.id] = rand > 0.15 ? 'present' : rand > 0.08 ? 'late' : 'absent';
    });
  }
  return records;
}

export const SEED_ATTENDANCE = generateSeedAttendance();

export const USERS = [
  { id: 'u1', name: 'Admin User', email: 'admin@university.edu', password: 'admin123', role: 'admin' },
  { id: 'u2', name: 'Dr. Sarah Ahmed', email: 'teacher@university.edu', password: 'teacher123', role: 'teacher', classId: 'cs101' },
];
