import { NavLink } from "react-router-dom";
import styles from "./navbar.module.css";
import { useUser } from "../../../contexts/UserContext";
import { MdPerson } from "react-icons/md";

const Navbar = () => {
  const { user } = useUser();
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
        </ul>
        <div className={styles.authActions}>
          {/* if a user is logged in (later we create better), show profile icon; otherwise, show login and signup links */}
          {!user ? (
            <>
              <NavLink
                to="/login"
                className={({ isActive }) =>
                  isActive
                    ? `${styles.navLink} ${styles.active}`
                    : styles.navLink
                }
              >
                Login
              </NavLink>
              <NavLink
                to="/register"
                className="btn btn-primary"
                style={{ padding: "0.4rem .9rem" }}
              >
                Sign Up
              </NavLink>
            </>
          ) : (
            <NavLink to="/profile" className={styles.navLink}>
              <MdPerson className={styles.profileIcon} size={40} />
            </NavLink>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
