import PropTypes from "prop-types";
import { createContext, useContext, useState, useEffect } from "react";
import * as savedJobsService from "../api/saveJobs";

const SavedJobsContext = createContext();

export function SavedJobsProvider({ children }) {
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch saved jobs from backend
  useEffect(() => {
    async function fetchSavedJobs() {
      try {
        const jobs = await savedJobsService.getSavedJobs();
        setSavedJobs(jobs);
      } catch (err) {
        console.error("Error fetching saved jobs", err);
      } finally {
        setLoading(false);
      }
    }

    fetchSavedJobs();
  }, []);

  // Add a job (save)
  const addJob = async (job) => {
    try {
      await savedJobsService.saveJob(job._id); // API expects jobId
      setSavedJobs((prev) => {
        if (prev.some((j) => j._id === job._id)) return prev;
        return [...prev, job];
      });
    } catch (err) {
      console.error("Error saving job", err);
    }
  };

  // Remove a job from saved
  const removeJob = async (jobId) => {
    try {
      await savedJobsService.removeSavedJob(jobId);
      setSavedJobs((prev) => prev.filter((job) => job._id !== jobId));
    } catch (err) {
      console.error("Error removing job", err);
    }
  };

  // Check if job is saved
  const isSaved = (jobId) => savedJobs.some((job) => job._id === jobId);

  return (
    <SavedJobsContext.Provider
      value={{ savedJobs, loading, addJob, removeJob, isSaved }}
    >
      {children}
    </SavedJobsContext.Provider>
  );
}

export function useSavedJobs() {
  return useContext(SavedJobsContext);
}

SavedJobsProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
