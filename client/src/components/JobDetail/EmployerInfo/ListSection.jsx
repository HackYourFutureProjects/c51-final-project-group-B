import PropTypes from "prop-types";
import { MdCheckCircle } from "react-icons/md";
import AccordionSection from "./AccordionSection";

const ListSection = ({ icon, title, items, styles }) => (
  <AccordionSection icon={icon} title={title} styles={styles}>
    <ul className={styles.requirementsList}>
      {items.map((item) => (
        <li key={item} className={styles.requirementItem}>
          <MdCheckCircle className={styles.requirementIcon} />
          {item}
        </li>
      ))}
    </ul>
  </AccordionSection>
);

ListSection.propTypes = {
  icon: PropTypes.elementType.isRequired,
  title: PropTypes.string.isRequired,
  items: PropTypes.arrayOf(PropTypes.string).isRequired,
  styles: PropTypes.object.isRequired,
};

export default ListSection;
