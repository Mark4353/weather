import React, { useEffect, useState } from "react";
import "./Main.css";

function Main() {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_KEY =
    "33efc2b91d2c7c3d5deea4f4c1a523d2" || "0c72cff0a989075ba1b65f2aca63f77b";

  useEffect(() => {
    getCityWeather();

    const t = setInterval(() => {
      if (weather) setWeather((w) => ({ ...w }));
    }, 60000);
    return () => clearInterval(t);
  }, []);

  function getCityWeather() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = pos.coords.latitude;
          const lon = pos.coords.longitude;
          loadWeatherByCoordinates(lat, lon);
        },
        () => {
          loadCityByIP();
        }
      );
    } else {
      loadCityByIP();
    }
  }

  async function loadWeatherByCoordinates(lat, lon) {
    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&lang=en&appid=${API_KEY}`
      );
      const data = await res.json();
      if (!res.ok) {
        if (res.status === 401) throw new Error("Api key error");
        throw new Error(data.message);
      }
      setWeather(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  async function loadCityByIP() {
    try {
      const locRes = await fetch("https://ipapi.co/json/");
      const loc = await locRes.json();
      const city = loc.city || "kiev";
      const res = await fetch(
        `https://api.openweathermap.org/data/3.0/weather?q=${encodeURIComponent(
          city
        )}&units=metric&lang=en&appid=${API_KEY}`
      );
      const data = await res.json();
      if (!res.ok) {
        if (res.status === 401) throw new Error("Api key error");
        throw new Error(data.message);
      }
      setWeather(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  const now = new Date();
  const timeString = now.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
  const dateString = now.toLocaleDateString();
const weekday = now.toLocaleString("en-US", { weekday: "long" }); 
  return (
    <section className="main">
      <div className="container">
        <ul className="card-list">
          <li className="card-item">
            <p className="item-city">
              {loading ? "loading..." : error ? "—" : weather?.name || "—"}
            </p>
            <h3 className="time">{timeString}</h3>
            <p className="item-date">{dateString} | {weekday}</p>
            {weather && !loading && !error && (
              <div className="weather-meta">
                <img
                  src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
                  alt={weather.weather[0].description}
                  className="item-icon"
                />
              </div>
            )}

            <p className="item-temp">
              {loading
                ? ""
                : error
                ? "error"
                : weather
                ? `${Math.round(weather.main.temp)}°C`
                : ""}
            </p>
            <ul className="item-btns">
              <li className="btn">
                <button
                  className="item-ref-btn"
                  onClick={() => {
                    setLoading(true);
                    getCityWeather();
                  }}
                >
                  o
                </button>
              </li>
              <li className="btn">
                <button className="item-like-btn">♥</button>
              </li>
              <li className="btn">
                <button className="item-more-btn">See more</button>
              </li>
              <li className="btn">
                <button className="item-del-btn">x</button>
              </li>
            </ul>
          </li>
        </ul>

        <h3 className="news-title">Interacting with our pets</h3>
        <ul className="news-list">
          <li className="news-item">
            <img src="#" alt="" />
            <p className="news-text"></p>
          </li>
        </ul>
        <button className="news-btn">See more</button>
      </div>
    </section>
  );
}

export default Main;
