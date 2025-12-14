import React, {
  useCallback,
  useEffect,
  useImperativeHandle,
  useState,
  forwardRef,
} from "react";
import "./Main.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import Info from "../info/Info";
import Day from "../info/8-day";
const API_KEY =
  process.env.REACT_APP_OWM_KEY || "33efc2b91d2c7c3d5deea4f4c1a523d2";

const Main = forwardRef(function Main(props, ref) {
  const [weather, setWeather] = useState(null);
  const [additionalCities, setAdditionalCities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  
  const [activeInfo, setActiveInfo] = useState(null);
  const [pendingInfo, setPendingInfo] = useState(null);

  
  useImperativeHandle(ref, () => ({
    addCity: (cityData) => {
      loadWeatherByCity(cityData);
    },
  }));

  async function loadWeatherByCoordinates(lat, lon) {
    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&lang=en&appid=${API_KEY}`
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to fetch");
      setWeather(data);
      setError(null);
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
      if (!res.ok) throw new Error(data.message || "Failed to fetch");
      setWeather(data);
      setError(null);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  async function loadWeatherByCity(cityData) {
    try {
      const name = cityData?.name || cityData?.local_names?.en || cityData;
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
          name
        )}&units=metric&lang=en&appid=${API_KEY}`
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to fetch");
      const newCity = { ...data, id: Date.now() };
      setAdditionalCities((prev) => [...prev, newCity]);
    } catch (err) {
      console.error("Error fetching weather:", err);
      alert("Error loading weather: " + err.message);
    }
  }

  const getCityWeather = useCallback(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => loadWeatherByCoordinates(pos.coords.latitude, pos.coords.longitude),
        () => loadCityByIP()
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

  function handleDeleteCity(cityId) {
    setAdditionalCities((prev) => prev.filter((c) => c.id !== cityId));
    if (activeInfo?.id === cityId) setActiveInfo(null);
  }


  function toggleInfoFor(id, cityName) {
    const saved = localStorage.getItem("weather_user");
    if (!saved) {
      setPendingInfo({ id, city: cityName });
      // ask the login modal to open
      window.dispatchEvent(new CustomEvent("open-login"));
      return;
    }

    if (activeInfo && activeInfo.id === id) setActiveInfo(null);
    else setActiveInfo({ id, city: cityName });
  }

 
  useEffect(() => {
    if (activeInfo) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev || "";
      };
    }
  }, [activeInfo]);

  // react to successful login: if user tried to open details before auth, open them now
  useEffect(() => {
    function onUserLoggedIn(e) {
      if (pendingInfo) {
        setActiveInfo(pendingInfo);
        setPendingInfo(null);
      }
    }
    window.addEventListener("user-logged-in", onUserLoggedIn);
    return () => window.removeEventListener("user-logged-in", onUserLoggedIn);
  }, [pendingInfo]);

  const now = new Date();
  const timeString = now.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
  const dateString = now.toLocaleDateString();
  const weekday = now.toLocaleString("en-US", { weekday: "long" });

  const renderWeatherCard = (weatherData, isMain = false) => {
    const idKey = weatherData?.id ?? (isMain ? "main" : Math.random());
    if (!weatherData) {
      return (
        <li className="card-item" key={idKey}>
          <p className="item-city">{loading ? "loading..." : "—"}</p>
          <h3 className="time">--:--</h3>
        </li>
      );
    }

    return (
      <li className="card-item" key={idKey}>
        <p className="item-city">{weatherData?.name || "—"}</p>
        <h3 className="time">{timeString}</h3>
        <p className="item-date">
          {dateString} | {weekday}
        </p>
        {weatherData?.weather && (
          <div className="weather-meta">
            <img
              src={`https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`}
              alt={weatherData.weather[0].description}
              className="item-icon"
            />
          </div>
        )}

        <p className="item-temp">
          {weatherData?.main?.temp ? `${Math.round(weatherData.main.temp)}°C` : "—"}
        </p>
        <ul className="item-btns">
          <li className="btn">
            <button
              className="item-ref-btn"
              onClick={() => {
                if (isMain) {
                  setLoading(true);
                  getCityWeather();
                }
              }}
              title="Refresh"
            >
              <i className="bi bi-arrow-clockwise"></i>
            </button>
          </li>
          <li className="btn">
            
          </li>
          <li className="btn">
            <button
              className="item-more-btn"
              onClick={() => toggleInfoFor(idKey, weatherData.name)}
              title="See more"
            >
              See more
            </button>
          </li>
          <li className="btn">
            <button
              className="item-del-btn"
              onClick={() => {
                if (!isMain) {
                  handleDeleteCity(weatherData.id);
                }
              }}
              title="Delete"
            >
              <i className="bi bi-trash"></i>
            </button>
          </li>
        </ul>
      </li>
    );
  };

  return (
    <section id="menu" className="main">
      <div className="container">
        <ul className="card-list">
          {renderWeatherCard(weather, true)}
          {additionalCities.map((city) => renderWeatherCard(city, false))}
        </ul>
      </div>

      
      {activeInfo && (
        <div
          className="fixed-info-overlay"
          onMouseDown={(e) => {
           
            if (e.target.classList.contains("fixed-info-overlay")) setActiveInfo(null);
          }}
        >
        
          <div className="fixed-info-panel" role="dialog" aria-modal="true">
            <div className="fixed-header">
            <button
              className="fixed-info-close"
              onClick={() => setActiveInfo(null)}
              aria-label="Close details"
            >
              ×
            </button>
             
          
          </div>
            <div className="fixed-info-inner">
              <Info key={`info-${activeInfo.id}-${activeInfo.city}`} city={activeInfo.city} />
             <Day city={activeInfo.city} />
             </div>
            
          </div>
        </div>
      )}
    </section>
  );
});

export default Main;

