import { useForm } from "react-hook-form";
import { useState } from "react";
import { Link } from "react-router-dom";

import { apiRequest } from "../../util/apiRequest";
import Loader from "../templates/Loader";
import css from "./form.module.css";
import usePersistedForm from "../../hooks/usePersistedForm";

const ForgotPasswordForm = () => {
  const [loading, setLoading] = useState(false);

  const {
    register,
    watch,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm();

  usePersistedForm(watch, reset, "requestForm");

  const requestPasswordReset = (data) => {
    apiRequest({
      url: "/api/auth/forgot-password",
      body: { email: data.email },
      setLoading,
      successMessage: "If the email exists, password reset email is sent.",
      onSuccess: () => {
        localStorage.removeItem("requestForm");
      },
    });
  };

  return (
    <div className={css.container}>
      <form className={css.form} onSubmit={handleSubmit(requestPasswordReset)}>
        <h2 className={css.title}>Forgot Password</h2>

        <div className={css.inputGroup}>
          <input
            className={`${css.input} ${errors.email ? css.inputError : ""}`}
            type="email"
            placeholder="Enter your email"
            {...register("email", { required: "Email is required" })}
          />
          {errors.email && <p className={css.error}>{errors.email.message}</p>}
        </div>

        <button type="submit" className={css.submit} disabled={loading}>
          {loading ? <Loader /> : "Send Reset Link"}
        </button>
        <div className={css.linkContainer}>
          <p
            className={css.linkText}
            style={{ textAlign: "center", marginTop: "1rem" }}
          >
            Remember your password?{" "}
            <Link className={css.link} to="/signin">
              Log in
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default ForgotPasswordForm;
