import { useMemo, useState } from 'react';
import './App.css';
import logo from './assets/csulb_logo.png';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import EventNoteIcon from '@mui/icons-material/EventNote';
import SchoolIcon from '@mui/icons-material/School';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import TaskAltIcon from '@mui/icons-material/TaskAlt';

const schedule = [
  {
    course: 'CECS 448-01',
    meeting: 'TuTh 11:00 AM - 12:15 PM',
    room: 'ECS Room 308'
  },
  {
    course: 'CECS 427-01',
    meeting: 'TuTh 12:30 PM - 1:45 PM',
    room: 'VEC Room 518'
  },
  {
    course: 'CECS 491B-08',
    meeting: 'TuTh 2:00 PM - 3:15 PM',
    room: 'ECS Room 413'
  },
  {
    course: 'CECS 327-01',
    meeting: 'TuTh 3:30 PM - 4:45 PM',
    room: 'ECS Room 105'
  },
  {
    course: 'CECS 470-01',
    meeting: 'MoWe 3:30 PM - 4:45 PM',
    room: 'ECS Room 405'
  }
];

const quickActions = [
  'View Financial Aid',
  'Search Classes',
  'Enroll',
  'Degree Planner',
  'My Textbooks',
  'Make a Payment'
];

const resources = [
  'Program Advisor (Computer Science)',
  'Student Health Services',
  'Campus Housing',
  'Parking Permit Purchase'
];

const dayOrder = {
  Mo: 1,
  Tu: 2,
  We: 3,
  Th: 4,
  Fr: 5,
  Sa: 6,
  Su: 7
};

function getMeetingSortValue(meeting) {
  const meetingMatch = meeting.match(/([A-Za-z]+)\s+(\d{1,2}):(\d{2})\s+(AM|PM)/);

  if (!meetingMatch) {
    return Number.MAX_SAFE_INTEGER;
  }

  const meetingDays = meetingMatch[1].match(/Mo|Tu|We|Th|Fr|Sa|Su/g) || [];
  const firstDay = meetingDays[0] || 'Su';
  const hours = Number.parseInt(meetingMatch[2], 10);
  const minutes = Number.parseInt(meetingMatch[3], 10);
  const period = meetingMatch[4];
  const normalizedHour = (hours % 12) + (period === 'PM' ? 12 : 0);

  return dayOrder[firstDay] * 1440 + normalizedHour * 60 + minutes;
}

function App() {
  const [actionQuery, setActionQuery] = useState('');
  const [scheduleSort, setScheduleSort] = useState('date');

  const visibleSchedule = useMemo(() => {
    const scheduleCopy = [...schedule];

    if (scheduleSort === 'name') {
      return scheduleCopy.sort((a, b) => a.course.localeCompare(b.course));
    }

    return scheduleCopy.sort((a, b) => {
      const aSortValue = getMeetingSortValue(a.meeting);
      const bSortValue = getMeetingSortValue(b.meeting);

      if (aSortValue !== bSortValue) {
        return aSortValue - bSortValue;
      }

      return a.course.localeCompare(b.course);
    });
  }, [scheduleSort]);

  const filteredQuickActions = useMemo(() => {
    const normalizedQuery = actionQuery.trim().toLowerCase();

    if (!normalizedQuery) {
      return quickActions;
    }

    return quickActions.filter((action) => action.toLowerCase().includes(normalizedQuery));
  }, [actionQuery]);

  return (
    <div className="student-center-app">
      <header className="topbar">
        <button className="icon-button" type="button" aria-label="Open navigation menu">
          <MenuIcon className="topbar-icon" />
        </button>
        <img src={logo} className="csulb-logo" alt="CSULB logo" />
        <button className="icon-button" type="button" aria-label="Open account menu">
          <AccountCircleIcon className="topbar-icon" />
        </button>
      </header>

      <main className="dashboard">
        <section className="hero-card card">
          <p className="eyebrow">Francisco&apos;s Student Center</p>
          <h1>Welcome back, Francisco</h1>
          <p>Everything important first: your classes, deadlines, finances, and must-do items.</p>
          <div className="status-row">
            <span className="status-pill good">
              <TaskAltIcon fontSize="small" /> No Holds
            </span>
            <span className="status-pill good">
              <AttachMoneyIcon fontSize="small" /> No Outstanding Charges
            </span>
            <span className="status-pill warning">
              <WarningAmberIcon fontSize="small" /> Review Student Fee Information
            </span>
          </div>
        </section>

        <section className="grid-main-side">
          <article className="card classes-priority">
            <div className="card-title-row">
              <SchoolIcon />
              <h2>Today&apos;s Schedule</h2>
            </div>
            <p className="section-subtitle">Classes first, so you can quickly see what is next.</p>
            <div className="schedule-content-box">
              <p className="focus-hint">Showing your full class schedule for today.</p>
              <div className="schedule-sort-controls" role="group" aria-label="Sort schedule">
                <button
                  className={`schedule-sort-button ${scheduleSort === 'date' ? 'is-active' : ''}`}
                  type="button"
                  onClick={() => setScheduleSort('date')}
                >
                  Date/Time Order
                </button>
                <button
                  className={`schedule-sort-button ${scheduleSort === 'name' ? 'is-active' : ''}`}
                  type="button"
                  onClick={() => setScheduleSort('name')}
                >
                  Name Order
                </button>
              </div>
              <ul className="schedule-list">
                {visibleSchedule.map((item) => (
                  <li key={item.course}>
                    <h3>{item.course}</h3>
                    <p>{item.meeting}</p>
                    <span>{item.room}</span>
                  </li>
                ))}
              </ul>
            </div>
          </article>

          <article className="card stack finance-priority">
            <div>
              <h2>Finances</h2>
              <p className="section-subtitle">Your account and aid summary.</p>
              <div className="metric-row side-metrics">
                <div>
                  <p className="metric-label">Outstanding Charges</p>
                  <p className="metric-value">$0.00</p>
                </div>
                <div>
                  <p className="metric-label">Financial Aid Estimate</p>
                  <p className="metric-value">$4,850.00</p>
                </div>
                <div>
                  <p className="metric-label">Account Status</p>
                  <p className="metric-value">Clear</p>
                </div>
              </div>
              <button className="financial-aid-button" type="button">
                View Financial Aid Details
              </button>
            </div>

            <div className="priority-checklist-box">
              <div className="card-title-row">
                <EventNoteIcon />
                <h2>Priority Checklist</h2>
              </div>
              <p className="section-subtitle">What needs attention right now.</p>
              <ul className="checklist">
                <li>To Do List: No items</li>
                <li>Admissions: No pending applications</li>
                <li>Financial Aid: Ready to review awards</li>
                <li>Enrollment Dates: Open enrollment available</li>
              </ul>
            </div>
          </article>
        </section>

        <section className="grid-two">
          <article className="card quick-actions-priority">
            <h2>Quick Actions</h2>
            <label className="search-label" htmlFor="quick-actions-search">
              Find an action quickly
            </label>
            <input
              id="quick-actions-search"
              className="action-search"
              type="search"
              value={actionQuery}
              onChange={(event) => setActionQuery(event.target.value)}
              placeholder="Search actions..."
            />
            <div className="actions-grid">
              {filteredQuickActions.map((action) => (
                <button key={action} className="action-button" type="button">
                  {action}
                </button>
              ))}
            </div>
            {filteredQuickActions.length === 0 ? (
              <p className="focus-hint">No matches. Try a broader keyword.</p>
            ) : null}
          </article>

          <article className="card resources-priority">
            <h2>Support & Resources</h2>
            <ul className="resource-list">
              {resources.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
        </section>
      </main>
    </div>
  );
}

export default App;
