import styles from "./feed-sections.module.css";
import PropTypes from "prop-types";

const FeedCard = ({ feed, selected, onClick }) => (
  <div
    className={`${styles.feedCard} ${selected ? styles.selected : ""}`}
    onClick={onClick}
    role="button"
    aria-pressed={selected}
  >
    <div className={styles.title}>{feed.title}</div>
    <div className={styles.tags}>
      {feed.tags &&
        feed.tags.map((tag) => (
          <span key={tag} className={styles.tag}>
            {tag}
          </span>
        ))}
    </div>
  </div>
);
FeedCard.propTypes = {
  feed: PropTypes.shape({
    title: PropTypes.string.isRequired,
    tags: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
  selected: PropTypes.bool,
  onClick: PropTypes.func,
};
export default FeedCard;
