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

  const { performFetch, cancelFetch } = useFetch(
    `/jobs/company/job-lists`,
    (response) => {
      setJobs(response?.data || []);
    },
  );

  useEffect(() => {
    performFetch();
    return () => cancelFetch();
  }, []);

  const handleJobDelete = (deletedId) => {
    setJobs((prevJobs) => prevJobs.filter((job) => job._id !== deletedId));
  };

  const startIndex = (page - 1) * limit;
  const paginatedJobs = jobs.slice(startIndex, startIndex + limit);

  return (
    <div className={styles.jobList}>
      {paginatedJobs.length > 0 ? (
        paginatedJobs.map((job) => (
          <JobCard
            key={job._id}
            job={job}
            onJobClick={onJobClick}
            onDelete={handleJobDelete} // ✅ pass delete handler
          />
        ))
      ) : (
        <p>No available jobs</p>
      )}

      <Pagination
        page={page}
        jobs={jobs}
        limit={limit}
        onPageChange={setPage}
      />
    </div>
  );
};

JobList.propTypes = {
  onJobClick: PropTypes.func.isRequired,
};

export default JobList;
