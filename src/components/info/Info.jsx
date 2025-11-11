import "./Info.css";
export default function Info() {
  const data = [
    14, 12, 11, 10, 10, 11, 12, 13, 14, 16, 17, 18, 19, 21, 23, 24, 25,
  ];

  const labels = [
    "11 pm",
    "Oct 14",
    "1 am",
    "2 am",
    "3 am",
    "4 am",
    "5 am",
    "6 am",
    "7 am",
    "8 am",
    "9 am",
    "10 am",
    "11 am",
    "12 pm",
    "1 pm",
    "2 pm",
    "3 pm",
  ];

  const width = 900;
  const height = 350;
  const pad = { top: 30, right: 20, bottom: 30, left: 50 };
  const innerW = width - pad.left - pad.right;
  const innerH = height - pad.top - pad.bottom;

  const minY = Math.min(...data) - 2;
  const maxY = Math.max(...data) + 2;

  const scaleX = (i) => pad.left + (i / (data.length - 1)) * innerW;
  const scaleY = (v) => pad.top + ((maxY - v) / (maxY - minY)) * innerH;

  const path = data
    .map((v, i) => `${i === 0 ? "M" : "L"} ${scaleX(i)} ${scaleY(v)}`)
    .join(" ");

  return (
    <section className="info">
      <div className="container">
        <ul className="info-list">
          <li className="info-item">
            <h3 className="info-card-title">Feels like</h3>
          </li>
          <li className="info-item">
            <h3 className="info-card-title">Min ℃</h3>
          </li>
          <li className="info-item">
            <h3 className="info-card-title">Humidity</h3>
          </li>
          <li className="info-item">
            <h3 className="info-card-title">Pressure</h3>
          </li>
          <li className="info-item">
            <h3 className="info-card-title">Wind speed</h3>
          </li>
          <li className="info-item">
            <h3 className="info-card-title">Visibility</h3>
          </li>
        </ul>
        <div className="bg-gray-100 w-full flex justify-center py-10">
          <div className="bg-gray-200 p-6 rounded-xl w-[980px] shadow">
            <h3 className="mb-4 text-gray-700 text-sm font-medium">
              Hourly forecast
            </h3>

            <svg width={width} height={height}>
              {[5, 10, 15, 20, 25].map((t) => (
                <line
                  key={t}
                  x1={pad.left}
                  x2={pad.left + innerW}
                  y1={scaleY(t)}
                  y2={scaleY(t)}
                  stroke="#ccc"
                  strokeWidth="1"
                />
              ))}

              {[5, 10, 15, 20, 25].map((t) => (
                <text
                  key={t}
                  x={pad.left - 10}
                  y={scaleY(t) + 4}
                  fontSize="12"
                  textAnchor="end"
                  fill="#555"
                >
                  {t}°C
                </text>
              ))}

              {labels.map((t, i) => (
                <text
                  key={i}
                  x={scaleX(i)}
                  y={height - 5}
                  fontSize="11"
                  textAnchor="middle"
                  fill="#555"
                >
                  {t}
                </text>
              ))}

              <path
                d={path}
                fill="none"
                stroke="#f6a44c"
                strokeWidth="3"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>

        <div className="day-for">
            <h3 className="day-title">8-day forecast</h3>
            <ul className="day-list">
              <li className="day-item">
                <p className="day-name"></p>
                <img src="" alt="" className="day-img" />
                <p className="day-temp"></p>
                <p className="day-info"></p>
              </li>
            </ul>
        </div>
      </div>
    </section>
  );
}
