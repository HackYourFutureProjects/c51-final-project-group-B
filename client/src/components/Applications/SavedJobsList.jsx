import { useState, useEffect } from "react";
import ApplicationJobCard from "./ApplicationJobCard";
import useFetch from "../../hooks/useFetch";
import ApplyModalForm from "../ApplyToJobs/ApplyModalForm";
import { toast } from "sonner";
import { deleteSavedJob } from "../../api/saveJobs";
import Loading from "../templates/Loader";
import Pagination from "../../components/FindJobs/Pagination";
import styles from "./ApplicationJobCard.module.css";

function SavedJobsList() {
  const [savedJobs, setSavedJobs] = useState([]);
  const [page, setPage] = useState(1);
  const limit = 3;
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState(null);

  const {
    isLoading,

    performFetch: fetchSavedJobs,
    cancelFetch: cancelSavedJobsFetch,
  } = useFetch("/saved-jobs", (response) => {
    setSavedJobs(response.data);
  });

  useEffect(() => {
    fetchSavedJobs();
    return () => cancelSavedJobsFetch();
  }, []);

  const handleDeleteSavedJob = async (jobId) => {
    try {
      await deleteSavedJob(jobId);

      const filteredJobs = savedJobs.filter((job) => job.jobId !== jobId);
      setSavedJobs(filteredJobs);

      const totalPages = Math.ceil(filteredJobs.length / limit);
      if (page > totalPages) setPage(totalPages > 0 ? totalPages : 1);

      toast.success("Job removed from saved list.");
    } catch (error) {
      toast.error(error.message || "Failed to remove job from saved list.");
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

  const startIndex = (page - 1) * limit;
  const paginatedJobs = savedJobs.slice(startIndex, startIndex + limit);
  const totalPages = Math.ceil(savedJobs.length / limit);

  return (
    <>
      <div className={styles.notFound}>
        {savedJobs.length === 0 && <p>No saved jobs found.</p>}

        {paginatedJobs.map((job) => (
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
            showApplyModal={showApplyModal && selectedJobId === job.jobId}
            onCloseApplyModal={handleCloseApplyModal}
            onApply={handleApply}
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
