import { useEffect } from "react";
import PropTypes from "prop-types";
import { useForm } from "react-hook-form";
import styles from "./postJobSection.module.css";
import { JOB_TYPES } from "../../constants.js";

const getTodayDateFormatted = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const JobForm = ({ onSubmit, isSubmitting, defaultValues, isEditMode }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
    setError,
  } = useForm({
    defaultValues: {
      ...defaultValues,
      deadline: defaultValues?.deadline || getTodayDateFormatted(),
    },
  });

  const descriptionValue = watch("description", "");
  const requirementsValue = watch("requirements", "");

  useEffect(() => {
    if (defaultValues && Object.keys(defaultValues).length) {
      reset(defaultValues);
    }
  }, [defaultValues, reset]);

  // Auto-grow textareas on content change
  useEffect(() => {
    ["description", "requirements"].forEach((id) => {
      const el = document.getElementById(id);
      if (el) {
        el.style.height = "auto";
        el.style.height = el.scrollHeight + "px";
      }
    });
  }, [descriptionValue, requirementsValue]);

  const handleValidatedSubmit = (data) => {
    const normalize = (val) =>
      typeof val === "string"
        ? val.trim().toUpperCase()
        : String(val ?? "")
            .trim()
            .toUpperCase();

    const minRaw = normalize(data.salaryMin);
    const maxRaw = normalize(data.salaryMax);

    const isMinNA = !minRaw || minRaw === "NA";
    const isMaxNA = !maxRaw || maxRaw === "NA";

    if (!isMinNA && !isMaxNA) {
      const min = Number(minRaw);
      const max = Number(maxRaw);
      if (!isNaN(min) && !isNaN(max) && min > max) {
        setError("salaryMin", {
          type: "manual",
          message: "Salary Min must be less than Salary Max",
        });
        setError("salaryMax", {
          type: "manual",
          message: "Salary Max must be greater than Salary Min",
        });
        return;
      }
    }
    onSubmit(data);
  };

  return (
    <section className={styles.settingsForm}>
      <h1>{isEditMode ? "Edit Job Posting" : "Create Job Posting"}</h1>

      {isSubmitting && (
        <div className={styles.overlay}>
          <div className={styles.spinner} />
        </div>
      )}

      <form onSubmit={handleSubmit(handleValidatedSubmit)} noValidate>
        {/* Title */}
        <div className={styles.formField}>
          <label htmlFor="title">Title *</label>
          <input
            id="title"
            type="text"
            placeholder="Software Engineer"
            maxLength={100}
            disabled={isSubmitting}
            {...register("title", {
              required: "Required",
              pattern: {
                value: /^[a-zA-Z\s.,'!&\-/]+$/,
                message: "Only letters, spaces, and basic punctuation allowed",
              },
              minLength: { value: 3, message: "Min 3 characters" },
              maxLength: { value: 100, message: "Max 100 characters" },
            })}
            aria-invalid={errors.title ? "true" : "false"}
          />
          {errors.title && (
            <p className={styles.errorText}>{errors.title.message}</p>
          )}
        </div>

        {/* Two column grid */}
        <div className={styles.twoColumn}>
          <div className={styles.formField}>
            <label htmlFor="location">Location *</label>
            <input
              id="location"
              type="text"
              placeholder="Amsterdam, Netherlands"
              maxLength={100}
              disabled={isSubmitting}
              {...register("location", {
                required: "Required",
                minLength: { value: 3, message: "Min 3 characters" },
                maxLength: { value: 100, message: "Max 100 characters" },
                pattern: {
                  value: /^[a-zA-Z0-9\s.,'-]+$/,
                  message:
                    "Only letters, numbers, spaces, and basic punctuation allowed",
                },
              })}
              aria-invalid={errors.location ? "true" : "false"}
            />
            {errors.location && (
              <p className={styles.errorText}>{errors.location.message}</p>
            )}
          </div>

          <div className={styles.formField}>
            <label htmlFor="numberOfOpenings">Number of Openings *</label>
            <input
              id="numberOfOpenings"
              type="number"
              placeholder="1"
              min={1}
              disabled={isSubmitting}
              {...register("numberOfOpenings", {
                required: "Required",
                valueAsNumber: true,
                min: { value: 1, message: "At least 1 opening required" },
                pattern: {
                  value: /^[1-9]\d*$/,
                  message: "Must be a positive integer",
                },
              })}
              aria-invalid={errors.numberOfOpenings ? "true" : "false"}
            />
            {errors.numberOfOpenings && (
              <p className={styles.errorText}>
                {errors.numberOfOpenings.message}
              </p>
            )}
          </div>
        </div>

        <div className={styles.twoColumn}>
          <div className={styles.formField}>
            <label htmlFor="type">Job Type *</label>
            <select
              id="type"
              disabled={isSubmitting}
              {...register("type", { required: "Required" })}
              aria-invalid={errors.type ? "true" : "false"}
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
            {errors.type && (
              <p className={styles.errorText}>{errors.type.message}</p>
            )}
          </div>

          <div className={styles.formField}>
            <label htmlFor="languages">Languages (comma-separated)</label>
            <input
              id="languages"
              type="text"
              placeholder="English"
              maxLength={100}
              disabled={isSubmitting}
              {...register("languages", {
                pattern: {
                  value: /^[a-zA-Z, ]*$/,
                  message: "Only letters, commas, and spaces allowed",
                },
              })}
              aria-invalid={errors.languages ? "true" : "false"}
            />
            {errors.languages && (
              <p className={styles.errorText}>{errors.languages.message}</p>
            )}
          </div>
        </div>

        <div className={styles.twoColumn}>
          <div className={styles.formField}>
            <label htmlFor="salaryMin">Salary Min</label>
            <input
              id="salaryMin"
              type="text"
              placeholder="30000"
              disabled={isSubmitting}
              {...register("salaryMin", {
                validate: (val) => {
                  if (!val) return true;
                  if (String(val).trim().toUpperCase() === "NA") return true;
                  const num = Number(val);
                  return !isNaN(num) && num > 0
                    ? true
                    : "Must be a positive number or 'NA'";
                },
              })}
              aria-invalid={errors.salaryMin ? "true" : "false"}
            />
            {errors.salaryMin && (
              <p className={styles.errorText}>{errors.salaryMin.message}</p>
            )}
          </div>

          <div className={styles.formField}>
            <label htmlFor="salaryMax">Salary Max</label>
            <input
              id="salaryMax"
              type="text"
              placeholder="60000"
              disabled={isSubmitting}
              {...register("salaryMax", {
                validate: (val) => {
                  if (!val) return true;
                  if (String(val).trim().toUpperCase() === "NA") return true;
                  const num = Number(val);
                  return !isNaN(num) && num > 0
                    ? true
                    : "Must be a positive number or 'NA'";
                },
              })}
              aria-invalid={errors.salaryMax ? "true" : "false"}
            />
            {errors.salaryMax && (
              <p className={styles.errorText}>{errors.salaryMax.message}</p>
            )}
          </div>
        </div>

        <div className={styles.twoColumn}>
          <div className={styles.formField}>
            <label htmlFor="tags">Tags (comma-separated)</label>
            <input
              id="tags"
              type="text"
              placeholder="backend, frontend, fullstack"
              maxLength={100}
              disabled={isSubmitting}
              {...register("tags", {
                pattern: {
                  value: /^[a-zA-Z0-9, ]*$/,
                  message: "Only letters, numbers, spaces, commas allowed",
                },
              })}
              aria-invalid={errors.tags ? "true" : "false"}
            />
            {errors.tags && (
              <p className={styles.errorText}>{errors.tags.message}</p>
            )}
          </div>

          <div className={styles.formField}>
            <label htmlFor="limit">Limit *</label>
            <input
              id="limit"
              type="number"
              placeholder="1"
              min={1}
              disabled={isSubmitting}
              {...register("limit", {
                required: "Required",
                min: { value: 1, message: "Must be at least 1" },
              })}
              aria-invalid={errors.limit ? "true" : "false"}
            />
            {errors.limit && (
              <p className={styles.errorText}>{errors.limit.message}</p>
            )}
          </div>
        </div>

        {/* Description textarea */}
        <div className={styles.formField}>
          <label htmlFor="description">Description *</label>
          <textarea
            id="description"
            placeholder="Describe the job responsibilities, etc."
            maxLength={1000}
            disabled={isSubmitting}
            {...register("description", {
              required: "Required",
              minLength: { value: 20, message: "Min 20 characters" },
              maxLength: { value: 1000, message: "Max 1000 characters" },
              validate: (val) => {
                if (!val) return "Required";

                // Decode HTML entities
                const decodeHtmlEntities = (text) => {
                  const parser = new DOMParser();
                  return (
                    parser.parseFromString(text, "text/html").body
                      .textContent || ""
                  );
                };

                const decodedVal = decodeHtmlEntities(val);

                // Regex pattern: letters, numbers, spaces, basic punctuation, slash, newline
                const pattern = /^[a-zA-Z0-9\s.,'!&\-():;?/\\n]+$/;

                if (!pattern.test(decodedVal)) {
                  return "Only letters, spaces, and basic punctuation allowed";
                }

                return true;
              },
            })}
            aria-invalid={errors.description ? "true" : "false"}
          />
          <div className={styles.charCount}>
            {descriptionValue.length} / 1000 characters
          </div>
          {errors.description && (
            <p className={styles.errorText}>{errors.description.message}</p>
          )}
        </div>

        {/* Requirements textarea */}
        <div className={styles.formField}>
          <label htmlFor="requirements">Requirements (comma-separated) *</label>
          <textarea
            id="requirements"
            placeholder="e.g. 2+ years experience, Strong communication skills"
            maxLength={1000}
            disabled={isSubmitting}
            {...register("requirements", {
              required: "Required",
              validate: (val) => {
                if (!val) return "2–10 items required";

                const arr = String(val)
                  .split(/[\n,]+/)
                  .map((s) => s.trim())
                  .filter((s) => s.length > 0);

                if (arr.length < 2 || arr.length > 10) {
                  return "2–10 items required";
                }

                const isValidCharacters = arr.every((item) =>
                  /^[\w\s.,'"!&/+\-()[\]:]+$/.test(item),
                );

                if (!isValidCharacters) {
                  return "Only letters, numbers, spaces, and basic punctuation allowed.";
                }

                const isLengthValid = arr.every((item) => item.length <= 200);
                if (!isLengthValid) {
                  return "Each item must be 200 characters or fewer.";
                }

                return true;
              },
            })}
            aria-invalid={errors.requirements ? "true" : "false"}
          />
          <div className={styles.charCount}>
            {requirementsValue.length} / 1000 characters
          </div>
          {errors.requirements && (
            <p className={styles.errorText}>{errors.requirements.message}</p>
          )}
        </div>

        <div className={`${styles.formField} ${styles.dateContainer}`}>
          <label htmlFor="deadline">Application Deadline *</label>
          <input
            id="deadline"
            type="date"
            min={getTodayDateFormatted()}
            disabled={isSubmitting}
            {...register("deadline", {
              required: "Required",
              validate: (val) => {
                const today = getTodayDateFormatted();
                return val >= today || "Deadline cannot be in the past";
              },
            })}
            aria-invalid={errors.deadline ? "true" : "false"}
          />
          {errors.deadline && (
            <p className={styles.errorText}>{errors.deadline.message}</p>
          )}
        </div>

        {/* Buttons */}
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
            onClick={() => window.history.back()}
            disabled={isSubmitting}
          >
            Cancel
          </button>
        </div>
      </form>
    </section>
  );
};

JobForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  isSubmitting: PropTypes.bool,
  defaultValues: PropTypes.object,
  isEditMode: PropTypes.bool,
};

JobForm.defaultProps = {
  isSubmitting: false,
  defaultValues: {},
  isEditMode: false,
};

export default JobForm;
