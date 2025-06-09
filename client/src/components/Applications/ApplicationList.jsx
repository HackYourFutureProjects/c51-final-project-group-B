import { useEffect, useState } from "react";
import ApplicationJobCard from "./ApplicationJobCard";
import useFetch from "../../hooks/useFetch";
import toast, { Toaster } from "react-hot-toast";

function ApplicationList() {
  const [applications, setApplications] = useState([]);

  const {
    isLoading,
    error,
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

  if (isLoading) return <p>Loading applications...</p>;
  if (error) return <p>Error loading applications: {error.message || error}</p>;

  return (
    <>
      <Toaster position="top-center" />
      <div>
        {applications.length === 0 && <p>No job applications found.</p>}

        {applications.map((app) => (
          <ApplicationJobCard
            key={app._id}
            applicationId={app._id}
            jobId={app._id} // optional
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
      </div>
    </>
  );
}

export default ApplicationList;
