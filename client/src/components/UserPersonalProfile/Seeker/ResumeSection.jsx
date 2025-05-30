import PropTypes from "prop-types";

import { useState } from "react";
import { useUser } from "../../../contexts/UserContext";
import { Controller } from "react-hook-form";
import { MdDelete } from "react-icons/md";
import styles from "../Shared/settings.module.css";

const ResumeSection = ({ resumeUrl, control, errors, isProcessing }) => {
  const { updateProfile } = useUser();
  const [deleteError, setDeleteError] = useState("");

  const handleDelete = async () => {
    setDeleteError("");
    try {
      await updateProfile({ seekerProfile: { resumeUrl: "" } });
    } catch {
      setDeleteError("Failed to delete CV");
    }
  };

  return (
    <div className={styles.resumeSection}>
      <div className={styles.settingsCvLink}>
        <label>CV (PDF)</label>
        <div className={styles.cvActionsRow}>
          {resumeUrl ? (
            <>
              <a
                href={resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.viewCvBtn}
              >
                View current CV
              </a>
              <button
                type="button"
                className={styles.deleteCvBtn}
                onClick={handleDelete}
                title="Delete CV"
              >
                <MdDelete />
              </button>
            </>
          ) : (
            <span style={{ color: "var(--text-secondary-color, #888)" }}>
              No CV uploaded
            </span>
          )}
        </div>
      </div>
      <div>
        <label htmlFor="resume">Upload New CV (PDF)</label>
        <Controller
          control={control}
          name="resume"
          render={({ field: { onChange, ref } }) => (
            <input
              id="resume"
              type="file"
              accept="application/pdf"
              onChange={(e) => onChange(e.target.files)}
              ref={ref}
              disabled={isProcessing}
            />
          )}
        />
        {errors.resume && (
          <p className={styles.errorText}>{errors.resume.message}</p>
        )}
        {deleteError && <p className={styles.errorText}>{deleteError}</p>}
      </div>
    </div>
  );
};
ResumeSection.propTypes = {
  resumeUrl: PropTypes.string,
  control: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  isProcessing: PropTypes.bool.isRequired,
};
export default ResumeSection;
