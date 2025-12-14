import "./App.css";
import "./reset.css";
import Header from "./components/header/Header.jsx";
import Hero from "./components/hero/Hero.jsx";
import Main from "./components/main/Main.jsx";
import News from "./components/news/News.jsx";
import Slider from "./components/slider/Slider.jsx";
import Footer from "./components/footer/Footer.jsx";
import { useRef } from "react";

function App() {
  const mainRef = useRef(null);

  function handleCitySelect(cityData) {
    console.log("City selected:", cityData);
    if (mainRef.current) {
      mainRef.current.addCity(cityData);
    }
  }

  return (
    <>
      <Header />
      <Hero id="who" onCitySelect={handleCitySelect} />
      <Main ref={mainRef} />
     
      <News />
      <Slider />
      <Footer />
    </>
  );
}

export default App;
