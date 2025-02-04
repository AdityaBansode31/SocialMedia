import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import { AuthContext } from "../context/AuthContext";
import "../scss/CreatePost.scss";

const CreatePost = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    
    if (!image || !user?.token) {
      setError("Please select an image and ensure you're logged in");
      return;
    }

    setLoading(true);
    
    try {
      const formData = new FormData();
      formData.append("Title", title);
      formData.append("Content", content);
      formData.append("ImageUrl", image);

      const response = await API.post("/Post/create", formData, {
        headers: {
          Authorization: `Bearer ${user.token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.isSuccess) {
        alert("Post created successfully!");
        navigate("/posts");
      } else {
        setError(response.data.message || "Failed to create post");
      }
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred while creating the post");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-post-container">
      <div className="create-post-card">
        <h2>Create New Post</h2>
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="upload-section">
            {preview ? (
              <img src={preview} alt="Preview" className="image-preview" />
            ) : (
              <label className="upload-label">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  required
                />
                <span>+ Upload Photo</span>
              </label>
            )}
          </div>

          <div className="form-group">
            <input
              type="text"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <textarea
              placeholder="Content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              rows="4"
            />
          </div>

          <button type="submit" disabled={loading}>
            {loading ? "Creating Post..." : "Create Post"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreatePost;