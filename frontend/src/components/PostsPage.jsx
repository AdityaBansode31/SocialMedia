import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import { AuthContext } from "../context/AuthContext";

const PostsPage = () => {
  const { user, logout } = useContext(AuthContext);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await API.get("/posts/get-posts");
        setPosts(response.data);
      } catch (err) {
        console.error("Error fetching posts:", err);
        alert(
          err.response?.data?.message || "Session expired. Please log in again."
        );
        logout();
        navigate("/login"); // Redirect to the login page
      } finally {
        setLoading(false); // Ensure loading state is stopped
      }
    };
    fetchPosts();
  }, [logout, navigate]);

  if (loading) {
    return <p>Loading posts...</p>; // Optional loading indicator
  }

  return (
    <div>
      <h1>Posts Page ({user?.role})</h1>
      {posts.length > 0 ? (
        <ul>
          {posts.map((post) => (
            <li key={post.id}>{post.title}</li>
          ))}
        </ul>
      ) : (
        <p>No posts available.</p>
      )}
    </div>
  );
};

export default PostsPage;
