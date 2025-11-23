import React, { useCallback, useEffect, useState } from "react";
import "./Main.css";

function Main() {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [articles, setArticles] = useState([]);
  const [displayedArticles, setDisplayedArticles] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const PER_PAGE = 4;

  const API_KEY = process.env.REACT_APP_OWM_KEY || "33efc2b91d2c7c3d5deea4f4c1a523d2";

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
      const city = loc.city || "Kiev";
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
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

  const getCityWeather = useCallback(() => {
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
  }, []);

  useEffect(() => {
    getCityWeather();
  }, [getCityWeather]);

  useEffect(() => {
    const t = setInterval(() => {
      setWeather((w) => (w ? { ...w } : null));
    }, 60000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const newsApi = "2cf7b639072143a2b52de39615867e0a";
    const proxyUrl = "https://api.allorigins.win/get?url=";
    const newsUrl = encodeURIComponent(
      `https://newsapi.org/v2/everything?q=weather&apiKey=${newsApi}&pageSize=20&sortBy=publishedAt`
    );

    fetch(proxyUrl + newsUrl)
      .then((response) => response.json())
      .then((data) => {
        const articles = JSON.parse(data.contents);
        if (articles.articles) {
          const articlesWithImages = articles.articles.filter((a) => a.urlToImage);
          setArticles(articlesWithImages);
          setDisplayedArticles(articlesWithImages.slice(0, PER_PAGE));
          setCurrentPage(0);
        }
      })
      .catch((error) => {
        console.error("Error fetching news:", error);
      });
  }, []);

  function handleSeeMore() {
    const nextPage = currentPage + 1;
    const startIndex = nextPage * PER_PAGE;
    const endIndex = startIndex + PER_PAGE;
    const newArticles = articles.slice(0, endIndex);
    setDisplayedArticles(newArticles);
    setCurrentPage(nextPage);
  }

  const hasMoreArticles =
    displayedArticles.length < articles.length;

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
            <p className="item-date">
              {dateString} | {weekday}
            </p>
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
                {/* <button className="item-like-btn"><img src="../../image/desktop/card/heart.svg" alt="" /></button> */}
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
          {displayedArticles.map((a, index) => (
            <li key={`${a.url}`} className="news-item">
              {a.urlToImage && (
                <img src={a.urlToImage} alt={a.title} className="news-img" />
              )}
              <p className="news-text">{a.title}</p>
            </li>
          ))}
        </ul>
        {hasMoreArticles && (
          <button className="news-btn" onClick={handleSeeMore}>
            See more
          </button>
        )}
      </div>
    </section>
  );
}
export default Main;
