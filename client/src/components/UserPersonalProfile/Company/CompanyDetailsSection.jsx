import styles from "../Shared/settings.module.css";
import PropTypes from "prop-types";
const CompanyDetailsSection = ({ register, errors, isProcessing }) => (
  <div className={styles.sectionContainer}>
    <div className={styles.formField}>
      <label htmlFor="companyName">Company Name:</label>
      <input
        className={`input-field${errors.companyName ? " input-error" : ""}`}
        id="companyName"
        type="text"
        disabled={isProcessing}
        {...register("companyName", {
          required: "Company name cannot be empty",
          maxLength: { value: 100, message: "Max 100 characters" },
        })}
      />
      {errors.companyName && (
        <p className={styles.errorText}>{errors.companyName.message}</p>
      )}
    </div>
    <div className={styles.formField}>
      <label htmlFor="industry">Industry:</label>
      <input
        className={`input-field${errors.industry ? " input-error" : ""}`}
        id="industry"
        type="text"
        disabled={isProcessing}
        {...register("industry", {
          maxLength: { value: 60, message: "Max 60 characters" },
        })}
      />
      {errors.industry && (
        <p className={styles.errorText}>{errors.industry.message}</p>
      )}
    </div>
    <div className={styles.formField}>
      <label htmlFor="website">Website:</label>
      <input
        className={`input-field${errors.website ? " input-error" : ""}`}
        id="website"
        type="url"
        disabled={isProcessing}
        {...register("website")}
      />
      {errors.website && (
        <p className={styles.errorText}>{errors.website.message}</p>
      )}
    </div>
    <div className={styles.formField}>
      <label htmlFor="companySize">Company Size:</label>
      <input
        className={`input-field${errors.companySize ? " input-error" : ""}`}
        id="companySize"
        type="text"
        disabled={isProcessing}
        {...register("companySize", {
          maxLength: { value: 30, message: "Max 30 characters" },
        })}
        placeholder="e.g. 201-500"
      />
      {errors.companySize && (
        <p className={styles.errorText}>{errors.companySize.message}</p>
      )}
    </div>
    <div className={styles.formField}>
      <label htmlFor="tagline">Tagline:</label>
      <input
        className={`input-field${errors.tagline ? " input-error" : ""}`}
        id="tagline"
        type="text"
        disabled={isProcessing}
        {...register("tagline", {
          maxLength: { value: 100, message: "Max 100 characters" },
        })}
        placeholder="e.g. Innovate your future."
      />
      {errors.tagline && (
        <p className={styles.errorText}>{errors.tagline.message}</p>
      )}
    </div>
    <div className={styles.formField}>
      <label htmlFor="headquarters">Headquarters:</label>
      <input
        className={`input-field${errors.headquarters ? " input-error" : ""}`}
        id="headquarters"
        type="text"
        disabled={isProcessing}
        {...register("headquarters", {
          maxLength: { value: 60, message: "Max 60 characters" },
        })}
        placeholder="e.g. Amsterdam"
      />
      {errors.headquarters && (
        <p className={styles.errorText}>{errors.headquarters.message}</p>
      )}
    </div>
    <div className={styles.formField}>
      <label htmlFor="about">About / Description:</label>
      <textarea
        className={`input-field${errors.about ? " input-error" : ""}`}
        id="about"
        disabled={isProcessing}
        {...register("about", {
          maxLength: { value: 500, message: "Max 500 characters" },
        })}
        placeholder="Describe your company..."
      />
      {errors.about && (
        <p className={styles.errorText}>{errors.about.message}</p>
      )}
    </div>
  </div>
);

CompanyDetailsSection.propTypes = {
  register: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired,
  isProcessing: PropTypes.bool.isRequired,
};

export default CompanyDetailsSection;
