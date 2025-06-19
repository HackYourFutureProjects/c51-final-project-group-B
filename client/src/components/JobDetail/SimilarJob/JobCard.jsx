import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { GoLocation } from "react-icons/go";
import moment from "moment";

const JobCard = ({ job, styles }) => {
  const {
    id,
    title,
    location,
    type,
    createdAt,
    companyProfile, // company name string
    description,
    profilePhoto,
  } = job;
  console.log("JobCard job:", profilePhoto);
  return (
    <Link to={`/jobs/${id}`} className={styles.jobCardLink}>
      <div className={styles.jobCard}>
        <div className={styles.jobCardHeader}>
          {profilePhoto && (
            <img
              src={profilePhoto}
              alt={companyProfile}
              className={styles.companyLogo}
            />
          )}

          <div className={styles.jobInfo}>
            <p className={styles.jobTitle}>{title}</p>
            <p className={styles.companyName}>{companyProfile}</p>{" "}
            {/* Add this */}
            <span className={styles.location}>
              <GoLocation className={styles.locationIcon} />
              {location}
            </span>
          </div>
        </div>

        <p className={styles.jobDescription}>
          {description.length > 150
            ? description.slice(0, 150) + "..."
            : description}
        </p>

        <div className={styles.jobFooter}>
          <span className={styles.jobType}>{type}</span>
          <span className={styles.postedTime}>
            {moment(createdAt).fromNow()}
          </span>
        </div>
      </div>
    </Link>
  );
};

JobCard.propTypes = {
  job: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    location: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    createdAt: PropTypes.string.isRequired,
    companyProfile: PropTypes.string, // company name
    description: PropTypes.string.isRequired,
    profilePhoto: PropTypes.string, // company logo url
  }).isRequired,
  styles: PropTypes.object.isRequired,
};

export default JobCard;
