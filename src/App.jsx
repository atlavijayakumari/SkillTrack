
import { useState, useEffect, useRef } from "react";
import {
  Code2, LayoutDashboard, BookOpen, Trophy, Flame, ArrowRight,
  Clock, Target, LogOut, Menu, X, CheckCircle, CircleAlert
} from "lucide-react";
import "./App.css";

const API = "http://localhost:8080/api/users";

const assessments = [
  { name: "Java Fundamentals", category: "PROGRAMMING", icon: "☕", questions: 5, time: "5 min", level: "Beginner" },
  { name: "Web Development", category: "WEB TECHNOLOGY", icon: "🌐", questions: 5, time: "5 min", level: "Beginner" },
  { name: "SQL Essentials", category: "DATABASE", icon: "▤", questions: 5, time: "5 min", level: "Beginner" }
];

const questionBank = {
  "Java Fundamentals": [
    { question: "Which keyword is used to declare a class in Java?", options: ["function", "class", "define", "struct"], answer: 1, explanation: "The class keyword declares a class in Java." },
    { question: "Which method is the entry point of a Java program?", options: ["start()", "run()", "main()", "init()"], answer: 2, explanation: "Java applications normally start from the main method." },
    { question: "Which data type stores true or false?", options: ["int", "String", "char", "boolean"], answer: 3, explanation: "The boolean data type stores true or false." },
    { question: "Which symbol usually ends a Java statement?", options: [".", ";", ":", ","], answer: 1, explanation: "Most Java statements end with a semicolon." },
    { question: "Which keyword is used to create an object?", options: ["new", "this", "void", "static"], answer: 0, explanation: "The new keyword creates an object." }
  ],
  "Web Development": [
    { question: "What does HTML primarily define?", options: ["Database storage", "Webpage structure", "Server security", "Network speed"], answer: 1, explanation: "HTML defines webpage structure and content." },
    { question: "Which technology styles a webpage?", options: ["SQL", "Java", "CSS", "JDBC"], answer: 2, explanation: "CSS controls the visual presentation of webpages." },
    { question: "Which language adds interactivity to webpages?", options: ["JavaScript", "HTML", "CSS", "XML"], answer: 0, explanation: "JavaScript can respond to user actions." },
    { question: "Which HTML tag creates a hyperlink?", options: ["<link>", "<p>", "<a>", "<href>"], answer: 2, explanation: "The a tag creates a hyperlink." },
    { question: "Which CSS property changes text color?", options: ["font-style", "background", "text-size", "color"], answer: 3, explanation: "The color property changes text color." }
  ],
  "SQL Essentials": [
    { question: "Which SQL command retrieves data?", options: ["GET", "SELECT", "OPEN", "FETCH ALL"], answer: 1, explanation: "SELECT retrieves data from database tables." },
    { question: "Which clause filters rows?", options: ["ORDER BY", "GROUP BY", "WHERE", "SELECT"], answer: 2, explanation: "WHERE filters rows using a condition." },
    { question: "Which command adds new rows?", options: ["INSERT", "UPDATE", "ALTER", "DROP"], answer: 0, explanation: "INSERT INTO adds records to a table." },
    { question: "Which function counts rows?", options: ["SUM()", "TOTAL()", "NUMBER()", "COUNT()"], answer: 3, explanation: "COUNT() counts rows or non-null values." },
    { question: "Which clause sorts query results?", options: ["SORT", "ORDER BY", "ARRANGE", "WHERE"], answer: 1, explanation: "ORDER BY sorts query results." }
  ]
};

function readResults() {
  try {
    return JSON.parse(localStorage.getItem("skilltrackResults") || "[]");
  } catch {
    return [];
  }
}

export default function App() {
  const [page, setPage] = useState("Dashboard");
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("skilltrackUser") || "null");
    } catch {
      return null;
    }
  });
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const [activeAssessment, setActiveAssessment] = useState(null);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(300);
  const [lastResult, setLastResult] = useState(null);
  const [results, setResults] = useState(readResults);
  const submitted = useRef(false);

  function navigate(next) {
    setPage(next);
    setMessage("");
    setMenuOpen(false);
  }

  async function register(e) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch(`${API}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim(),
          password: form.password
        })
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          data.message || data.detail || data.error ||
          `Registration failed (${response.status}).`
        );
      }

      setMessage("Account created successfully! You can now log in.");
      setForm({ name: "", email: "", password: "" });
      setTimeout(() => {
        setPage("Login");
        setMessage("");
      }, 1000);
    } catch (error) {
      setMessage(error.message || "Cannot connect to the backend.");
    } finally {
      setLoading(false);
    }
  }

  async function login(e) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch(`${API}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: form.email.trim(),
          password: form.password
        })
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          data.message || data.detail || data.error ||
          `Login failed (${response.status}).`
        );
      }

      const profile = {
        id: data.id,
        name: data.name,
        email: data.email,
        role: data.role
      };

      localStorage.setItem("skilltrackUser", JSON.stringify(profile));
      setUser(profile);
      setForm({ name: "", email: "", password: "" });
      navigate("Dashboard");
    } catch (error) {
      setMessage(error.message || "Cannot connect to the backend.");
    } finally {
      setLoading(false);
    }
  }

  function logout() {
    localStorage.removeItem("skilltrackUser");
    setUser(null);
    navigate("Dashboard");
  }

  function startAssessment(item) {
    submitted.current = false;
    setActiveAssessment(item);
    setQuestionIndex(0);
    setAnswers({});
    setTimeLeft(300);
    setLastResult(null);
    setMessage("");
    navigate("Quiz");
  }

  function finishAssessment() {
    if (!activeAssessment || submitted.current) return;

    submitted.current = true;

    const questions = questionBank[activeAssessment.name] || [];
    const score = questions.reduce(
      (total, question, index) =>
        total + (answers[index] === question.answer ? 1 : 0),
      0
    );

    const result = {
      id: Date.now(),
      assessment: activeAssessment.name,
      score,
      total: questions.length,
      date: new Date().toLocaleString(),
      answers: { ...answers }
    };

    const updatedResults = [result, ...results];

    try {
      localStorage.setItem("skilltrackResults", JSON.stringify(updatedResults));
    } catch {
      // Keep the result visible even if browser storage is unavailable.
    }

    setResults(updatedResults);
    setLastResult(result);
    navigate("Result");
  }

  useEffect(() => {
    if (page !== "Quiz" || timeLeft <= 0) return;

    const timer = setTimeout(() => {
      setTimeLeft(previous => Math.max(0, previous - 1));
    }, 1000);

    return () => clearTimeout(timer);
  }, [page, timeLeft]);

  useEffect(() => {
    if (page === "Quiz" && timeLeft === 0) {
      finishAssessment();
    }
  }, [page, timeLeft]);

  const navItems = [
    { name: "Dashboard", icon: LayoutDashboard },
    { name: "Assessments", icon: BookOpen },
    { name: "My Results", icon: Trophy }
  ];

  const totalAttempts = results.length;
  const average = totalAttempts
    ? Math.round(results.reduce((sum, r) => sum + (r.score / r.total) * 100, 0) / totalAttempts)
    : null;
  const best = totalAttempts
    ? Math.max(...results.map(r => Math.round((r.score / r.total) * 100)))
    : null;

  const currentQuestions = activeAssessment
    ? questionBank[activeAssessment.name] || []
    : [];
  const currentQuestion = currentQuestions[questionIndex];

  return (
    <div className="app-shell">
      <aside className={`sidebar ${menuOpen ? "sidebar-open" : ""}`}>
        <div className="brand">
          <div className="brand-icon"><Code2 size={23} /></div>
          <span>SkillTrack<span className="brand-dot">.</span></span>
          <button className="close-menu" onClick={() => setMenuOpen(false)} aria-label="Close menu"><X /></button>
        </div>

        <div className="workspace-label">WORKSPACE</div>
        <nav className="side-nav">
          {navItems.map(item => {
            const Icon = item.icon;
            return (
              <button
                key={item.name}
                className={page === item.name ? "nav-item active" : "nav-item"}
                onClick={() => navigate(item.name)}
              >
                <Icon size={19} />
                {item.name}
                {item.name === "Assessments" && <span className="nav-count">3</span>}
              </button>
            );
          })}
        </nav>

        <div className="sidebar-bottom">
          <div className="help-card">
            <div className="help-icon">✦</div>
            <strong>Keep growing!</strong>
            <p>Small steps every day lead to big results.</p>
          </div>
          <div className="profile">
            <div className="avatar">{user?.name?.charAt(0)?.toUpperCase() || "S"}</div>
            <div className="profile-info">
              <strong>{user?.name || "Guest Learner"}</strong>
              <span>{user ? "Student account" : "Welcome to SkillTrack"}</span>
            </div>
            {user && (
              <button className="icon-button" title="Log out" onClick={logout}>
                <LogOut size={17} />
              </button>
            )}
          </div>
        </div>
      </aside>

      {menuOpen && (
        <button className="mobile-overlay" onClick={() => setMenuOpen(false)} aria-label="Close menu" />
      )}

      <main className="main-content">
        <header className="topbar">
          <button className="mobile-menu" onClick={() => setMenuOpen(true)} aria-label="Open menu">
            <Menu />
          </button>
          <div className="breadcrumb">Workspace <span>/</span> <strong>{page}</strong></div>
          <div className="top-actions">
            <span className="online-dot" />
            <span className="online-text">Learning space</span>
            {!user && <button className="top-login" onClick={() => navigate("Login")}>Log in</button>}
            {!user && <button className="primary-btn small-btn" onClick={() => navigate("Register")}>Sign up</button>}
          </div>
        </header>

        {page === "Dashboard" && (
          <div className="page-content">
            <section className="welcome-row">
              <div>
                <div className="eyebrow">YOUR LEARNING OVERVIEW</div>
                <h1>{user ? `Welcome back, ${user.name}!` : "Ready to level up?"}</h1>
                <p>Build your skills one assessment at a time. Your next achievement starts here.</p>
              </div>
              <div className="welcome-art"><Target size={60} strokeWidth={1.4} /><span>✦</span></div>
            </section>

            <section className="stats-grid">
              <Stat icon={<BookOpen />} label="Assessments taken" value={String(totalAttempts)} note="Completed assessments" />
              <Stat icon={<Target />} label="Average score" value={average === null ? "—" : `${average}%`} note="Across your attempts" />
              <Stat icon={<Trophy />} label="Best score" value={best === null ? "—" : `${best}%`} note="Your personal best" />
            </section>

            <section className="streak-card">
              <div className="streak-top">
                <div>
                  <div className="streak-title"><Flame size={22} /> Learning activity</div>
                  <p>Build a consistent learning habit, one day at a time.</p>
                </div>
                <div className="streak-pill">🔥 <strong>Keep practicing</strong></div>
              </div>
              <div className="heatmap">
                {Array.from({ length: 28 }, (_, i) => (
                  <div key={i} className={`heat-cell ${i >= 24 ? "heat-active" : ""}`} title={`Practice day ${i + 1}`} />
                ))}
              </div>
              <div className="heatmap-footer">
                <span>Practice tracker preview</span>
                <div>Less <i /><i /><i /><i className="heat-active" /> More</div>
              </div>
            </section>

            <SectionHeading
              eyebrow="PICK UP WHERE YOU LEFT OFF"
              title="Available assessments"
              subtitle="Choose a topic and test what you know."
              action="View all"
              onAction={() => navigate("Assessments")}
            />
            <div className="assessment-grid">
              {assessments.map((a, i) => (
                <AssessmentCard key={a.name} item={a} index={i} onStart={() => startAssessment(a)} />
              ))}
            </div>
          </div>
        )}

        {page === "Assessments" && (
          <div className="page-content">
            <SectionHeading
              eyebrow="PRACTICE MAKES PROGRESS"
              title="Explore assessments"
              subtitle="Choose a subject to challenge yourself."
            />
            <div className="assessment-grid">
              {assessments.map((a, i) => (
                <AssessmentCard key={a.name} item={a} index={i} onStart={() => startAssessment(a)} />
              ))}
            </div>
          </div>
        )}

        {page === "Quiz" && activeAssessment && currentQuestion && (
          <div className="page-content">
            <section className="quiz-panel">
              <button className="text-btn" onClick={() => navigate("Assessments")}>← Exit assessment</button>
              <div className="eyebrow">SKILLTRACK ASSESSMENT</div>
              <h1>{activeAssessment.name}</h1>

              <div className="quiz-meta">
                <span>Question {questionIndex + 1} of {currentQuestions.length}</span>
                <span><Clock size={17} /> {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, "0")}</span>
              </div>

              <div className="quiz-progress">
                <div style={{ width: `${((questionIndex + 1) / currentQuestions.length) * 100}%` }} />
              </div>

              <h2>{currentQuestion.question}</h2>
              <div className="quiz-options">
                {currentQuestion.options.map((option, index) => (
                  <button
                    type="button"
                    key={option}
                    className={answers[questionIndex] === index ? "quiz-option selected" : "quiz-option"}
                    onClick={() => setAnswers(previous => ({ ...previous, [questionIndex]: index }))}
                  >
                    <span>{String.fromCharCode(65 + index)}</span>
                    {option}
                    {answers[questionIndex] === index && <CheckCircle className="option-check" size={18} />}
                  </button>
                ))}
              </div>

              <div className="quiz-footer">
                <button
                  className="secondary-btn"
                  disabled={questionIndex === 0}
                  onClick={() => setQuestionIndex(index => index - 1)}
                >
                  Previous
                </button>

                {questionIndex < currentQuestions.length - 1 ? (
                  <button className="primary-btn" onClick={() => setQuestionIndex(index => index + 1)}>
                    Next question <ArrowRight size={17} />
                  </button>
                ) : (
                  <button className="primary-btn" onClick={finishAssessment}>
                    Submit assessment <CheckCircle size={17} />
                  </button>
                )}
              </div>
              <p className="quiz-hint">Unanswered questions count as incorrect. Your result appears after submission.</p>
            </section>
          </div>
        )}

        {page === "Result" && lastResult && (
          <div className="page-content">
            <section className="quiz-panel result-panel">
              <div className="result-icon"><Trophy size={36} /></div>
              <div className="eyebrow">ASSESSMENT COMPLETED</div>
              <h1>Your results</h1>
              <p>{lastResult.assessment}</p>

              <div className="score-circle">
                <strong>{Math.round((lastResult.score / lastResult.total) * 100)}%</strong>
                <span>Score</span>
              </div>
              <h2>{lastResult.score} out of {lastResult.total} correct</h2>
              <p className="result-date">Completed {lastResult.date}</p>

              <div className="review-list">
                {(questionBank[lastResult.assessment] || []).map((q, index) => {
                  const selected = lastResult.answers[index];
                  const correct = selected === q.answer;
                  return (
                    <div className="review-item" key={index}>
                      <div className="review-question">
                        {correct ? <CheckCircle size={19} /> : <CircleAlert size={19} />}
                        <strong>{index + 1}. {q.question}</strong>
                      </div>
                      <p>Your answer: {selected === undefined ? "Not answered" : q.options[selected]}</p>
                      <p>Correct answer: {q.options[q.answer]}</p>
                      <small>{q.explanation}</small>
                    </div>
                  );
                })}
              </div>

              <div className="quiz-footer">
                <button className="secondary-btn" onClick={() => navigate("My Results")}>My Results</button>
                <button className="primary-btn" onClick={() => navigate("Assessments")}>
                  Try another assessment <ArrowRight size={17} />
                </button>
              </div>
            </section>
          </div>
        )}

        {page === "My Results" && (
          <div className="page-content">
            <SectionHeading
              eyebrow="YOUR PERFORMANCE"
              title="My results"
              subtitle="Review your completed assessments and scores."
            />
            {results.length === 0 ? (
              <div className="empty-state">
                <Trophy size={38} />
                <h3>Your journey starts here</h3>
                <p>Complete an assessment to start building your results history.</p>
                <button className="primary-btn" onClick={() => navigate("Assessments")}>
                  Explore assessments <ArrowRight size={17} />
                </button>
              </div>
            ) : (
              <div className="results-grid">
                {results.map(result => (
                  <article className="result-card" key={result.id}>
                    <div className="stat-icon"><Trophy /></div>
                    <h3>{result.assessment}</h3>
                    <h2>{result.score}/{result.total}</h2>
                    <p>{Math.round((result.score / result.total) * 100)}% score</p>
                    <small>{result.date}</small>
                    <button
                      className="text-btn"
                      onClick={() => {
                        setLastResult(result);
                        navigate("Result");
                      }}
                    >
                      Review answers <ArrowRight size={16} />
                    </button>
                  </article>
                ))}
              </div>
            )}
          </div>
        )}

        {(page === "Login" || page === "Register") && (
          <div className="auth-layout">
            <form className="auth-card" onSubmit={page === "Register" ? register : login}>
              <div className="auth-logo"><Code2 size={25} /></div>
              <div className="eyebrow">{page === "Register" ? "START YOUR JOURNEY" : "WELCOME BACK"}</div>
              <h1>{page === "Register" ? "Create your account" : "Sign in to SkillTrack"}</h1>
              <p>{page === "Register" ? "Set up your account to begin tracking your skills." : "Enter your details to continue learning."}</p>

              {page === "Register" && (
                <Field label="Full name" name="name" value={form.name}
                  onChange={v => setForm({ ...form, name: v })} placeholder="Your full name" />
              )}
              <Field label="Email address" name="email" type="email" value={form.email}
                onChange={v => setForm({ ...form, email: v })} placeholder="you@example.com" />
              <Field label="Password" name="password" type="password" value={form.password}
                onChange={v => setForm({ ...form, password: v })} placeholder="At least 8 characters" />

              <button className="primary-btn full-btn" disabled={loading}>
                {loading ? "Please wait..." : page === "Register" ? "Create account" : "Sign in"}
                <ArrowRight size={17} />
              </button>

              {message && <div className="form-message" role="status">{message}</div>}

              <div className="auth-switch">
                {page === "Register" ? "Already have an account?" : "New to SkillTrack?"}
                <button type="button" onClick={() => navigate(page === "Register" ? "Login" : "Register")}>
                  {page === "Register" ? "Sign in" : "Create account"}
                </button>
              </div>
              <button type="button" className="guest-link" onClick={() => navigate("Dashboard")}>
                Continue as guest
              </button>
            </form>

            <div className="auth-side">
              <div className="auth-side-icon"><Trophy size={36} /></div>
              <h2>Your next milestone<br />starts with practice.</h2>
              <p>Learn consistently. Measure your progress. Celebrate every improvement.</p>
              <div className="auth-mini-stats">
                <div><strong>01</strong><span>Learn</span></div>
                <div><strong>02</strong><span>Practice</span></div>
                <div><strong>03</strong><span>Improve</span></div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

function Stat({ icon, label, value, note }) {
  return (
    <article className="stat-card">
      <div className="stat-icon">{icon}</div>
      <div className="stat-label">{label}</div>
      <div className="stat-value">{value}</div>
      <div className="stat-note">{note}</div>
    </article>
  );
}

function SectionHeading({ eyebrow, title, subtitle, action, onAction }) {
  return (
    <div className="section-heading">
      <div>
        <div className="eyebrow">{eyebrow}</div>
        <h2>{title}</h2>
        <p>{subtitle}</p>
      </div>
      {action && (
        <button className="text-btn" onClick={onAction}>
          {action} <ArrowRight size={16} />
        </button>
      )}
    </div>
  );
}

function AssessmentCard({ item, index, onStart }) {
  return (
    <article className="assessment-card">
      <div className={`assessment-icon icon-${index}`}>{item.icon}</div>
      <div className="card-category">{item.category}</div>
      <h3>{item.name}</h3>
      <p>Strengthen your knowledge and build confidence with focused practice.</p>
      <div className="card-meta">
        <span><BookOpen size={15} /> {item.questions} questions</span>
        <span><Clock size={15} /> {item.time}</span>
      </div>
      <div className="card-bottom">
        <span className="level-tag">{item.level}</span>
        <button className="start-btn" onClick={onStart}>
          Start <ArrowRight size={16} />
        </button>
      </div>
    </article>
  );
}

function Field({ label, name, type = "text", value, onChange, placeholder }) {
  return (
    <label className="form-field">
      {label}
      <input
        name={name}
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        required
        minLength={type === "password" ? 8 : undefined}
      />
    </label>
  );
}
