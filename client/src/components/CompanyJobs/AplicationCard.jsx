import PropTypes from "prop-types";
import styles from "./aplication-card.module.css";
import "../../index.css";
import { useNavigate } from "react-router-dom";
import useFetch from "../../hooks/useFetch";

const AplicationCard = ({ applicant }) => {
  const navigate = useNavigate();

  const { firstName, lastName, appliedAt, applicantId, resumeUrl, _id } =
    applicant;

  const handleDetailsClick = () => {
    navigate(`/users/candidate-profile/${applicantId}`);
  };

  const { performFetch } = useFetch(`/applications/${_id}/status`, (data) => {
    console.log("Status updated successfully:", data.updatedApplication.status);
  });

  const handleStatusChange = (status) => {
    performFetch({
      method: "PATCH",
      body: JSON.stringify({ status }),
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
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
        <button
          className={styles.rejectBtn}
          onClick={() => handleStatusChange("rejected")}
        >
          reject candidate
        </button>
        <button
          className={styles.acceptBtn}
          onClick={() => handleStatusChange("accepted")}
        >
          accept candidate
        </button>
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
    _id: PropTypes.string.isRequired,
    resumeUrl: PropTypes.string,
  }).isRequired,
};

export default AplicationCard;
