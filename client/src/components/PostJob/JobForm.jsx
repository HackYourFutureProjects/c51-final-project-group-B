import { useEffect } from "react";
import PropTypes from "prop-types";
import { useForm } from "react-hook-form";
import styles from "./postJobSection.module.css";

import InputField from "./InputField";
import TextareaField from "./TextareaField";
import JobTypeSelect from "./JobTypeSelect";
import SalaryFields from "./SalaryField";
import DeadlineField from "./DeadlineField";
import FormButtons from "./FormButtons";

const getTodayDateFormatted = () => new Date().toISOString().split("T")[0];

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

  useEffect(() => {
    ["description", "requirements"].forEach((id) => {
      const el = document.getElementById(id);
      if (el) {
        el.style.height = "auto";
        el.style.height = el.scrollHeight + "px";
      }
    });
  }, [descriptionValue, requirementsValue]);

  const normalizeValue = (val) =>
    String(val ?? "")
      .trim()
      .toUpperCase();

  const handleValidatedSubmit = (data) => {
    const minRaw = normalizeValue(data.salaryMin);
    const maxRaw = normalizeValue(data.salaryMax);

    if (minRaw !== "NA" && maxRaw !== "NA" && minRaw && maxRaw) {
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
    localStorage.removeItem("jobFormData");
    reset(defaultValues);
  };

  const handleCancel = () => {
    localStorage.removeItem("jobFormData");
    window.history.back();
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
        <InputField
          id="title"
          label="Title *"
          placeholder="Software Engineer"
          register={register}
          rules={{
            required: "Required",
            pattern: {
              value: /^[a-zA-Z\s.,'!&\-/]+$/,
              message: "Only letters, spaces, and basic punctuation allowed",
            },
            minLength: { value: 3, message: "Min 3 characters" },
            maxLength: { value: 100, message: "Max 100 characters" },
          }}
          error={errors.title}
          disabled={isSubmitting}
          maxLength={100}
        />

        <div className={styles.twoColumn}>
          <InputField
            id="location"
            label="Location *"
            placeholder="Amsterdam, Netherlands"
            register={register}
            rules={{
              required: "Required",
              minLength: { value: 3, message: "Min 3 characters" },
              maxLength: { value: 100, message: "Max 100 characters" },
              pattern: {
                value: /^[a-zA-Z0-9\s.,'-]+$/,
                message: "Only letters, numbers, and punctuation allowed",
              },
            }}
            error={errors.location}
            disabled={isSubmitting}
            maxLength={100}
          />

          <InputField
            id="numberOfOpenings"
            label="Number of Openings *"
            type="number"
            placeholder="1"
            register={register}
            rules={{
              required: "Required",
              valueAsNumber: true,
              min: { value: 1, message: "At least 1 opening required" },
            }}
            error={errors.numberOfOpenings}
            disabled={isSubmitting}
            min={1}
          />
        </div>

        <div className={styles.twoColumn}>
          <JobTypeSelect
            register={register}
            error={errors.type}
            disabled={isSubmitting}
          />

          <InputField
            id="languages"
            label="Languages (comma-separated)"
            placeholder="English"
            register={register}
            rules={{
              pattern: {
                value: /^[a-zA-Z, ]*$/,
                message: "Only letters, commas, and spaces allowed",
              },
            }}
            error={errors.languages}
            disabled={isSubmitting}
            maxLength={100}
          />
        </div>

        <SalaryFields
          register={register}
          errors={errors}
          isSubmitting={isSubmitting}
        />

        <div className={styles.twoColumn}>
          <InputField
            id="tags"
            label="Tags (comma-separated)"
            placeholder="backend, frontend, fullstack"
            register={register}
            rules={{
              pattern: {
                value: /^[a-zA-Z0-9, ]*$/,
                message: "Only letters, numbers, spaces, commas allowed",
              },
            }}
            error={errors.tags}
            disabled={isSubmitting}
            maxLength={100}
          />

          <InputField
            id="limit"
            label="Limit *"
            type="number"
            placeholder="1"
            register={register}
            rules={{
              required: "Required",
              min: { value: 1, message: "Must be at least 1" },
            }}
            error={errors.limit}
            disabled={isSubmitting}
            min={1}
          />
        </div>

        <TextareaField
          id="description"
          label="Description *"
          placeholder="Describe the job responsibilities, etc."
          register={register}
          rules={{
            required: "Required",
            minLength: { value: 20, message: "Min 20 characters" },
            maxLength: { value: 1000, message: "Max 1000 characters" },
          }}
          error={errors.description}
          disabled={isSubmitting}
          value={descriptionValue}
          maxLength={1000}
        />

        <TextareaField
          id="requirements"
          label="Requirements (comma-separated) *"
          placeholder="e.g. 2+ years experience, Strong communication skills"
          register={register}
          rules={{
            required: "Required",
            validate: (val) => {
              if (!val) return "Required";

              const items = val
                .split(/\.\s*[\n]?/)
                .map((item) => item.trim())
                .filter(Boolean);

              if (items.length < 2 || items.length > 10) {
                return "2–10 items required";
              }

              if (items.some((item) => item.length > 200)) {
                return "Each item must be 200 characters or fewer.";
              }

              return true;
            },
          }}
          error={errors.requirements}
          disabled={isSubmitting}
          value={requirementsValue}
          maxLength={1000}
        />

        <DeadlineField
          register={register}
          error={errors.deadline}
          isSubmitting={isSubmitting}
        />

        <FormButtons
          isSubmitting={isSubmitting}
          isEditMode={isEditMode}
          resetForm={handleCancel}
        />
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
