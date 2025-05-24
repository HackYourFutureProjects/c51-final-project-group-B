import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import css from "./form-style.module.css";
import { Link } from "react-router-dom";

const Registerform = () => {
  const [userType, setUserType] = useState("seeker");

  const {
    register,
    reset,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    reset({
      companyName: "",
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
    });
  }, [userType, reset]);

  const onSubmit = async (data) => {
    delete data.confirmPassword;
    if (userType === "company") {
      delete data.firstName;
      delete data.lastName;
    } else {
      delete data.companyName;
    }
    const fullData = { ...data, userType };
    console.log("Form Data:", fullData);
    try {
      const response = await fetch("api/users/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(fullData),
      });

      if (!response.ok) {
        throw new Error(" Error, your registration was not successful!");
      }
      const result = await response.json();
      console.log(result);
      alert("Registration successful!");
      reset();
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className={css.container}>
      <form
        key={userType}
        className={css.form}
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className={css["user-type-selector"]}>
          <button
            className={`${css.btn} ${userType === "company" ? css.active : ""}`}
            type="button"
            onClick={() => setUserType("company")}
          >
            Company
          </button>
          <button
            className={`${css.btn} ${userType === "seeker" ? css.active : ""}`}
            type="button"
            onClick={() => setUserType("seeker")}
          >
            Seeker
          </button>
        </div>
        <h2 className={css.title}>Sign up</h2>

        {userType === "company" ? (
          <>
            <input
              placeholder="company name"
              className={css.input}
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
          </>
        ) : (
          <>
            <input
              placeholder="first Name"
              className={css.input}
              {...register("firstName", {
                required: "first name is required",
              })}
            />
            {errors.firstName && (
              <p className={css.error}>{errors.firstName.message}</p>
            )}

            <input
              placeholder="last Name"
              className={css.input}
              {...register("lastName", { required: "last name is required" })}
            />
            {errors.lastName && (
              <p className={css.error}>{errors.lastName.message}</p>
            )}
          </>
        )}

        <input
          className={css.input}
          type="email"
          placeholder="email"
          {...register("email", { required: "Email is required" })}
        />
        {errors.email && <p className={css.error}>{errors.email.message}</p>}

        <input
          className={css.input}
          type="password"
          placeholder="password"
          {...register("password", {
            required: "Password is required",
            minLength: {
              value: 8,
              message: "Password must be at least 8 characters",
            },
          })}
        />
        {errors.password && (
          <p className={css.error}>{errors.password.message}</p>
        )}

        <input
          className={css.input}
          type="password"
          placeholder="confirm password"
          {...register("confirmPassword", {
            required: "Please confirm your password",
            validate: (value) =>
              value === watch("password") || "Confirm password",
          })}
        />
        {errors.confirmPassword && (
          <p className={css.error}>{errors.confirmPassword.message}</p>
        )}

        <input type="submit" value="Sign Up" />
        <p>
          already have account?{" "}
          <Link className={css.link} to="/login">
            Log in
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Registerform;
