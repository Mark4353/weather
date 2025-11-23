import { useEffect, useState } from "react";
import "./Header.css";
import LoginButton from "../modal/login";

function Header() {
  const [isDarkMode, setIsDarkMode] = useState(false);

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
            <img src="" alt="logo" />
          </div>

          <ul className="header-links">
            <li className="header-link">Who we are</li>
            <li className="header-link">Contacts</li>
            <li className="header-link">Menu</li>
          </ul>

          <button className="theme-btn" onClick={toggleTheme} title="Toggle theme">
            {isDarkMode ? "☀️" : "🌙"}
          </button>

          <div className="header-btns">
            <LoginButton />
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
