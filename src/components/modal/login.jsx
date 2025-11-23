import { useEffect, useRef, useState } from "react";
import "../../App.css";
import "./login.css";

const API_BASE = process.env.REACT_APP_MOCKAPI_BASE || "https://682364aa65ba058033969579.mockapi.io/api/login";

export default function LoginButton() {
  const [modalOpen, setModalOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [user, setUser] = useState(null);

  const modalRef = useRef(null);
  const firstInputRef = useRef(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("weather_user");
      if (saved) setUser(JSON.parse(saved));
    } catch {
      localStorage.removeItem("weather_user");
    }
  }, []);

  useEffect(() => {
    if (modalOpen) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      setTimeout(() => firstInputRef.current?.focus(), 0);
      return () => (document.body.style.overflow = prev);
    } else {
      setEmail("");
      setPassword("");
      setError("");
    }
  }, [modalOpen, setError]);

  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape" && modalOpen) setModalOpen(false);
      if (e.key === "Enter" && modalOpen) handleSubmit();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line
  }, [modalOpen, email, password]);

  function handleBackdropClick(e) {
    if (modalRef.current && !modalRef.current.contains(e.target))
      setModalOpen(false);
  }

  async function handleSubmit(e) {
    e && e.preventDefault();
    if (!email || !password) {
      setError("Please enter email and password.");
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      const checkRes = await fetch(
        `${API_BASE}?email=${encodeURIComponent(email)}`
      );
      if (!checkRes.ok) throw new Error("Network error while checking user");
      const existing = await checkRes.json();

      if (existing && existing.length) {
        const found = existing[0];
        const usr = {
          id: found.id,
          email: found.email,
          name: found.name || found.username || email.split("@")[0],
        };
        setUser(usr);
        localStorage.setItem("weather_user", JSON.stringify(usr));
        setModalOpen(false);
        return;
      }

      const createRes = await fetch(API_BASE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name: email.split("@")[0] }),
      });
      if (!createRes.ok) throw new Error("Failed to create account (mock).");
      const created = await createRes.json();
      const usr = {
        id: created.id || Date.now(),
        email: created.email || email,
        name: created.name || created.username || email.split("@")[0],
      };
      setUser(usr);
      localStorage.setItem("weather_user", JSON.stringify(usr));
      setModalOpen(false);
    } catch (err) {
      setError(err?.message || "Login failed. Try again.");
    } finally {
      setSubmitting(false);
    }
  }

  function handleLogout() {
    setUser(null);
    localStorage.removeItem("weather_user");
  }

  return (
    <>
      <button className="header-btn" onClick={() => setModalOpen(true)}>
        {user ? user.name || user.email : "Sign Up"}
      </button>

      {modalOpen && (
        <div
          className="login-backdrop"
          onMouseDown={handleBackdropClick}
          aria-modal="true"
          role="dialog"
        >
          <div
            ref={modalRef}
            className="login-modal"
            onMouseDown={(e) => e.stopPropagation()}
            aria-labelledby="login-modal-title"
          >
            <div className="login-header">
              <h3 id="login-modal-title" className="login-title">
                {user ? "Account" : "Sign in / Sign up"}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                aria-label="Close"
                className="login-close"
              >
                ×
              </button>
            </div>

            {!user ? (
              <form onSubmit={handleSubmit} className="login-form">
                {error && <div className="login-error">{error}</div>}
                <label className="login-label">
                  Email
                  <input
                    ref={firstInputRef}
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="login-input"
                    autoComplete="username"
                    required
                  />
                </label>

                <label className="login-label">
                  Password
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="login-input"
                    autoComplete="current-password"
                    required
                  />
                </label>

                <button type="submit" className="login-button" disabled={submitting}>
                  Sign in / Sign up
                </button>
              </form>
            ) : (
              <div className="login-account">
                <p>
                  Signed in as <strong>{user.email}</strong>
                </p>
                <p></p>
                <div className="login-account-actions">
                  <button
                    onClick={() => {
                      handleLogout();
                      setModalOpen(false);
                    }}
                    className="login-logout-btn"
                  >
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
