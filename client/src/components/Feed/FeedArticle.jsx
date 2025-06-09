import ReactMarkdown from "react-markdown";
import styles from "./feed-sections.module.css";
import PropTypes from "prop-types";

const FeedArticle = ({ feed }) => (
  <article className={styles.feedArticle}>
    <div className={styles.tags}>
      {feed.tags &&
        feed.tags.map((tag) => (
          <span key={tag} className={styles.tag}>
            {tag}
          </span>
        ))}
    </div>
    <div className={styles.content}>
      <ReactMarkdown>{feed.content}</ReactMarkdown>
    </div>

    {feed.media && feed.media.length > 0 && (
      <div className={styles.media}>
        {feed.media.map((url) => (
          <img key={url} src={url} alt="media" className={styles.mediaImg} />
        ))}
      </div>
    )}
  </article>
);

FeedArticle.propTypes = {
  feed: PropTypes.shape({
    tags: PropTypes.arrayOf(PropTypes.string),
    content: PropTypes.string.isRequired,
    media: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
};

export default FeedArticle;
