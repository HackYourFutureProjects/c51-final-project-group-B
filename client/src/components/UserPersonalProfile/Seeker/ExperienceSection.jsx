import { useState } from "react";
import styles from "../Shared/settings.module.css";
import PropTypes from "prop-types";

const ExperienceSection = ({
  expFields,
  register,
  errors,
  removeExp,
  appendExp,
}) => {
  //  open/closed state for each entry
  const [openIndexes, setOpenIndexes] = useState([]);

  const toggleOpen = (idx) => {
    setOpenIndexes((prev) =>
      prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx],
    );
  };

  return (
    <div className={styles.sectionContainer}>
      <h2>Experience</h2>
      {expFields.map((item, idx) => {
        const isOpen = openIndexes.includes(idx);
        return (
          <div key={item.id} className={styles.dynamicFieldGroup}>
            <div
              className={styles.collapsibleHeader}
              onClick={() => toggleOpen(idx)}
            >
              <span>
                {item.company || "Company"} — {item.title || "Title"}
              </span>
              <span
                className={`${styles.arrowIcon} ${isOpen ? styles.arrowOpen : ""}`}
                aria-label={isOpen ? "Collapse" : "Expand"}
              >
                ▼
              </span>
            </div>
            {isOpen && (
              <>
                <div className={styles.formField}>
                  <label>Company</label>
                  <input
                    className={`input-field${errors.experiences?.[idx]?.company ? " input-error" : ""}`}
                    maxLength={80}
                    {...register(`experiences.${idx}.company`, {
                      required: "Company is required",
                      maxLength: { value: 80, message: "Max 80 characters" },
                    })}
                  />
                  {errors.experiences?.[idx]?.company && (
                    <p className={styles.errorText}>
                      {errors.experiences[idx].company.message}
                    </p>
                  )}
                </div>
                <div className={styles.formField}>
                  <label>Title</label>
                  <input
                    className={`input-field${errors.experiences?.[idx]?.title ? " input-error" : ""}`}
                    maxLength={80}
                    {...register(`experiences.${idx}.title`, {
                      required: "Title is required",
                      maxLength: { value: 80, message: "Max 80 characters" },
                    })}
                  />
                  {errors.experiences?.[idx]?.title && (
                    <p className={styles.errorText}>
                      {errors.experiences[idx].title.message}
                    </p>
                  )}
                </div>
                <div className={styles.formField}>
                  <label>Location</label>
                  <input
                    className="input-field"
                    maxLength={80}
                    {...register(`experiences.${idx}.workLocation`, {
                      maxLength: { value: 80, message: "Max 80 characters" },
                    })}
                  />
                </div>
                <div className={styles.formField}>
                  <label>Start Date</label>
                  <input
                    className={`input-field${errors.experiences?.[idx]?.startDate ? " input-error" : ""}`}
                    type="date"
                    {...register(`experiences.${idx}.startDate`, {
                      required: "Start date required",
                    })}
                  />
                  {errors.experiences?.[idx]?.startDate && (
                    <p className={styles.errorText}>
                      {errors.experiences[idx].startDate.message}
                    </p>
                  )}
                </div>
                <div className={styles.formField}>
                  <label>End Date</label>
                  <input
                    className="input-field"
                    type="date"
                    {...register(`experiences.${idx}.endDate`, {
                      validate: (endDate, formValues) => {
                        const startDate =
                          formValues.experiences?.[idx]?.startDate;
                        if (endDate && startDate && endDate < startDate) {
                          return "End date must be after start date";
                        }
                        return true;
                      },
                    })}
                  />
                  {errors.experiences?.[idx]?.endDate && (
                    <p className={styles.errorText}>
                      {errors.experiences[idx].endDate.message}
                    </p>
                  )}
                </div>
                <div className={styles.formField}>
                  <label>Description</label>
                  <textarea
                    className="input-field"
                    maxLength={500}
                    {...register(`experiences.${idx}.description`, {
                      maxLength: { value: 500, message: "Max 500 characters" },
                    })}
                  />
                </div>
                <button
                  type="button"
                  className={styles.removeBtn}
                  onClick={() => removeExp(idx)}
                >
                  Remove
                </button>
              </>
            )}
          </div>
        );
      })}
      {/* Button to add a new experience entry with empty defualts */}
      <button
        type="button"
        className={styles.addBtn}
        onClick={() =>
          appendExp({
            company: "",
            title: "",
            workLocation: "",
            startDate: "",
            endDate: "",
            description: "",
          })
        }
      >
        Add Experience
      </button>
    </div>
  );
};
ExperienceSection.propTypes = {
  expFields: PropTypes.array.isRequired,
  register: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired,
  removeExp: PropTypes.func.isRequired,
  appendExp: PropTypes.func.isRequired,
};
export default ExperienceSection;
