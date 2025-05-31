import { useState } from "react";
import JobCard from "./JobCard";
import PropTypes from "prop-types";

/**
 * SimilarJobs component renders a list of similar job postings.
 * - Shows first 3 jobs by default.
 * - Users can toggle between showing all jobs or only the first 3.
 * - Uses JobCard component for each job rendering.
 *
 * Props:
 * - jobs: array of job objects to display.
 * - styles: CSS module styles object for styling.
 */
const SimilarJobs = ({ jobs, styles }) => {
  const [showAll, setShowAll] = useState(false);
  // Show all jobs if toggled, else show first 3
  const jobsToShow = showAll ? jobs : jobs.slice(0, 3);

  return (
    <div className={styles.similarJobsSection}>
      <p className={styles.similarJobsTitle}>Similar Job Posts</p>
      <div className={styles.similarJobsList}>
        {jobsToShow.map((job) => (
          // Use job.id as key for better uniqueness instead of index
          <JobCard job={job} key={job.id} styles={styles} />
        ))}
      </div>

      {/* Toggle buttons to show more or less */}
      {!showAll && jobs.length > 3 && (
        <button
          className={styles.showMoreButton}
          onClick={() => setShowAll(true)}
          aria-label="Show more similar jobs"
        >
          Show More
        </button>
      )}

      {showAll && (
        <button
          className={styles.showMoreButton}
          onClick={() => setShowAll(false)}
          aria-label="Show fewer similar jobs"
        >
          Show Less
        </button>
      )}
    </div>
  );
};

SimilarJobs.propTypes = {
  jobs: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      jobTitle: PropTypes.string.isRequired,
      location: PropTypes.string.isRequired,
      jobType: PropTypes.string.isRequired,
      createdAt: PropTypes.string.isRequired,
      company: PropTypes.shape({
        profileUrl: PropTypes.string,
        name: PropTypes.string,
      }),
      detail: PropTypes.arrayOf(
        PropTypes.shape({
          desc: PropTypes.string,
        }),
      ),
    }),
  ).isRequired,
  styles: PropTypes.object.isRequired,
};

export default SimilarJobs;
