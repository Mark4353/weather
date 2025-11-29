import "./App.css";
import "./reset.css";
import Header from "./components/header/Header.jsx";
import Hero from "./components/hero/Hero.jsx";
import Main from "./components/main/Main.jsx";
// import Info from "./components/info/Info.jsx";
import Footer from "./components/footer/Footer.jsx";
function App() {
  return (
    <>
      <Header />
      <Hero />
      <Main/>
      {/* <Info /> */}
      <Footer />
   </>
  );
}

export default App;
