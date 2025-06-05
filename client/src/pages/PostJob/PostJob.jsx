import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import JobForm from "../../components/PostJob/JobForm";
import styles from "../../components/PostJob/postJobSection.module.css";

const PostJob = () => {
  const [postsToday, setPostsToday] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formReset, setFormReset] = useState(null);

  const onSubmit = async (data) => {
    if (postsToday >= 5) {
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
        throw new Error(errMsg || "Submission failed");
      }

      toast.success("Job posted successfully");
      incrementPostsCount();

      if (formReset) formReset();
    } catch (error) {
      console.error("Job post failed:", error);
      toast.error(`${error.message}. Please try again.`);
    } finally {
      setIsSubmitting(false);
    }
  };
  const incrementPostsCount = () => {
    setPostsToday((prev) => prev + 1);
    localStorage.setItem("postsToday", postsToday + 1);
  };
  console.log("Posts today:", postsToday);
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
