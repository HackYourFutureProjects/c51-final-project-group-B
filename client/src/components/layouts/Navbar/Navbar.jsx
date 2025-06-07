import { NavLink } from "react-router-dom";
import { useUser } from "../../../contexts/UserContext";
import { MdPerson } from "react-icons/md";
import ThemeToggle from "../../theme/ThemeToggle";
import { useEffect, useState } from "react";

import styles from "./navbar.module.css";

const Navbar = () => {
  const { user } = useUser();

  const [isDarkTheme, setIsDarkTheme] = useState(() => {
    return localStorage.getItem("theme") === "dark-theme";
  });

  useEffect(() => {
    document.documentElement.classList.toggle("dark-theme", isDarkTheme);
    localStorage.setItem("theme", isDarkTheme ? "dark-theme" : "light-theme");
  }, [isDarkTheme]);

  return (
    <header>
      <nav className={styles.navbar}>
        <NavLink to="/" className={styles.logo}>
          Talent Nest
        </NavLink>

        <ul className={styles.navLinks}>
          <li>
            <NavLink
              to="/"
              className={({ isActive }) =>
                isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
              }
            >
              Home
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/feed"
              className={({ isActive }) =>
                isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
              }
            >
              Feed
            </NavLink>
          </li>

          {user && user.userType === "seeker" && (
            <li>
              <NavLink
                to="/jobs/find"
                className={({ isActive }) =>
                  isActive
                    ? `${styles.navLink} ${styles.active}`
                    : styles.navLink
                }
              >
                Find Jobs
              </NavLink>
            </li>
          )}
        </ul>
        <div className={styles.authActions}>
          {/* if a user is logged in (later we create better), show profile icon; otherwise, show login and signup links */}
          {!user ? (
            <>
              <NavLink
                to="/signin"
                className={({ isActive }) =>
                  isActive
                    ? `${styles.navLink} ${styles.active}`
                    : styles.navLink
                }
              >
                Login
              </NavLink>
              <NavLink
                to="/signup"
                className="btn btn-primary"
                style={{ padding: "0.4rem .9rem" }}
              >
                Sign Up
              </NavLink>
            </>
          ) : (
            // if user has a profile photo show, else show a default icon
            <NavLink to="/profile" className={styles.navLink}>
              {user.profilePhoto ? (
                <img src={user.profilePhoto} alt="Profile" className="Avatar" />
              ) : (
                <MdPerson
                  size={40}
                  style={{
                    borderRadius: "50%",
                    background: "#eef2ff",
                    color: "#6366f1",
                    padding: 4,
                  }}
                  aria-label="Profile"
                />
              )}
            </NavLink>
          )}
        </div>
        <div className="themeToggleContainer">
          <ThemeToggle checked={isDarkTheme} onChange={setIsDarkTheme} />
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
