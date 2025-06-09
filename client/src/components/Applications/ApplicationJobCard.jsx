import { useState } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { GoLocation } from "react-icons/go";
import { MdDateRange } from "react-icons/md";
import moment from "moment";
import styles from "./ApplicationJobCard.module.css";

const ApplicationJobCard = (props) => {
  const {
    jobTitle,
    jobLocation,
    appliedAt,
    jobExpireOn,
    companyName,
    status,
    jobId,
    description,
    onWithdraw,
  } = props;

  const [showConfirm, setShowConfirm] = useState(false);

  const capitalize = (str) =>
    str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

  const badgeClass = styles[`badge${capitalize(status)}`] || "";
  const isPending = status === "pending" || status === "applied";

  const handleWithdrawClick = () => {
    if (isPending) setShowConfirm(true);
  };

  const handleConfirmWithdraw = () => {
    if (typeof onWithdraw === "function") {
      onWithdraw(jobId);
    }
    setShowConfirm(false);
  };

  const handleCancelWithdraw = () => {
    setShowConfirm(false);
  };

  return (
    <div className={styles.jobApplicationContainer1}>
      <div className={`${styles.jobApplicationBadge} ${badgeClass}`}>
        Status - <span className={styles.jobApplicationOffer}>{status}</span>
      </div>

      <div className={styles.jobApplicationContainer}>
        <div className={styles.jobApplicationContent}>
          <div className={styles.jobApplicationHeader}>
            {/* Mobile view - hidden in desktop */}
            <div className={styles.jobApplicationImageMobile}></div>

            {/* Withdraw button stays here */}
            <div className={styles.jobApplicationCatalogWithdraw}></div>

            <div
              className={`${styles.jobApplicationWithdrawBtn} ${
                isPending ? styles.jobApplicationWithdrawBtnActive : ""
              }`}
              onClick={handleWithdrawClick}
              role="button"
              tabIndex={isPending ? 0 : -1}
            >
              <div>
                <svg
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  width="20"
                  height="20"
                >
                  <path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.89 2 1.99 2H15v-8h5V8zm-1 7V3.5L18.5 9zm4 12.66V16h5.66v2h-2.24l2.95 2.95-1.41 1.41L19 19.41v2.24h-2z"></path>
                </svg>
              </div>
              Withdraw application
            </div>
          </div>
        </div>

        {/* Confirmation box */}
        {showConfirm && (
          <div className={styles.withdrawConfirmCard}>
            <p>
              Are you sure you want to withdraw your application from{" "}
              <strong>{jobTitle}</strong>?
            </p>
            <div className={styles.withdrawButtons}>
              <button
                className={styles.cancelButton}
                onClick={handleCancelWithdraw}
              >
                Cancel
              </button>
              <button
                className={styles.confirmButton}
                onClick={handleConfirmWithdraw}
              >
                Confirm
              </button>
            </div>
          </div>
        )}

        {/* Job Info */}
        <div className={styles.jobApplicationDetails}>
          <div>
            {/* Removed Link here and replaced with div */}
            <div className={styles.jobApplicationTitle}>{jobTitle}</div>

            <div className={styles.postedBy}>
              Posted by <strong>{companyName}</strong>
            </div>

            <div className={styles.jobApplicationDate}>
              <div className={styles.jobApplicationTime}>
                Applied {moment(appliedAt).fromNow()}
              </div>
            </div>

            <div className={styles.jobApplicationItems}>
              <div className={styles.jobApplicationItem}>
                <GoLocation size={15} style={{ marginRight: "5px" }} />
                {jobLocation}
              </div>
              <div className={styles.jobApplicationItem}>
                <MdDateRange size={16} style={{ marginRight: "5px" }} />
                {moment(jobExpireOn).format("MMMM Do, YYYY")}
              </div>
            </div>
          </div>

          {/* No longer needed placeholder for logo */}
          <div className={styles.jobApplicationImage}></div>
        </div>

        <div className={styles.jobApplicationDescription}>
          {description || `${companyName} is looking to hire a ${jobTitle}.`}
        </div>

        <div className={styles.showMoreLess}>
          <Link to={`/job/${jobId}`} className={styles.seeMoreLink}>
            See More
          </Link>
        </div>
      </div>
    </div>
  );
};

ApplicationJobCard.propTypes = {
  jobTitle: PropTypes.string.isRequired,
  jobLocation: PropTypes.string.isRequired,
  appliedAt: PropTypes.string.isRequired,
  jobExpireOn: PropTypes.string.isRequired,
  companyName: PropTypes.string.isRequired,
  status: PropTypes.string.isRequired,
  jobId: PropTypes.string.isRequired,
  description: PropTypes.string,
  onWithdraw: PropTypes.func,
};

export default ApplicationJobCard;
