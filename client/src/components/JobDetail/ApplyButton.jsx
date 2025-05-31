import proptypes from "prop-types";

const ApplyButton = ({ styles }) => (
  <div>
    <button className={styles.applyButton}>Apply Now</button>
  </div>
);

ApplyButton.propTypes = {
  styles: proptypes.object.isRequired,
};

export default ApplyButton;
// This component renders an "Apply Now" button with styles passed as props.
// It uses prop-types to enforce that the styles prop is an object.
