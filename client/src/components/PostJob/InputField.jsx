import PropTypes from "prop-types";
import styles from "./postJobSection.module.css";

const InputField = ({
  id,
  label,
  type = "text",
  placeholder,
  register,
  rules,
  error,
  disabled,
  maxLength,
  min,
}) => (
  <div className={styles.formField}>
    <label htmlFor={id}>{label}</label>
    <input
      id={id}
      type={type}
      placeholder={placeholder}
      maxLength={maxLength}
      min={min}
      disabled={disabled}
      {...register(id, rules)}
      aria-invalid={error ? "true" : "false"}
    />
    {error && <p className={styles.errorText}>{error.message}</p>}
  </div>
);

InputField.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  type: PropTypes.string,
  placeholder: PropTypes.string,
  register: PropTypes.func.isRequired,
  rules: PropTypes.object,
  error: PropTypes.object,
  disabled: PropTypes.bool,
  maxLength: PropTypes.number,
  min: PropTypes.number,
};

export default InputField;
