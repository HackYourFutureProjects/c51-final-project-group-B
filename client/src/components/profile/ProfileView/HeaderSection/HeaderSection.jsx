import { MdEmail, MdLocationOn } from "react-icons/md";
import PropTypes from "prop-types";

import styles from "./header-section.module.css";
import defaultAvatar from "../../../../assets/woman.png";

const HeaderSection = ({ user }) => {
  const { seekerProfile = {}, email, profilePhoto, location } = user;
  const { firstName, lastName, position } = seekerProfile;

  return (
    <>
      <div className={styles.headerWrapper}>
        <div className={styles.leftSection}>
          <div className={styles.profileImageWrapper}>
            <img
              className={styles.profileImage}
              src={profilePhoto || defaultAvatar}
              alt={`${firstName}'s profile`}
            />
          </div>

          <div className={styles.profileDetails}>
            <div className={styles.nameRoleWrapper}>
              <h2 className={styles.profileName}>
                {`${firstName} ${lastName}`}
              </h2>
              {position && <span className={styles.roleBadge}>{position}</span>}
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
          <button id="contactBtnId" className="btn btn-primary">
            Contact
          </button>
          <button id="downloadBtnId" className="btn btn-outline">
            Download CV
          </button>
        </div>
      </div>
    </>
  );
};

HeaderSection.propTypes = {
  user: PropTypes.shape({
    name: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    seekerProfile: PropTypes.object.isRequired,
    profilePhoto: PropTypes.string,
    location: PropTypes.string,
    position: PropTypes.string,
  }).isRequired,
};

export default HeaderSection;
