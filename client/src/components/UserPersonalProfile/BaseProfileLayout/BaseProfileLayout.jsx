import Sidebar from "./Sidebar";
import styles from "./BaseProfileLayout.module.css";
import PropTypes from "prop-types";

const BaseProfileLayout = ({ children }) => {
  return (
    <div className={styles.profileLayoutContainer}>
      <div className={styles.sidebarWrapper}>
        <Sidebar />
      </div>
      <div className={styles.contentWrapper}>{children}</div>
    </div>
  );
};

BaseProfileLayout.propTypes = {
  children: PropTypes.node,
};

export default BaseProfileLayout;
