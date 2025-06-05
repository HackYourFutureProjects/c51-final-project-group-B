import { useState } from "react";
import styles from "./findjob.module.css";
import PropTypes from "prop-types";

const JobSearchBar = ({ onSearch }) => {
  const [title, setTitle] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch({
      title: title.trim(),
    });
  };

  return (
    <form className={styles.jobSearchBar} onSubmit={handleSubmit}>
      <input
        className={styles.jobSearchInput}
        type="text"
        placeholder="Job title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        aria-label="Job title"
      />

      <button className={styles.jobSearchButton} type="submit">
        Search
      </button>
    </form>
  );
};

export default JobSearchBar;

JobSearchBar.propTypes = {
  onSearch: PropTypes.func.isRequired,
};
