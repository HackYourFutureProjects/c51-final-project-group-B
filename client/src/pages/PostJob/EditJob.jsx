import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import JobForm from "../../components/PostJob/JobForm";
import styles from "../../components/PostJob/postJobSection.module.css";
import useFetch from "../../hooks/useFetch";
import Loading from "../../components/templates/Loader";

// Simple confirmation modal component
const ConfirmDeleteModal = ({
  jobTitle,
  onCancel,
  onConfirm,
  isProcessing,
}) => {
  return (
    <div className={styles.modalBackdrop}>
      <div className={styles.modalContent}>
        <h3>Delete Job</h3>
        <p>Are you sure you want to delete the job &quot;{jobTitle}&quot;?</p>
        <div>
          <button
            onClick={onCancel}
            disabled={isProcessing}
            className="btn btn-secondary"
            style={{ marginRight: "1rem" }}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isProcessing}
            className="btn btn-danger"
          >
            {isProcessing ? "Deleting..." : "Yes, Delete"}
          </button>
        </div>
      </div>
    </div>
  );
};

const EditJob = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [defaultValues, setDefaultValues] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  const { isLoading, error, performFetch, cancelFetch } = useFetch(
    `/jobs/${id}`,
    (data) => {
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
    }, // <-- Removed trailing comma here
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

    try {
      const response = await fetch(`/api/jobs/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      if (!response.ok || result.success === false) {
        throw new Error(result.msg || "Failed to update job");
      }

      toast.success("Job updated successfully");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete handler, called only when user confirms in modal
  const handleDeleteConfirmed = async () => {
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/jobs/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.msg || "Failed to delete job");
      }
      toast.success("Job deleted successfully");
      setShowConfirmDelete(false);
      setTimeout(() => navigate("/jobs"), 1500);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) return <Loading />;
  if (error) return <p className={styles.error}>Error: {error}</p>;
  if (!defaultValues) return null;

  return (
    <>
      <Toaster position="top-center" />
      <div className={styles.container}>
        <h1>Edit Vacancy</h1>

        <JobForm
          isEditMode
          isSubmitting={isSubmitting}
          onSubmit={handleEditSubmit}
          defaultValues={defaultValues}
        />

        <div style={{ marginTop: "2rem" }}>
          <button
            type="button"
            className="btn btn-danger"
            onClick={() => setShowConfirmDelete(true)}
          >
            Delete Job
          </button>
        </div>
      </div>

      {/* Confirmation modal */}
      {showConfirmDelete && (
        <ConfirmDeleteModal
          jobTitle={defaultValues.title}
          isProcessing={isDeleting}
          onCancel={() => setShowConfirmDelete(false)}
          onConfirm={handleDeleteConfirmed}
        />
      )}
    </>
  );
};

export default EditJob;
