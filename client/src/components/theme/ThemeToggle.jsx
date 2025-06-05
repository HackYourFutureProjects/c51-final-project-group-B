import { MdDarkMode, MdLightMode } from "react-icons/md";
import PropTypes from "prop-types";
import Switch from "react-switch";

const ThemeToggle = ({ checked, onChange }) => {
  const isDarkTheme = checked;

  const moonColor = "#005c99";
  const sunColor = "#FFD700";
  const onColor = "#EB6969";
  const offColor = isDarkTheme ? "#424242" : "#87CEEB";
  const handleColor = isDarkTheme ? "#fefefe" : "#ffffff";

  return (
    <Switch
      checked={checked}
      onChange={onChange}
      checkedIcon={
        <MdDarkMode
          color={moonColor}
          size={18}
          style={{ marginLeft: 4, marginTop: 2, fill: moonColor }}
        />
      }
      uncheckedIcon={
        <MdLightMode
          color={sunColor}
          size={18}
          style={{ marginLeft: 4, marginTop: 2, fill: sunColor }}
        />
      }
      onColor={onColor}
      offColor={offColor}
      onHandleColor={handleColor}
      offHandleColor={handleColor}
      height={22}
      width={46}
      handleDiameter={18}
    />
  );
};

ThemeToggle.propTypes = {
  checked: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
};
export default ThemeToggle;
