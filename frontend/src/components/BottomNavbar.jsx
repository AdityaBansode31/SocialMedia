// import React from "react";
import { FaHome, FaSearch, FaPlus, FaVideo, FaUser } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "../scss/BottomNavbar.scss";

const BottomNavbar = () => {
  const navigate = useNavigate();

  return (
    <div className="bottom-navbar">
      <ul>
        <li><FaHome onClick={() => navigate("/posts")} /></li>
        <li><FaSearch onClick={() => navigate("/search")} /></li>
        <li><FaPlus onClick={() => navigate("/create")} /></li>
        <li><FaVideo onClick={() => navigate("/reels")} /></li>
        <li><FaUser onClick={() => navigate("/profile")} /></li>
      </ul>
    </div>
  );
};

export default BottomNavbar;
