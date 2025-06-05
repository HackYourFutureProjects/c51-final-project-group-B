import styles from "./findjob.module.css";
import PropTypes from "prop-types";

const Pagination = ({ page, jobs, limit, onPageChange }) => {
  if (!jobs || jobs.length === 0) return null;

  return (
    <nav className={styles.paginationNav} aria-label="Pagination">
      <button
        className={styles.paginationBtn}
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
        aria-label="Previous page"
      >
        &laquo; Prev
      </button>
      <span className={styles.paginationNumber}>{page}</span>
      <button
        className={styles.paginationBtn}
        onClick={() => onPageChange(page + 1)}
        disabled={jobs.length < limit}
        aria-label="Next page"
      >
        Next &raquo;
      </button>
    </nav>
  );
};

export default Pagination;
Pagination.propTypes = {
  page: PropTypes.number.isRequired,
  jobs: PropTypes.array.isRequired,
  limit: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
};
