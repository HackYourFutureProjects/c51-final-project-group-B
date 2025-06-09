import { useState } from "react";
import { MdSearch } from "react-icons/md";
import styles from "./feed-sections.module.css";
import PropTypes from "prop-types";

const FeedSearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(query.trim());
  };

  return (
    <form className={styles.feedSearchBar} onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Search articles..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className={styles.feedSearchInput}
      />
      <button
        type="submit"
        className={styles.feedSearchBtn}
        aria-label="Search"
      >
        <MdSearch size={22} />
      </button>
    </form>
  );
};

FeedSearchBar.propTypes = {
  onSearch: PropTypes.func.isRequired,
};

export default FeedSearchBar;
