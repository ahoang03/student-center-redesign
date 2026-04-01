import { useEffect, useMemo, useState } from 'react';
import './App.css';
import logo from './assets/csulb_logo.png';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import EventNoteIcon from '@mui/icons-material/EventNote';
import SchoolIcon from '@mui/icons-material/School';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import BoltIcon from '@mui/icons-material/Bolt';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import CloseIcon from '@mui/icons-material/Close';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import PersonIcon from '@mui/icons-material/Person';
import HomeIcon from '@mui/icons-material/Home';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import EditIcon from '@mui/icons-material/Edit';
import DashboardIcon from '@mui/icons-material/Dashboard';

const schedule = [
  {
    course: 'CECS 448-01',
    meeting: 'TuTh 11:00 AM - 12:15 PM',
    room: 'ECS Room 308',
  },
  {
    course: 'CECS 427-01',
    meeting: 'TuTh 12:30 PM - 1:45 PM',
    room: 'VEC Room 518',
  },
  {
    course: 'CECS 491B-08',
    meeting: 'TuTh 2:00 PM - 3:15 PM',
    room: 'ECS Room 413',
  },
  {
    course: 'CECS 327-01',
    meeting: 'TuTh 3:30 PM - 4:45 PM',
    room: 'ECS Room 105',
  },
  {
    course: 'CECS 470-01',
    meeting: 'MoWe 3:30 PM - 4:45 PM',
    room: 'ECS Room 405',
  },
];

const initialPlannerClasses = [
  {
    id: 'cecs-455',
    code: 'CECS 455-01',
    title: 'Senior Project Prep',
    meeting: 'MoWe 10:00 AM - 11:15 AM',
    room: 'ECS Room 120',
    units: '3',
  },
  {
    id: 'cecs-378',
    code: 'CECS 378-02',
    title: 'Intro to Cybersecurity',
    meeting: 'TuTh 9:30 AM - 10:45 AM',
    room: 'VEC Room 201',
    units: '3',
  },
  {
    id: 'cecs-429',
    code: 'CECS 429-03',
    title: 'Web Development',
    meeting: 'TuTh 4:00 PM - 5:15 PM',
    room: 'ECS Room 210',
    units: '3',
  },
];

const quickActions = ['Search Classes', 'Degree Planner', 'My Textbooks', 'Transcripts'];

const resources = [
  { label: 'Register to Vote', href: 'https://registertovote.ca.gov/' },
  { label: 'Student Involvement & Rep Fee', href: 'https://www.csulb.edu/student-records/tuition-and-fees' },
  { label: 'CalFresh', href: 'https://www.getcalfresh.org/' },
  { label: 'CSU Freedom of Expression', href: 'https://www.calstate.edu/freedom-of-expression' },
  { label: 'Program Advisor (Computer Science)', href: 'https://www.csulb.edu/college-of-engineering/advising-center' },
  { label: 'Student Health Services', href: 'https://www.csulb.edu/student-affairs/student-health-services' },
];

const calendarDays = ['Mo', 'Tu', 'We', 'Th', 'Fr'];
const PERSONAL_INFO_STORAGE_KEY = 'csulbStudentCenterPersonalInfo';
const defaultPersonalInfo = {
  names: 'Francisco Ramirez',
  homeAddress: '1250 Bellflower Blvd, Long Beach, CA 90840',
  mailingAddress: 'P.O. Box 1284, Long Beach, CA 90801',
  preferredPhone: '(562) 555-0182',
  preferredEmail: 'francisco.ramirez@student.csulb.edu',
  demographicData: 'Hispanic/Latino, First-Generation Student',
  emergencyContact: 'Mariana Ramirez - (562) 555-0199',
  userPreference: 'Email notifications for academics and finances',
  privacySettings: 'Directory profile limited to campus staff',
};

const dayOrder = {
  Mo: 1,
  Tu: 2,
  We: 3,
  Th: 4,
  Fr: 5,
  Sa: 6,
  Su: 7,
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
  const [page, setPage] = useState('dashboard');
  const [actionQuery, setActionQuery] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [scheduleSort, setScheduleSort] = useState('date');
  const [scheduleDayFilter, setScheduleDayFilter] = useState('all');
  const [plannerQuery, setPlannerQuery] = useState('');
  const [plannerClasses, setPlannerClasses] = useState(initialPlannerClasses);
  const [enrollmentCart, setEnrollmentCart] = useState([]);
  const [newClassForm, setNewClassForm] = useState({
    code: '',
    title: '',
    meeting: '',
    room: '',
    units: '3',
  });
  // eslint-disable-next-line no-unused-vars
  const [personalInfo, setPersonalInfo] = useState(() => {
    try {
      const saved = window.localStorage.getItem(PERSONAL_INFO_STORAGE_KEY);
      return saved ? { ...defaultPersonalInfo, ...JSON.parse(saved) } : defaultPersonalInfo;
    } catch {
      return defaultPersonalInfo;
    }
  });
  const [notice, setNotice] = useState(null);

  const outstandingCharges = 0;
  const enrollmentDate = new Date('2026-04-01T08:00:00');
  const enrollmentEndDate = new Date('2026-08-15T23:59:59');
  const today = new Date();
  const canMakePayment = outstandingCharges > 0;
  const canEnroll = today >= enrollmentDate && today <= enrollmentEndDate;
  const canSubmitEnrollment = canEnroll && enrollmentCart.length > 0;

  const [aidSelections, setAidSelections] = useState({
    pell: 'accept',
    calGrant: 'accept',
    loanA: 'decline',
    loanB: 'decline',
  });

  const visibleSchedule = useMemo(() => {
    const filteredSchedule = schedule.filter((item) => {
      if (scheduleDayFilter === 'all') {
        return true;
      }

      if (scheduleDayFilter === 'mw') {
        return item.meeting.includes('Mo') || item.meeting.includes('We');
      }

      if (scheduleDayFilter === 'tuth') {
        return item.meeting.includes('Tu') || item.meeting.includes('Th');
      }

      return item.meeting.includes(scheduleDayFilter);
    });

    const scheduleCopy = [...filteredSchedule];

    if (scheduleSort === 'name') {
      return scheduleCopy.sort((a, b) => a.course.localeCompare(b.course));
    }

    if (scheduleSort === 'room') {
      return scheduleCopy.sort((a, b) => a.room.localeCompare(b.room));
    }

    return scheduleCopy.sort((a, b) => {
      const aSortValue = getMeetingSortValue(a.meeting);
      const bSortValue = getMeetingSortValue(b.meeting);

      if (aSortValue !== bSortValue) {
        return aSortValue - bSortValue;
      }

      return a.course.localeCompare(b.course);
    });
  }, [scheduleSort, scheduleDayFilter]);

  const filteredQuickActions = useMemo(() => {
    const normalizedQuery = actionQuery.trim().toLowerCase();

    if (!normalizedQuery) {
      return quickActions;
    }

    return quickActions.filter((action) => action.toLowerCase().includes(normalizedQuery));
  }, [actionQuery]);

  const scheduleByDay = useMemo(() => {
    return calendarDays.reduce((accumulator, day) => {
      accumulator[day] = visibleSchedule.filter((item) => item.meeting.includes(day));
      return accumulator;
    }, {});
  }, [visibleSchedule]);

  const visiblePlannerClasses = useMemo(() => {
    const normalizedQuery = plannerQuery.trim().toLowerCase();
    if (!normalizedQuery) {
      return plannerClasses;
    }

    return plannerClasses.filter((item) => {
      return (
        item.code.toLowerCase().includes(normalizedQuery)
        || item.title.toLowerCase().includes(normalizedQuery)
        || item.room.toLowerCase().includes(normalizedQuery)
      );
    });
  }, [plannerClasses, plannerQuery]);

  function closeSidebar() {
    setIsClosing(true);

    setTimeout(() => {
      setSidebarOpen(false);
      setIsClosing(false);
    }, 250); // match animation duration
  }

  function handleAidChange(key, value) {
    setAidSelections((prev) => ({
      ...prev,
      [key]: value,
    }));
  }


  function showNotice(type, message) {
    setNotice({ type, message });
    window.setTimeout(() => {
      setNotice((current) => (current?.message === message ? null : current));
    }, 3600);
  }

  function handleViewFinancialDetails() {
    showNotice('success', 'CSULB Notice: Financial detail page opened successfully.');
  }

  function handleAcceptLoans() {
    showNotice('success', 'CSULB Notice: Successfully accepted your loan package.');
  }

  function handleMakePayment() {
    if (!canMakePayment) {
      showNotice('warning', 'CSULB Notice: Make a Payment is unavailable because no balance is due.');
      return;
    }

    showNotice('success', 'CSULB Notice: Payment submitted successfully.');
  }

  function handleViewEnrollmentStatus() {
    showNotice('success', 'CSULB Notice: Enrollment status loaded for your selected term.');
  }

  function handleSubmitEnrollment() {
    if (enrollmentCart.length === 0) {
      showNotice('warning', 'CSULB Notice: Add classes to your enrollment cart before submitting enrollment.');
      return;
    }

    if (!canEnroll) {
      showNotice('warning', 'CSULB Notice: Enrollment is currently closed for this period.');
      return;
    }

    showNotice('success', 'CSULB Notice: Successfully enrolled in selected classes.');
    setEnrollmentCart([]);
  }

  function handleAddClassToCart(classItem) {
    const exists = enrollmentCart.some((item) => item.id === classItem.id);
    if (exists) {
      showNotice('warning', `CSULB Notice: ${classItem.code} is already in your cart.`);
      return;
    }

    setEnrollmentCart((current) => [...current, classItem]);
    showNotice('success', `CSULB Notice: ${classItem.code} added to your enrollment cart.`);
  }

  function handleRemoveFromCart(classId) {
    setEnrollmentCart((current) => current.filter((item) => item.id !== classId));
    showNotice('success', 'CSULB Notice: Class removed from cart.');
  }

  function handleNewClassFormChange(field, value) {
    setNewClassForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function handleCreateNewClass() {
    if (!newClassForm.code.trim() || !newClassForm.title.trim() || !newClassForm.meeting.trim() || !newClassForm.room.trim()) {
      showNotice('warning', 'CSULB Notice: Complete all class fields before adding a new class.');
      return;
    }

    const duplicateCode = plannerClasses.some(
      (item) => item.code.toLowerCase() === newClassForm.code.trim().toLowerCase(),
    );

    if (duplicateCode) {
      showNotice('warning', 'CSULB Notice: A class with this course code already exists.');
      return;
    }

    const createdClass = {
      id: `custom-${Date.now()}`,
      code: newClassForm.code.trim(),
      title: newClassForm.title.trim(),
      meeting: newClassForm.meeting.trim(),
      room: newClassForm.room.trim(),
      units: newClassForm.units || '3',
    };

    setPlannerClasses((current) => [createdClass, ...current]);
    setNewClassForm({
      code: '',
      title: '',
      meeting: '',
      room: '',
      units: '3',
    });
    showNotice('success', `CSULB Notice: ${createdClass.code} added to available classes.`);
  }

  useEffect(() => {
    try {
      window.localStorage.setItem(PERSONAL_INFO_STORAGE_KEY, JSON.stringify(personalInfo));
    } catch {
      setNotice({
        type: 'warning',
        message: 'CSULB Notice: Unable to save profile changes in this browser session.',
      });
    }
  }, [personalInfo]);

  return (
    <div className="student-center-app">
      <header className="topbar">
        <button className="icon-button" type="button" aria-label="Open navigation menu" onClick={() => {
  setSidebarOpen(true);
  setIsClosing(false);
}}>
          <MenuIcon className="topbar-icon" />
        </button>
        <img src={logo} className="csulb-logo" alt="CSULB logo" />
        <button className="icon-button" type="button" aria-label="Open account menu">
          <AccountCircleIcon className="topbar-icon" />
        </button>
      </header>

      {(sidebarOpen || isClosing) && (
        <div className="sidebar-overlay" onClick={closeSidebar}>
          <aside
            className={`sidebar ${isClosing ? 'closing' : ''}`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sidebar-header">
              <h2>Navigation</h2>
              <button className="icon-button sidebar-close" onClick={closeSidebar}>
                <CloseIcon sx={{ color: 'black' }}/>
              </button>
            </div>

            <nav className="sidebar-nav">
              <button
                className={`sidebar-link ${page === 'dashboard' ? 'active' : ''}`}
                onClick={() => { setPage('dashboard'); setSidebarOpen(false); }}
              >
                <DashboardIcon fontSize="small" /> Dashboard <ArrowForwardIosIcon className="button-arrow" fontSize="inherit" />
              </button>

              <button
                className={`sidebar-link ${page === 'planner' ? 'active' : ''}`}
                onClick={() => { setPage('planner'); setSidebarOpen(false); }}
              >
                <SchoolIcon fontSize="small" /> Class Planner <ArrowForwardIosIcon className="button-arrow" fontSize="inherit" />
              </button>

              <button
                className={`sidebar-link ${page === 'financialAid' ? 'active' : ''}`}
                onClick={() => { setPage('financialAid'); setSidebarOpen(false); }}
              >
                <AttachMoneyIcon fontSize="small" />Financial Aid <ArrowForwardIosIcon className="button-arrow" fontSize="inherit" />
              </button>
            </nav>
          </aside>
        </div>
      )}

      <main className="dashboard">
        {notice ? (
          <section className={`csulb-notice ${notice.type}`} role="status" aria-live="polite">
            <div className="notice-title-row">
              {notice.type === 'success' ? <CheckCircleIcon fontSize="small" /> : <ReportProblemIcon fontSize="small" />}
              <strong>CSULB Student Center Notification</strong>
              <button
                type="button"
                className="notice-close-button"
                aria-label="Dismiss notification"
                onClick={() => setNotice(null)}
              >
                <CloseIcon fontSize="small" />
              </button>
            </div>
            <p>{notice.message}</p>
          </section>
        ) : null}

        {page === 'dashboard' ? (
          <>
            <section className="hero-card card">
              <p className="eyebrow">Francisco&apos;s Student Center</p>
              <h1>Welcome back, Francisco</h1>
              <h2>Undergraduate Student in Computer Science</h2>
              <p className="enrollment-date-note">Enrollment Date: April 1, 2026</p>
              <div className="status-row">
                <button className="status-pill warning status-pill-button" type="button">
                  <WarningAmberIcon fontSize="small" /> View Important Alerts
                </button>
              </div>
            </section>

            <section className="grid-main-side">
              <article className="card classes-priority">
                <div className="card-title-row">
                  <SchoolIcon />
                  <h2>Weekly Schedule</h2>
                  <select className="schedule-term-select" defaultValue="Spring 2026">
                    <option>Spring 2026</option>
                    <option>Summer 2026</option>
                    <option>Fall 2026</option>
                  </select>
                </div>
                <div className="schedule-content-box">
                  <p className="focus-hint">Showing your full class schedule for today.</p>
                  <div className="calendar-view" aria-label="Weekly calendar view">
                    {calendarDays.map((day) => (
                      <div className="calendar-day" key={day}>
                        <h3>{day}</h3>
                        <ul>
                          {scheduleByDay[day].length > 0 ? (
                            scheduleByDay[day].map((item) => (
                              <li key={`${item.course}-${day}`}>
                                <strong>{item.course}</strong>
                                <span>{item.meeting.replace('MoWe ', '').replace('TuTh ', '')}</span>
                              </li>
                            ))
                          ) : (
                            <li className="calendar-empty">No class</li>
                          )}
                        </ul>
                      </div>
                    ))}
                  </div>
                  <div className="schedule-toolbar" role="group" aria-label="Schedule controls">
                    <label className="schedule-control" htmlFor="schedule-sort-select">
                      <span><AccessTimeIcon fontSize="small" /> Sort By</span>
                      <select
                        id="schedule-sort-select"
                        className="schedule-control-select"
                        value={scheduleSort}
                        onChange={(event) => setScheduleSort(event.target.value)}
                      >
                        <option value="date">Date/Time</option>
                        <option value="name">Course Name</option>
                        <option value="room">Room</option>
                      </select>
                    </label>
                    <label className="schedule-control" htmlFor="schedule-day-filter-select">
                      <span><FilterAltIcon fontSize="small" /> Day Filter</span>
                      <select
                        id="schedule-day-filter-select"
                        className="schedule-control-select"
                        value={scheduleDayFilter}
                        onChange={(event) => setScheduleDayFilter(event.target.value)}
                      >
                        <option value="all">All Days</option>
                        <option value="mw">Mon/Wed</option>
                        <option value="tuth">Tue/Thu</option>
                        <option value="Mo">Monday</option>
                        <option value="Tu">Tuesday</option>
                        <option value="We">Wednesday</option>
                        <option value="Th">Thursday</option>
                      </select>
                    </label>
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
                  <div className="card-title-row">
                    <AttachMoneyIcon className="finances-icon"/>
                    <h2>Finances</h2>
                  </div>
                  <p className="section-subtitle">Your account and aid summary.</p>
                  <span className="status-pill good">
                    <AttachMoneyIcon fontSize="small" /> No Outstanding Charges
                  </span>
                  <div className="metric-row side-metrics">
                    <div>
                      <p className="metric-label">Outstanding Charges</p>
                      <p className="metric-value">${outstandingCharges.toFixed(2)}</p>
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
                  <button className="financial-aid-button" type="button" onClick={handleViewFinancialDetails}>
                    View Financial Details <ArrowForwardIosIcon className="button-arrow" fontSize="inherit" />
                  </button>
                  <a
                    className="finance-link"
                    href="https://www.csulb.edu/financial-aid-and-scholarships/refunds"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    E-Refund Sign Up
                  </a>
                  <button className="financial-aid-button" type="button" onClick={() => setPage('financialAid')}>
                    Accept/Decline Award Package <ArrowForwardIosIcon className="button-arrow" fontSize="inherit" />
                  </button>
                  <button className="financial-aid-button" type="button" onClick={handleMakePayment} disabled={!canMakePayment}>
                    Make a Payment <ArrowForwardIosIcon className="button-arrow" fontSize="inherit" />
                  </button>
                </div>

                <div>
                  <h2>Enrollment</h2>
                  <p className="section-subtitle">Your enrollment status and deadlines.</p>
                  <span className="status-pill good">
                    <TaskAltIcon fontSize="small" /> No Holds
                  </span>
                  <div className="metric-row side-metrics">
                    <div style={{ textAlign: 'center' }}>
                      <p className="metric-label">Current Term</p>
                      <select className="term-select" defaultValue="Spring 2026">
                        <option>Spring 2026</option>
                        <option>Summer 2026</option>
                        <option>Fall 2026</option>
                      </select>
                    </div>
                    <div>
                      <p className="metric-label">Enrollment Date</p>
                      <p className="metric-value">April 1, 2026</p>
                    </div>
                    <div>
                      <p className="metric-label">Enrollment Deadline</p>
                      <p className="metric-value">August 15, 2026</p>
                    </div>
                    <div>
                      <p className="metric-label">Cart Items</p>
                      <p className="metric-value">{enrollmentCart.length}</p>
                    </div>
                  </div>
                  <button className="financial-aid-button" type="button" onClick={handleViewEnrollmentStatus}>
                    View Enrollment Status <ArrowForwardIosIcon className="button-arrow" fontSize="inherit" />
                  </button>
                  <button
                    className="financial-aid-button"
                    type="button"
                    onClick={() => setPage('planner')}
                  >
                    <ShoppingCartIcon fontSize="small" /> Open Class Planner
                    <ArrowForwardIosIcon className="button-arrow" fontSize="inherit" />
                  </button>
                  <button
                    className="financial-aid-button"
                    type="button"
                    onClick={handleSubmitEnrollment}
                    disabled={!canSubmitEnrollment}
                  >
                    <TaskAltIcon fontSize="small" /> Submit Enrollment
                    <ArrowForwardIosIcon className="button-arrow" fontSize="inherit" />
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
                <div className="card-title-row">
                  <BoltIcon />
                  <h2>Quick Actions</h2>
                </div>
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
                      {action} <ArrowForwardIosIcon className="button-arrow" fontSize="inherit" />
                    </button>
                  ))}
                </div>
                {filteredQuickActions.length === 0 ? (
                  <p className="focus-hint">No matches. Try a broader keyword.</p>
                ) : null}
              </article>

              <article className="card resources-priority">
                <div className="card-title-row">
                  <SupportAgentIcon />
                  <h2>Support & Resources</h2>
                </div>
                <ul className="resource-list">
                  {resources.map((item) => (
                    <li key={item.label}>
                      <a href={item.href} target="_blank" rel="noopener noreferrer">
                        {item.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </article>
            </section>

            <section className="grid-two">
              <article className="card personal-info-priority">
                <div className="card-title-row">
                  <PersonIcon />
                  <h2>Personal Information</h2>
                </div>
            
            <div className="personal-info-content">
              <div className="info-display-section">
                <h3 className="info-section-title">Contact Information</h3>
                
                <div className="info-item">
                  <div className="info-icon">
                    <HomeIcon fontSize="small" />
                  </div>
                  <div className="info-details">
                    <p className="info-label">Home Address</p>
                    <p className="info-value">{personalInfo.homeAddress}</p>
                  </div>
                </div>

                <div className="info-item">
                  <div className="info-icon">
                    <HomeIcon fontSize="small" />
                  </div>
                  <div className="info-details">
                    <p className="info-label">Mailing Address</p>
                    <p className="info-value">{personalInfo.mailingAddress}</p>
                  </div>
                </div>

                <div className="info-item">
                  <div className="info-icon">
                    <PhoneIcon fontSize="small" />
                  </div>
                  <div className="info-details">
                    <p className="info-label">Preferred Phone</p>
                    <p className="info-value">{personalInfo.preferredPhone}</p>
                  </div>
                </div>

                <div className="info-item">
                  <div className="info-icon">
                    <EmailIcon fontSize="small" />
                  </div>
                  <div className="info-details">
                    <p className="info-label">Preferred Email</p>
                    <p className="info-value">{personalInfo.preferredEmail}</p>
                  </div>
                </div>
              </div>

              <div className="info-actions-section">
                <h3 className="info-section-title">Update Your Information</h3>
                <div className="info-actions-grid">
                  <button className="info-action-button" type="button">
                    <EditIcon fontSize="small" />
                    <span>Demographic Data</span>
                  </button>
                  <button className="info-action-button" type="button">
                    <EditIcon fontSize="small" />
                    <span>Emergency Contact</span>
                  </button>
                  <button className="info-action-button" type="button">
                    <EditIcon fontSize="small" />
                    <span>Names</span>
                  </button>
                  <button className="info-action-button" type="button">
                    <EditIcon fontSize="small" />
                    <span>User Preference</span>
                  </button>
                  <button className="info-action-button" type="button">
                    <EditIcon fontSize="small" />
                    <span>Privacy Settings</span>
                  </button>
                </div>
              </div>
            </div>
              </article>
            </section>
          </>
        ) : page === 'financialAid' ? (
          <>
            <section className="hero-card card">
              <p className="eyebrow">Financial Aid</p>
              <h1>Accept / Decline Financial Aid</h1>
              <h2>Review and manage your 2025–2026 award package</h2>

              <div className="status-row">
                <button
                  className="status-pill warning status-pill-button"
                  type="button"
                  onClick={() => setPage('dashboard')}
                >
                  <ArrowBackIcon fontSize="small" /> Back to Dashboard
                </button>
              </div>
            </section>

            <section className="card">
              <div className="card-title-row">
                <AttachMoneyIcon />
                <h2>Award Package</h2>
              </div>

              <p className="section-subtitle">
                Select which awards you would like to accept or decline.
              </p>

              <table className="aid-table">
                <thead>
                  <tr>
                    <th>Award</th>
                    <th>Category</th>
                    <th>Offered</th>
                    <th>Accepted</th>
                    <th>Accept</th>
                    <th>Decline</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Federal Pell Grant</td>
                    <td>Grant</td>
                    <td>$3000.00</td>
                    <td>$3000.00</td>
                    <td>
                      <input
                        type="checkbox"
                        checked={aidSelections.pell === 'accept'}
                        onChange={() => handleAidChange('pell', 'accept')}
                      />
                    </td>

                    <td>
                      <input
                        type="checkbox"
                        checked={aidSelections.pell === 'decline'}
                        onChange={() => handleAidChange('pell', 'decline')}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>Cal Grant A</td>
                    <td>Grant</td>
                    <td>$1850.00</td>
                    <td>$1850.00</td>
                    <td>
                      <input
                        type="checkbox"
                        checked={aidSelections.calGrant === 'accept'}
                        onChange={() => handleAidChange('calGrant', 'accept')}
                      />
                    </td>

                    <td>
                      <input
                        type="checkbox"
                        checked={aidSelections.calGrant === 'decline'}
                        onChange={() => handleAidChange('calGrant', 'decline')}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>Direct Subsidized Loan</td>
                    <td>Loan</td>
                    <td>$0.00</td>
                    <td>$0.00</td>
                    <td>
                      <input
                        type="checkbox"
                        checked={aidSelections.loanA === 'accept'}
                        onChange={() => handleAidChange('loanA', 'accept')}
                      />
                    </td>

                    <td>
                      <input
                        type="checkbox"
                        checked={aidSelections.loanA === 'decline'}
                        onChange={() => handleAidChange('loanA', 'decline')}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>Direct Unsubsidized Loan</td>
                    <td>Loan</td>
                    <td>$0.00</td>
                    <td>$0.00</td>
                    <td>
                      <input
                        type="checkbox"
                        checked={aidSelections.loanB === 'accept'}
                        onChange={() => handleAidChange('loanB', 'accept')}
                      />
                    </td>

                    <td>
                      <input
                        type="checkbox"
                        checked={aidSelections.loanB === 'decline'}
                        onChange={() => handleAidChange('loanB', 'decline')}
                      />
                    </td>
                  </tr>
                  <tr className="total-aid">
                      <td>Total:</td>
                      <td></td>
                      <td>$4850.00</td>
                      <td>$4850.00</td>
                      <td></td>
                      <td></td>
                  </tr>
                </tbody>
              </table>

              <div style={{ marginTop: '1rem', display: 'flex', gap: '1rem' }}>
                <button
                  className="financial-aid-button"
                  type="button"
                  onClick={() => handleAcceptLoans()}
                >
                  Submit Changes
                </button>

                <button
                  className="action-button"
                  type="button"
                  onClick={() => setPage('dashboard')}
                >
                  Cancel
                </button>
              </div>
            </section>
          </>
        ) : (
          <>
            <section className="hero-card card">
              <p className="eyebrow">Francisco&apos;s Student Center</p>
              <h1>Class Planner</h1>
              <h2>Plan classes first, then submit enrollment when your window opens</h2>
              <div className="status-row">
                <button className="status-pill warning status-pill-button" type="button" onClick={() => setPage('dashboard')}>
                  <ArrowBackIcon fontSize="small" /> Back to Dashboard
                </button>
              </div>
            </section>

            <section className="grid-two planner-grid">
              <article className="card classes-priority">
                <div className="card-title-row">
                  <SchoolIcon />
                  <h2>Available Classes</h2>
                </div>
                <input
                  className="action-search"
                  type="search"
                  value={plannerQuery}
                  onChange={(event) => setPlannerQuery(event.target.value)}
                  placeholder="Search by code, title, or room..."
                />
                <div className="planner-list">
                  {visiblePlannerClasses.map((item) => {
                    const inCart = enrollmentCart.some((cartItem) => cartItem.id === item.id);
                    return (
                      <div className="planner-item" key={item.id}>
                        <div>
                          <h3>{item.code} - {item.title}</h3>
                          <p>{item.meeting}</p>
                          <span>{item.room} | {item.units} Units</span>
                        </div>
                        <button
                          className="financial-aid-button planner-add-button"
                          type="button"
                          onClick={() => handleAddClassToCart(item)}
                          disabled={inCart}
                        >
                          <ShoppingCartIcon fontSize="small" /> {inCart ? 'In Cart' : 'Add To Cart'}
                          <ArrowForwardIosIcon className="button-arrow" fontSize="inherit" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </article>

              <article className="card finance-priority">
                <div className="card-title-row">
                  <AddCircleOutlineIcon />
                  <h2>Add New Class</h2>
                </div>
                <p className="section-subtitle">Create a custom class option before adding it to your cart.</p>
                <div className="planner-form-grid">
                  <label className="personal-info-field" htmlFor="new-class-code">
                    <span>Course Code: </span>
                    <input
                      id="new-class-code"
                      type="text"
                      value={newClassForm.code}
                      onChange={(event) => handleNewClassFormChange('code', event.target.value)}
                      placeholder="e.g. CECS 499-01"
                    />
                  </label>
                  <label className="personal-info-field" htmlFor="new-class-title">
                    <span>Course Title: </span>
                    <input
                      id="new-class-title"
                      type="text"
                      value={newClassForm.title}
                      onChange={(event) => handleNewClassFormChange('title', event.target.value)}
                      placeholder="e.g. Special Topics"
                    />
                  </label>
                  <label className="personal-info-field" htmlFor="new-class-meeting">
                    <span>Meeting Time: </span>
                    <input
                      id="new-class-meeting"
                      type="text"
                      value={newClassForm.meeting}
                      onChange={(event) => handleNewClassFormChange('meeting', event.target.value)}
                      placeholder="e.g. TuTh 5:00 PM - 6:15 PM"
                    />
                  </label>
                  <label className="personal-info-field" htmlFor="new-class-room">
                    <span>Room: </span>
                    <input
                      id="new-class-room"
                      type="text"
                      value={newClassForm.room}
                      onChange={(event) => handleNewClassFormChange('room', event.target.value)}
                      placeholder="e.g. ECS Room 211"
                    />
                  </label>
                  <label className="personal-info-field" htmlFor="new-class-units">
                    <span>Units: </span>
                    <input
                      id="new-class-units"
                      type="number"
                      min="1"
                      max="6"
                      value={newClassForm.units}
                      onChange={(event) => handleNewClassFormChange('units', event.target.value)}
                    />
                  </label>
                </div>
                <button className="financial-aid-button" type="button" onClick={handleCreateNewClass}>
                  <AddCircleOutlineIcon fontSize="small" /> Save New Class
                  <ArrowForwardIosIcon className="button-arrow" fontSize="inherit" />
                </button>
              </article>
            </section>

            <section className="card resources-priority">
              <div className="card-title-row">
                <ShoppingCartIcon />
                <h2>Enrollment Cart</h2>
              </div>
              {enrollmentCart.length === 0 ? (
                <p className="focus-hint">Your cart is empty. Add a class from the planner list.</p>
              ) : (
                <div className="planner-list">
                  {enrollmentCart.map((item) => (
                    <div className="planner-item" key={`cart-${item.id}`}>
                      <div>
                        <h3>{item.code} - {item.title}</h3>
                        <p>{item.meeting}</p>
                        <span>{item.room} | {item.units} Units</span>
                      </div>
                      <button
                        className="action-button planner-remove-button"
                        type="button"
                        onClick={() => handleRemoveFromCart(item.id)}
                      >
                        <DeleteOutlineIcon fontSize="small" /> Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </>
        )}
      </main>
    </div>
  );
}

export default App;
