import { useState, useEffect } from "react";
import ApplicationJobCard from "./ApplicationJobCard";
import ApplyModalForm from "../ApplyToJobs/ApplyModalForm";
import useFetch from "../../hooks/useFetch";
import { Toaster, toast } from "react-hot-toast";
import Loading from "../templates/Loader";
import ErrorArea from "../../pages/Error/ErrorArea";

function RecommendedJobsList() {
  const [recommendedJobs, setRecommendedJobs] = useState([]);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState(null);

  const {
    isLoading,
    error,
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

  const handleOpenApplyModal = (jobId) => {
    setSelectedJobId(jobId);
    setShowApplyModal(true);
  };

  const handleCloseApplyModal = () => {
    setShowApplyModal(false);
    setSelectedJobId(null);
  };

  const handleApply = (jobId, formData) => {
    console.log("Applying for job:", jobId, formData);
    toast.success("Application submitted!");
    handleCloseApplyModal();
  };

  if (isLoading) return <Loading />;
  if (error) return <ErrorArea />;

  return (
    <>
      <Toaster position="top-center" />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          width: "100%",
          maxWidth: 900,
          margin: "0 auto",
          paddingLeft: 16,
          paddingRight: 16,
        }}
      >
        {recommendedJobs.length === 0 && <p>No recommended jobs found.</p>}

        {recommendedJobs.map((job) => (
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
            onOpenApplyModal={() => handleOpenApplyModal(job._id)}
          />
        ))}

        {showApplyModal && (
          <ApplyModalForm
            jobId={selectedJobId}
            onClose={handleCloseApplyModal}
            onApply={handleApply}
          />
        )}
      </div>
    </>
  );
}

export default RecommendedJobsList;
