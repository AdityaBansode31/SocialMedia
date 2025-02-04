import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import {jwtDecode} from "jwt-decode";
import API from "../services/api";
import { AuthContext } from "../context/AuthContext";
import Sidebar from "./Sidebar";
import BottomNavbar from "./BottomNavbar";
import Header from "./Header";
import "../scss/PostsPage.scss";

const PostsPage = () => {
  const { user, logout } = useContext(AuthContext);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const navigate = useNavigate();

  const BASE_URL = "http://localhost:5261"

 // Update your JWT decoding logic
const decodedToken = user?.token ? jwtDecode(user.token) : null;
const currentUserId = decodedToken?.['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'];
const username = decodedToken?.['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'];
const UserEmail = decodedToken?.['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'];
const UserRole = decodedToken?.['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (!user?.token) {
      alert("Session expired. Please log in again.");
      logout();
      navigate("/login");
      return;
    }

    const fetchPosts = async () => {
      try {
        const response = await API.get("/Post/GetPosts", {
          headers: { Authorization: `Bearer ${user.token}` },
        });

        if (response.data.isSuccess) {
          // Filter only approved posts
          const approvedPosts = response.data.result.filter(
            post => post.approvalStatus === "Approved"
          );
          setPosts(approvedPosts);
        } else {
          alert("Failed to fetch posts: " + response.data.message);
        }
      } catch (err) {
        alert(err.response?.data?.message || "Error fetching posts");
        logout();
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [user, logout, navigate]);

  if (loading) {
    return <p>Loading posts...</p>;
  }

  return (
    <div className="container">
      {isMobile && <Header />}

      <Sidebar />

      <div className="content">
        <div className="posts-section">
          {posts.length > 0 ? (
            posts.map((post) => (
              <div key={post.postId} className="post-card">
                <div className="post-header">
                  <img 
                    src="/default-avatar.png" 
                    alt="User" 
                    className="user-avatar"
                  />
                  <div className="post-user-info">
                    <p className="username">{username}</p>
                    <p className="post-title">{post.title}</p>
                  </div>
                </div>
                {post.imageUrl && (
                  <img 
                    src={
                  post.imageUrl
                    ? `${BASE_URL}${post.imageUrl}`
                    : "placeholder-image-url" }
                    alt="Post" 
                    className="post-image" 
                  />
                )}
                <div className="post-content">
                  <p>{post.content}</p>
                </div>
                <div className="post-actions">
                  <span>❤️ {post.likes || 0} Likes</span>
                  <span>💬 {post.comments || 0} Comments</span>
                </div>
                <div className="post-meta">
                  <p>Posted on: {new Date(post.createdDate).toLocaleDateString()}</p>
                </div>
              </div>
            ))
          ) : (
            <p>No approved posts available.</p>
          )}
        </div>

        <div className="suggested-users">
          <h2>Suggested for You</h2>
          <ul>
            <li>
              <img 
                src="/default-avatar.png" 
                alt="User" 
                className="user-avatar"
              />
              <p>Example User</p>
              <button>Follow</button>
            </li>
          </ul>
        </div>
      </div>

      {isMobile && <BottomNavbar />}
    </div>
  );
};

export default PostsPage;