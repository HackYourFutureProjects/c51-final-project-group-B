import { useState, useEffect } from "react";
import ApplicationJobCard from "./ApplicationJobCard";
import ApplyModalForm from "../ApplyToJobs/ApplyModalForm";
import useFetch from "../../hooks/useFetch";
import { Toaster, toast } from "react-hot-toast";
import { deleteSavedJob } from "../../api/saveJobs";
import Loading from "../templates/Loader";
import ErrorArea from "../../pages/Error/ErrorArea";

function SavedJobsList() {
  const [savedJobs, setSavedJobs] = useState([]);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState(null);

  const {
    isLoading,
    error,
    performFetch: fetchSavedJobs,
    cancelFetch: cancelSavedJobsFetch,
  } = useFetch("/saved-jobs", (response) => {
    if (response.success) {
      setSavedJobs(response.data);
    }
  });

  useEffect(() => {
    fetchSavedJobs();
    return () => cancelSavedJobsFetch();
  }, []);

  const handleDeleteSavedJob = async (jobId) => {
    try {
      await deleteSavedJob(jobId);
      setSavedJobs((prevJobs) => prevJobs.filter((job) => job._id !== jobId));
      toast.success("Job removed from saved list.");
    } catch (error) {
      console.error("Failed to delete saved job:", error);
      toast.error("Failed to remove job. Please try again.");
    }
  };

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

  // Function to format date nicely
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    if (isNaN(date)) return "Invalid Date";
    return date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (isLoading) return <Loading />;
  if (error) return <ErrorArea />;

  return (
    <>
      <Toaster position="top-center" />
      <div>
        {savedJobs.length === 0 && <p>No saved jobs found.</p>}

        {savedJobs.map((job) => (
          <ApplicationJobCard
            key={job.jobId}
            jobTitle={job.jobTitle}
            description={job.jobDescription}
            jobId={job.jobId}
            status={job.jobIsActive ? "Active" : "Closed"}
            jobLocation={job.jobLocation ?? "N/A"}
            jobExpireOn={formatDate(job.jobExpireOn)}
            companyName={job.companyName ?? "Company Name"}
            onWithdraw={handleDeleteSavedJob}
            mode="saved"
            createdAt={job.createdAt}
            jobIsActive={job.jobIsActive}
            jobType={job.jobType}
            onOpenApplyModal={() => handleOpenApplyModal(job.jobId)}
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

export default SavedJobsList;
