import "./Header.css";

function Header() {
  return (
    <header>
      <div className="container">
        <div className="header">
          <div className="logo-box">
            <img src="" alt="logo" />
            </div>
          <ul className="header-links">
            <li className="header-link"><a href="#">Who we are</a></li>
            <li className="header-link"><a href="#">Contacts</a></li>
            <li className="header-link"><a href="#">Menu</a></li>
          </ul>
        <div className="header-btns">
          <button className="header-btn">Sing Up</button>
          <button className="profile-btn">open</button>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
