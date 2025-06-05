import { useState } from "react";
import PropTypes from "prop-types";

import { MdVisibility, MdVisibilityOff } from "react-icons/md";

import css from "./form.module.css";

const ToggleVisibility = ({
  placeholder,
  inputId,
  register,
  errors,
  validation,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className={css.passwordInput}>
      <input
        id={inputId}
        type={showPassword ? "text" : "password"}
        placeholder={placeholder}
        className={`${css.input} ${errors?.[inputId] ? css.inputError : ""}`}
        {...register(inputId, validation)}
      />
      <button
        type="button"
        className={css.eyeIcon}
        onClick={() => setShowPassword((prev) => !prev)}
      >
        {showPassword ? (
          <MdVisibilityOff size={22} color="var(--primary-color)" />
        ) : (
          <MdVisibility size={22} color="var(--primary-color)" />
        )}
      </button>
    </div>
  );
};

ToggleVisibility.propTypes = {
  placeholder: PropTypes.string.isRequired,
  inputId: PropTypes.string.isRequired,
  register: PropTypes.func.isRequired,
  errors: PropTypes.object,
  validation: PropTypes.object,
};

export default ToggleVisibility;
