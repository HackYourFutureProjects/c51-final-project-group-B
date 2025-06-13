import AplicationList from "../../CompanyJobs/AplicationList";
import JobList from "../../CompanyJobs/JobList";
import { useState } from "react";
import styles from "./jobs.module.css";

const Jobs = () => {
  const [selectedJob, setSelectedJob] = useState(null);

  return (
    <>
      {selectedJob ? (
        <>
          <AplicationList id={selectedJob._id} />
          <div className={styles.btnContainerRight}>
            <button className={styles.btn} onClick={() => setSelectedJob(null)}>
              ← back to Jobs
            </button>
          </div>
        </>
      ) : (
        <JobList onJobClick={setSelectedJob} />
      )}
    </>
  );
};

export default Jobs;
