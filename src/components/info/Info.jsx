import React, { useEffect, useMemo, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import "./Info.css";

const API_KEY = "33efc2b91d2c7c3d5deea4f4c1a523d2";

export default function HourlyForecast({ city = "London" }) {
  const [fullData, setFullData] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  
  const [maxPoints, setMaxPoints] = useState(() => {
    const w = typeof window !== "undefined" ? window.innerWidth : 1200;
    if (w <= 380) return 4;
    if (w <= 600) return 6;
    if (w <= 900) return 8;
    return 12;
  });

  useEffect(() => {
    function handleResize() {
      const w = window.innerWidth;
      if (w <= 380) setMaxPoints(4);
      else if (w <= 600) setMaxPoints(6);
      else if (w <= 900) setMaxPoints(8);
      else setMaxPoints(12);
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    let cancelled = false;
    async function loadWeather() {
      try {
        setLoading(true);
        setError(null);

        const respCity = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&lang=en&appid=${API_KEY}`
        );
        const cityData = await respCity.json();
        if (!respCity.ok) throw new Error(cityData.message || "City fetch error");

        const { lon, lat } = cityData.coord;

        const respHourly = await fetch(
          `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
        );
        const hourlyData = await respHourly.json();
        if (!respHourly.ok) throw new Error(hourlyData.message || "Forecast fetch error");

        const parsed = hourlyData.list.map((item) => ({
          time: new Date(item.dt * 1000).getHours() + ":00",
          temp: Math.round(item.main.temp),
        }));

        if (!cancelled) setFullData(parsed);
      } catch (err) {
        if (!cancelled) setError("Ошибка загрузки данных");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    loadWeather();
    return () => {
      cancelled = true;
    };
  }, [city]);


  const displayed = useMemo(() => {
    const arr = fullData || [];
    const n = Math.max(1, Math.min(arr.length, maxPoints || 6));
    if (arr.length <= n) return arr;
    const step = Math.floor(arr.length / n) || 1;
    const res = [];
    for (let i = 0; i < arr.length && res.length < n; i += step) {
      res.push(arr[i]);
    }

    while (res.length < n) res.push(arr[arr.length - 1]);
    return res;
  }, [fullData, maxPoints]);

  if (loading) return <div className="info-loading">Загрузка...</div>;
  if (error) return <div className="info-error">{error}</div>;

  return (
    <div className="info-panel">
      <h3 className="info-title">Hourly forecast — {city}</h3>

      <div className="chart-wrapper">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={displayed}>
            <CartesianGrid stroke="#dcdcdc" />
            <XAxis dataKey="time" />
            <YAxis domain={["dataMin-2", "dataMax+2"]} unit="°C" />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="temp"
              stroke="#ffa74f"
              strokeWidth={3}
              dot={{ r: 3 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
