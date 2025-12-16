import { useState } from "react";
import "./Hero.css";
import "bootstrap-icons/font/bootstrap-icons.css";

function Hero({ onCitySelect, id }) {
  const [searchInput, setSearchInput] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);

  const now = new Date();
  const monthName = now.toLocaleString("en-US", { month: "long" });
  const year = now.getFullYear();
  const weekday = now.toLocaleString("en-US", { weekday: "long" });
  const day = now.getDate();
  const formattedDate = `${monthName} ${year} ${weekday}, ${day}`;

  async function handleSearch(e) {
    const value = e.target.value;
    setSearchInput(value);

    if (value.length < 2) {
      setSuggestions([]);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(
        `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(
          value
        )}&limit=5&appid=33efc2b91d2c7c3d5deea4f4c1a523d2`
      );
      const data = await res.json();
      if (data && data.length > 0) {
        setSuggestions(data);
      } else {
        setSuggestions([]);
      }
    } catch (err) {
      console.error("Error fetching suggestions:", err);
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  }

  function handleSelectCity(city) {
    if (onCitySelect) {
      onCitySelect(city);
    }
    setSearchInput("");
    setSuggestions([]);
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (suggestions.length > 0) {
      handleSelectCity(suggestions[0]);
    }
  }

  return (
    <section id={id} className="hero">
      <div className="bg-opacity">
        <div className="container">
          <h1 className="hero-title">Weather dashboard</h1>
          <div className="info-box">
            <p className="hero-info">
              Create your personal list of favorite cities and always be aware
              of the weather.
            </p>
            <p className="correct-weaher hero-info">{formattedDate}</p>
          </div>
          <form onSubmit={handleSubmit} className="hero-form">
            <div className="hero-search-wrapper">
              <input
                type="text"
                className="hero-input"
                placeholder="Search location..."
                value={searchInput}
                onChange={handleSearch}
                autoComplete="off"
                pattern="^[a-zA-Z\s-]{2,}$"
                required
              />
              <button
                type="submit"
                className="hero-search-btn"
                disabled={loading}
              >
                <i className="bi bi-search" />
              </button>

              {suggestions.length > 0 && (
                <ul className="hero-suggestions">
                  {suggestions.map((city, index) => (
                    <li
                      key={index}
                      className="hero-suggestion-item"
                      onClick={() => handleSelectCity(city)}
                    >
                      <span className="city-name">{city.name}</span>
                      {city.state && (
                        <span className="city-state">{city.state}</span>
                      )}
                      <span className="city-country">{city.country}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}

export default Hero;
