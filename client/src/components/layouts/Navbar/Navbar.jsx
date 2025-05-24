import { NavLink } from "react-router-dom";
import styles from "./navbar.module.css";

const Navbar = () => {
  return (
    <header>
      <nav className={styles.navbar}>
        <NavLink to="/" className={styles.logo}>
          Talent Nest
        </NavLink>

        <ul className={styles.navLinks}>
          <li>
            <NavLink
              to="/register/candidate"
              className={({ isActive }) =>
                isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
              }
            >
              Job Seekers
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/register/employer"
              className={({ isActive }) =>
                isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
              }
            >
              For Employers
            </NavLink>
          </li>
        </ul>

        <div className={styles.authActions}>
          <NavLink
            to="/login"
            className={({ isActive }) =>
              isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
            }
          >
            Login
          </NavLink>
          <NavLink to="/signup" className="btn btn-primary">
            Sign Up
          </NavLink>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
