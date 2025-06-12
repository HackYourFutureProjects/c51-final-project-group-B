import PropTypes from "prop-types";

const ApplyButton = ({ styles, onClick }) => (
  <div className={styles.applyButtonWrapper}>
    <button className={styles.applyButton} onClick={onClick}>
      Apply Now
    </button>
  </div>
);

ApplyButton.propTypes = {
  styles: PropTypes.object.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default ApplyButton;
