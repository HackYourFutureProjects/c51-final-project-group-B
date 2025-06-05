import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { useUser } from "../../contexts/UserContext";
import ToggleVisibility from "./ToggleVisibility";
import css from "./form.module.css";

const SigninForm = () => {
  const navigate = useNavigate();
  const { login } = useUser();

  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      await login(data);
      toast.success("Login successful!");
      reset();
      navigate("/profile");
    } catch (error) {
      toast.error(error.message || "Login failed.");
    }
  };

  return (
    <div className={css.container}>
      <form className={css.form} onSubmit={handleSubmit(onSubmit)}>
        <h2 className={css.title}>Log In</h2>

        <div className={css.inputGroup}>
          <input
            className={`${css.input} ${errors.email ? css.inputError : ""}`}
            type="email"
            placeholder="Email"
            {...register("email", { required: "Email is required" })}
          />
          {errors.email && <p className={css.error}>{errors.email.message}</p>}
        </div>

        <div className={css.inputGroup}>
          <ToggleVisibility
            placeholder="Enter password"
            inputId="password"
            register={register}
            errors={errors}
          />
          {errors.password && (
            <p className={css.error}>{errors.password.message}</p>
          )}
        </div>

        <input className={css.submit} type="submit" value="Log In" />

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
              Don’t have an account?{" "}
              <Link className={css.link} to="/signup">
                Sign up
              </Link>
            </span>
            <span>
              <Link className={css.link} to="/forgot-password">
                Forgot password?
              </Link>
            </span>
          </p>
        </div>
      </form>
    </div>
  );
};

export default SigninForm;
