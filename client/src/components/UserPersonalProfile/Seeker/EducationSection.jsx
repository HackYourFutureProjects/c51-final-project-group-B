import { useState } from "react";
import styles from "../Shared/settings.module.css";
import PropTypes from "prop-types";

const EducationSection = ({
  eduFields,
  register,
  errors,
  removeEdu,
  appendEdu,
}) => {
  // open/closed state
  const [openIndexes, setOpenIndexes] = useState([]);

  const toggleOpen = (idx) => {
    setOpenIndexes((prev) =>
      prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx],
    );
  };

  return (
    <div className={styles.sectionContainer}>
      <h2>Education</h2>
      {eduFields.map((item, idx) => {
        const isOpen = openIndexes.includes(idx);
        return (
          <div key={item.id} className={styles.dynamicFieldGroup}>
            <div
              className={styles.collapsibleHeader}
              onClick={() => toggleOpen(idx)}
            >
              <span>
                {item.school || "School"} — {item.degree || "Degree"}
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
                  <label>School</label>
                  <input
                    className={`input-field${errors.education?.[idx]?.school ? " input-error" : ""}`}
                    {...register(`education.${idx}.school`, {
                      required: "School is required",
                    })}
                  />
                  {errors.education?.[idx]?.school && (
                    <p className={styles.errorText}>
                      {errors.education[idx].school.message}
                    </p>
                  )}
                </div>
                <div className={styles.formField}>
                  <label>Degree</label>
                  <input
                    className={`input-field${errors.education?.[idx]?.degree ? " input-error" : ""}`}
                    {...register(`education.${idx}.degree`, {
                      required: "Degree is required",
                    })}
                  />
                  {errors.education?.[idx]?.degree && (
                    <p className={styles.errorText}>
                      {errors.education[idx].degree.message}
                    </p>
                  )}
                </div>
                <div className={styles.formField}>
                  <label>Field of Study</label>
                  <input
                    className="input-field"
                    {...register(`education.${idx}.fieldOfStudy`)}
                  />
                </div>
                <div className={styles.formField}>
                  <label>Location</label>
                  <input
                    className="input-field"
                    {...register(`education.${idx}.educationLocation`)}
                  />
                </div>
                <div className={styles.formField}>
                  <label>Start Date</label>
                  <input
                    className={`input-field${errors.education?.[idx]?.startDate ? " input-error" : ""}`}
                    type="date"
                    {...register(`education.${idx}.startDate`, {
                      required: "Start date required",
                    })}
                  />
                  {errors.education?.[idx]?.startDate && (
                    <p className={styles.errorText}>
                      {errors.education[idx].startDate.message}
                    </p>
                  )}
                </div>
                <div className={styles.formField}>
                  <label>End Date</label>
                  <input
                    className="input-field"
                    type="date"
                    {...register(`education.${idx}.endDate`)}
                  />
                </div>
                <button
                  type="button"
                  className={styles.removeBtn}
                  onClick={() => removeEdu(idx)}
                >
                  Remove
                </button>
              </>
            )}
          </div>
        );
      })}
      {/* Button to add new education entry[empty] */}
      <button
        type="button"
        className={styles.addBtn}
        onClick={() =>
          appendEdu({
            school: "",
            degree: "",
            fieldOfStudy: "",
            educationLocation: "",
            startDate: "",
            endDate: "",
          })
        }
      >
        Add Education
      </button>
    </div>
  );
};

EducationSection.propTypes = {
  eduFields: PropTypes.array.isRequired,
  register: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired,
  removeEdu: PropTypes.func.isRequired,
  appendEdu: PropTypes.func.isRequired,
};

export default EducationSection;
