import { MdBuild, MdLanguage } from "react-icons/md";
import PropTypes from "prop-types";

import styles from "./tag-section.module.css";

/* 
  The TagSection component is a general purpose component
  that can be used for skills, language, and other sections
  with a similar structure.
*/
const TagSection = ({ tags, type }) => {
  const title = type === "skills" ? "Skills" : "Languages";
  const icon = type === "skills" ? <MdBuild /> : <MdLanguage />;

  return (
    <>
      <div className={styles.sectionHeader}>
        <div className={styles.sectionIcon}>{icon}</div>
        <h2 className={styles.sectionTitle}>{title}</h2>
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
