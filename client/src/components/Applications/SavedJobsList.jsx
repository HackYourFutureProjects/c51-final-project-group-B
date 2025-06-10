import { useState, useEffect } from "react";
import ApplicationJobCard from "./ApplicationJobCard";
import ApplyModalForm from "../ApplyToJobs/ApplyModalForm";
import useFetch from "../../hooks/useFetch";
import { Toaster, toast } from "react-hot-toast";
import { deleteSavedJob } from "../../api/saveJobs";
import Loading from "../templates/Loader";
import ErrorArea from "../../pages/Error/ErrorArea";
import { Pagination, Stack } from "@mui/material";

function SavedJobsList() {
  const [savedJobs, setSavedJobs] = useState([]);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState(null);

  const [page, setPage] = useState(1);
  const limit = 3;

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
      setSavedJobs((prevJobs) => prevJobs.filter((job) => job.jobId !== jobId));
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

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const startIndex = (page - 1) * limit;
  const paginatedJobs = savedJobs.slice(startIndex, startIndex + limit);
  const totalPages = Math.ceil(savedJobs.length / limit);

  if (isLoading) return <Loading />;
  if (error) return <ErrorArea />;

  return (
    <>
      <Toaster position="top-center" />
      <div>
        {savedJobs.length === 0 && <p>No saved jobs found.</p>}

        {paginatedJobs.map((job) => (
          <ApplicationJobCard
            key={job.jobId}
            jobTitle={job.jobTitle}
            description={job.jobDescription}
            jobId={job.jobId}
            status={job.jobIsActive ? "Active" : "Closed"}
            jobLocation={job.jobLocation ?? "N/A"}
            jobExpireOn={job.jobExpireOn}
            companyName={job.companyName ?? "Company Name"}
            onWithdraw={handleDeleteSavedJob}
            mode="saved"
            createdAt={job.createdAt}
            jobIsActive={job.jobIsActive}
            jobType={job.jobType}
            onOpenApplyModal={() => handleOpenApplyModal(job.jobId)}
          />
        ))}

        {totalPages > 1 && (
          <Stack spacing={2} alignItems="center" mt={4}>
            <Pagination
              count={totalPages}
              page={page}
              onChange={handlePageChange}
              variant="outlined"
              shape="rounded"
              color="primary"
              size="large"
              sx={{
                backgroundColor: "var(--surface-color)",
                borderRadius: "8px",
                padding: "8px",
                "& .MuiPaginationItem-root": {
                  color: "#ccc",
                  borderColor: "#444",
                  backgroundColor: "transparent",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    backgroundColor: "#3a3a55",
                    borderColor: "#888",
                  },
                },
                "& .Mui-selected": {
                  backgroundColor: "#556ee6",
                  color: "#fff",
                  borderColor: "#556ee6",
                  "&:hover": {
                    backgroundColor: "#4454c4",
                    borderColor: "#4454c4",
                  },
                },
                "& .Mui-disabled": {
                  color: "#555 !important",
                  borderColor: "transparent !important",
                },
              }}
            />
          </Stack>
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
