import { useParams, Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useForm } from "react-hook-form";

import css from "./form.module.css";
import ToggleVisibility from "./ToggleVisibility";
import { apiRequest } from "../../util/apiRequest";
import Loader from "../templates/Loader";

const ResetPasswordForm = () => {
  const [loading, setLoading] = useState(false);
  const { token } = useParams();
  const navigate = useNavigate();

  const {
    register,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const resetPassword = (data) => {
    apiRequest({
      url: `/api/auth/reset-password/${token}`,
      body: {
        password: data.password,
        confirmPassword: data.confirmPassword,
      },
      setLoading,
      successMessage: "Password successfully reset.",
      onSuccess: () => navigate("/signin"),
    });
  };

  return (
    <div className={css.container}>
      <form className={css.form} onSubmit={handleSubmit(resetPassword)}>
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

        <button type="submit" className={css.submit} disabled={loading}>
          {loading ? <Loader /> : "Reset Password"}
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
