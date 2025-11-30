import { useEffect, useState } from "react";
import "./Slider.css";

const API_KEY = "49809824-6020f8c5e3e6ee0bf43d51bd8";
const API_URL = `https://pixabay.com/api/?key=${API_KEY}&q=nature&image_type=photo&per_page=20&safesearch=true`;

function Slider() {
  const [images, setImages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchImages() {
      try {
        const res = await fetch(API_URL);
        if (!res.ok) throw new Error("Failed to fetch images");
        const data = await res.json();
        if (data.hits && data.hits.length > 0) {
          setImages(data.hits);
          setCurrentIndex(Math.floor(data.hits.length / 2));
        } else {
          throw new Error("No found");
        }
      } catch (err) {
        setError(err.message);
        console.error("Error fetching images:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchImages();
  }, []);


  useEffect(() => {
    if (images.length === 0) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [images.length]);


  function handleImageClick(index) {
    setCurrentIndex(index);
  }

  if (loading) return <div className="slider"><p>Loading images...</p></div>;
  if (error) return <div className="slider"><p>Error: {error}</p></div>;
  if (images.length === 0) return <div className="slider"><p>No images found</p></div>;

  const currentImage = images[currentIndex];
  

  const getVisibleImages = () => {
    const visible = [];
    const range = 2;
    
    for (let i = -range; i <= range; i++) {
      const idx = (currentIndex + i + images.length) % images.length;
      visible.push({ index: idx, img: images[idx], offset: i });
    }
    return visible;
  };

  const visibleImages = getVisibleImages();

  return (
    <div className="container">
    <div className="slider">
      <h3 className="slider-title">Beautiful nature</h3>


      <div className="slider-container">
  
        <ul className="slider-list left">
          {visibleImages
            .filter((item) => item.offset < 0)
            .reverse()
            .map((item) => (
              <li
                key={`left-${item.index}`}
                className="slider-item"
                onClick={() => handleImageClick(item.index)}
              >
                <img
                  src={item.img.webformatURL}
                  alt={item.img.tags}
                  className="slider-img"
                />
              </li>
            ))}
        </ul>
        <div className="slider-main">
          <img
            src={currentImage.largeImageURL}
            alt={currentImage.tags}
            className="slider-main-img"
          />
        </div>
        <ul className="slider-list right">
          {visibleImages
            .filter((item) => item.offset > 0)
            .map((item) => (
              <li
                key={`right-${item.index}`}
                className="slider-item"
                onClick={() => handleImageClick(item.index)}
              >
                <img
                  src={item.img.webformatURL}
                  alt={item.img.tags}
                  className="slider-img"
                />
              </li>
            ))}
        </ul>
      </div>
    </div>
    </div>
  );
}

export default Slider;