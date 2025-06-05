import { useForm } from "react-hook-form";
import { useEffect } from "react";
import PropTypes from "prop-types";
import styles from "./postJobSection.module.css";
import { JOB_TYPES } from "../../constants.js";

const JobForm = ({ onSubmit, isSubmitting, defaultValues, isEditMode }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
    setError,
  } = useForm({ defaultValues });

  // Reset form when defaultValues change
  useEffect(() => {
    if (defaultValues && Object.keys(defaultValues).length) {
      reset(defaultValues);
    }
  }, [defaultValues, reset]);

  // Validate salary min/max relationship before submission
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

  // Watch description and requirements for char count display
  const descriptionValue = watch("description", "");
  const requirementsValue = watch("requirements", "");

  return (
    <form
      onSubmit={handleSubmit(handleValidatedSubmit)}
      className={styles.settingsForm}
    >
      {/* Title */}
      <FormField label="Title:" htmlFor="title" error={errors.title}>
        <input
          id="title"
          type="text"
          disabled={isSubmitting}
          maxLength={100}
          placeholder="Software Engineer"
          {...register("title", {
            required: "Required",
            pattern: {
              value: /^[a-zA-Z\s.,'!&-]+$/,
              message: "Only letters, spaces, and basic punctuation allowed",
            },
            minLength: { value: 3, message: "Min 3 characters" },
            maxLength: { value: 100, message: "Max 100 characters" },
          })}
        />
      </FormField>

      <div className={styles.twoColumn}>
        {/* Location */}
        <FormField label="Location:" htmlFor="location" error={errors.location}>
          <input
            id="location"
            type="text"
            disabled={isSubmitting}
            maxLength={100}
            placeholder="Amsterdam, Netherlands"
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
          />
        </FormField>

        {/* Number of Openings */}
        <FormField
          label="Number of Openings:"
          htmlFor="numberOfOpenings"
          error={errors.numberOfOpenings}
        >
          <input
            id="numberOfOpenings"
            type="number"
            min="1"
            disabled={isSubmitting}
            placeholder="1"
            {...register("numberOfOpenings", {
              required: "Required",
              valueAsNumber: true,
              min: { value: 1, message: "At least 1 opening required" },
              pattern: {
                value: /^[1-9]\d*$/,
                message: "Must be a positive integer",
              },
            })}
          />
        </FormField>
      </div>

      <div className={styles.twoColumn}>
        {/* Job Type */}
        <FormField label="Job Type:" htmlFor="type" error={errors.type}>
          <select
            id="type"
            disabled={isSubmitting}
            {...register("type", { required: "Required" })}
          >
            <option value="">Select type</option>
            {JOB_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </FormField>

        {/* Languages */}
        <FormField
          label="Languages (comma-separated):"
          htmlFor="languages"
          error={errors.languages}
        >
          <input
            id="languages"
            type="text"
            disabled={isSubmitting}
            maxLength={100}
            placeholder="English"
            {...register("languages", {
              pattern: {
                value: /^[a-zA-Z, ]*$/,
                message: "Only letters, commas, and spaces allowed",
              },
            })}
          />
        </FormField>
      </div>

      <div className={styles.twoColumn}>
        {/* Salary Min */}
        <FormField
          label="Salary Min:"
          htmlFor="salaryMin"
          error={errors.salaryMin}
        >
          <input
            id="salaryMin"
            type="text"
            disabled={isSubmitting}
            placeholder="30000"
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
          />
        </FormField>

        {/* Salary Max */}
        <FormField
          label="Salary Max:"
          htmlFor="salaryMax"
          error={errors.salaryMax}
        >
          <input
            id="salaryMax"
            type="text"
            disabled={isSubmitting}
            placeholder="60000"
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
          />
        </FormField>
      </div>

      <div className={styles.twoColumn}>
        {/* Tags */}
        <FormField
          label="Tags (comma-separated):"
          htmlFor="tags"
          error={errors.tags}
        >
          <input
            id="tags"
            type="text"
            disabled={isSubmitting}
            maxLength={100}
            placeholder="backend, frontend, fullstack"
            {...register("tags", {
              pattern: {
                value: /^[a-zA-Z0-9, ]*$/,
                message: "Only letters, numbers, spaces, commas allowed",
              },
            })}
          />
        </FormField>

        {/* Limit */}
        <FormField label="Limit:" htmlFor="limit" error={errors.limit}>
          <input
            id="limit"
            type="number"
            min="1"
            disabled={isSubmitting}
            placeholder="1"
            {...register("limit", {
              required: "Required",
              min: { value: 1, message: "Must be at least 1" },
            })}
          />
        </FormField>
      </div>

      {/* Description */}
      <FormField
        label="Description:"
        htmlFor="description"
        error={errors.description}
      >
        <textarea
          id="description"
          disabled={isSubmitting}
          maxLength={1000}
          placeholder="Describe the job responsibilities, etc."
          {...register("description", {
            required: "Required",
            minLength: { value: 20, message: "Min 20 characters" },
            maxLength: { value: 1000, message: "Max 1000 characters" },
            pattern: {
              value: /^[a-zA-Z\s.,'!&-]+$/,
              message: "Only letters, spaces, and basic punctuation allowed",
            },
          })}
        />
        <div className={styles.charCount}>{descriptionValue.length}/1000</div>
      </FormField>

      {/* Requirements */}
      <FormField
        label="Requirements (comma-separated):"
        htmlFor="requirements"
        error={errors.requirements}
      >
        <textarea
          id="requirements"
          disabled={isSubmitting}
          maxLength={1000}
          placeholder="e.g. 2+ years experience, Strong communication skills"
          {...register("requirements", {
            required: "Required",
            validate: (val) => {
              if (!val) return "2–10 items required";
              const arr = String(val)
                .split(",")
                .map((s) => s.trim())
                .filter(Boolean);
              return arr.length >= 2 && arr.length <= 10
                ? true
                : "2–10 items required";
            },
          })}
        />
        <div className={styles.charCount}>{requirementsValue.length}/1000</div>
      </FormField>

      {/* Deadline */}
      <FormField
        label="Application Deadline:"
        htmlFor="deadline"
        error={errors.deadline}
      >
        <input
          id="deadline"
          type="date"
          disabled={isSubmitting}
          {...register("deadline", {
            required: "Required",
            validate: (value) => {
              const today = new Date().setHours(0, 0, 0, 0);
              const selected = new Date(value).setHours(0, 0, 0, 0);
              return selected >= today || "Deadline cannot be in the past";
            },
          })}
        />
      </FormField>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className={styles.submitButton}
      >
        {isSubmitting
          ? isEditMode
            ? "Updating..."
            : "Submitting..."
          : isEditMode
            ? "Edit Job"
            : "Post Job"}
      </button>
    </form>
  );
};

const FormField = ({ label, htmlFor, children, error }) => (
  <div className={styles.formField}>
    <label htmlFor={htmlFor}>{label}</label>
    {children}
    {error && <p className={styles.errorText}>{error.message}</p>}
  </div>
);

FormField.propTypes = {
  label: PropTypes.string.isRequired,
  htmlFor: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  error: PropTypes.object,
};

JobForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  isSubmitting: PropTypes.bool.isRequired,
  defaultValues: PropTypes.object,
  isEditMode: PropTypes.bool,
};

JobForm.defaultProps = {
  defaultValues: {
    title: "",
    location: "",
    numberOfOpenings: 1,
    type: "",
    languages: "",
    salaryMin: "",
    salaryMax: "",
    tags: "",
    limit: 1,
    description: "",
    requirements: "",
    deadline: "",
  },
  isEditMode: false,
};

export default JobForm;
