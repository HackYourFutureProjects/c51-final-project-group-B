import styles from "../Shared/settings.module.css";
import PropTypes from "prop-types";

const PersonalDetailsSection = ({ register, errors, isProcessing }) => (
  <div className={styles.sectionContainer}>
    <div className={styles.formField}>
      <label htmlFor="firstName">First Name:</label>
      <input
        className={`input-field${errors.firstName ? " input-error" : ""}`}
        id="firstName"
        type="text"
        disabled={isProcessing}
        {...register("firstName", {
          required: "First name cannot be empty",
        })}
      />
      {errors.firstName && (
        <p className={styles.errorText}>{errors.firstName.message}</p>
      )}
    </div>
    <div className={styles.formField}>
      <label htmlFor="lastName">Last Name:</label>
      <input
        className={`input-field${errors.lastName ? " input-error" : ""}`}
        id="lastName"
        type="text"
        disabled={isProcessing}
        {...register("lastName", {
          required: "Last name cannot be empty",
        })}
      />
      {errors.lastName && (
        <p className={styles.errorText}>{errors.lastName.message}</p>
      )}
    </div>
    <div className={styles.formField}>
      <label htmlFor="position">Position:</label>
      <input
        className={`input-field${errors.position ? " input-error" : ""}`}
        id="position"
        type="text"
        disabled={isProcessing}
        placeholder="e.g. Frontend Developer"
        {...register("position", {
          maxLength: {
            value: 99,
            message: "Position must be less than 99 characters",
          },
        })}
      />
      {errors.position && (
        <p className={styles.errorText}>{errors.position.message}</p>
      )}
    </div>
    <div className={styles.formField}>
      <label htmlFor="bio">Bio:</label>
      <textarea
        className={`input-field${errors.bio ? " input-error" : ""}`}
        id="bio"
        disabled={isProcessing}
        placeholder="Tell us about yourself..."
        {...register("bio", {
          maxLength: {
            value: 499,
            message: "Bio must be less than 499 characters",
          },
        })}
      />
      {errors.bio && <p className={styles.errorText}>{errors.bio.message}</p>}
    </div>
  </div>
);

PersonalDetailsSection.propTypes = {
  register: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired,
  isProcessing: PropTypes.bool.isRequired,
};
export default PersonalDetailsSection;
