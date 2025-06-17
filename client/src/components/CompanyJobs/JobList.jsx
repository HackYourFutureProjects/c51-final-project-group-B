import { useEffect, useState } from "react";
import styles from "./jobList.module.css";
import useFetch from "../../hooks/useFetch";
import JobCard from "./JobCard";
import PropTypes from "prop-types";
import Pagination from "../../components/FindJobs/Pagination";

const JobList = ({ onJobClick }) => {
  const [jobs, setJobs] = useState([]);
  const [page, setPage] = useState(1);
  const limit = 6;

  console.log(jobs);
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
  console.log(jobs);

  const startIndex = (page - 1) * limit;
  const paginatedJobs = jobs.slice(startIndex, startIndex + limit);

  return (
    <div className={styles.jobList}>
      {paginatedJobs.length > 0 ? (
        paginatedJobs.map((job) => (
          <JobCard key={job._id} job={job} onJobClick={onJobClick} />
        ))
      ) : (
        <p>No available jobs</p>
      )}
      {jobs.length > limit && (
        <Pagination
          page={page}
          jobs={paginatedJobs}
          limit={limit}
          onPageChange={setPage}
        />
      )}
    </div>
  );
};

JobList.propTypes = {
  onJobClick: PropTypes.func.isRequired,
};

export default JobList;
