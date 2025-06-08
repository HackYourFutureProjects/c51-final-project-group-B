import { NavLink, useNavigate } from "react-router-dom";
import { useUser } from "../../../contexts/UserContext";
import {
  MdPerson,
  MdExpandMore,
  MdSettings,
  MdLogout,
  MdInbox,
} from "react-icons/md";
import { toast } from "sonner";
import ThemeToggle from "../../theme/ThemeToggle";
import { useEffect, useState, useRef } from "react";
import styles from "./navbar.module.css";

const Navbar = () => {
  const { user, logout } = useUser();
  const navigate = useNavigate();

  const [isDropDownOpen, setIsDropDownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const [isDarkTheme, setIsDarkTheme] = useState(
    () => localStorage.getItem("theme") === "dark-theme",
  );

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropDownOpen(false);
      }
    };
    if (isDropDownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropDownOpen]);

  useEffect(() => {
    document.documentElement.classList.toggle("dark-theme", isDarkTheme);
    localStorage.setItem("theme", isDarkTheme ? "dark-theme" : "light-theme");
  }, [isDarkTheme]);

  const handleLogout = async (e) => {
    e.preventDefault();
    await logout();
    toast.success("Logout successfully!");
    navigate("/");
  };

  const navLinkClass = ({ isActive }) =>
    isActive ? `${styles.navLink} ${styles.active}` : styles.navLink;

  const dropDownClass = ({ isActive }) =>
    isActive ? `${styles.dropDownItem} ${styles.active}` : styles.dropDownItem;

  const profileLink =
    user?.userType === "company"
      ? "/profile/company-jobs"
      : "/profile/seeker-jobs";

  const settingsLink =
    user?.userType === "company"
      ? "/profile/company-settings"
      : "/profile/seeker-settings";

  const messageLink = "/profile/messages";

  return (
    <header>
      <nav className={styles.navbar}>
        <NavLink to="/" className={styles.logo}>
          Talent Nest
        </NavLink>

        <ul className={styles.navLinks}>
          <li>
            <NavLink to="/" className={navLinkClass}>
              Home
            </NavLink>
          </li>
          <li>
            <NavLink to="/feed" className={navLinkClass}>
              Feed
            </NavLink>
          </li>
          {user?.userType === "seeker" && (
            <li>
              <NavLink to="/jobs/find" className={navLinkClass}>
                Find Jobs
              </NavLink>
            </li>
          )}
        </ul>

        <div className={styles.rightSection}>
          <div className={styles.authActions}>
            {!user ? (
              <>
                <NavLink to="/signin" className={navLinkClass}>
                  Login
                </NavLink>
                <NavLink to="/signup" className={styles.signupBtn}>
                  Sign Up
                </NavLink>
              </>
            ) : (
              <div className={styles.profileContainer} ref={dropdownRef}>
                <button
                  className={styles.profileButton}
                  onClick={() => setIsDropDownOpen(!isDropDownOpen)}
                >
                  {user.profilePhoto ? (
                    <img
                      src={user.profilePhoto}
                      alt="Profile"
                      className={styles.avatar}
                    />
                  ) : (
                    <MdPerson size={40} className={styles.defaultIcon} />
                  )}
                  <MdExpandMore
                    className={`${styles.caret} ${
                      isDropDownOpen ? styles.rotated : ""
                    }`}
                  />
                </button>
                {isDropDownOpen && (
                  <div className={styles.dropDownMenu}>
                    <div className={styles.dropDownHeader}>
                      <span className={styles.userName}>
                        {user.name || "User"}
                      </span>
                      <span className={styles.userEmail}>{user.email}</span>
                    </div>
                    <div className={styles.dropDownItems}>
                      <NavLink to={profileLink} className={dropDownClass}>
                        <MdPerson size={18} color="var(--primary-color)" />
                        <span>Profile</span>
                      </NavLink>
                      <NavLink to={messageLink} className={dropDownClass}>
                        <MdInbox size={18} color="var(--primary-color)" />
                        <span>Messages</span>
                      </NavLink>
                      <NavLink to={settingsLink} className={dropDownClass}>
                        <MdSettings size={18} color="var(--primary-color)" />
                        <span>Settings</span>
                      </NavLink>
                      <a
                        href="#logout"
                        className={styles.dropDownItem}
                        onClick={handleLogout}
                        title="Logout"
                      >
                        <MdLogout size={18} color="var(--primary-color)" />
                        <span>Logout</span>
                      </a>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className={styles.themeToggleContainer}>
            <ThemeToggle checked={isDarkTheme} onChange={setIsDarkTheme} />
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
