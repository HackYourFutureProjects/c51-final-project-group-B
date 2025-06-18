import PropTypes from "prop-types";
import styles from "./ApplicationJobCard.module.css";

const ConfirmDialog = ({ action, jobTitle, onConfirm, onCancel }) => {
  return (
    <>
      <div className={styles.dialogOverlay} onClick={onCancel} />
      <div
        className={styles.withdrawConfirmCard}
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-dialog-title"
      >
        <p id="confirm-dialog-title">
          {action === "delete" ? (
            <>
              Are you sure you want to remove
              <strong>{jobTitle}</strong> from your saved list?
            </>
          ) : (
            <>
              Are you sure you want to withdraw your application from{" "}
              <strong>{jobTitle}</strong>?
            </>
          )}
        </p>
        <div className={styles.withdrawButtons}>
          <button className={styles.cancelButton} onClick={onCancel}>
            Cancel
          </button>
          <button className={styles.confirmButton} onClick={onConfirm}>
            Confirm
          </button>
        </div>
      </div>
    </>
  );
};

ConfirmDialog.propTypes = {
  action: PropTypes.oneOf(["withdraw", "delete"]).isRequired,
  jobTitle: PropTypes.string.isRequired,
  onConfirm: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default ConfirmDialog;
