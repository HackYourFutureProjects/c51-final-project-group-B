import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

import useFetch from "../../hooks/useFetch";
import Loader from "../templates/Loader";

const VerifyUser = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const { isLoading, error, performFetch, cancelFetch } = useFetch(
    `/auth/verify-email/${token}`,
    () => {
      toast.success("Email verified successfully.", {
        style: {
          backgroundColor: "var(--success-color)",
          color: "#fff",
          border: "1px solid transparent",
        },
      });
    },
  );

  useEffect(() => {
    performFetch();
    return cancelFetch;
  }, []);

  useEffect(() => {
    if (!isLoading) {
      if (error) {
        toast.error("Email verification failed.", {
          style: {
            backgroundColor: "var(--error-color)",
            color: "#fff",
            border: "1px solid transparent",
          },
        });
        return navigate("/signin");
      }
      navigate("/signin");
    }
  }, [isLoading, error, navigate]);

  if (isLoading) return <Loader />;
  return null;
};

export default VerifyUser;
