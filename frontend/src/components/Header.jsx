// import React from "react";
import { FaSearch, FaHeart } from "react-icons/fa";
import "../scss/Header.scss";

const Header = () => {
  return (
    <header className="header">
      <h2 className="logo">Instagram</h2>
      <div className="header-icons">
        <FaSearch />
        <FaHeart />
      </div>
    </header>
  );
};

export default Header;
