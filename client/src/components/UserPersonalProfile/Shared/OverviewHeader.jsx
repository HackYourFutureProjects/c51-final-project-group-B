import React from "react";
import { MdEmail, MdLocationOn } from "react-icons/md";
import { useUser } from "../../../contexts/UserContext";
import { useNavigate } from "react-router-dom";
import styles from "./header-section.module.css";
import Avatar from "../../../../src/assets/woman.png";

const OverviewHeader = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  if (!user) return null;

  const { userType, email, profilePhoto, location } = user;

  // Seeker fields
  const seekerProfile = user.seekerProfile || {};
  const { firstName, lastName, position } = seekerProfile;

  // Company fields
  const companyProfile = user.companyProfile || {};
  const { companyName, industry } = companyProfile;

  //  display values
  const displayName =
    userType === "company"
      ? companyName
      : [firstName, lastName].filter(Boolean).join(" ");
  const displayRole = userType === "company" ? industry : position;

  //   Edit button
  const handleEditClick = () => {
    if (userType === "company") {
      navigate("/profile/company-settings");
    } else {
      navigate("/profile/seeker-settings");
    }
  };

  return (
    <div className={styles.headerWrapper}>
      <div className={styles.leftSection}>
        <div className={styles.profileImageWrapper}>
          <img
            className={styles.profileImage}
            src={profilePhoto || Avatar}
            alt={`${displayName}`}
          />
        </div>
        <div className={styles.profileDetails}>
          <div className={styles.nameRoleWrapper}>
            <h2 className={styles.profileName}>{displayName}</h2>
            {displayRole && (
              <span className={styles.roleBadge}>{displayRole}</span>
            )}
          </div>
          <div className={styles.contactDetails}>
            <p className={styles.profileItem}>
              <MdEmail className={styles.icon} />
              {email}
            </p>
            {location && (
              <p className={styles.profileItem}>
                <MdLocationOn className={styles.icon} />
                {location}
              </p>
            )}
          </div>
        </div>
      </div>
      <div className={styles.rightSection}>
        <button
          id="contactBtnId"
          className="btn btn-primary"
          onClick={handleEditClick}
        >
          Edit
        </button>
      </div>
    </div>
  );
};

export default OverviewHeader;
