import styles from "../settings.module.css";
import PropTypes from "prop-types";

const ArrayInputSection = ({
  label,
  name,
  register,
  errors,
  validate,
  isProcessing,
  placeholder = "",
}) => (
  <div>
    <label htmlFor={name}>{label}</label>
    <input
      className={`input-field${errors[name] ? " input-error" : ""}`}
      id={name}
      type="text"
      disabled={isProcessing}
      placeholder={placeholder}
      {...register(name, { validate })}
    />
    {errors[name] && <p className={styles.errorText}>{errors[name].message}</p>}
  </div>
);

ArrayInputSection.propTypes = {
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  register: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired,
  validate: PropTypes.func,
  isProcessing: PropTypes.bool,
  placeholder: PropTypes.string,
};

export default ArrayInputSection;
