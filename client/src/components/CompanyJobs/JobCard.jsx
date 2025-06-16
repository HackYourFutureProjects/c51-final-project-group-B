import { useState } from "react";
import PropTypes from "prop-types";
import { GoLocation } from "react-icons/go";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import styles from "./job-card.module.css";
import toast, { Toaster } from "react-hot-toast";
import ConfirmDeleteModal from "./ConfirmDeleteModal";

const JobCard = ({ job, onJobClick, onDelete }) => {
  const navigate = useNavigate();
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const {
    _id,
    title,
    location,
    type,
    companyProfile,
    profilePhoto,
    isActive,
    expireOn,
    applicationCount,
  } = job;

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/jobs/${_id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const result = await response.json();
      if (!response.ok || result.success === false) {
        throw new Error(result.msg || "Failed to delete job");
      }

      toast.success("Job deleted successfully");
      setShowConfirmDelete(false);

      onDelete?.(_id);
    } catch (err) {
      console.error("Delete error:", err);
      toast.error(err.message || "Error deleting job");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <Toaster position="top-center" />
      <div onClick={() => onJobClick(job)} className={styles.jobCardLink}>
        <div className={styles.jobCard}>
          <div className={styles.jobCardHeader}>
            {profilePhoto && (
              <img
                src={profilePhoto}
                alt={companyProfile}
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

          <div>
            <span className={styles.applicationCount}>
              Applications: {applicationCount || 0}
            </span>
          </div>
          <div>
            <span className={styles.expireOn}>
              Expires on: {moment(expireOn).format("MMM Do YYYY")}
            </span>
          </div>

          <div>
            <span className={styles.isActive}>
              Status: {isActive ? "Active" : "Inactive"}
            </span>
          </div>

          <div className={styles.jobFooter}>
            <span className={styles.jobType}>{type}</span>
            <div className={styles.buttonGroup}>
              <button
                className="btn btn-primary"
                disabled={job.applicationCount > 0}
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/edit/${_id}`);
                }}
              >
                Edit
              </button>
              <button
                className="btn btn-primary"
                disabled={job.applicationCount > 0}
                onClick={(e) => {
                  e.stopPropagation();
                  setShowConfirmDelete(true);
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>

      {showConfirmDelete && (
        <ConfirmDeleteModal
          jobTitle={title}
          isProcessing={isDeleting}
          onCancel={() => setShowConfirmDelete(false)}
          onConfirm={handleDelete}
        />
      )}
    </>
  );
};

JobCard.propTypes = {
  job: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    location: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    companyProfile: PropTypes.string,
    profilePhoto: PropTypes.string,
    isActive: PropTypes.bool,
    expireOn: PropTypes.string,
    applicationCount: PropTypes.number,
  }).isRequired,
  onJobClick: PropTypes.func.isRequired,
  onDelete: PropTypes.func,
};

export default JobCard;
