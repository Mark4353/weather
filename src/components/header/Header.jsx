import { useEffect, useState } from "react";
import "./Header.css";
import LoginButton from "../modal/login";
import RegisterModal from "../modal/register";
import logo from "../../logo1.png";
function Header() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    function onScroll() {
      const scrolled = window.scrollY || window.pageYOffset;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight <= 0) return setShowScrollTop(false);
      const ratio = scrolled / docHeight;
      setShowScrollTop(ratio > 0.6);
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      setIsDarkMode(true);
      document.documentElement.classList.add("dark-mode");
    } else {
      setIsDarkMode(false);
      document.documentElement.classList.remove("dark-mode");
    }
  }, []);

  function toggleTheme() {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);

    if (newMode) {
      document.documentElement.classList.add("dark-mode");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark-mode");
      localStorage.setItem("theme", "light");
    }
  }

  return (
    <header>
      <div className="container">
        <div className="header">
          <div className="logo-box">
            <img src={logo} alt="logo" />
          </div>

          <ul className="header-links">
            <li className="header-link">
              <a href="#who">Who we are</a>
            </li>
            <li className="header-link">
              <a href="#contacts">Contacts</a>
            </li>
            <li className="header-link">
              <a href="#menu">Menu</a>
            </li>
          </ul>

          <div className="header-btns">
            <button
              className="theme-btn"
              onClick={toggleTheme}
              title="Toggle theme"
            >
              {isDarkMode ? "☀️" : "🌙"}
            </button>
            <LoginButton />
            <RegisterModal />
          </div>
        </div>
      </div>

      {showScrollTop && (
        <button
          className="scroll-top-btn"
          onClick={scrollToTop}
          aria-label="Scroll to top"
        >
          <i className="bi bi-arrow-up" />
        </button>
      )}
    </header>
  );
}

export default Header;
