import { MdEmail, MdLocationOn, MdLanguage } from "react-icons/md";
import PropTypes from "prop-types";

import styles from "./header-section.module.css";
import defaultAvatar from "../../../../assets/woman.png";
// import { use } from "react";

const HeaderSection = ({ user }) => {
  const { userType, email, profilePhoto, location } = user;

  const isCompany = userType === "company";

  // Company
  const { companyProfile = {} } = isCompany ? user : {};
  const { companyName, headquarters, tagline, website, industry } =
    companyProfile;

  // Seeker
  const { seekerProfile = {} } = !isCompany ? user : {};
  const { firstName, lastName, position } = seekerProfile;

  const name = isCompany
    ? companyName || "Company Name Not Provided"
    : `${firstName || "Name Not Provided"} ${lastName || ""}`.trim();
  const roleOrIndustry = isCompany
    ? industry || "IIndustry not specified"
    : position || "Position not specified";

  const locationOrHQ = isCompany
    ? headquarters || "Location not specified"
    : location || "Location not specified";

  const userEmail = email || "Email not provided";
  const userWebsite = website || "Website not provided";
  return (
    <div className={styles.headerWrapper}>
      <div className={styles.leftSection}>
        <div className={styles.profileImageWrapper}>
          <img
            className={styles.profileImage}
            src={profilePhoto || defaultAvatar}
            alt={`${name}'s profile`}
          />
        </div>

        <div className={styles.profileDetails}>
          <div className={styles.nameRoleWrapper}>
            <h2 className={styles.profileName}>{name}</h2>
            {roleOrIndustry && (
              <span className={styles.roleBadge}>{roleOrIndustry}</span>
            )}
          </div>

          {isCompany && tagline && (
            <h3 className={styles.tagline}>{tagline}</h3>
          )}

          <div className={styles.contactDetails}>
            <p className={styles.profileItem}>
              <MdEmail className={styles.icon} />
              {userEmail}
            </p>
            {isCompany && website && (
              <p className={styles.profileItem}>
                <MdLanguage className={styles.icon} />
                {userWebsite}
              </p>
            )}
            {locationOrHQ && (
              <p className={styles.profileItem}>
                <MdLocationOn className={styles.icon} />
                {locationOrHQ}
              </p>
            )}
          </div>
        </div>
      </div>
      {/* button to contact the employer */}
      <div className={styles.rightSection}>
        <button id="contactBtnId" className="btn btn-primary">
          Contact
        </button>

        {/* button to upload resume */}
        {!isCompany && (
          <button id="downloadBtnId" className="btn btn-outline">
            Download CV
          </button>
        )}
      </div>
    </div>
  );
};

HeaderSection.propTypes = {
  user: PropTypes.shape({
    userType: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    profilePhoto: PropTypes.string,
    location: PropTypes.string,
    seekerProfile: PropTypes.object,
    companyProfile: PropTypes.object,
  }).isRequired,
};

export default HeaderSection;
