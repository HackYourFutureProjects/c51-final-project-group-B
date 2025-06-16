import PropTypes from "prop-types";
import styles from "./postJobSection.module.css";

const FormButtons = ({ isSubmitting, isEditMode, resetForm }) => (
  <div className={styles.buttonGroup}>
    <button
      type="submit"
      className={styles.submitButton}
      disabled={isSubmitting}
    >
      {isEditMode ? "Update Job" : "Post Job"}
    </button>
    <button
      type="button"
      className={styles.cancelButton}
      onClick={resetForm}
      disabled={isSubmitting}
    >
      Cancel
    </button>
  </div>
);

FormButtons.propTypes = {
  isSubmitting: PropTypes.bool,
  isEditMode: PropTypes.bool,
  resetForm: PropTypes.func.isRequired,
};

export default FormButtons;
