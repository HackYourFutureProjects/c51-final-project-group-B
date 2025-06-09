// SavedJobsList.jsx
import { useEffect, useState } from "react";
import ApplicationJobCard from "./ApplicationJobCard";
import useFetch from "../../hooks/useFetch";
import { Toaster } from "react-hot-toast";

function SavedJobsList() {
  const [savedJobs, setSavedJobs] = useState([]);

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
  console.log("Saved Jobs List Rendered", savedJobs);
  useEffect(() => {
    fetchSavedJobs();
    return () => cancelSavedJobsFetch();
  }, []);

  if (isLoading) return <p>Loading saved jobs...</p>;
  if (error) return <p>Error loading saved jobs: {error.message || error}</p>;

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
            status="saved"
            jobLocation="N/A" // or use a real value if available
            appliedAt={job.createdAt}
            jobExpireOn={new Date().toISOString()} // or fetch real expiry date
            companyName="Company Name" // optionally replace with real data
            onWithdraw={() => {}} // dummy handler if needed
          />
        ))}
      </div>
    </>
  );
}

export default SavedJobsList;
