import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";

import ToggleVisibility from "./ToggleVisibility";
import css from "./form.module.css";
import Loader from "../../components/templates/Loader";

import usePersistedForm from "../../hooks/usePersistedForm";
import { apiRequest } from "../../util/apiRequest";

const SignupForm = () => {
  const [userType, setUserType] = useState(() => {
    return localStorage.getItem("userType") || "seeker";
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    reset,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm({});

  /** Save and load form data from localStorage, excluding passwords */
  usePersistedForm(watch, reset, "signupForm", ["password", "confirmPassword"]);

  useEffect(() => {
    localStorage.setItem("userType", userType);
  }, [userType]);

  const onSubmit = async (data) => {
    delete data.confirmPassword;
    if (userType === "company") {
      delete data.firstName;
      delete data.lastName;
    } else {
      delete data.companyName;
    }
    const fullData = { ...data, userType };

    apiRequest({
      url: "/api/users/register",
      body: fullData,
      setLoading,
      successMessage:
        "Registration successful. Verification email has been sent.",
      onSuccess: () => {
        localStorage.removeItem("signForm");
        navigate("/signin");
        reset();
      },
    });
  };

  return (
    <div className={css.container}>
      <form
        key={userType}
        className={css.form}
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className={css.userTypeSelector}>
          <button
            type="button"
            className={`${css.btn} ${userType === "seeker" ? css.active : ""}`}
            onClick={() => setUserType("seeker")}
          >
            Job Seeker
          </button>
          <button
            type="button"
            className={`${css.btn} ${userType === "company" ? css.active : ""}`}
            onClick={() => setUserType("company")}
          >
            Company
          </button>
        </div>

        <h2 className={css.title}>Create Account</h2>

        {userType === "company" ? (
          <div className={css.inputGroup}>
            <input
              id="companyName"
              placeholder="Company Name"
              className={`${css.input} ${
                errors.companyName ? css.inputError : ""
              }`}
              {...register("companyName", {
                required: "Company name is required",
                minLength: {
                  value: 3,
                  message: "Company name must be at least 3 characters",
                },
              })}
            />
            {errors.companyName && (
              <p className={css.error}>{errors.companyName.message}</p>
            )}
          </div>
        ) : (
          <div className={css.nameRow}>
            <div className={css.inputGroup}>
              <input
                id="firstName"
                placeholder="First Name"
                className={`${css.input} ${
                  errors.firstName ? css.inputError : ""
                }`}
                {...register("firstName", {
                  required: "First name is required",
                })}
              />
              {errors.firstName && (
                <p className={css.error}>{errors.firstName.message}</p>
              )}
            </div>
            <div className={css.inputGroup}>
              <input
                id="lastName"
                placeholder="Last Name"
                className={`${css.input} ${
                  errors.lastName ? css.inputError : ""
                }`}
                {...register("lastName", {
                  required: "Last name is required",
                })}
              />
              {errors.lastName && (
                <p className={css.error}>{errors.lastName.message}</p>
              )}
            </div>
          </div>
        )}

        <div className={css.inputGroup}>
          <input
            id="email"
            type="email"
            placeholder="Email"
            className={`${css.input} ${errors.email ? css.inputError : ""}`}
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Please enter a valid email address",
              },
            })}
          />
          {errors.email && <p className={css.error}>{errors.email.message}</p>}
        </div>

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
          {loading ? <Loader /> : "Create Account"}
        </button>

        <div className={css.linkContainer}>
          <p className={css.linkText}>
            Already have an account?{" "}
            <Link to="/signin" className={css.link}>
              Sign in
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default SignupForm;
