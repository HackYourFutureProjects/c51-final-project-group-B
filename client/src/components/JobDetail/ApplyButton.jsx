import proptypes from "prop-types";

const ApplyButton = ({ styles, onClick }) => (
  <div>
    <button className={styles.applyButton} onClick={onClick}>
      Apply Now
    </button>
  </div>
);

ApplyButton.propTypes = {
  styles: proptypes.object.isRequired,
  onClick: proptypes.func.isRequired,
};

export default ApplyButton;
// This component renders an "Apply Now" button with styles passed as props.
// It uses prop-types to enforce that the styles prop is an object.
