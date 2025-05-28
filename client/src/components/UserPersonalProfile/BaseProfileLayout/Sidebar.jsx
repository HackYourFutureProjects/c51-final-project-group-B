import { NavLink, useNavigate } from "react-router-dom";
import { useUser } from "../../../contexts/UserContext";
import styles from "./sidebar.module.css";
import {
  FaUser,
  FaBriefcase,
  FaEnvelope,
  FaCog,
  FaSignOutAlt,
} from "react-icons/fa";

const Sidebar = () => {
  const { user, logout } = useUser();
  const navigate = useNavigate();
  if (!user) return null;

  const handleLogout = async (e) => {
    e.preventDefault();
    await logout();
    navigate("/");
  };

  return (
    <nav className={styles.sidebarContainer}>
      <ul className={styles.navList}>
        <li className={styles.navItem}>
          <NavLink
            to={
              user.userType === "company"
                ? "/profile/company-overview"
                : "/profile/seeker-overview"
            }
            className={({ isActive }) =>
              isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
            }
          >
            <span className={styles.icon}>
              <FaUser />
            </span>
            <span className={styles.label}></span>{" "}
            {/* we can add texts with icons too */}
          </NavLink>
        </li>
        <li className={styles.navItem}>
          <NavLink
            to={
              user.userType === "company"
                ? "/profile/company-jobs"
                : "/profile/seeker-jobs"
            }
            className={({ isActive }) =>
              isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
            }
          >
            <span className={styles.icon}>
              <FaBriefcase />
            </span>
            <span className={styles.label}>
              {user.userType === "company" ? "" : ""}{" "}
              {/* we can add texts with icons too  */}
            </span>
          </NavLink>
        </li>
        <li className={styles.navItem}>
          <NavLink
            to="/profile/messages"
            className={({ isActive }) =>
              isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
            }
          >
            <span className={styles.icon}>
              <FaEnvelope />
            </span>
            <span className={styles.label}></span>{" "}
            {/* we can add texts with icons too */}
          </NavLink>
        </li>
        <li className={styles.navItem}>
          <NavLink
            to={
              user.userType === "company"
                ? "/profile/company-settings"
                : "/profile/seeker-settings"
            }
            className={({ isActive }) =>
              isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
            }
          >
            <span className={styles.icon}>
              <FaCog />
            </span>
            <span className={styles.label}></span>{" "}
            {/* we can add texts with icons too */}
          </NavLink>
        </li>
        <li className={styles.navItem}>
          <a
            href="#logout"
            className={styles.navLink}
            onClick={handleLogout}
            title="Logout"
          >
            <span className={styles.icon}>
              <FaSignOutAlt />
            </span>
            <span className={styles.label}></span>{" "}
            {/* we can add texts with icons too */}
          </a>
        </li>
      </ul>
    </nav>
  );
};

export default Sidebar;
