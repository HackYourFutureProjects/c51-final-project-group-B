import { useEffect, useState } from "react";
import styles from "./jobList.module.css";
import useFetch from "../../hooks/useFetch";
import JobCard from "./JobCard";
import PropTypes from "prop-types";

const JobList = ({ onJobClick }) => {
  const [jobs, setJobs] = useState([]);

  const { performFetch, cancelFetch } = useFetch(
    `/jobs/company/job-lists`,
    (response) => {
      setJobs(response?.data || []);
    },
  );

  useEffect(() => {
    performFetch();
    return () => {
      cancelFetch();
    };
  }, []);

  return (
    <div className={styles.jobList}>
      {jobs.length > 0 ? (
        jobs.map((job) => (
          <JobCard key={job._id} job={job} onJobClick={onJobClick} />
        ))
      ) : (
        <p>No available jobs</p>
      )}
    </div>
  );
};

JobList.propTypes = {
  onJobClick: PropTypes.func.isRequired,
};

export default JobList;
