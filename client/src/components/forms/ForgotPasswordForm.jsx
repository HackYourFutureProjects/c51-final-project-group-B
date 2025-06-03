import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { toast } from "sonner";

import { asyncHandler } from "../../util/asyncHandler.js";
import css from "./form.module.css";

const ForgotPasswordForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const requestPasswordReset = async (data) => {
    const res = await fetch("/api/auth/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: data.email }),
    });

    if (!res.ok) throw new Error("Failed to send password reset email.");

    toast.success("Password reset email sent.");
  };

  const onSubmit = asyncHandler(requestPasswordReset);

  return (
    <div className={css.container}>
      <form className={css.form} onSubmit={handleSubmit(onSubmit)}>
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

        <button className={css.submit} type="submit">
          Send Reset Link
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
