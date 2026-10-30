
import { useState } from "react";
import {
  Search,
  GraduationCap,
  BookOpen,
  CheckCircle2,
  XCircle,
  LoaderCircle,
  ArrowUpRight,
  ShieldCheck,
} from "lucide-react";
import "./App.css";

const API_URL = import.meta.env.VITE_API_URL || "";

function App() {
  const [rollNumber, setRollNumber] = useState("");
  const [student, setStudent] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function searchResult(event) {
    event.preventDefault();

    const roll = rollNumber.trim();

    if (!roll) {
      setError("Please enter your roll number.");
      setStudent(null);
      return;
    }

    setLoading(true);
    setError("");
    setStudent(null);

    try {
      const response = await fetch(
        `${API_URL}/results/${encodeURIComponent(roll)}`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to fetch result.");
      }

      setStudent(data);
    } catch (err) {
      setError(
        err.message === "Failed to fetch"
          ? "Cannot connect to the server. Please check that the backend is running."
          : err.message
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="app-shell">
      <nav className="navbar">
        <a className="brand" href="/">
          <span className="brand-icon">
            <GraduationCap size={23} />
          </span>
          <span>Result<span className="brand-highlight">ly</span></span>
        </a>

        <div className="nav-status">
          <span className="status-dot" />
          Academic Portal
        </div>
      </nav>

      <section className="hero">
        <div className="eyebrow">
          <ShieldCheck size={15} />
          STUDENT RESULT PORTAL
        </div>

        <h1>
          Your hard work,
          <br />
          <span>your results.</span>
        </h1>

        <p className="hero-description">
          Enter your roll number to access your academic performance,
          subject-wise marks, and overall result.
        </p>

        <form className="search-form" onSubmit={searchResult}>
          <div className="search-input-wrap">
            <Search size={20} />
            <input
              type="text"
              placeholder="Enter your roll number (e.g. 101)"
              value={rollNumber}
              onChange={(event) => setRollNumber(event.target.value)}
              aria-label="Student roll number"
            />
          </div>

          <button type="submit" disabled={loading}>
            {loading ? (
              <LoaderCircle className="spin" size={19} />
            ) : (
              <>
                Find result <ArrowUpRight size={18} />
              </>
            )}
          </button>
        </form>

        {error && <div className="error-message">{error}</div>}

        <p className="demo-hint">
          Try a sample roll number:{" "}
          <button type="button" onClick={() => setRollNumber("101")}>
            101
          </button>
          <span>·</span>
          <button type="button" onClick={() => setRollNumber("102")}>
            102
          </button>
          <span>·</span>
          <button type="button" onClick={() => setRollNumber("103")}>
            103
          </button>
        </p>
      </section>

      {student && (
        <section className="result-section" aria-live="polite">
          <div className="result-heading">
            <div>
              <p className="section-label">ACADEMIC RECORD</p>
              <h2>Your result overview</h2>
            </div>

            <span
              className={`result-badge ${
                student.result === "PASS" ? "pass" : "fail"
              }`}
            >
              {student.result === "PASS" ? (
                <CheckCircle2 size={16} />
              ) : (
                <XCircle size={16} />
              )}
              {student.result}
            </span>
          </div>

          <div className="student-card">
            <div className="student-avatar">
              {student.name?.charAt(0).toUpperCase()}
            </div>

            <div className="student-info">
              <h3>{student.name}</h3>
              <p>Roll No. {student.rollNumber}</p>
              <p>
                {student.department} · Semester {student.semester}
              </p>
            </div>
          </div>

          <div className="stats-grid">
            <article className="stat-card">
              <span className="stat-icon purple">
                <BookOpen size={19} />
              </span>
              <p>Total marks</p>
              <h3>
                {student.totalMarks}
                <span> / {student.maximumMarks}</span>
              </h3>
            </article>

            <article className="stat-card">
              <span className="stat-icon blue">
                <GraduationCap size={20} />
              </span>
              <p>Percentage</p>
              <h3>{student.percentage}%</h3>
            </article>
          </div>

          <div className="marks-card">
            <div className="marks-header">
              <div>
                <h3>Subject performance</h3>
                <p>Your marks across all subjects</p>
              </div>
              <span className="subject-count">
                {student.subjects.length} subjects
              </span>
            </div>

            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>SUBJECT</th>
                    <th>MARKS</th>
                    <th>PERFORMANCE</th>
                  </tr>
                </thead>

                <tbody>
                  {student.subjects.map((subject) => {
                    const percentage =
                      (subject.marks / subject.maxMarks) * 100;

                    return (
                      <tr key={subject.name}>
                        <td>{subject.name}</td>
                        <td className="marks-value">
                          {subject.marks}
                          <span> / {subject.maxMarks}</span>
                        </td>
                        <td>
                          <div className="progress-cell">
                            <div className="progress-track">
                              <div
                                className="progress-fill"
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                            <span>{Math.round(percentage)}%</span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="marks-footer">
              <span>Overall percentage</span>
              <strong>{student.percentage}%</strong>
            </div>
          </div>
        </section>
      )}

      {!student && !error && (
        <section className="empty-state">
          <div className="empty-icon">
            <BookOpen size={25} />
          </div>
          <h3>Your results, all in one place.</h3>
          <p>Search using your roll number to get started.</p>
        </section>
      )}

      <footer>
        <span>© 2026 Resultly</span>
        <span>Built with React & Node.js</span>
      </footer>
    </main>
  );
}

export default App;
