import { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Pagination,
  Link,
} from "@mui/material";
import { useUser } from "../../contexts/UserContext";
import useFetch from "../../hooks/useFetch";
import Loader from "../../components/templates/Loader";

const ITEMS_PER_PAGE = 6;

const BlogCard = ({ blog }) => (
  <Card sx={{ maxWidth: 345, display: "flex", flexDirection: "column" }}>
    <Link
      href={blog.href || "#"}
      underline="none"
      color="inherit"
      target="_blank"
      rel="noopener noreferrer"
    >
      {blog.media?.[0] && (
        <CardMedia
          component="div"
          role="img"
          aria-label={blog.title}
          sx={{
            height: 180,
            backgroundImage: `url(${blog.media[0]})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            borderRadius: "4px 4px 0 0",
          }}
        />
      )}
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography variant="body2" color="text.secondary" fontWeight="600">
          by {blog.author || "Unknown"} • <small>{blog.date || ""}</small>
        </Typography>
        <Typography
          variant="h6"
          component="h2"
          gutterBottom
          sx={{ marginTop: 1 }}
        >
          {blog.title}
        </Typography>
        <Typography variant="body2" color="text.secondary" noWrap>
          {blog.content}
        </Typography>
        <Box sx={{ borderBottom: 1, borderColor: "divider", my: 2 }} />
        <Typography variant="caption" color="text.secondary">
          {blog.readTime || ""}
        </Typography>
      </CardContent>
    </Link>
  </Card>
);

const Feeds = () => {
  const { user, loading: userLoading } = useUser();
  const [feeds, setFeeds] = useState({ total: 0, items: [] });
  const [page, setPage] = useState(1);

  const { isLoading, error, performFetch } = useFetch("", (json) => {
    setFeeds(json.data || { total: 0, items: [] });
  });

  useEffect(() => {
    if (userLoading) return;

    const endpoint =
      user && (user.userType === "seeker" || user.userType === "company")
        ? "/feed"
        : "/feed/public";

    const url = `${endpoint}?page=${page}&limit=${ITEMS_PER_PAGE}`;
    performFetch({
      method: "GET",
      headers: { "Content-Type": "application/json" },
      routeOverride: url,
    });
  }, [user, page, userLoading]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [page]);

  const pageCount = Math.ceil((feeds.total || 0) / ITEMS_PER_PAGE);
  const blogs = feeds.items || [];

  const handlePageChange = (_, newPage) => {
    setPage(newPage);
  };

  if (isLoading) return <Loader />;
  if (error)
    return <Box sx={{ textAlign: "center", color: "red" }}>Error: {error}</Box>;
  if (blogs.length === 0)
    return <Box sx={{ textAlign: "center" }}>No articles found.</Box>;

  return (
    <Box sx={{ width: "100%", padding: 4 }}>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", md: "1fr 1fr 1fr" },
          gap: 4,
          mb: 4,
        }}
      >
        {blogs.map((blog) => (
          <BlogCard key={blog._id} blog={blog} />
        ))}
      </Box>

      <Box sx={{ display: "flex", justifyContent: "center" }}>
        <Pagination
          count={pageCount}
          page={page}
          onChange={handlePageChange}
          color="primary"
          shape="rounded"
          size="large"
        />
      </Box>
    </Box>
  );
};

export default Feeds;
