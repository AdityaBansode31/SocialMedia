// import { useState, useContext } from "react";
// import API from "../services/api";
// import { AuthContext } from "../context/AuthContext";

// const LoginForm = () => {
//   const { login } = useContext(AuthContext);
//   const [formData, setFormData] = useState({ email: "", password: "" });

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault(); 
//     const multipartFormData = new FormData();
//     multipartFormData.append("Email", formData.email);
//     multipartFormData.append("PasswordHash", formData.password); // Assuming backend expects "PasswordHash"

//     try {
//       const response = await API.post("/User/login", multipartFormData, {
//         headers: {
//           "Content-Type": "multipart/form-data",
//         },
//       });
//       login(response.data.result); // Save user data and navigate to posts page
//     } catch (err) {
//       console.error(err.response.data.message);
//       alert("Login failed.");
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit}>
//       <input name="email" placeholder="Email" onChange={handleChange} />
//       <input
//         name="password"
//         type="password"
//         placeholder="Password"
//         onChange={handleChange}
//       />
//       <button type="submit">Login</button>
//     </form>
//   );
// };

// export default LoginForm;

import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import API from "../services/api";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    
    try {
      // Create FormData object
      const formData = new FormData();
      formData.append("email", email);
      formData.append("PasswordHash", password);

      // Send FormData to the API
      const response = await API.post("/User/login", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.data.isSuccess) {
        const { token, result } = response.data;

        // Save token & user info in AuthContext and localStorage
        login({
          token,
          userId: result.userId,
          userName: result.userName,
          email: result.email,
          role: result.role,
        });

        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(result));

        // Redirect to posts page after successful login
        navigate("/posts");
      } else {
        alert("Login failed: " + response.data.message);
      }
    } catch (err) {
      alert("Login error: " + (err.response?.data?.message || "Try again later."));
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <h2>Login</h2>
      <input
        type="text"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button type="submit">Login</button>
    </form>
  );
};

export default LoginForm;
