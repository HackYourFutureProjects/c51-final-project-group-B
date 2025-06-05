// import { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import toast, { Toaster } from "react-hot-toast";
// import styles from "../../components/UserPersonalProfile/Company/postJobSection.module.css";
// import useFetch from "../../hooks/useFetch";

// const DeleteJob = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const [jobTitle, setJobTitle] = useState("");
//   const [isDeleting, setIsDeleting] = useState(false);

//   // Destructure loading and error states from useFetch
//   const { isLoading, error, performFetch, cancelFetch } = useFetch(
//     `/jobs/${id}`,
//     (data) => {
//       setJobTitle(data.data.title || "");
//     },
//   );

//   useEffect(() => {
//     performFetch();
//     return () => cancelFetch();
//   }, [id]);

//   const handleDelete = async () => {
//     if (
//       !window.confirm(`Are you sure you want to delete the job "${jobTitle}"?`)
//     ) {
//       return;
//     }

//     setIsDeleting(true);

//     try {
//       const response = await fetch(`/api/jobs/${id}`, {
//         method: "DELETE",
//       });
//       if (!response.ok) throw new Error("Failed to delete job");
//       toast.success("Job deleted successfully");
//       setTimeout(() => {
//         navigate("/jobs");
//       }, 1500);
//     } catch (error) {
//       toast.error(error.message);
//     } finally {
//       setIsDeleting(false);
//     }
//   };

//   if (isLoading) return <p className={styles.loading}>Loading...</p>;
//   if (error) return <p className={styles.error}>Error: {error}</p>;

//   return (
//     <>
//       <Toaster position="top-center" />
//       <div className={styles.container}>
//         <h1>Delete Job</h1>
//         <p>Are you sure you want to delete the job titled:</p>
//         <h2 className={styles.jobTitle}>{jobTitle}</h2>
//         <button
//           onClick={handleDelete}
//           disabled={isDeleting}
//           className={styles.deleteButton}
//         >
//           {isDeleting ? "Deleting..." : "Delete Job"}
//         </button>
//       </div>
//     </>
//   );
// };

// export default DeleteJob;
