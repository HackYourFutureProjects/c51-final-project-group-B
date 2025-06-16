import PropTypes from "prop-types";
import styles from "./job-card.module.css";

const ConfirmDeleteModal = ({
  jobTitle,
  onCancel,
  onConfirm,
  isProcessing,
}) => (
  <div className={styles.modalBackdrop}>
    <div className={styles.modalContent}>
      <h3>Delete Job</h3>
      <p>Are you sure you want to delete the job &quot;{jobTitle}&quot;?</p>
      <div>
        <button
          onClick={onCancel}
          className={styles.cancelButton}
          disabled={isProcessing}
          style={{ marginRight: "1rem" }}
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          disabled={isProcessing}
          className={styles.deletebutton}
        >
          {isProcessing ? "Deleting..." : "Yes, Delete"}
        </button>
      </div>
    </div>
  </div>
);

ConfirmDeleteModal.propTypes = {
  jobTitle: PropTypes.string.isRequired,
  onCancel: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  isProcessing: PropTypes.bool.isRequired,
};

export default ConfirmDeleteModal;
