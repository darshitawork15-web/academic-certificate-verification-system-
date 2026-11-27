
import { useState } from "react";
import "./App.css";

const API_BASE_URL = "http://localhost:5000";

function App() {
  const [activePage, setActivePage] = useState("verify");
  const [certificateId, setCertificateId] = useState("");
  const [verifyState, setVerifyState] = useState(null);

  // REAL BLOCKCHAIN VERIFICATION THROUGH BACKEND
  const verifyCertificate = async () => {
    if (!certificateId.trim()) {
      setVerifyState({
        type: "error",
        title: "Certificate ID required",
        message: "Please enter a Certificate ID to continue."
      });
      return;
    }

    setVerifyState({
      type: "demo",
      title: "Verifying...",
      message: "Checking certificate against the blockchain."
    });

    try {
      const response = await fetch(
        `${API_BASE_URL}/certificates/${encodeURIComponent(
          certificateId.trim()
        )}/verify`
      );

      const data = await response.json();

      setVerifyState({
        type: response.ok && data.valid ? "success" : "error",
        title: data.valid
          ? "Certificate Verified"
          : "Verification Failed",
        message: data.message || "Unable to verify certificate."
      });

    } catch (error) {
      setVerifyState({
        type: "error",
        title: "Connection Error",
        message: "Could not connect to the verification server."
      });
    }
  };

  return (
    <div className="app-shell">
      <aside className="sidebar">

        <div className="brand">
          <div className="brand-mark">✓</div>
          <div>
            <h1>CertiChain</h1>
            <span>Academic Verification</span>
          </div>
        </div>

        <nav>
          <button
            className={
              activePage === "verify"
                ? "nav-item active"
                : "nav-item"
            }
            onClick={() => setActivePage("verify")}
          >
            <span>⌕</span> Verify Certificate
          </button>

          <button
            className={
              activePage === "issue"
                ? "nav-item active"
                : "nav-item"
            }
            onClick={() => setActivePage("issue")}
          >
            <span>＋</span> Issue Certificate
          </button>

          <button
            className={
              activePage === "student"
                ? "nav-item active"
                : "nav-item"
            }
            onClick={() => setActivePage("student")}
          >
            <span>▣</span> Student View
          </button>
        </nav>

        <div className="sidebar-bottom">
          <div className="network-dot"></div>
          <div>
            <strong>Blockchain Network</strong>
            <small>Sepolia Test Network</small>
          </div>
        </div>

      </aside>

      <main className="main-content">

        <header className="topbar">
          <div>
            <p className="eyebrow">DECENTRALIZED CREDENTIALS</p>

            <h2>
              {activePage === "verify"
                ? "Verify Academic Certificate"
                : activePage === "issue"
                ? "Issue New Certificate"
                : "Student Certificate"}
            </h2>
          </div>

          <div className="status-pill">
            <span></span> System ready
          </div>
        </header>

        {/* VERIFY CERTIFICATE PAGE */}
        {activePage === "verify" && (
          <section className="page">

            <div className="hero">
              <div>
                <div className="tag">
                  TRUST • VERIFY • PROTECT
                </div>

                <h3>
                  Verify a certificate
                  <br />
                  in seconds.
                </h3>

                <p>
                  Check the authenticity of an academic credential
                  using its unique Certificate ID and
                  blockchain-backed verification record.
                </p>
              </div>

              <div className="hero-icon">✓</div>
            </div>

            <div className="verify-card">

              <div className="card-heading">
                <div>
                  <span className="step">01</span>
                  <h4>Enter Certificate ID</h4>
                  <p>
                    Use the unique ID provided on the academic certificate.
                  </p>
                </div>

                <div className="shield">⌁</div>
              </div>

              <div className="input-row">

                <input
                  value={certificateId}
                  onChange={(e) => {
                    setCertificateId(e.target.value);
                    setVerifyState(null);
                  }}
                  onKeyDown={(e) =>
                    e.key === "Enter" && verifyCertificate()
                  }
                  placeholder="e.g. CERT-2027-00124"
                />

                <button
                  className="primary-btn"
                  onClick={verifyCertificate}
                >
                  Verify <span>→</span>
                </button>

              </div>

              {verifyState && (
                <div className={`result-box ${verifyState.type}`}>
                  <div className="result-icon">
                    {verifyState.type === "success" ? "✓" : "!"}
                  </div>

                  <div>
                    <strong>{verifyState.title}</strong>
                    <p>{verifyState.message}</p>
                  </div>
                </div>
              )}

            </div>

            <div className="info-grid">

              <div className="info-card">
                <span className="info-number">01</span>
                <h4>Unique Certificate ID</h4>
                <p>
                  Each credential is associated with a unique
                  verification identifier.
                </p>
              </div>

              <div className="info-card">
                <span className="info-number">02</span>
                <h4>Cryptographic Proof</h4>
                <p>
                  A certificate fingerprint can be compared
                  with the registered record.
                </p>
              </div>

              <div className="info-card">
                <span className="info-number">03</span>
                <h4>Clear Result</h4>
                <p>
                  The system checks whether the certificate
                  matches its blockchain record.
                </p>
              </div>

            </div>

          </section>
        )}

        {/* ISSUE CERTIFICATE PAGE */}
        {activePage === "issue" && (
          <section className="page">

            <div className="section-card">

              <div className="section-title">
                <span className="step">01</span>

                <div>
                  <h3>Issue Academic Certificate</h3>
                  <p>
                    Institution/admin interface for registering a credential.
                  </p>
                </div>
              </div>

              <div className="form-grid">

                <label>
                  Student Name
                  <input placeholder="Enter student name" />
                </label>

                <label>
                  Certificate ID
                  <input placeholder="CERT-2027-00124" />
                </label>

                <label>
                  Degree / Course
                  <input placeholder="B.Tech Computer Science" />
                </label>

                <label>
                  Graduation Year
                  <input placeholder="2027" />
                </label>

                <label className="full">
                  Certificate / Document Reference
                  <input placeholder="Upload or enter document reference" />
                </label>

              </div>

              <button
                className="primary-btn wide"
                disabled
                title="Certificate issuance integration is pending"
              >
                Generate & Register Certificate →
              </button>

              <p className="backend-note">
                Certificate issuance requires the authorised
                institution wallet.
              </p>

            </div>

          </section>
        )}

        {/* STUDENT VIEW PAGE */}
        {activePage === "student" && (
          <section className="page">

            <div className="certificate-preview">

              <div className="certificate-top">
                <span>
                  DECENTRALIZED ACADEMIC CREDENTIAL
                </span>

                <div className="verified-badge">
                  ✓ VERIFICATION RECORD
                </div>
              </div>

              <div className="certificate-body">

                <p className="mini-label">
                  CERTIFICATE OF ACHIEVEMENT
                </p>

                <h3>Student Name</h3>

                <p className="degree">
                  Bachelor of Technology •
                  Computer Science & Engineering
                </p>

                <div className="certificate-meta">

                  <div>
                    <span>Certificate ID</span>
                    <strong>CERT-2027-00124</strong>
                  </div>

                  <div>
                    <span>Issue Date</span>
                    <strong>DD / MM / YYYY</strong>
                  </div>

                  <div>
                    <span>Status</span>
                    <strong>Pending verification</strong>
                  </div>

                </div>

              </div>

              <div className="certificate-footer">
                <span>
                  Blockchain-backed verification interface
                </span>

                <span>
                  QR / share integration can be added here
                </span>
              </div>

            </div>

          </section>
        )}

      </main>
    </div>
  );
}

export default App;
