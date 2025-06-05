import JobCard from "./JobCard";
import styles from "./findjob.module.css";
import PropTypes from "prop-types";

const JobList = ({ jobs }) => {
  if (!jobs || jobs.length === 0) {
    return <div className={styles.jobListEmpty}>No jobs found.</div>;
  }

  return (
    <div className={styles.jobList}>
      {jobs.map((job) => (
        <JobCard key={job._id || job.id} job={job} />
      ))}
    </div>
  );
};

export default JobList;

JobList.propTypes = {
  jobs: PropTypes.arrayOf(PropTypes.object).isRequired,
};
