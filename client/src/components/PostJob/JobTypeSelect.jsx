import PropTypes from "prop-types";
import { JOB_TYPES } from "../../constants";
import styles from "./postJobSection.module.css";

const JobTypeSelect = ({ register, error, disabled }) => (
  <div className={styles.formField}>
    <label htmlFor="type">Job Type *</label>
    <select
      id="type"
      disabled={disabled}
      {...register("type", { required: "Required" })}
      aria-invalid={error ? "true" : "false"}
      defaultValue=""
    >
      <option value="" disabled>
        Select type
      </option>
      {JOB_TYPES.map((type) => (
        <option key={type} value={type}>
          {type}
        </option>
      ))}
    </select>
    {error && <p className={styles.errorText}>{error.message}</p>}
  </div>
);

JobTypeSelect.propTypes = {
  register: PropTypes.func.isRequired,
  error: PropTypes.object,
  disabled: PropTypes.bool,
};

export default JobTypeSelect;
