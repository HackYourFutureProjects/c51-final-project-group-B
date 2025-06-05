import styles from "./findjob.module.css";
import PropTypes from "prop-types";

const JOB_TYPES = [
  "Full-time",
  "Part-time",
  "Internship",
  "Contract",
  "Temporary",
  "Remote",
  "Hybrid",
  "Freelance",
];

const JobFilters = ({ filters, onChangeFilter }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    onChangeFilter({ ...filters, [name]: value });
  };

  const handleReset = () => {
    onChangeFilter({ location: "", type: "", tags: "" });
  };

  return (
    <aside className={styles.filterPanel}>
      <div className={styles.filterTitle}>Filters</div>
      <div className={styles.filterSection}>
        <label className={styles.filterLabel}>Location</label>
        <input
          className={styles.filterInput}
          type="text"
          name="location"
          value={filters.location || ""}
          onChange={handleChange}
          placeholder="e.g. Amsterdam"
        />
      </div>
      <div className={styles.filterSection}>
        <label className={styles.filterLabel}>Type</label>
        <select
          className={styles.filterInput}
          name="type"
          value={filters.type || ""}
          onChange={handleChange}
        >
          <option value="">Any</option>
          {JOB_TYPES.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>
      <div className={styles.filterSection}>
        <label className={styles.filterLabel}>Tags</label>
        <input
          className={styles.filterInput}
          type="text"
          name="tags"
          value={filters.tags || ""}
          onChange={handleChange}
          placeholder="e.g. React, Backend"
        />
      </div>
      <button
        type="button"
        className={styles.filterResetBtn}
        onClick={handleReset}
      >
        Reset
      </button>
    </aside>
  );
};

export default JobFilters;

JobFilters.propTypes = {
  filters: PropTypes.shape({
    location: PropTypes.string,
    type: PropTypes.string,
    tags: PropTypes.string,
  }).isRequired,
  onChangeFilter: PropTypes.func.isRequired,
};
