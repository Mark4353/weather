import "./Hero.css";
import "bootstrap-icons/font/bootstrap-icons.css";


function Hero() {

  const now = new Date();
  const monthName = now.toLocaleString("en-US", { month: "long" }); 
  const year = now.getFullYear(); 
  const weekday = now.toLocaleString("en-US", { weekday: "long" }); 
  const day = now.getDate(); 
  const formattedDate = `${monthName} ${year} ${weekday}, ${day}`;

  return (
    <section className="hero">
      <div className="bg-opacity">
      <div className="container">
        <h1 className="hero-title">Weather dashboard</h1>
        <div className="info-box">
          <p className="hero-info">
            Create your personal list of favorite cities and always be aware of
            the weather.
          </p>
          <p className="correct-weaher hero-info">{formattedDate}</p>
        </div>
        <form action="" className="hero-form">
          <input
            type="text"
            className="hero-input"
            placeholder="Search location..."
          />
          <button className="hero-search-btn"><i class="bi bi-search"></i></button>
        </form>
      </div>
      </div>
    </section>
  );
}

export default Hero;
