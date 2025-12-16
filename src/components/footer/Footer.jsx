import "./Footer.css";
import logo from '../../logo1.png';
function Footer() {
  return (
    
    <footer id="contacts">
      <div className="container footer-container">
        <img src={logo} alt="logo" />
      <div className="adr">
        <h3 className="footer-adr-title">Address</h3>
        <p className="footer-adr">Svobody str. 35 Kyiv, Ukraine</p>
      </div>
      <div className="contact">
        <h3 className="contact-title"><a href="https://goiteens.com/" className="footer-link" target="blank">Contact us</a></h3>
      </div>
      </div>
    </footer>
  );
}
export default Footer;