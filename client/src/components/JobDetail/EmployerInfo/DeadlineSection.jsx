import PropTypes from "prop-types";
import { MdAccessTime } from "react-icons/md";
import AccordionSection from "./AccordionSection";

/**
 * DeadlineSection displays the job application deadline inside
 * an accordion section with an access time icon.
 *
 * It formats the ISO date string to a human-readable format,
 * or shows a fallback message if no deadline is specified.
 *
 * Props:
 * - expireOn: ISO date string representing the deadline.
 * - styles: CSS module styles object for styling.
 */
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
