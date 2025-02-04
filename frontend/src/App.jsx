// import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import RegistrationForm from "./components/RegistrationForm";
import LoginForm from "./components/LoginForm";
import PostsPage from "./components/PostsPage";
import ProtectedRoute from "./components/ProtectedRoute";
import CreatePost from "./components/CreatePost";

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<RegistrationForm />} />
          <Route path="/login" element={<LoginForm />} />
          <Route
            path="/posts"
            element={
              <ProtectedRoute>
                <PostsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/create"
            element={
              <ProtectedRoute>
                <CreatePost />
              </ProtectedRoute>
            }     
          />
        </Routes>
      </AuthProvider>
    </Router>
  );
};

export default App;
