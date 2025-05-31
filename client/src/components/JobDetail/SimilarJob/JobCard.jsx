import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { GoLocation } from "react-icons/go";
import moment from "moment";

/**
 * JobCard component displays a summarized view of a job posting.
 * It includes company logo, job title, location, brief description,
 * job type, and the relative posted time.
 * The entire card is wrapped with a Link to the detailed job page.
 *
 * @param {object} props - The component props
 * @param {object} props.job - Job data object
 * @param {object} props.styles - Styles object for CSS classes
 */
const JobCard = ({ job, styles }) => {
  // Destructure relevant job properties for easier access
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

  // Use profilePhoto or fallback to empty string (no image)
  const companyLogo = profilePhoto || "";

  // Safely get company name or fallback to empty string
  const companyName = companyProfile?.companyName || "";

  return (
    // Wrap entire card with Link to job details page using job id
    <Link to={`/jobs/${id}`} className={styles.jobCardLink}>
      <div className={styles.jobCard}>
        {/* Header containing company logo and job basic info */}
        <div className={styles.jobCardHeader}>
          {/* Render company logo only if it exists */}
          {companyLogo && (
            <img
              src={companyLogo}
              alt={companyName}
              className={styles.companyLogo}
            />
          )}
          <div className={styles.jobInfo}>
            {/* Job title */}
            <p className={styles.jobTitle}>{title}</p>
            {/* Location with icon */}
            <span className={styles.location}>
              <GoLocation className={styles.locationIcon} />
              {location}
            </span>
          </div>
        </div>

        {/* Job description truncated to 150 chars with ellipsis if longer */}
        <p className={styles.jobDescription}>
          {description.length > 150
            ? description.slice(0, 150) + "..."
            : description}
        </p>

        {/* Footer with job type and relative posted time */}
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
    companyProfile: PropTypes.shape({
      companyName: PropTypes.string,
    }),
    description: PropTypes.string.isRequired,
    profilePhoto: PropTypes.string,
  }).isRequired,
  styles: PropTypes.object.isRequired,
};

export default JobCard;
