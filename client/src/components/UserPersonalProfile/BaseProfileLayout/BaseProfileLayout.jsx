import Sidebar from "./Sidebar";
import styles from "./BaseProfileLayout.module.css";
import PropTypes from "prop-types";

const BaseProfileLayout = ({ children, contentWrapperClass = "" }) => {
  return (
    <div className={styles.profileLayoutContainer}>
      <div className={styles.sidebarWrapper}>
        <Sidebar />
      </div>
      <div className={`${styles.contentWrapper} ${contentWrapperClass}`}>
        {children}
      </div>
    </div>
  );
};

BaseProfileLayout.propTypes = {
  children: PropTypes.node,
  contentWrapperClass: PropTypes.string,
};

export default BaseProfileLayout;
