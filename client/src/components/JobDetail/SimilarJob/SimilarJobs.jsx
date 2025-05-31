import { useState } from "react";
import JobCard from "./JobCard";
import PropTypes from "prop-types";

/**
 * Helper function to map job object to JobCard props shape
 */
const mapJobToCardProps = (job) => ({
  id: job.id,
  title: job.jobTitle,
  type: job.jobType,
  description: job.detail?.map((detailItem) => detailItem.desc).join(" ") || "",
  location: job.location,
  company: job.company,
  createdAt: job.createdAt,
});

const SimilarJobs = ({ jobs, styles }) => {
  const [showAll, setShowAll] = useState(false);
  const jobsToShow = showAll ? jobs : jobs.slice(0, 3);

  return (
    <div className={styles.similarJobsSection}>
      <p className={styles.similarJobsTitle}>Similar Job Posts</p>
      <div className={styles.similarJobsList}>
        {jobsToShow.map((job) => (
          <JobCard job={mapJobToCardProps(job)} key={job.id} styles={styles} />
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
