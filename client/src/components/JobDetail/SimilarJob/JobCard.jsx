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
    companyProfile,
    description,
    profilePhoto,
  } = job;

  const companyLogo = profilePhoto || "";
  const companyName = companyProfile || "";

  return (
    <Link to={`/jobs/${id}`} className={styles.jobCardLink}>
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
    companyProfile: PropTypes.string,
    description: PropTypes.string.isRequired,
    profilePhoto: PropTypes.string,
  }).isRequired,
  styles: PropTypes.object.isRequired,
};

export default JobCard;
