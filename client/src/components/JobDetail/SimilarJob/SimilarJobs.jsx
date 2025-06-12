import { useState } from "react";
import JobCard from "./JobCard";
import PropTypes from "prop-types";

/**
 * Helper function to map job object to JobCard props shape
 */
const mapJobToCardProps = (job) => {
  return {
    id: job._id,
    title: job.title,
    type: job.type,
    description: job.description || "",
    location: job.location,
    companyProfile: job.postedBy?.companyProfile?.companyName || "",
    profilePhoto: job.postedBy?.profilePhoto || "",
    createdAt: job.createdAt,
  };
};

const SimilarJobs = ({ jobs, styles }) => {
  const [showAll, setShowAll] = useState(false);
  const jobsToShow = showAll ? jobs : jobs.slice(0, 3);

  // Debug: log any jobs missing an id
  jobsToShow.forEach((job, index) => {
    if (!job.id) {
      console.warn(`Job at index ${index} is missing an id!`, job);
    }
  });

  return (
    <div className={styles.similarJobsSection}>
      <p className={styles.similarJobsTitle}>Similar Job Posts</p>
      <div className={styles.similarJobsWrapper}>
        <div className={styles.similarJobsList}>
          {jobsToShow.map((job, index) => (
            <JobCard
              job={mapJobToCardProps(job)}
              key={job.id ?? `job-${index}`}
              styles={styles}
            />
          ))}
        </div>

        <div className={styles.showMoreButtonContainer}>
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
      </div>
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
