import PropTypes from "prop-types";
import { MdAccessTime } from "react-icons/md";
import AccordionSection from "./AccordionSection";

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
    <AccordionSection icon={MdAccessTime} title="Deadline" styles={styles}>
      <p>{formatDate(expireOn)}</p>
    </AccordionSection>
  );
};

DeadlineSection.propTypes = {
  expireOn: PropTypes.string,
  styles: PropTypes.object.isRequired,
};

export default DeadlineSection;
