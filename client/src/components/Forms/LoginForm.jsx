// import React from 'react';
import css from "./formStyle.module.css";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";

const LoginForm = () => {
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const response = await fetch("api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Invalid email or password");
      }

      const result = await response.json();
      console.log("Login successful:", result);
      alert("Login successful!");
      reset();
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className={css.container}>
      <form className={css.form} onSubmit={handleSubmit(onSubmit)}>
        <h2 className={css.title}>Log In</h2>

        <input
          className={css.input}
          type="email"
          placeholder="Email"
          {...register("email", { required: "Email is required" })}
        />
        {errors.email && <p className={css.error}>{errors.email.message}</p>}

        <input
          className={css.input}
          type="password"
          placeholder="Password"
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

        <input className={css.submit} type="submit" value="Log In" />
        <p>
          don t have account?{" "}
          <Link className={css.link} to="/register">
            Sign up
          </Link>
        </p>
      </form>
    </div>
  );
};

export default LoginForm;
