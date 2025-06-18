import { useEffect, useState } from "react";
import ApplicationJobCard from "./ApplicationJobCard";
import useFetch from "../../hooks/useFetch";
import { toast } from "sonner";
import Loading from "../templates/Loader";

import Pagination from "../../components/FindJobs/Pagination";
import styles from "./ApplicationJobCard.module.css";
function ApplicationList() {
  const [applications, setApplications] = useState([]);
  const [page, setPage] = useState(1);
  const limit = 3;

  const {
    isLoading,

    performFetch: fetchApplications,
    cancelFetch: cancelApplicationsFetch,
  } = useFetch("/applications", (response) => {
    if (response.success) {
      setApplications(response.data);
      console.log("Fetched applications:", response.data);
    }
  });

  useEffect(() => {
    fetchApplications();
    return () => {
      cancelApplicationsFetch();
    };
  }, []);

  const handleWithdraw = async (applicationId) => {
    console.log("Handle withdraw called for:", applicationId);
    try {
      const res = await fetch(`/api/applications/${applicationId}`, {
        method: "DELETE",
      });

      const contentType = res.headers.get("content-type") || "";

      let result;
      if (contentType.includes("application/json")) {
        result = await res.json();
      } else {
        const text = await res.text();
        console.error("Expected JSON but got:", text);
        toast.error("Unexpected server response.");
        return;
      }

      if (result.success) {
        const filtered = applications.filter(
          (app) => app._id !== applicationId,
        );
        setApplications(filtered);
        toast.success("Application withdrawn successfully!");
      } else {
        toast.error("Failed to withdraw application.");
      }
    } catch (error) {
      toast.error("Error withdrawing application.");
      console.error(error);
    }
  };

  const startIndex = (page - 1) * limit;
  const paginatedJobs = applications.slice(startIndex, startIndex + limit);
  const totalPages = Math.ceil(applications.length / limit);

  if (isLoading) return <Loading />;

  return (
    <>
      <div className={styles.notFound}>
        {applications.length === 0 && <p>No job applications found.</p>}

        {paginatedJobs.map((app) => (
          <ApplicationJobCard
            key={app._id}
            applicationId={app._id}
            jobId={app.jobId}
            jobTitle={app.jobTitle}
            jobLocation={app.jobLocation}
            appliedAt={app.appliedAt}
            jobExpireOn={app.jobExpireOn}
            companyName={app.companyName}
            companyLogo={app.companyLogo || "/default-logo.png"}
            status={app.status}
            description={app.description}
            onWithdraw={handleWithdraw}
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
      </div>
    </>
  );
}

export default ApplicationList;
