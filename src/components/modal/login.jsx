import { useEffect, useRef, useState } from "react";
import "../../App.css";
import "./login.css";

const API_BASE = "https://682364aa65ba058033969579.mockapi.io/api/login";

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

    // open modal programmatically when other parts of app dispatch 'open-login'
    function onOpenLogin() {
      setModalOpen(true);
    }
    window.addEventListener("open-login", onOpenLogin);

    function onUserLogged(e) {
      const u = e?.detail;
      if (u) {
        setUser(u);
        localStorage.setItem("weather_user", JSON.stringify(u));
        setModalOpen(false);
      }
    }

    window.addEventListener("user-logged-in", onUserLogged);

    return () => {
      window.removeEventListener("open-login", onOpenLogin);
      window.removeEventListener("user-logged-in", onUserLogged);
    };
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
  }, [modalOpen]);

  function openRegister() {
    // close login and open register modal
    setModalOpen(false);
    window.dispatchEvent(new CustomEvent("open-register"));
  }

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


  async function getUserGeolocation() {
    return new Promise((resolve) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            resolve({
              latitude: pos.coords.latitude,
              longitude: pos.coords.longitude,
              accuracy: pos.coords.accuracy,
            });
          },
          () => {
            resolve(null);
          }
        );
      } else {
        resolve(null);
      }
    });
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
      const geolocation = await getUserGeolocation();

      const checkRes = await fetch(API_BASE);
      if (!checkRes.ok) throw new Error("Network error while checking user");
      const allUsers = await checkRes.json();

      const found = allUsers.find((u) => u.email === email);

      if (found) {
        if (found.password !== password) {
          throw new Error("Invalid password");
        }
        const usr = {
          id: found.id,
          email: found.email,
          name: found.name || email.split("@")[0],
        };
        setUser(usr);
        localStorage.setItem("weather_user", JSON.stringify(usr));
        setModalOpen(false);
        // notify app that a user just logged in
        window.dispatchEvent(new CustomEvent("user-logged-in", { detail: usr }));
        return;
      }

      // user not found - prompt to register
      setError("Account not found.\nYou can create a new account.");
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
                {user ? "Account" : "Login"}
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
                  {submitting ? "Logining..." : "Login"}
                </button>

                <div style={{ marginTop: 10, textAlign: "center" }}>
                  <button type="button" className="login-link" onClick={openRegister}>
                    Create account
                  </button>
                </div>
              </form>
            ) : (
              <div className="login-account">
                <p>
                  Signed in as <strong>{user.email}</strong>
                </p>
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
