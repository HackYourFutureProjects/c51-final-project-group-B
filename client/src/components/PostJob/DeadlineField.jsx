import PropTypes from "prop-types";
import styles from "./postJobSection.module.css";

const getTodayDateFormatted = () => new Date().toISOString().split("T")[0];

const DeadlineField = ({ register, error, isSubmitting }) => (
  <div className={`${styles.formField} ${styles.dateContainer}`}>
    <label htmlFor="deadline">Application Deadline *</label>
    <input
      id="deadline"
      type="date"
      min={getTodayDateFormatted()}
      disabled={isSubmitting}
      {...register("deadline", {
        required: "Required",
        validate: (val) =>
          val >= getTodayDateFormatted() || "Deadline cannot be in the past",
      })}
      aria-invalid={error ? "true" : "false"}
    />
    {error && <p className={styles.errorText}>{error.message}</p>}
  </div>
);

DeadlineField.propTypes = {
  register: PropTypes.func.isRequired,
  error: PropTypes.object,
  isSubmitting: PropTypes.bool,
};

export default DeadlineField;
