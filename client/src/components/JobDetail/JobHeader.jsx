import PropTypes from "prop-types";
import { AiOutlineSafetyCertificate } from "react-icons/ai";
import moment from "moment";

/**
 * JobHeader component renders the header section of a job listing.
 * It displays the company logo, job title, location, company name,
 * and the time since the job was posted, along with a certification icon.
 *
 * @param {object} props - The component props
 * @param {object} props.job - The job data object
 * @param {object} props.styles - CSS module or styles object for styling
 */
const JobHeader = ({ job, styles }) => {
  // Safely extract company name, fallback to 'Company' if missing
  const companyName = job.companyProfile?.companyName || "Company";

  // Use provided profile photo or fallback to a placeholder image
  const profilePhoto = job.profilePhoto || "/placeholder-logo.png";

  // Use provided location or fallback text
  const location = job.location || "Unknown Location";

  return (
    <div className={styles.header}>
      <div className={styles.companyInfo}>
        {/* Company logo image, lazy loaded for performance */}
        <img
          src={profilePhoto}
          alt={companyName}
          className={styles.companyLogo}
          loading="lazy"
        />
        <div className={styles.jobSummary}>
          {/* Job title */}
          <p className={styles.jobTitle}>{job.title}</p>

          {/* Job location */}
          <span>{location}</span>

          {/* Company name */}
          <span className={styles.companyName}>{companyName}</span>

          {/* Display relative posted time using moment.js */}
          <span className={styles.postedDate}>
            {moment(job.createdAt).fromNow()}
          </span>
        </div>
      </div>

      {/* Certification icon for visual enhancement */}
      <AiOutlineSafetyCertificate className={styles.certIcon} />
    </div>
  );
};

// PropTypes for runtime type checking and developer documentation
JobHeader.propTypes = {
  job: PropTypes.shape({
    title: PropTypes.string.isRequired,
    location: PropTypes.string, //
    createdAt: PropTypes.string.isRequired,
    companyProfile: PropTypes.shape({
      companyName: PropTypes.string,
    }),
    profilePhoto: PropTypes.string,
  }).isRequired,
  styles: PropTypes.object.isRequired,
};

export default JobHeader;
