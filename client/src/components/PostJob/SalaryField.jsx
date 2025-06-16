import InputField from "./InputField";
import PropTypes from "prop-types";

const normalizeValue = (val) =>
  String(val ?? "")
    .trim()
    .toUpperCase();

const SalaryField = ({ register, errors, isSubmitting }) => (
  <div className="twoColumn">
    <InputField
      id="salaryMin"
      label="Salary Min"
      placeholder="30000"
      register={register}
      rules={{
        validate: (val) => {
          if (!val || normalizeValue(val) === "NA") return true;
          const num = Number(val);
          return !isNaN(num) && num > 0
            ? true
            : "Must be a positive number or 'NA'";
        },
      }}
      error={errors.salaryMin}
      disabled={isSubmitting}
    />
    <InputField
      id="salaryMax"
      label="Salary Max"
      placeholder="60000"
      register={register}
      rules={{
        validate: (val) => {
          if (!val || normalizeValue(val) === "NA") return true;
          const num = Number(val);
          return !isNaN(num) && num > 0
            ? true
            : "Must be a positive number or 'NA'";
        },
      }}
      error={errors.salaryMax}
      disabled={isSubmitting}
    />
  </div>
);
SalaryField.propTypes = {
  register: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired,
  isSubmitting: PropTypes.bool,
};

export default SalaryField;
