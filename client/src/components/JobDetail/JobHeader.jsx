import PropTypes from "prop-types";
import { AiOutlineSafetyCertificate } from "react-icons/ai";
import moment from "moment";
import { useNavigate } from "react-router-dom";

/**
 * JobHeader component renders the header section of a job listing.
 */
const JobHeader = ({ job, styles }) => {
  const navigate = useNavigate();

  const companyName = job.postedBy?.companyProfile?.companyName || "Company";
  const location = job.location || "Unknown Location";
  const profilePhoto = job.postedBy?.profilePhoto;
  const companyId = job.postedBy?._id;
  console.log("Company ID:", companyId);
  const goToCompanyProfile = () => {
    if (companyId) {
      navigate(`/users/company-profile/${companyId}`);
    }
  };

  return (
    <div className={styles.header}>
      <div className={styles.companyInfo}>
        {profilePhoto && (
          <img
            src={profilePhoto}
            alt={companyName}
            className={styles.companyLogo}
            loading="lazy"
            onClick={goToCompanyProfile}
            style={{ cursor: "pointer" }}
          />
        )}

        <div className={styles.jobSummary}>
          <p className={styles.jobTitle}>{job.title}</p>
          <span>{location}</span>
          <span
            className={styles.companyName}
            onClick={goToCompanyProfile}
            style={{ cursor: "pointer" }}
          >
            {companyName}
          </span>
          <span className={styles.postedDate}>
            {moment(job.createdAt).fromNow()}
          </span>
        </div>
      </div>

      <AiOutlineSafetyCertificate className={styles.certIcon} />
    </div>
  );
};

JobHeader.propTypes = {
  job: PropTypes.shape({
    title: PropTypes.string.isRequired,
    location: PropTypes.string,
    createdAt: PropTypes.string.isRequired,
    postedBy: PropTypes.shape({
      _id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      profilePhoto: PropTypes.string,
      companyProfile: PropTypes.shape({
        companyName: PropTypes.string,
      }),
    }),
  }).isRequired,
  styles: PropTypes.object.isRequired,
};

export default JobHeader;
