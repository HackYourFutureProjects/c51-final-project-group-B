import { useState, useEffect } from "react";
import useFetch from "../../hooks/useFetch";
import JobSearchBar from "../../components/FindJobs/JobSearchBar";
import JobFilters from "../../components/FindJobs/JobFilters";
import JobList from "../../components/FindJobs/JobList";
import Pagination from "../../components/FindJobs/Pagination";
import styles from "./findjobs-page.module.css";

function FindJobsPage() {
  const [searchQuery, setSearchQuery] = useState({ title: "" });
  const [filters, setFilters] = useState({ location: "", type: "", tags: "" });
  const [page, setPage] = useState(1);
  const [jobs, setJobs] = useState([]);
  const limit = 6; // Number of jobs per page

  const { isLoading, error, performFetch } = useFetch("/jobs", (jsonResult) => {
    setJobs(jsonResult.data);
  });

  useEffect(() => {
    const params = new URLSearchParams();
    if (searchQuery.title) params.append("title", searchQuery.title);
    if (filters.location) params.append("location", filters.location);
    if (filters.type) params.append("type", filters.type);
    if (filters.tags) params.append("tags", filters.tags);
    params.append("page", page);
    params.append("limit", limit);

    const dynamicRoute = `/jobs?${params.toString()}`;

    performFetch({
      method: "GET",
      headers: { "content-type": "application/json" },
      routeOverride: dynamicRoute,
    });
  }, [searchQuery, filters, page]);

  return (
    <div className={styles.findJobsContainer}>
      <JobSearchBar onSearch={setSearchQuery} />
      <div className={styles.findJobsContent}>
        <JobFilters
          filters={filters}
          onChangeFilter={(newFilters) => {
            setFilters(newFilters);
            setPage(1);
          }}
        />
        <div className={styles.findJobsListSection}>
          {isLoading ? (
            <p className={styles.findJobsLoading}>Loading jobs...</p>
          ) : error ? (
            <p className={styles.findJobsError}>{error}</p>
          ) : (
            <>
              <JobList jobs={jobs} />
              <Pagination
                page={page}
                jobs={jobs}
                limit={limit}
                onPageChange={setPage}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default FindJobsPage;
