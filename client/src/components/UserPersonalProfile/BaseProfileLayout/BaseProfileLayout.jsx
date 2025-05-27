import React from "react";
import Sidebar from "./Sidebar";
import styles from "./BaseProfileLayout.module.css";

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

export default BaseProfileLayout;
