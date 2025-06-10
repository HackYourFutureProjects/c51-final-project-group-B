import PropTypes from "prop-types";
import styles from "./aplication-card.module.css";
import "../../index.css";
import { useNavigate } from "react-router-dom";

const AplicationCard = ({ applicant }) => {
  const navigate = useNavigate();

  const { firstName, lastName, appliedAt, applicantId, resumeUrl } = applicant;
  console.log("AplicationCard render, applicant:", applicant);

  const handleDetailsClick = () => {
    navigate(`/users/candidate-profile/${applicantId}`);
  };

  return (
    <div className={styles.aplicationCard}>
      <div className={styles.applicantName}>First name: {firstName}</div>
      <div className={styles.applicantName}>Last name: {lastName} </div>

      <div className={styles.appliedAt}>
        Applied at: {new Date(appliedAt).toLocaleDateString()}
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
      <div className={styles.applicationFooter}>
        <button className={styles.rejectBtn}>reject candidate</button>
        <button className={styles.acceptBtn}>accept candidate</button>
        <button className="btn btn-primary" onClick={handleDetailsClick}>
          view profile
        </button>
      </div>
    </div>
  );
};

AplicationCard.propTypes = {
  applicant: PropTypes.shape({
    firstName: PropTypes.string.isRequired,
    lastName: PropTypes.string.isRequired,
    appliedAt: PropTypes.string.isRequired,
    applicantId: PropTypes.string.isRequired,
    resumeUrl: PropTypes.string,
  }).isRequired,
};

export default AplicationCard;
