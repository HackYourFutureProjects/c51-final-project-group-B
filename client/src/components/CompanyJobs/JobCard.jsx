import PropTypes from "prop-types";
import { GoLocation } from "react-icons/go";
import moment from "moment";
import styles from "./job-card.module.css";

const JobCard = ({ job, onJobClick }) => {
  const {
    title,
    location,
    resumeUrl,
    type,
    companyProfile,
    profilePhoto,
    isActive,
    expireOn,
    applicationCount,
  } = job;

  const companyLogo = profilePhoto || "";
  const companyName = companyProfile || "";
  return (
    <div onClick={() => onJobClick(job)} className={styles.jobCardLink}>
      <div className={styles.jobCard}>
        <div className={styles.jobCardHeader}>
          {companyLogo && (
            <img
              src={companyLogo}
              alt={companyName}
              className={styles.companyLogo}
            />
          )}
          <div className={styles.jobInfo}>
            <p className={styles.jobTitle}>{title}</p>
            <span className={styles.location}>
              <GoLocation className={styles.locationIcon} />
              {location}
            </span>
          </div>
        </div>

        <div>
          <span className={styles.applicationCount}>
            Applications: {applicationCount || 0}
          </span>
        </div>
        <div>
          <span className={styles.expireOn}>
            Expires on: {moment(expireOn).format("MMM Do YYYY")}
          </span>
        </div>

        <div>
          <span className={styles.isActive}>
            Status: {isActive ? "Active" : "Inactive"}
          </span>
        </div>

        <div>
          {resumeUrl && (
            <div className={styles.resumeLink}>
              <a
                href={resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary"
                onClick={(e) => {
                  e.stopPropagation();
                }}
              >
                View current CV
              </a>
            </div>
          )}
        </div>

        <div className={styles.jobFooter}>
          <span className={styles.jobType}>{type}</span>
          <button
            className="btn btn-primary"
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            Edit
          </button>
        </div>
      </div>
    </div>
  );
};

JobCard.propTypes = {
  job: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    location: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    createdAt: PropTypes.string.isRequired,
    companyProfile: PropTypes.string,
    profilePhoto: PropTypes.string,
    isActive: PropTypes.bool,
    expireOn: PropTypes.string,
    applicationCount: PropTypes.number,
    resumeUrl: PropTypes.string,
  }).isRequired,
  onJobClick: PropTypes.func.isRequired,
};

export default JobCard;
