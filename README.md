# EduTrack — Attendance Management System

A role-based school/university attendance management system built with React. Admins and teachers can mark daily attendance, track student performance, flag at-risk students, and export reports as CSV.

---

## Features

- **Role-based access** — Admin sees all classes; Teachers see only their assigned class
- **Mark attendance** — Mark students as Present / Late / Absent per class per day
- **At-risk alerts** — Automatically flags students below 75% attendance
- **Analytics dashboard** — Monthly bar charts, pie charts, top/bottom performers
- **Student history** — Expand any student to see their last 10 sessions
- **CSV export** — Download attendance reports for any class
- **Persistent state** — All data saved to localStorage (no backend needed)

---

## Tech Stack

| Tool | Purpose |
|---|---|
| React 18 | UI framework |
| React Router v6 | Client-side routing |
| Recharts | Charts and data visualisation |
| Lucide React | Icon library |
| localStorage | Data persistence |
| Context API | Global state management |

---

## Getting Started

### Prerequisites
- Node.js v16 or higher
- npm or yarn

### Installation

```bash
# Clone the repo
git clone https://github.com/YOUR_USERNAME/attendance-tracker.git
cd attendance-tracker

# Install dependencies
npm install

# Start the development server
npm start
```

The app will open at `http://localhost:3000`

---

## Demo Accounts

| Role | Email | Password |
|---|---|---|
| Admin | admin@university.edu | admin123 |
| Teacher | teacher@university.edu | teacher123 |

\u003e **Admin** can access all 4 classes, view reports, and manage all students.  
\u003e **Teacher** can only access their assigned class (CS 101).

---

## Project Structure

```
src/
├── components/
│   ├── Sidebar.js          # Navigation sidebar
│   ├── StatCard.js         # Reusable metric card
│   └── StatusBadge.js      # Present / Absent / Late badge
├── context/
│   └── AppContext.js       # Auth + attendance state
├── data/
│   └── mockData.js         # Students, classes, seed attendance
├── pages/
│   ├── Login.js            # Login screen
│   ├── Dashboard.js        # Overview + charts
│   ├── MarkAttendance.js   # Daily attendance marking
│   ├── Students.js         # Student list + stats
│   └── Reports.js          # Analytics (admin only)
└── utils/
    └── helpers.js          # CSV export, date formatting
```

---

## Screenshots

\u003e Add screenshots here after running the app locally.

---

## Deployment

Deploy instantly with [Vercel](https://vercel.com):

```bash
npm install -g vercel
vercel
```

Or with [Netlify](https://netlify.com):
```bash
npm run build
# Drag the /build folder into Netlify's dashboard
```

---

## Future Improvements

- [ ] Firebase backend for real-time multi-user sync
- [ ] Email/SMS alerts for at-risk students
- [ ] PDF report card generation per student
- [ ] Timetable integration
- [ ] Parent portal view

---

## License

MIT — free to use and modify.
