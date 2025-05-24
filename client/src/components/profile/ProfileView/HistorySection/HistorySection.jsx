import { MdSchool, MdWork } from "react-icons/md";
import PropTypes from "prop-types";

import { formatDate } from "../../../../util/dates.js";
import styles from "./history-section.module.css";

/* 
  The HistorySection component is a general purpose component
  that can be used for study, work experience, and other sections
  with a similar structure.
*/

const HistorySection = ({ type, title, icon, items }) => {
  const result = icon === "edu" ? <MdSchool /> : <MdWork />;

  return (
    <>
      <div className={styles.sectionHeader}>
        <div className={styles.sectionIcon}>{result}</div>
        <h2 className={styles.sectionTitle}>{title}</h2>
      </div>

      <div className={styles.historyList}>
        {items.map((item, index) => (
          <div key={`${type}-${index}`} className={styles.historyItem}>
            <div className={styles.itemHeader}>
              <h3 className={styles.itemTitle}>{item.title}</h3>
              <span className={styles.itemDates}>
                {formatDate(item.startDate)} - {formatDate(item.endDate)}
              </span>
            </div>

            {item.subtitle && (
              <p className={styles.itemSubtitle}>{item.subtitle}</p>
            )}

            <p className={styles.itemOrganization}>
              {item.organization}
              {item.location && (
                <span className={styles.itemLocation}> • {item.location}</span>
              )}
            </p>

            {item.description && (
              <ul className={styles.itemDescription}>
                {item.description.split("\n").map((point, i) => (
                  <li key={i}>{point}</li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </>
  );
};

HistorySection.propTypes = {
  type: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  icon: PropTypes.elementType,
  items: PropTypes.array.isRequired,
};

export default HistorySection;
