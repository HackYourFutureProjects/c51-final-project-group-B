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
 */ const JobHeader = ({ job, styles }) => {
  const companyName = job.companyProfile?.companyName || "Company";
  const location = job.location || "Unknown Location";

  return (
    <div className={styles.header}>
      <div className={styles.companyInfo}>
        {/* Render image only if profilePhoto exists */}
        {job.profilePhoto && (
          <img
            src={job.profilePhoto}
            alt={companyName}
            className={styles.companyLogo}
            loading="lazy"
          />
        )}

        <div className={styles.jobSummary}>
          <p className={styles.jobTitle}>{job.title}</p>
          <span>{location}</span>
          <span className={styles.companyName}>{companyName}</span>
          <span className={styles.postedDate}>
            {moment(job.createdAt).fromNow()}
          </span>
        </div>
      </div>

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
