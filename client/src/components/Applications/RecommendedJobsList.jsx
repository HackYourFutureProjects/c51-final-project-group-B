import { useState, useEffect } from "react";
import ApplicationJobCard from "./ApplicationJobCard";

import useFetch from "../../hooks/useFetch";
import { toast } from "sonner";
import Loading from "../templates/Loader";
import Pagination from "../../components/FindJobs/Pagination";
import styles from "./ApplicationJobCard.module.css";
function RecommendedJobsList() {
  const [recommendedJobs, setRecommendedJobs] = useState([]);
  const [page, setPage] = useState(1);
  const limit = 3;

  const {
    isLoading,

    performFetch: fetchRecommendedJobs,
    cancelFetch: cancelRecommendedJobsFetch,
  } = useFetch("/jobs/recommendations", (response) => {
    if (response.success) {
      setRecommendedJobs(response.data);
    } else {
      toast.error("Failed to fetch recommended jobs.");
    }
  });

  useEffect(() => {
    fetchRecommendedJobs();
    return () => cancelRecommendedJobsFetch();
  }, []);

  const startIndex = (page - 1) * limit;
  const paginatedJobs = recommendedJobs.slice(startIndex, startIndex + limit);
  const totalPages = Math.ceil(recommendedJobs.length / limit);

  if (isLoading) return <Loading />;

  return (
    <>
      <div className={styles.notFound}>
        {recommendedJobs.length === 0 && <p>No recommended jobs found.</p>}

        {paginatedJobs.map((job) => (
          <ApplicationJobCard
            key={job._id}
            jobTitle={job.title}
            description={job.description}
            jobId={job._id}
            status={job.isActive ? "Active" : "Closed"}
            jobLocation={job.location ?? "N/A"}
            jobExpireOn={null}
            companyName={job.postedBy?.companyProfile?.companyName ?? "Unknown"}
            onWithdraw={null}
            mode="recommendation"
            createdAt={job.createdAt}
            jobIsActive={job.isActive}
            jobType={job.type}
          />
        ))}

        {totalPages > 1 && (
          <Pagination
            page={page}
            jobs={paginatedJobs}
            limit={limit}
            onPageChange={setPage}
          />
        )}
      </div>
    </>
  );
}

export default RecommendedJobsList;
