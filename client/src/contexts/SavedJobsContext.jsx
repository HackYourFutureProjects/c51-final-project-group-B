import PropTypes from "prop-types";
import { createContext, useContext, useState, useEffect } from "react";
import * as savedJobsService from "../api/saveJobs";

const SavedJobsContext = createContext();

function SavedJobsProvider({ children }) {
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSavedJobs() {
      try {
        const response = await savedJobsService.getSavedJobs();
        const jobsArray = Array.isArray(response)
          ? response
          : Array.isArray(response?.savedJobs)
            ? response.savedJobs
            : [];
        setSavedJobs(jobsArray);
      } catch (error) {
        console.error(error);
        setSavedJobs([]);
      } finally {
        setLoading(false);
      }
    }
    fetchSavedJobs();
  }, []);

  // Accept the whole job object here, not just jobId
  const addJob = async (job) => {
    if (!job || !job._id) {
      throw new Error("Invalid job object or missing job._id");
    }
    if (isSaved(job._id)) {
      throw new Error("This job is saved already.");
    }
    await savedJobsService.saveJob(job._id);
    const response = await savedJobsService.getSavedJobs();
    const jobsArray = Array.isArray(response)
      ? response
      : Array.isArray(response?.savedJobs)
        ? response.savedJobs
        : [];
    setSavedJobs(jobsArray);
  };

  const removeJob = async (jobId) => {
    await savedJobsService.deleteSavedJob(jobId);
    const response = await savedJobsService.getSavedJobs();
    const jobsArray = Array.isArray(response)
      ? response
      : Array.isArray(response?.savedJobs)
        ? response.savedJobs
        : [];
    setSavedJobs(jobsArray);
  };

  const isSaved = (jobId) =>
    Array.isArray(savedJobs) && savedJobs.some((job) => job._id === jobId);

  return (
    <SavedJobsContext.Provider
      value={{ savedJobs, loading, addJob, removeJob, isSaved }}
    >
      {children}
    </SavedJobsContext.Provider>
  );
}

function useSavedJobs() {
  return useContext(SavedJobsContext);
}

SavedJobsProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export { SavedJobsProvider, useSavedJobs };
