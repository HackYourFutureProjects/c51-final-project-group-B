import { useState } from "react";
import { toast } from "sonner";
import JobForm from "../../../components/PostJob/JobForm";
import styles from "../../../components/PostJob/postJobSection.module.css";
import { DAILY_POST_LIMIT } from "../../../constants";

const PostJob = () => {
  const [postsToday, setPostsToday] = useState(() => {
    const storedPostsToday = localStorage.getItem("postsToday");
    return storedPostsToday ? parseInt(storedPostsToday, 10) : 0;
  });
  console.log("Posts today:", postsToday);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formReset, setFormReset] = useState(null);

  const onSubmit = async (data) => {
    if (postsToday >= DAILY_POST_LIMIT) {
      toast.error(
        `You have reached the limit of ${DAILY_POST_LIMIT} job posts today.`,
      );
      return;
    }

    setIsSubmitting(true);

    const formatted = {
      ...data,
      expireOn: new Date(`${data.deadline}T00:00:00Z`)
        .toISOString()
        .replace("Z", "+00:00"),
      numberOfOpenings: Number(data.numberOfOpenings || 1),
      requirements: (data.requirements || "")
        .split(/[\n.]+/)
        .map((s) => s.trim())
        .filter(Boolean),
      tags: (data.tags || "")
        .split(/[\n,]+/)
        .map((s) => s.trim())
        .filter(Boolean),
      languages: (data.languages || "")
        .split(/[\n,]+/)
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
    console.log(postsToday);
    console.log("Submitted job data:", formatted);

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

  const decrementPostsCount = () => {
    setPostsToday((prev) => {
      const updatedPostsToday = Math.max(prev - 1, 0);
      localStorage.setItem("postsToday", updatedPostsToday);
      return updatedPostsToday;
    });
  };

  return (
    <>
      <div className={styles.noContentWrapperStyles}>
        <div className={styles.settingsWrapper}>
          <JobForm
            onSubmit={onSubmit}
            isSubmitting={isSubmitting}
            setFormReset={setFormReset}
            onDeleteSuccess={decrementPostsCount}
          />
        </div>
      </div>
    </>
  );
};

export default PostJob;
