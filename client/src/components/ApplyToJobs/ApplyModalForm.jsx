import PropTypes from "prop-types";
import { useUser } from "../../contexts/UserContext";
import styles from "./apply-form.module.css";
import { useState } from "react";
import { uploadFileToCloudinary } from "../../util/cloudinaryUpload";
import { MdAccountCircle } from "react-icons/md";
import { HiOutlineDocumentText } from "react-icons/hi";
import { applyToJob } from "../../api/applicationService";
import FeedbackMessage from "../UserPersonalProfile/Shared/SettingsSections/FeedbackMessage";

const ApplyModalForm = ({ jobId, onClose }) => {
  const { user } = useUser();
  const seekerProfile = user?.seekerProfile || {};

  const { firstName, lastName, resumeUrl: defaultResumeUrl } = seekerProfile;
  const [resumeUrl, setResumeUrl] = useState(defaultResumeUrl || "");
  const [isUploading, setIsUploading] = useState(false);

  const [feedback, setFeedback] = useState("");
  const [uploadError, setUploadError] = useState("");

  // handle file upload for the resume
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.type !== "application/pdf") {
      setUploadError("Only PDF files are accepted.");
      return;
    }
    setIsUploading(true);
    setUploadError("");
    setFeedback("");
    try {
      const url = await uploadFileToCloudinary(file);
      setResumeUrl(url);
      setFeedback("Resume uploaded successfully!");
    } catch (err) {
      setUploadError("Upload failed: " + err.message);
    } finally {
      setIsUploading(false);
    }
  };

  // submit the application

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFeedback("");
    setUploadError("");
    if (!resumeUrl) {
      setFeedback("Please add your CV before applying.");
      return;
    }

    try {
      const response = await applyToJob({ jobId, resumeUrl });

      setFeedback(response?.msg || "Application submitted successfully!");

      setTimeout(onClose, 1200);
    } catch (err) {
      //  error feedback
      setUploadError(err.message);
    }
  };

  return (
    <div
      className={styles.modalBackdrop}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className={styles.modalContent}>
        <button
          className={styles.closeBtn}
          onClick={onClose}
          aria-label="Close"
        >
          &times;
        </button>
        <div className={styles.header}>
          {user.profilePhoto ? (
            <img src={user.profilePhoto} alt="Profile" className="Avatar" />
          ) : (
            // Fallback avatar icon if no profile photo is set
            <MdAccountCircle className={styles.avatar} size={56} color="#bbb" />
          )}
          <div>
            <div className={styles.title}>Easy Apply</div>
            <div style={{ fontSize: "1rem", color: "#666" }}>
              {user.firstName} {user.lastName}
            </div>
          </div>
        </div>
        {/* Feedback */}
        <FeedbackMessage feedback={feedback} uploadError={uploadError} />

        {/* Application Form */}
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.inputGroup}>
            <label className={styles.label}>Full Name</label>
            <input
              className={styles.input}
              value={`${firstName} ${lastName}`}
              disabled
            />
          </div>
          <div className={styles.inputGroup}>
            <label className={styles.label}>Email</label>
            <input className={styles.input} value={user.email} disabled />
          </div>
          <div className={styles.inputGroup}>
            <label className={styles.label}>CV / Resume</label>
            {resumeUrl ? (
              <a
                className={styles.cvLink}
                href={resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <HiOutlineDocumentText
                  size={20}
                  style={{ verticalAlign: "middle", marginRight: 6 }}
                />
                View Current CV
              </a>
            ) : (
              <span style={{ color: "#888" }}>No CV uploaded</span>
            )}
            <label
              className={styles.uploadBtn}
              style={{ display: "inline-block", marginTop: 8 }}
            >
              {isUploading ? "Uploading..." : "Add New CV"}
              <input
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                disabled={isUploading}
                style={{ display: "none" }}
              />
            </label>
          </div>
          <button className={styles.submitBtn} type="submit">
            Submit
          </button>
          <button className={styles.cancelBtn} type="button" onClick={onClose}>
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
};

ApplyModalForm.propTypes = {
  jobId: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
};
export default ApplyModalForm;
