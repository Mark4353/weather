import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

const API_KEY = "33efc2b91d2c7c3d5deea4f4c1a523d2"; // ← вставьте ключ

export default function HourlyForecast({ city = "London" }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadWeather() {
      try {
        setLoading(true);

        const respCity = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&lang=en&appid=${API_KEY}`
        );
        const cityData = await respCity.json();

        const { lon, lat } = cityData.coord;

        const respHourly = await fetch(
          `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
        );

        const hourlyData = await respHourly.json();

        const parsed = hourlyData.list.slice(0, 12).map((item) => ({
          time: new Date(item.dt * 1000).getHours() + ":00",
          temp: Math.round(item.main.temp),
        }));

        setData(parsed);
      } catch (err) {
        setError("Ошибка загрузки данных");
      } finally {
        setLoading(false);
      }
    }

    loadWeather();
  }, [city]);

  if (loading) return <div>Загрузка...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div style={{ width: "90%", height: 350, background: "#f4f4f4", padding: 20, borderRadius: 12 }}>
      <h3>Hourly forecast — {city}</h3>

      <ResponsiveContainer width="100%" height="90%">
        <LineChart data={data}>
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
  );
}
