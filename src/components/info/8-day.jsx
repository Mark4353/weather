import React, { useEffect, useState } from "react";
import "./Info.css";

const OWM_KEY = "33efc2b91d2c7c3d5deea4f4c1a523d2";


const weatherMap = {
  0: { desc: "clear sky", icon: "01d" },
  1: { desc: "mainly clear", icon: "02d" },
  2: { desc: "partly cloudy", icon: "03d" },
  3: { desc: "overcast", icon: "04d" },

  45: { desc: "fog", icon: "50d" },
  48: { desc: "rime fog", icon: "50d" },

  51: { desc: "light drizzle", icon: "09d" },
  53: { desc: "drizzle", icon: "09d" },
  55: { desc: "heavy drizzle", icon: "09d" },

  61: { desc: "light rain", icon: "10d" },
  63: { desc: "rain", icon: "10d" },
  65: { desc: "heavy rain", icon: "10d" },

  71: { desc: "light snow", icon: "13d" },
  73: { desc: "snow", icon: "13d" },
  75: { desc: "heavy snow", icon: "13d" },

  80: { desc: "rain showers", icon: "10d" },
  81: { desc: "rain showers", icon: "10d" },
  82: { desc: "violent showers", icon: "10d" },

  95: { desc: "thunderstorm", icon: "11d" },
  96: { desc: "thunderstorm + hail", icon: "11d" },
  99: { desc: "thunderstorm + hail", icon: "11d" },
};

export default function EightDayForecast({ city }) {
  const [days, setDays] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function loadForecast() {
      try {
        setLoading(true);
        setError(null);

    
        const respCity = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${OWM_KEY}`
        );
        const cityData = await respCity.json();
        if (!respCity.ok) throw new Error(cityData.message);

        const { lat, lon } = cityData.coord;

       
        const resp = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=weathercode,temperature_2m_max,temperature_2m_min&timezone=auto`
        );
        const data = await resp.json();

        if (!data.daily) throw new Error("Forecast unavailable");

        const mapped = data.daily.time.map((date, i) => {
          const code = data.daily.weathercode[i];
          const icon = weatherMap[code]?.icon || "03d";
          const desc = weatherMap[code]?.desc || "unknown";

          return {
            date,
            tempMax: Math.round(data.daily.temperature_2m_max[i]),
            tempMin: Math.round(data.daily.temperature_2m_min[i]),
            icon,
            desc,
          };
        });

        if (!cancelled) setDays(mapped.slice(0, 8));
      } catch (e) {
        if (!cancelled) setError("Ошибка загрузки прогноза");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadForecast();
    return () => (cancelled = true);
  }, [city]);


  function formatDate(d) {
    return new Date(d).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  }

  if (loading) return <div className="info-loading">Загрузка...</div>;
  if (error) return <div className="info-error">{error}</div>;

  return (
    <div className="day-panel">
      <h3 className="info-title">8-day forecast — {city}</h3>

      <div className="forecast-list">
        {days.map((day, idx) => (
          <div key={idx} className="forecast-row">
            <div className="forecast-date">{formatDate(day.date)}</div>

            <img
              className="forecast-icon"
              src={`https://openweathermap.org/img/wn/${day.icon}.png`}
              alt=""
            />

            <div className="forecast-temp">
              {day.tempMax}° / {day.tempMin}°
            </div>

            <div className="forecast-desc">{day.desc}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
