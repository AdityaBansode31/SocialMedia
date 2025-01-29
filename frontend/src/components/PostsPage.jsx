import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import { AuthContext } from "../context/AuthContext";
import "../scss/PostsPage.scss"; // Import CSS styles

const PostsPage = () => {
  const { user, logout } = useContext(AuthContext);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Session expired. Please log in again.");
      logout();
      navigate("/login");
      return;
    }

    const fetchPosts = async () => {
      try {
        const response = await API.get("/Post/GetPosts", {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log("API Response:", response.data);
        setPosts(response.data.result);
      } catch (err) {
        console.error("Error fetching posts:", err);
        alert(
          err.response?.data?.message || "Session expired. Please log in again."
        );
        logout();
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [logout, navigate]);

  if (loading) {
    return <p>Loading posts...</p>;
  }

  return (
    <div className="container">
      {/* Left Sidebar */}
      <aside className="sidebar">
        <h2>Instagram</h2>
        <nav>
          <ul>
            <li>Home</li>
            <li>Search</li>
            <li>Explore</li>
            <li>Reels</li>
            <li>Messages</li>
            <li>Notifications</li>
            <li>Create</li>
            <li>Profile</li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="content">
        <h1>Posts Page ({user?.role})</h1>
        {posts.length > 0 ? (
          <ul>
            {posts.map((post) => (
              <li key={post.id} className="post">
                <h3>{post.title}</h3>
                <p>{post.description}</p>
                <img src={post.imageUrl} alt={post.title} />
                <span>{post.likes} likes</span>
              </li>
            ))}
          </ul>
        ) : (
          <p>No posts available.</p>
        )}
      </main>

      {/* Right Sidebar (Messages) */}
      <aside className="messages">
        <h2>Messages</h2>
        <ul>
          <li>mr_luffy_31</li>
          <li>nikhil_karwa</li>
          <li>akash_kendule_06</li>
          <li>jaggnathbansode</li>
          <li>nani_010101</li>
          <li>rohit.adam.g.t_7</li>
        </ul>
      </aside>
    </div>
  );
};

export default PostsPage;
