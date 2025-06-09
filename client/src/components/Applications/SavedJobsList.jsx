import { useSavedJobs } from "../../contexts/SavedJobsContext";
import JobCard from "../FindJobs/JobCard";
import Loading from "../templates/Loader";

const SavedJobsList = () => {
  const { savedJobs, loading, removeJob } = useSavedJobs();

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="saved-job-cards">
      {savedJobs.length === 0 ? (
        <p className="saved-jobs-empty">
          You haven&apos;t saved any jobs yet...
        </p>
      ) : (
        savedJobs.map((job) => (
          <div key={job.id} className="job-card">
            <JobCard job={job} />
            <button
              className="remove-saved-job"
              onClick={() => removeJob(job.id)}
            >
              Remove from Saved Jobs
            </button>
          </div>
        ))
      )}
    </div>
  );
};

export default SavedJobsList;
