import FeedCard from "./FeedCard";
import styles from "./feed-sections.module.css";
import PropTypes from "prop-types";

const FeedList = ({ feeds, selectedIndex, onCardClick }) => (
  <div className={styles.feedList}>
    {feeds.map((feed, idx) => (
      <FeedCard
        key={feed._id}
        feed={feed}
        selected={idx === selectedIndex}
        onClick={() => onCardClick(idx)}
      />
    ))}
  </div>
);
FeedList.propTypes = {
  feeds: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      tags: PropTypes.arrayOf(PropTypes.string),
    }),
  ).isRequired,
  selectedIndex: PropTypes.number.isRequired,
  onCardClick: PropTypes.func.isRequired,
};
export default FeedList;
