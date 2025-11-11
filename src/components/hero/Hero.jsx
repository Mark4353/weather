import "./Hero.css";

function Hero() {
  return (
    <section className="hero">
      <div className="container">
        <h1 className="hero-title">Weather dashboard</h1>
        <p className="hero-info">
          Create your personal list of favorite cities and always be aware of
          the weather.
        </p>
        <p className="correct-weaher"></p>
        <form action="" className="hero-form">
          <input
            type="text"
            className="hero-input"
            placeholder="Search location..."
          />
          <button className="hero-search-btn">search</button>
        </form>
      </div>
    </section>
  );
}

export default Hero;
