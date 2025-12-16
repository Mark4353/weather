import { useEffect, useRef, useState } from "react";
import "../../App.css";
import "./login.css";

const API_BASE = "https://682364aa65ba058033969579.mockapi.io/api/login";

export default function RegisterModal() {
  const [modalOpen, setModalOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const modalRef = useRef(null);
  const firstInputRef = useRef(null);

  useEffect(() => {
    function onOpenRegister() {
      setModalOpen(true);
    }
    window.addEventListener("open-register", onOpenRegister);
    return () => window.removeEventListener("open-register", onOpenRegister);
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
          () => resolve(null)
        );
      } else {
        resolve(null);
      }
    });
  }

  async function handleRegister(e) {
    e && e.preventDefault();
    if (!email || !password) {
      setError("Please enter email and password.");
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      const geolocation = await getUserGeolocation();

      const createRes = await fetch(API_BASE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
          name: email.split("@")[0],
          latitude: geolocation?.latitude || null,
          longitude: geolocation?.longitude || null,
          accuracy: geolocation?.accuracy || null,
          registeredAt: new Date().toISOString(),
        }),
      });
      if (!createRes.ok) throw new Error("Failed to create account.");
      const created = await createRes.json();
      const usr = {
        id: created.id || Date.now(),
        email: created.email || email,
        name: created.name || email.split("@")[0],
      };
      localStorage.setItem("weather_user", JSON.stringify(usr));
      setModalOpen(false);
      window.dispatchEvent(new CustomEvent("user-logged-in", { detail: usr }));
    } catch (err) {
      setError(err?.message || "Registration failed. Try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
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
            aria-labelledby="register-modal-title"
          >
            <div className="login-header">
              <h3 id="register-modal-title" className="login-title">
                Create account
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                aria-label="Close"
                className="login-close"
              >
                ×
              </button>
            </div>
            <form onSubmit={handleRegister} className="login-form">
              {error && <div className="login-error">{error}</div>}
              <label className="login-label">
                Email
                <input
                  ref={firstInputRef}
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="login-input"
                  autoComplete="email"
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
                  autoComplete="new-password"
                  required
                />
              </label>

              <button
                type="submit"
                className="login-button"
                disabled={submitting}
              >
                {submitting ? "Creating…" : "Create account"}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
