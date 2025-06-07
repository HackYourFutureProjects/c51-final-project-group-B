// This component was originally created to display a list of scrolling articles in the feed, but now switches to a single article view.
import FeedArticle from "./FeedArticle";
import styles from "./feed-sections.module.css";
import PropTypes from "prop-types";

const FeedArticles = ({ feed }) => (
  <div className={styles.feedArticles}>
    {feed && <FeedArticle feed={feed} />}
  </div>
);

FeedArticles.propTypes = {
  feed: PropTypes.shape({
    tags: PropTypes.arrayOf(PropTypes.string),
    content: PropTypes.string.isRequired,
    media: PropTypes.arrayOf(PropTypes.string),
  }),
};

export default FeedArticles;
