import { useState } from "react";
import { Link } from "react-router-dom";
import { useUser } from "../../util/UserContext";
import "./NavBar.css";

const Nav = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, logout } = useUser();
  const isAuthorized = user !== null;

  return (
    <nav className="navbar">
      <div className="nav__header">
        <div className="nav__logo">
          <h2>OpportunityHunt</h2>
        </div>
        <div
          id="mobile-menu"
          className={`menu-icon ${menuOpen ? "is-active" : ""}`}
          onClick={() => setMenuOpen((prev) => !prev)}
        >
          ☰
        </div>
      </div>

      <ul className={`nav__links ${menuOpen ? "active" : ""}`}>
        {!isAuthorized && (
          <>
            <li>
              <Link to="/jobs">Jobs</Link>
            </li>
            <li>
              <Link to="/companies">Companies</Link>
            </li>
            <li>
              <Link to="/feeds">Feeds</Link>
            </li>
            <li>
              <Link to="/contact">Contact Us</Link>
            </li>
            <li>
              <Link to="/login">Login</Link>
            </li>
            <li>
              <Link to="/signup" className="btn">
                SignUp
              </Link>
            </li>
          </>
        )}

        {isAuthorized && user?.role === "JobSeeker" && (
          <>
            <li>
              <Link to="/jobs">Jobs</Link>
            </li>
            <li>
              <Link to="/companies">Companies</Link>
            </li>
            <li>
              <Link to="/feeds">Feeds</Link>
            </li>
            <li>
              <Link to="/contact">Contact Us</Link>
            </li>
            <li>
              <Link to="/profile">Profile</Link>
            </li>
            <li>
              <Link to="/notifications">Notifications</Link>
            </li>
            <li>
              <button onClick={logout}>Logout</button>
            </li>
          </>
        )}

        {isAuthorized && user?.role === "Employer" && (
          <>
            <li>
              <Link to="/jobposts">Job Posts</Link>
            </li>
            <li>
              <Link to="/feeds">Feeds</Link>
            </li>
            <li>
              <Link to="/contact">Contact Us</Link>
            </li>
            <li>
              <Link to="/profile">Profile</Link>
            </li>
            <li>
              <Link to="/notifications">Notifications</Link>
            </li>
            <li>
              <button onClick={logout}>Logout</button>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Nav;
