import PropTypes from "prop-types";

import { useState } from "react";
import { useUser } from "../../../../contexts/UserContext";
import { Controller } from "react-hook-form";
import { MdDelete } from "react-icons/md";
import styles from "../settings.module.css";

export default function ProfilePhotoSection({
  profilePhotoUrl,
  control,
  errors,
  isProcessing,
}) {
  const { updateProfile } = useUser();
  const [deleteError, setDeleteError] = useState("");

  const handleDelete = async () => {
    setDeleteError("");
    try {
      await updateProfile({ profilePhoto: "" });
    } catch {
      setDeleteError("Failed to delete photo");
    }
  };

  return (
    <div className={styles.settingsPhotoSection}>
      <label>Profile Photo</label>
      <div
        className={styles.settingsPhotoPreview}
        style={{ position: "relative" }}
      >
        {profilePhotoUrl ? (
          <>
            <img
              src={profilePhotoUrl}
              alt="Current"
              className={styles.photoPreviewImage}
            />
            <button
              type="button"
              onClick={handleDelete}
              className={styles.deletePhotoButton}
              disabled={isProcessing}
              title="Remove photo"
            >
              <MdDelete />
            </button>
          </>
        ) : (
          <div className={styles.photoPlaceholder}>No Photo</div>
        )}
      </div>

      <Controller
        control={control}
        name="profilePhoto"
        render={({ field: { onChange, ref } }) => (
          <input
            id="profilePhoto"
            type="file"
            accept="image/*"
            onChange={(e) => onChange(e.target.files)}
            ref={ref}
            disabled={isProcessing}
          />
        )}
      />
      {errors.profilePhoto && (
        <p className={styles.errorText}>{errors.profilePhoto.message}</p>
      )}
      {deleteError && <p className={styles.errorText}>{deleteError}</p>}
    </div>
  );
}
ProfilePhotoSection.propTypes = {
  profilePhotoUrl: PropTypes.string,
  control: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  isProcessing: PropTypes.bool.isRequired,
};
