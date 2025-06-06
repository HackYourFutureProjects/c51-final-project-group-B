import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import JobForm from "../../components/PostJob/JobForm";
import styles from "../../components/PostJob/postjobsection.module.css";
import { DAILY_POST_LIMIT } from "../../constants";

const PostJob = () => {
  const [postsToday, setPostsToday] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formReset, setFormReset] = useState(null);

  const onSubmit = async (data) => {
    if (postsToday >= DAILY_POST_LIMIT) {
      toast.error("You have reached the limit of 5 job posts today.");
      return;
    }

    setIsSubmitting(true);

    const formatted = {
      ...data,
      numberOfOpenings: Number(data.numberOfOpenings || 1),
      requirements: (data.requirements || "")
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      tags: (data.tags || "")
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      languages: (data.languages || "")
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      salaryMin:
        typeof data.salaryMin === "string" &&
        data.salaryMin.trim().toUpperCase() === "NA"
          ? "NA"
          : Number(data.salaryMin || 0),
      salaryMax:
        typeof data.salaryMax === "string" &&
        data.salaryMax.trim().toUpperCase() === "NA"
          ? "NA"
          : Number(data.salaryMax || 0),
    };

    try {
      const response = await fetch("/api/jobs/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formatted),
      });

      if (!response.ok) {
        const errMsg = await response.text();
        let message;
        try {
          message = JSON.parse(errMsg).msg || "Submission failed";
        } catch {
          message = errMsg || "Submission failed";
        }
        throw new Error(message);
      }

      toast.success("Job posted successfully");
      incrementPostsCount();

      if (formReset) formReset();
    } catch (error) {
      toast.error(error.message || "Submission failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const incrementPostsCount = () => {
    setPostsToday((prev) => {
      const updatedPostsToday = prev + 1;
      localStorage.setItem("postsToday", updatedPostsToday);
      return updatedPostsToday;
    });
  };

  return (
    <>
      <Toaster position="top-center" />
      <div className={styles.settingsWrapper}>
        <h1 className={styles.settingsTitle}>Post a Job or Training</h1>
        <JobForm
          onSubmit={onSubmit}
          isSubmitting={isSubmitting}
          setFormReset={setFormReset}
        />
      </div>
    </>
  );
};

export default PostJob;
