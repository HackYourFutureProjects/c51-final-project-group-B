import { httpClient } from "./client";

// Get all saved jobs
export async function getSavedJobs() {
  return httpClient("/saved-jobs", {
    method: "GET",
  });
}

// Save a job
export async function saveJob(jobId) {
  return httpClient("/saved-jobs", {
    method: "POST",
    body: { jobId },
  });
}

// Remove a saved job
export async function removeSavedJob(jobId) {
  return httpClient(`/saved-jobs/${jobId}`, {
    method: "DELETE",
  });
}
