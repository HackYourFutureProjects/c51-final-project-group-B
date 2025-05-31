import {
  MdBuild,
  MdLanguage,
  MdApartment,
  MdStar,
  MdAssignment,
} from "react-icons/md";
import PropTypes from "prop-types";

import styles from "./tag-section.module.css";

/* 
  The TagSection component is a general purpose component
  that can be used for skills, language, and other sections
  with a similar structure.
*/

const typeConfig = {
  skills: {
    title: "Skills",
    icon: <MdBuild />,
  },
  languages: {
    title: "Languages",
    icon: <MdLanguage />,
  },

  about: {
    title: "About Us",
    icon: <MdAssignment />,
  },
  branches: {
    title: "Branches",
    icon: <MdApartment />,
  },
  values: {
    title: "Values",
    icon: <MdStar />,
  },
};
const TagSection = ({ tags, type }) => {
  const config = typeConfig[type] || { title: "Values", icon: <MdBuild /> };

  return (
    <>
      <div className={styles.sectionHeader}>
        <div className={styles.sectionIcon}>{config.icon}</div>
        <h2 className={styles.sectionTitle}>{config.title}</h2>
      </div>
      <div className={styles.tagsGrid}>
        {tags?.map((tag, index) => (
          <div key={index} className="tag">
            {tag}
          </div>
        ))}
      </div>
    </>
  );
};

TagSection.propTypes = {
  type: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  icon: PropTypes.elementType,
  tags: PropTypes.array.isRequired,
};

export default TagSection;
