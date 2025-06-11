import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import JobForm from "../../components/PostJob/JobForm";
import styles from "../../components/PostJob/postJobSection.module.css";
import useFetch from "../../hooks/useFetch";
import Loading from "../../components/templates/Loader";

const EditJob = () => {
  const { id } = useParams();
  const [defaultValues, setDefaultValues] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { isLoading, error, performFetch, cancelFetch } = useFetch(
    `/jobs/${id}`,
    (data) => {
      console.log("Fetched job data:", data);
      setDefaultValues({
        title: data.data.title || "",
        location: data.data.location || "",
        numberOfOpenings: data.data.numberOfOpenings || 1,
        type: data.data.type || "",
        languages: Array.isArray(data.data.languages)
          ? data.data.languages.join(", ")
          : "",
        salaryMin: data.data.salaryMin || "",
        salaryMax: data.data.salaryMax || "",
        tags: Array.isArray(data.data.tags) ? data.data.tags.join(", ") : "",
        limit: data.data.limit || 1,
        description: data.data.description || "",
        requirements: Array.isArray(data.data.requirements)
          ? data.data.requirements.join(", ")
          : "",
        deadline: data.data.expireOn?.slice(0, 10) || "",
      });
    },
  );

  useEffect(() => {
    performFetch();
    return () => cancelFetch();
  }, [id]);
  const handleEditSubmit = async (formData) => {
    setIsSubmitting(true);

    const payload = {
      ...formData,
      tags: formData.tags.split(",").map((tag) => tag.trim()),
      requirements: formData.requirements.split(",").map((req) => req.trim()),
      languages: formData.languages.split(",").map((lang) => lang.trim()),
      salaryMin: Number(formData.salaryMin),
      salaryMax: Number(formData.salaryMax),
      numberOfOpenings: Number(formData.numberOfOpenings),
      limit: Number(formData.limit),
    };

    console.log("Submitting payload:", payload);

    try {
      const response = await fetch(`/api/jobs/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error("Failed to update job");
      toast.success("Job updated successfully");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) return <Loading />;
  if (error) return <p className={styles.error}>Error: {error}</p>;
  if (!defaultValues) return null;

  return (
    <>
      <Toaster position="top-center" />
      <div className={styles.container}>
        <JobForm
          isEditMode
          isSubmitting={isSubmitting}
          onSubmit={handleEditSubmit}
          defaultValues={defaultValues}
        />
      </div>
    </>
  );
};

export default EditJob;
