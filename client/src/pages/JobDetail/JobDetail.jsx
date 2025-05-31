import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import styles from "./JobDetail.module.css";
import JobHeader from "../../components/JobDetail/JobHeader";
import JobStats from "../../components/JobDetail/JobStats";
import JobAccordion from "../../components/JobDetail/EmployerInfo/JobAccordion";
import ApplyButton from "../../components/JobDetail/ApplyButton";
import SimilarJobs from "../../components/JobDetail/SimilarJob/SimilarJobs";
import useFetch from "../../hooks/useFetch";

const JobDetail = () => {
  const { id } = useParams();
  const [job, setJob] = useState(null);

  // Initialize fetch with URL and callback to setJob
  const { isLoading, error, performFetch, cancelFetch } = useFetch(
    `/jobs/${id}`,
    (response) => {
      // Assuming API returns job data inside response.data
      const fetchedJob = response?.data;
      console.log("Fetched job:", fetchedJob);
      setJob(fetchedJob);
    },
  );

  useEffect(() => {
    performFetch();
    return cancelFetch;
  }, [id]); // re-fetch if id changes

  if (isLoading)
    return <p className={styles.loading}>Loading job details...</p>;
  if (error) return <p className={styles.error}>Error: {error}</p>;
  if (!job) return <p className={styles.noJob}>No job found.</p>;

  return (
    <div className={styles.container}>
      <div className={styles.mainContent}>
        <div className={styles.jobDetailSection}>
          <JobHeader job={job} styles={styles} />
          <JobStats job={job} styles={styles} />
          <JobAccordion job={job} styles={styles} />
          <ApplyButton styles={styles} />
        </div>
        <SimilarJobs jobs={[]} styles={styles} />{" "}
        {/* Update with actual similar jobs */}
      </div>
    </div>
  );
};

export default JobDetail;
