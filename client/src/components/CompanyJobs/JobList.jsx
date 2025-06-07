import { useEffect, useState } from "react";
import styles from "./jobList.module.css";
import useFetch from "../../hooks/useFetch";
import JobCard from "./JobCard";

const JobList = () => {
  const [jobs, setJobs] = useState([]);

  const { performFetch, cancelFetch } = useFetch(
    `/jobs/company/job-lists`,
    (response) => {
      console.log("Jobs fetched:", response);
      setJobs(response?.data || []);
    },
  );

  useEffect(() => {
    performFetch();
    return () => {
      cancelFetch();
    };
  }, []);

  console.log("Jobs fetched:", jobs);
  console.log("First job:", jobs[9]);

  return (
    <div className={styles.jobList}>
      {jobs.length > 0 ? (
        jobs.map((job) => <JobCard key={job._id} job={job} styles={styles} />)
      ) : (
        <p>No available jobs</p>
      )}
    </div>
  );
};

export default JobList;
