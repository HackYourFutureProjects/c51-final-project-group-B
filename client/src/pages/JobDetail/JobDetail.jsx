import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import styles from "./jobdetail.module.css";
import JobHeader from "../../components/JobDetail/JobHeader";
import JobStats from "../../components/JobDetail/JobStats";
import JobAccordion from "../../components/JobDetail/EmployerInfo/JobAccordion";
import ApplyButton from "../../components/JobDetail/ApplyButton";
import SimilarJobs from "../../components/JobDetail/SimilarJob/SimilarJobs";
import useFetch from "../../hooks/useFetch";

const JobDetail = () => {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [similarJobs, setSimilarJobs] = useState([]);

  // Fetch job details
  const {
    isLoading: isJobLoading,
    error: jobError,
    performFetch: fetchJob,
    cancelFetch: cancelJobFetch,
  } = useFetch(`/jobs/${id}`, (response) => {
    const fetchedJob = response?.data;
    console.log("Fetched job:", fetchedJob);
    setJob(fetchedJob);
  });

  //Fetch similar jobs
  const {
    isLoading: isSimilarLoading,
    error: similarError,
    performFetch: fetchSimilar,
    cancelFetch: cancelSimilarFetch,
  } = useFetch(`/jobs/${id}/similar-jobs`, (response) => {
    setSimilarJobs(response?.data || []);
  });

  useEffect(() => {
    fetchJob();
    fetchSimilar();
    return () => {
      cancelJobFetch();
      cancelSimilarFetch();
    };
  }, [id]);

  if (isJobLoading)
    return <p className={styles.loading}>Loading job details...</p>;
  if (jobError) return <p className={styles.error}>Error: {jobError}</p>;
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

        {isSimilarLoading ? (
          <p className={styles.loading}>Loading similar jobs...</p>
        ) : similarError ? (
          <p className={styles.error}>Error loading similar jobs.</p>
        ) : (
          <SimilarJobs jobs={similarJobs} styles={styles} />
        )}
      </div>
    </div>
  );
};

export default JobDetail;

// the apply button is not functional yet, it just renders a button this will be implemented later and  check based user applied or not
// SimilarJobs component is commented out for now, it can be uncommented when the similar jobs feature is implemente
