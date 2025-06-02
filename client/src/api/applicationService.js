import { httpClient } from "./client";

// function to apply for a job
export async function applyToJob({ jobId, resumeUrl }) {
  return httpClient("/applications", {
    method: "POST",
    body: { jobId, resumeUrl },
  });
}
