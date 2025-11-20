
import "./Header.css";
import LoginButton from "../modal/login";

function Header() {
  return (
    <header>
      <div className="container">
        <div className="header">
          <div className="logo-box">
            <img src="" alt="logo" />
          </div>

          <ul className="header-links">
            <li className="header-link">Who we are</li>
            <li className="header-link">Contacts</li>
            <li className="header-link">Menu</li>
          </ul>

          <div className="header-btns">
           
            <LoginButton />
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
