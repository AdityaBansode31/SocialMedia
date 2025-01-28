import { useState } from "react";
import API from "../services/api";

const RegistrationForm = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    imageUrl: null, // Provide as null
    role: null
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const multipartFormData = new FormData();
    multipartFormData.append("UserName", formData.username);
    multipartFormData.append("Email", formData.email);
    multipartFormData.append("PasswordHash", formData.password); 
  
    // Validate form fields before sending the request
    if (!formData.username || !formData.email || !formData.password) {
      alert("All fields are required!");
      return;
    }
  
    try {
      const response = await API.post("/User/addUser", multipartFormData,{
        headers: {
                    "Content-Type": "multipart/form-data",
                },
    });
  
      if (response.status === 200) {
        console.log("User registered successfully:", response.data);
        // Redirect or handle success logic here
      }
    } catch (error) {
      console.error("Error:", error.response || error);
      if (error.response?.status === 400) {
        alert("Invalid input: Please check your form data.");
      }
    }
  };


  return (
    <form onSubmit={handleSubmit}>
      <input name="username" placeholder="Username" onChange={handleChange} />
      <input name="email" placeholder="Email" onChange={handleChange} />
      <input
        name="password"
        type="password"
        placeholder="Password"
        onChange={handleChange}
      />
      <button type="submit">Register</button>
    </form>
  );
};  

export default RegistrationForm;
