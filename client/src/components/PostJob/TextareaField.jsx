import PropTypes from "prop-types";
import styles from "./postJobSection.module.css";

const TextareaField = ({
  id,
  label,
  placeholder,
  register,
  rules,
  error,
  disabled,
  value,
  maxLength,
}) => (
  <div className={styles.formField}>
    <label htmlFor={id}>{label}</label>
    <textarea
      id={id}
      placeholder={placeholder}
      maxLength={maxLength}
      disabled={disabled}
      {...register(id, rules)}
      aria-invalid={error ? "true" : "false"}
    />
    <div className={styles.charCount}>
      {value.length} / {maxLength} characters
    </div>
    {error && <p className={styles.errorText}>{error.message}</p>}
  </div>
);

TextareaField.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  register: PropTypes.func.isRequired,
  rules: PropTypes.object,
  error: PropTypes.object,
  disabled: PropTypes.bool,
  value: PropTypes.string.isRequired,
  maxLength: PropTypes.number.isRequired,
};

export default TextareaField;
