import { useParams, Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { useForm } from "react-hook-form";
import css from "./form.module.css";
import ToggleVisibility from "./ToggleVisibility";

import { asyncHandler } from "../../util/asyncHandler.js";

const ResetPasswordForm = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const {
    register,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const resetPassword = async (data) => {
    const res = await fetch(`/api/auth/reset-password/${token}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        password: data.password,
        confirmPassword: data.confirmPassword,
      }),
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || "Password reset failed.");
    }

    toast.success("Password successfully reset.", { duration: 5000 });
    navigate("/signin");
  };

  const onSubmit = asyncHandler(resetPassword);

  return (
    <div className={css.container}>
      <form className={css.form} onSubmit={handleSubmit(onSubmit)}>
        <h2 className={css.title}>Reset Password</h2>

        <div className={css.inputGroup}>
          <ToggleVisibility
            placeholder="Enter password"
            inputId="password"
            register={register}
            errors={errors}
            validation={{
              required: "Password is required",
              minLength: {
                value: 8,
                message: "Password must be at least 8 characters",
              },
            }}
          />
          {errors.password && (
            <p className={css.error}>{errors.password.message}</p>
          )}
        </div>

        <div className={css.inputGroup}>
          <ToggleVisibility
            placeholder="Confirm password"
            inputId="confirmPassword"
            register={register}
            errors={errors}
            validation={{
              required: "Please confirm your password",
              validate: (value) =>
                value === watch("password") || "Passwords do not match",
            }}
          />
          {errors.confirmPassword && (
            <p className={css.error}>{errors.confirmPassword.message}</p>
          )}
        </div>

        <button className={css.submit} type="submit">
          Reset Password
        </button>

        <div className={css.linkContainer}>
          <p
            className={css.linkText}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span>
              Remember your password?{" "}
              <Link className={css.link} to="/signin">
                Login
              </Link>
            </span>
          </p>
        </div>
      </form>
    </div>
  );
};

export default ResetPasswordForm;
