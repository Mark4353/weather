import { useEffect, useState } from "react";
import "../main/Main.css";

function News() {
  const [articles, setArticles] = useState([]);
  const [displayedArticles, setDisplayedArticles] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const PER_PAGE = 4;

  useEffect(() => {
    const newsApi = "2cf7b639072143a2b52de39615867e0a";
    const proxyUrl = "https://api.allorigins.win/get?url=";
    const newsUrl = encodeURIComponent(
      `https://newsapi.org/v2/everything?q=weather&apiKey=${newsApi}&pageSize=20&sortBy=publishedAt`
    );

    fetch(proxyUrl + newsUrl)
      .then((response) => response.json())
      .then((data) => {
        const articles = JSON.parse(data.contents);
        if (articles.articles) {
          const articlesWithImages = articles.articles.filter(
            (a) => a.urlToImage
          );
          setArticles(articlesWithImages);
          setDisplayedArticles(articlesWithImages.slice(0, PER_PAGE));
          setCurrentPage(0);
        }
      })
      .catch((error) => {
        console.error("Error fetching news:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  function handleSeeMore() {
    const nextPage = currentPage + 1;
    const startIndex = nextPage * PER_PAGE;
    const endIndex = startIndex + PER_PAGE;
    const newArticles = articles.slice(0, endIndex);
    setDisplayedArticles(newArticles);
    setCurrentPage(nextPage);
  }

  const hasMoreArticles = displayedArticles.length < articles.length;

  if (loading) {
    return (
      <section className="news">
        <div className="container">
          <h3 className="news-title">News</h3>
          <p>Loading news...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="news">
      <div className="container">
        <h3 className="news-title">News</h3>
        <ul className="news-list">
          {displayedArticles.map((a, index) => (
            <li key={`${a.url}-${index}`} className="news-item">
              {a.urlToImage && (
                <img src={a.urlToImage} alt={a.title} className="news-img" />
              )}
              <p className="news-text">{a.title}</p>
            </li>
          ))}
        </ul>
        {hasMoreArticles && (
          <button className="news-btn" onClick={handleSeeMore}>
            See more
          </button>
        )}
      </div>
    </section>
  );
}

export default News;