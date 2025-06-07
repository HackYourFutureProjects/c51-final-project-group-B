import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styles from "./jobdetail.module.css";
import JobHeader from "../../components/JobDetail/JobHeader";
import JobStats from "../../components/JobDetail/JobStats";
import JobAccordion from "../../components/JobDetail/EmployerInfo/JobAccordion";
import ApplyButton from "../../components/JobDetail/ApplyButton";
import SimilarJobs from "../../components/JobDetail/SimilarJob/SimilarJobs";
import useFetch from "../../hooks/useFetch";
import ApplyModalForm from "../../components/ApplyToJobs/ApplyModalForm";
import Loading from "../../components/templates/Loader";

const JobDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [similarJobs, setSimilarJobs] = useState([]);
  const [showApplyModal, setShowApplyModal] = useState(false);

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

  // Fetch similar jobs
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

  useEffect(() => {
    if (jobError || similarError) {
      navigate("/error");
    }
  }, [jobError, similarError, navigate]);

  if (isJobLoading) return <Loading />;

  if (!job) return <p className={styles.noJob}>No job found.</p>;

  return (
    <div className={styles.container}>
      <div className={styles.mainContent}>
        <div className={styles.jobDetailSection}>
          <JobHeader job={job} styles={styles} />
          <JobStats job={job} styles={styles} />
          <JobAccordion job={job} styles={styles} />
          <ApplyButton
            styles={styles}
            onClick={() => setShowApplyModal(true)}
          />
          {showApplyModal && (
            <ApplyModalForm
              jobId={id}
              onClose={() => setShowApplyModal(false)}
            />
          )}
        </div>

        {isSimilarLoading ? (
          <Loading />
        ) : (
          <SimilarJobs jobs={similarJobs} styles={styles} />
        )}
      </div>
    </div>
  );
};

export default JobDetail;
