import "./Main.css";

function Main() {
  return (
    <section className="main">
      <div className="container">
        <ul className="card-list">
          <li className="card-item">
            <p className="item-city"></p>
            <h3 className="time"></h3>
            <p className="item-date"></p>
            <p className="item-temp"></p>
            <button className="item-ref-btn"></button>
            <button className="item-like-btn"></button>
            <button className="item-more-btn"></button>
            <button className="item-del-btn"></button>
          </li>
        </ul>
        <h3 className="news-title"></h3>
        <ul className="news-list">
          <li className="news-item">
            <p className="news-text"></p>
            <img src="" alt="" className="news-img" />
          </li>
        </ul>
        <button className="news-btn">see more</button>
      </div>
    </section>
  );
}
