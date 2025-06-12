import { useState, useEffect } from "react";
import { useUser } from "../../contexts/UserContext";
import useFetch from "../../hooks/useFetch";
import FeedList from "../../components/Feed/FeedList";
import FeedArticles from "../../components/Feed/FeedArticles";
import Pagination from "../../components/FindJobs/Pagination";
import Loader from "../../components/templates/Loader";
import FeedSearchBar from "../../components/Feed/FeedSearch";
import styles from "./feed.module.css";

const Feed = () => {
  const { user, loading: userLoading } = useUser();
  const [feeds, setFeeds] = useState([]);
  const [page, setPage] = useState(1);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [search, setSearch] = useState("");

  const FEED_LIMIT = 4;

  // Choose endpoint based on user auth
  const endpoint =
    user && (user.userType === "seeker" || user.userType === "company")
      ? "/feed"
      : "/feed/public";

  // Fetch feeds
  const { isLoading, error, performFetch } = useFetch(
    endpoint,
    (jsonResult) => {
      setFeeds(jsonResult.data || []);
      setSelectedIndex(0);
    },
  );

  useEffect(() => {
    if (userLoading) return;
    let url = `${endpoint}?page=${page}&limit=${FEED_LIMIT}`;
    if (search) url += `&search=${encodeURIComponent(search)}`;
    performFetch({
      method: "GET",
      headers: { "content-type": "application/json" },
      routeOverride: url,
    });
  }, [endpoint, page, userLoading, search]);

  const handleCardClick = (idx) => setSelectedIndex(idx);

  const noFeeds = !isLoading && feeds.length === 0;

  return (
    <div className={styles.feedContainer}>
      <aside className={styles.feedSidebar}>
        <FeedSearchBar
          onSearch={(q) => {
            setSearch(q);
            setPage(1);
          }}
        />
        <FeedList
          feeds={feeds}
          selectedIndex={selectedIndex}
          onCardClick={handleCardClick}
        />
        <Pagination
          page={page}
          jobs={feeds}
          limit={FEED_LIMIT}
          onPageChange={(newPage) => {
            setPage(newPage);
            setSelectedIndex(0);
          }}
        />
      </aside>
      <main className={styles.feedMain}>
        {error && <div className={styles.feedError}>Error: {error}</div>}
        {noFeeds && <div className={styles.feedEmpty}>No articles found.</div>}
        <FeedArticles feed={feeds[selectedIndex]} />
        {isLoading && <Loader />}
      </main>
    </div>
  );
};

export default Feed;
