import "./Footer.css";
const Footer = () => {
  return (
    <footer className="footer">
      <div className="section__container footer__container">
        <div className="footer__col">
          <h4>Quick Links</h4>
          <ul className="footer__links">
            {/* TODO: Add quick links like Home, About, Services, etc. */}
          </ul>
        </div>
        <div className="footer__col">
          <h4>Follow Us</h4>
          <ul className="footer__links">
            {/* TODO: Add social media links like Facebook, Twitter, LinkedIn, etc. */}
          </ul>
        </div>
        <div className="footer__col">
          <h4>Contact Us</h4>
          <ul className="footer__links">
            {/* TODO: Add contact info like email, phone, or contact page link */}
          </ul>
        </div>
      </div>
      <div className="footer__bar">
        Copyright © 2025 Web Design Mastery. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
