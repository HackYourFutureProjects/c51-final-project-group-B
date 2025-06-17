import styles from "./findjob.module.css";
import { MdSend, MdBookmarkBorder, MdBookmark } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { useState, useRef } from "react";
import ApplyModalForm from "../ApplyToJobs/ApplyModalForm";
import FeedbackMessage from "../UserPersonalProfile/Shared/SettingsSections/FeedbackMessage";
import PropTypes from "prop-types";
import { useSavedJobs } from "../../contexts/SavedJobsContext";

const JobCard = ({ job }) => {
  const navigate = useNavigate();
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [saveLoading, setSaveLoading] = useState(false);
  const shareBtnRef = useRef(null);

  const { isSaved, addJob, removeJob } = useSavedJobs();
  const saved = isSaved(job._id);

  if (!job) return null;

  // Fallback / computed values
  const title = job.title || "Untitled";
  const companyName =
    job.postedBy?.companyProfile?.companyName || "Unknown Company";
  const location = job.location || "Anywhere";
  const type = job.type || "";
  const tags = Array.isArray(job.tags) ? job.tags.slice(0, 2) : [];
  const desc =
    typeof job.description === "string"
      ? job.description.slice(0, 100) +
        (job.description.length > 100 ? "..." : "")
      : "";
  const isActive = job.isActive === true;
  const statusText =
    typeof job.isActive === "undefined" || job.isActive === null
      ? ""
      : isActive
        ? "Active"
        : "Closed";

  // action handlers
  const handleView = () => {
    if (job._id) {
      navigate(`/jobs/${job._id}`);
    }
  };

  const handleApply = () => {
    setShowApplyModal(true);
  };

  const handleCloseApply = () => {
    setShowApplyModal(false);
  };

  const handleShareClick = () => {
    setShowShareMenu((prev) => !prev);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`${window.location.origin}/jobs/${job._id}`);
    setShowShareMenu(false);
    setFeedback("Job link copied!");
    setTimeout(() => setFeedback(null), 2000);
  };

  const handleShareEmail = () => {
    window.open(
      `mailto:?subject=Check out this job!&body=Here's a job you might like: ${window.location.origin}/jobs/${job._id}`,
      "_blank",
    );
    setShowShareMenu(false);
  };

  const handleSaveToggle = async () => {
    setSaveLoading(true);
    try {
      if (saved) {
        await removeJob(job._id);
        setFeedback("Job removed from saved!");
      } else {
        await addJob(job);
        setFeedback("Job saved!");
      }
      setTimeout(() => setFeedback(null), 2000);
    } catch (err) {
      console.error("Error toggling save job", err);
      setFeedback(err.message || "Error saving job.");
      setTimeout(() => setFeedback(null), 2000);
    } finally {
      setSaveLoading(false);
    }
  };
  return (
    <div className={styles.jobCard}>
      {feedback && <FeedbackMessage feedback={feedback} />}
      <div className={styles.jobCardHeader}>
        <div>
          <div className={styles.jobTitle}>{title}</div>
          <div className={styles.jobMeta}>
            <span className={styles.jobLocation}>{location}</span>
            {type && (
              <>
                <span className={styles.jobMetaDivider}>·</span>
                <span className={styles.jobType}>{type}</span>
              </>
            )}
          </div>
        </div>
        <div className={styles.jobCardHeaderIcons}>
          <button
            className={styles.saveIconBtn}
            aria-label={saved ? "Unsave job" : "Save job"}
            onClick={handleSaveToggle}
            disabled={saveLoading}
            type="button"
          >
            {saved ? (
              <MdBookmark
                className={styles.saveIcon}
                style={{ color: "#0070f3" }}
              />
            ) : (
              <MdBookmarkBorder className={styles.saveIcon} />
            )}
          </button>
          <div style={{ position: "relative", display: "inline-block" }}>
            <button
              className={styles.shareIconBtn}
              aria-label="Share job"
              onClick={handleShareClick}
              ref={shareBtnRef}
              type="button"
            >
              <MdSend className={styles.shareIcon} />
            </button>
            {showShareMenu && (
              <div className={styles.shareMenu}>
                <button onClick={handleCopyLink} type="button">
                  Copy Link
                </button>
                <button onClick={handleShareEmail} type="button">
                  Share
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className={styles.companyName}>{companyName}</div>
      <div className={styles.jobDesc}>{desc}</div>
      <div className={styles.jobStatusRow}>
        <span className={isActive ? styles.activeStatus : styles.closedStatus}>
          {statusText}
        </span>
        <div className={styles.jobTagsRow}>
          {tags.map((tag) => (
            <span className={styles.jobTag} key={tag}>
              {tag}
            </span>
          ))}
        </div>
      </div>
      <div className={styles.jobCardFooter}>
        <button
          className={styles.jobCardBtnPrimary}
          onClick={handleApply}
          disabled={!isActive}
        >
          Apply
        </button>
        <button className={styles.jobCardBtn} onClick={handleView}>
          View
        </button>
      </div>
      {showApplyModal && (
        <ApplyModalForm jobId={job._id} onClose={handleCloseApply} />
      )}
    </div>
  );
};

JobCard.propTypes = {
  job: PropTypes.shape({
    _id: PropTypes.string,
    title: PropTypes.string,
    postedBy: PropTypes.shape({
      companyProfile: PropTypes.shape({
        companyName: PropTypes.string,
      }),
    }),
    location: PropTypes.string,
    type: PropTypes.string,
    tags: PropTypes.arrayOf(PropTypes.string),
    description: PropTypes.string,
    isActive: PropTypes.bool,
  }).isRequired,
};

export default JobCard;
