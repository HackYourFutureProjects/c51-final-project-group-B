import { httpClient } from "./client";

// GET /api/saved-jobs
export async function getSavedJobs() {
  return httpClient("/saved-jobs", {
    method: "GET",
  });
}

// POST /api/saved-jobs/:id
export async function saveJob(jobId) {
  return httpClient(`/saved-jobs/${jobId}`, {
    method: "POST",
  });
}

// DELETE /api/saved-jobs/:id
export async function deleteSavedJob(jobId) {
  return httpClient(`/saved-jobs/${jobId}`, {
    method: "DELETE",
  });
}
