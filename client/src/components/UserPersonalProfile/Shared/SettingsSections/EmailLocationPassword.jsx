import styles from "../settings.module.css";
import PropTypes from "prop-types";

const EmailLocationPassword = ({
  register,
  errors,
  watch,
  isProcessing,
  showLocation = true,
}) => (
  <div className={styles.sectionContainer}>
    <div className={styles.formField}>
      <label htmlFor="email">Email:</label>
      <input
        className={`input-field${errors.email ? " input-error" : ""}`}
        id="email"
        type="email"
        disabled={isProcessing}
        {...register("email", {
          required: "Email is required",
          pattern: {
            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            message: "Please enter a valid email address",
          },
        })}
      />
      {errors.email && (
        <p className={styles.errorText}>{errors.email.message}</p>
      )}
    </div>
    {showLocation && (
      <div className={styles.formField}>
        <label htmlFor="location">Location:</label>
        <input
          className="input-field"
          id="location"
          type="text"
          disabled={isProcessing}
          {...register("location")}
        />
      </div>
    )}
    <div className={styles.formField}>
      <label htmlFor="password">Password:</label>
      <input
        className={`input-field${errors.password ? " input-error" : ""}`}
        id="password"
        type="password"
        disabled={isProcessing}
        {...register("password", {
          minLength: {
            value: 8,
            message: "Password must be at least 8 characters",
          },
        })}
      />
      {errors.password && (
        <p className={styles.errorText}>{errors.password.message}</p>
      )}
    </div>
    <div className={styles.formField}>
      <label htmlFor="confirmPassword">Confirm Password:</label>
      <input
        className={`input-field${errors.confirmPassword ? " input-error" : ""}`}
        id="confirmPassword"
        type="password"
        disabled={isProcessing}
        {...register("confirmPassword", {
          validate: (value) =>
            !watch("password") ||
            value === watch("password") ||
            "Passwords do not match",
        })}
      />
      {errors.confirmPassword && (
        <p className={styles.errorText}>{errors.confirmPassword.message}</p>
      )}
    </div>
  </div>
);

EmailLocationPassword.propTypes = {
  register: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired,
  watch: PropTypes.func.isRequired,
  isProcessing: PropTypes.bool.isRequired,
  showLocation: PropTypes.bool,
};
export default EmailLocationPassword;
