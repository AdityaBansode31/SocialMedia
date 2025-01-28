import { useState, useContext } from "react";
import API from "../services/api";
import { AuthContext } from "../context/AuthContext";

const LoginForm = () => {
  const { login } = useContext(AuthContext);
  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); 
    const multipartFormData = new FormData();
    multipartFormData.append("Email", formData.email);
    multipartFormData.append("PasswordHash", formData.password); // Assuming backend expects "PasswordHash"

    try {
      const response = await API.post("/User/login", multipartFormData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      login(response.data); // Save user data and navigate to posts page
    } catch (err) {
      console.error(err.response.data.message);
      alert("Login failed.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="email" placeholder="Email" onChange={handleChange} />
      <input
        name="password"
        type="password"
        placeholder="Password"
        onChange={handleChange}
      />
      <button type="submit">Login</button>
    </form>
  );
};

export default LoginForm;
