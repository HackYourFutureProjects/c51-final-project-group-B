import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { GoLocation } from "react-icons/go";
import { MdDateRange } from "react-icons/md";
import FileOpenIcon from "@mui/icons-material/FileOpen";
import DeleteIcon from "@mui/icons-material/Delete";
import moment from "moment";
import ConfirmDialog from "./ConfirmDialog";
import styles from "./ApplicationJobCard.module.css";
import { useState } from "react";

const ApplicationJobCard = ({
  jobTitle,
  jobLocation,
  appliedAt,
  jobExpireOn,
  companyName,
  status = "pending",
  jobId,
  description,
  onWithdraw,
  mode = "application",
  createdAt,
  jobIsActive,
  jobType,
  onOpenApplyModal, // callback for Apply button click
}) => {
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);

  const capitalize = (str) =>
    str ? str.charAt(0).toUpperCase() + str.slice(1).toLowerCase() : "";

  const badgeClass = status ? styles[`badge${capitalize(status)}`] : "";
  const isPending = status === "pending" || status === "applied";

  const handleWithdrawClick = () => {
    if (mode === "application" && isPending) {
      setConfirmAction("withdraw");
      setShowConfirm(true);
    }
  };

  const handleDeleteClick = () => {
    if (mode === "saved") {
      setConfirmAction("delete");
      setShowConfirm(true);
    }
  };

  const handleConfirm = () => {
    if (typeof onWithdraw === "function" && confirmAction) {
      onWithdraw(jobId, confirmAction);
    }
    setShowConfirm(false);
  };

  const handleCancel = () => setShowConfirm(false);

  // Determine badge for saved jobs
  const savedStatus = jobIsActive ? "Active" : "Closed";
  const savedBadgeClass = styles[`badge${savedStatus}`];

  return (
    <div className={styles.jobApplicationContainer1}>
      {mode === "application" && status && (
        <div className={`${styles.jobApplicationBadge} ${badgeClass}`}>
          Status - <span className={styles.jobApplicationOffer}>{status}</span>
        </div>
      )}

      {mode === "saved" && (
        <div className={`${styles.jobApplicationBadge} ${savedBadgeClass}`}>
          {savedStatus}
        </div>
      )}

      <div className={styles.jobApplicationContainer}>
        <div className={styles.jobApplicationContent}>
          <div className={styles.jobApplicationHeader}>
            <div className={styles.jobApplicationImageMobile}></div>
            <div className={styles.jobApplicationCatalogWithdraw}></div>

            {mode === "application" && (
              <div
                className={`${styles.jobApplicationWithdrawBtn} ${
                  isPending ? styles.jobApplicationWithdrawBtnActive : ""
                }`}
                onClick={handleWithdrawClick}
                role="button"
                tabIndex={isPending ? 0 : -1}
              >
                <FileOpenIcon
                  style={{ width: 20, height: 20, marginRight: 6 }}
                />
                Withdraw application
              </div>
            )}

            {mode === "saved" && (
              <div
                className={styles.jobApplicationDeleteBtn}
                onClick={handleDeleteClick}
                role="button"
                tabIndex={0}
              >
                <DeleteIcon style={{ width: 20, height: 20 }} />
              </div>
            )}
          </div>
        </div>

        {showConfirm && (
          <ConfirmDialog
            action={confirmAction}
            jobTitle={jobTitle}
            onConfirm={handleConfirm}
            onCancel={handleCancel}
          />
        )}

        <div className={styles.jobApplicationDetails}>
          <div>
            <div className={styles.jobApplicationTitle}>{jobTitle}</div>
            {/* Job type below title */}
            {jobType && <div className={styles.jobType}>{jobType}</div>}

            {/* Application Mode: Company & Applied time on separate lines */}
            {mode === "application" && (
              <>
                {companyName && (
                  <div className={styles.postedBy}>
                    Posted by <strong>{companyName}</strong>
                  </div>
                )}
                {appliedAt && (
                  <div className={styles.jobApplicationTime}>
                    Applied {moment(appliedAt).fromNow()}
                  </div>
                )}
              </>
            )}

            {/* Saved Mode: Company & Posted time on the same line */}
            {mode === "saved" && companyName && createdAt && (
              <div className={styles.postedBy}>
                Posted by <strong>{companyName}</strong> •{" "}
                {moment(createdAt).fromNow()}
              </div>
            )}

            <div className={styles.jobApplicationItems}>
              {jobLocation && (
                <div className={styles.jobApplicationItem}>
                  <GoLocation size={15} style={{ marginRight: "5px" }} />
                  {jobLocation}
                </div>
              )}
              {jobExpireOn && (
                <div className={styles.jobApplicationItem}>
                  <MdDateRange size={16} style={{ marginRight: "5px" }} />
                  {moment(jobExpireOn).format("MMMM Do, YYYY")}
                </div>
              )}
            </div>
          </div>
          <div className={styles.jobApplicationImage}></div>
        </div>

        <div className={styles.jobApplicationDescription}>
          {description ||
            `${companyName ?? "This company"} is looking to hire a ${jobTitle}.`}
        </div>

        <div className={styles.showMoreLess}>
          <Link to={`/jobs/${jobId}`} className={styles.seeMoreLink}>
            See More
          </Link>

          {mode === "saved" && (
            <Link
              to={jobIsActive ? "#" : `/jobs/${jobId}/apply`}
              className={`${styles.applyLink} ${
                jobIsActive ? styles.applyLinkActive : styles.applyLinkInactive
              }`}
              onClick={(e) => {
                if (jobIsActive) {
                  e.preventDefault();
                  if (typeof onOpenApplyModal === "function") {
                    onOpenApplyModal();
                  }
                }
              }}
              tabIndex={jobIsActive ? 0 : -1}
              aria-disabled={!jobIsActive}
            >
              Apply Now
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

ApplicationJobCard.propTypes = {
  jobTitle: PropTypes.string.isRequired,
  jobLocation: PropTypes.string,
  appliedAt: PropTypes.string,
  jobExpireOn: PropTypes.string,
  companyName: PropTypes.string,
  status: PropTypes.oneOf([
    "pending",
    "accepted",
    "rejected",
    "Active",
    "closed",
  ]),
  jobId: PropTypes.string.isRequired,
  description: PropTypes.string,
  onWithdraw: PropTypes.func,
  mode: PropTypes.oneOf(["application", "saved"]),
  createdAt: PropTypes.string,
  jobIsActive: PropTypes.bool,
  jobType: PropTypes.string,
  onOpenApplyModal: PropTypes.func,
};

export default ApplicationJobCard;
