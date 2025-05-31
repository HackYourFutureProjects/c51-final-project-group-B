import { useState } from "react";
import JobCard from "./JobCard";
import PropTypes from "prop-types";

const SimilarJobs = ({ jobs, styles }) => {
  const [showAll, setShowAll] = useState(false);
  const jobsToShow = showAll ? jobs : jobs.slice(0, 3);

  return (
    <div className={styles.similarJobsSection}>
      <p className={styles.similarJobsTitle}>Similar Job Posts</p>
      <div className={styles.similarJobsList}>
        {jobsToShow.map((job, index) => (
          <JobCard job={job} key={index} styles={styles} />
        ))}
      </div>

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
// SimilarJobs.jsx
// This component displays a list of similar job posts. It allows users to toggle between showing a limited number of jobs or all available jobs.
// It uses the JobCard component to render each job and includes a button to show more or fewer jobs based on user interaction.
