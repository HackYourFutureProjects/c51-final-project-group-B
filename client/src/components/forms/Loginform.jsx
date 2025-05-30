import css from "./form-style.module.css";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../contexts/UserContext";
const LogInform = () => {
  const navigate = useNavigate();

  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm();

  // used the hook from UserContext to access the login function
  const { login } = useUser();

  const onSubmit = async (data) => {
    try {
      await login(data); // use context login
      alert("Login successful!");
      reset();
      navigate("/profile");
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
        <p className={css.title}>Forgot password ?</p>
        <p className={css.title}>
          don t have account?{" "}
          <Link className={css.link} to="/register">
            Sign up
          </Link>
        </p>
      </form>
    </div>
  );
};

export default LogInform;
