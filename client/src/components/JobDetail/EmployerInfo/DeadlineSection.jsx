import PropTypes from "prop-types";
import { MdAccessTime } from "react-icons/md";

const DeadlineSection = ({ expireOn, styles }) => {
  const formatDate = (isoDate) =>
    isoDate
      ? new Date(isoDate).toLocaleDateString(undefined, {
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      : "No deadline specified";

  return (
    <div className={styles.deadlineSection}>
      <MdAccessTime
        size={20}
        style={{ verticalAlign: "middle", marginRight: 8 }}
      />
      <span>{formatDate(expireOn)}</span>
    </div>
  );
};

DeadlineSection.propTypes = {
  expireOn: PropTypes.string,
  styles: PropTypes.object.isRequired,
};

export default DeadlineSection;
