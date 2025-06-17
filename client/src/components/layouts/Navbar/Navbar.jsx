import { NavLink, useNavigate } from "react-router-dom";
import { useUser } from "../../../contexts/UserContext";

import {
  MdPerson,
  MdExpandMore,
  MdSettings,
  MdLogout,
  MdInbox,
  MdWork,
  MdMenu, // Import for hamburger icon
  MdClose, // Import for close icon
} from "react-icons/md";

import { toast } from "sonner";
import ThemeToggle from "../../theme/ThemeToggle";
import { useEffect, useState, useRef } from "react";
import styles from "./navbar.module.css";
import NotificationBell from "../../NotificationBell/NotificationBell";

const Navbar = () => {
  const { user, logout } = useUser();
  const navigate = useNavigate();

  const [isDropDownOpen, setIsDropDownOpen] = useState(false);
  const dropdownRef = useRef(null); // Ref for the profile dropdown container

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const mobileMenuRef = useRef(null); // Ref for the mobile menu content

  const [isDarkTheme, setIsDarkTheme] = useState(
    () => localStorage.getItem("theme") === "dark-theme",
  );

  // Effect to handle clicks outside of dropdown and mobile menu
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Close profile dropdown if click is outside its container
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropDownOpen(false);
      }

      // Close mobile menu if click is outside its container AND not on the hamburger button
      // This also ensures clicking the profile section (which is visible on mobile) doesn't close the hamburger
      if (
        isMobileMenuOpen && // Only check if mobile menu is currently open
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target) &&
        !event.target.closest(`.${styles.hamburgerButton}`)
      ) {
        setIsMobileMenuOpen(false);
      }
    };

    // Add event listener only when either menu is open to optimize performance
    if (isDropDownOpen || isMobileMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropDownOpen, isMobileMenuOpen]); // Re-run effect if menu states change

  // Effect to apply/remove dark theme class to document element
  useEffect(() => {
    document.documentElement.classList.toggle("dark-theme", isDarkTheme);
    localStorage.setItem("theme", isDarkTheme ? "dark-theme" : "light-theme");
  }, [isDarkTheme]);

  // Handle user logout
  const handleLogout = async (e) => {
    e.preventDefault();
    await logout();

    toast.success("Logout successfully!");
    navigate("/");
    setIsDropDownOpen(false); // Ensure dropdown is closed on logout
    setIsMobileMenuOpen(false); // Ensure mobile menu is closed on logout
  };

  // Helper function for NavLink class names (active state styling)
  const navLinkClass = ({ isActive }) =>
    isActive ? `${styles.navLink} ${styles.active}` : styles.navLink;

  // Helper function for dropdown item class names (active state styling)
  const dropDownClass = ({ isActive }) =>
    isActive ? `${styles.dropDownItem} ${styles.active}` : styles.dropDownItem;

  // Global navigation click handler:
  // - Always closes the mobile menu.
  // - Closes the profile dropdown only if 'closeDropdown' is true (default behavior for non-dropdown links).
  const handleNavLinkClick = (closeDropdown = true) => {
    setIsMobileMenuOpen(false); // Always close mobile menu on any navigation
    if (closeDropdown) {
      setIsDropDownOpen(false); // Close profile dropdown for non-dropdown links
    }
  };

  // Dynamic profile, settings, and jobs links based on user type
  const profileLink =
    user?.userType === "company"
      ? "/profile/company-overview"
      : "/profile/seeker-overview";

  const settingsLink =
    user?.userType === "company"
      ? "/profile/company-settings"
      : "/profile/seeker-settings";

  const jobsLink =
    user?.userType === "company"
      ? "/profile/company-jobs"
      : "/profile/seeker-jobs";

  const messageLink = "/profile/messages";

  return (
    <header>
      <nav className={styles.navbar}>
        <NavLink
          to="/"
          className={styles.logo}
          onClick={() => handleNavLinkClick(true)}
        >
          <img
            src="/logo.png"
            alt="Talent Nest Logo"
            className={styles.logoImage}
          />
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
            {user && (
              <div>
                <NotificationBell />
              </div>
            )}
          </div>
          {!user ? (
            <div className={styles.authActions}>
              <NavLink to="/signin" className={navLinkClass}>
                Login
              </NavLink>
              <NavLink to="/signup" className={styles.signupBtn}>
                Sign Up
              </NavLink>
            </div>
          ) : (
            <div className={styles.profileContainer} ref={dropdownRef}>
              <NavLink
                to={profileLink}
                className={styles.profileButton}
                title="View Profile"
                onClick={() => handleNavLinkClick(true)}
              >
                {user.profilePhoto ? (
                  <img
                    src={user.profilePhoto}
                    alt="Profile"
                    className="Avatar"
                  />
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

              <button
                className={styles.dropdownToggle}
                onClick={() => setIsDropDownOpen(!isDropDownOpen)}
                aria-label="Toggle profile menu"
              >
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
                    <NavLink
                      to={jobsLink}
                      className={dropDownClass}
                      onClick={() => handleNavLinkClick(false)}
                    >
                      <MdWork size={18} color="var(--primary-color)" />
                      <span>My Jobs</span>
                    </NavLink>
                    <NavLink
                      to={messageLink}
                      className={dropDownClass}
                      onClick={() => handleNavLinkClick(false)}
                    >
                      <MdInbox size={18} color="var(--primary-color)" />
                      <span>Messages</span>
                    </NavLink>
                    <NavLink
                      to={settingsLink}
                      className={dropDownClass}
                      onClick={() => handleNavLinkClick(false)}
                    >
                      <MdSettings size={18} color="var(--primary-color)" />
                      <span>Settings</span>
                    </NavLink>
                    <a
                      href="#logout"
                      className={`${styles.dropDownItem} ${styles.logoutItem}`}
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

          {/* Theme toggle - always rendered here for both desktop & mobile visibility */}
          <div className={styles.themeToggleContainer}>
            <ThemeToggle checked={isDarkTheme} onChange={setIsDarkTheme} />
          </div>

          {/* Hamburger menu button - hidden on desktop, shown on mobile AFTER profile */}
          <button
            className={styles.hamburgerButton}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle mobile menu"
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? <MdClose size={24} /> : <MdMenu size={24} />}
          </button>
        </div>

        {/* Mobile menu content container (conditionally rendered) */}
        {isMobileMenuOpen && (
          <div className={styles.mobileMenu} ref={mobileMenuRef}>
            {/* Main navigation links within the mobile menu */}
            <ul className={styles.mobileNavLinks}>
              <li>
                <NavLink
                  to="/"
                  className={navLinkClass}
                  onClick={() => handleNavLinkClick(true)}
                >
                  Home
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/feed"
                  className={navLinkClass}
                  onClick={() => handleNavLinkClick(true)}
                >
                  Feed
                </NavLink>
              </li>
              {user?.userType === "seeker" && (
                <li>
                  <NavLink
                    to="/jobs/find"
                    className={navLinkClass}
                    onClick={() => handleNavLinkClick(true)}
                  >
                    Find Jobs
                  </NavLink>
                </li>
              )}
              {/* Auth actions (Login/Signup) within the mobile menu for non-logged-in users */}
              {!user && (
                <>
                  <li>
                    <NavLink
                      to="/signin"
                      className={navLinkClass}
                      onClick={() => handleNavLinkClick(true)}
                    >
                      Login
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/signup"
                      className={styles.signupBtn}
                      onClick={() => handleNavLinkClick(true)}
                    >
                      Sign Up
                    </NavLink>
                  </li>
                </>
              )}
            </ul>
            {/* No need to duplicate profile-related links or theme toggle here, as they are in the main bar */}
          </div>
        )}
      </nav>
    </header>
  );
};

export default Navbar;
