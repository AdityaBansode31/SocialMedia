
import { useNavigate, useLocation } from "react-router-dom";
import { FaHome, FaSearch, FaCompass, FaVideo, FaEnvelope, FaBell, FaPlus, FaUser } from "react-icons/fa";
import "../scss/Sidebar.scss"; // SCSS styles

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation(); // To highlight active route

  const menuItems = [
    { name: "Home", icon: <FaHome />, path: "/posts" }, // Default home page
    { name: "Search", icon: <FaSearch />, path: "/search" },
    { name: "Explore", icon: <FaCompass />, path: "/explore" },
    { name: "Reels", icon: <FaVideo />, path: "/reels" },
    { name: "Messages", icon: <FaEnvelope />, path: "/messages" },
    { name: "Notifications", icon: <FaBell />, path: "/notifications" },
    { name: "Create", icon: <FaPlus />, path: "/create" },
    { name: "Profile", icon: <FaUser />, path: "/profile" },
  ];

  return (
    <div className="sidebar">
      <h2>CreatO</h2>
      <ul>
        {menuItems.map((item) => (
          <li
            key={item.name}
            onClick={() => navigate(item.path)}
            className={location.pathname === item.path ? "active" : ""}
          >
            {item.icon} {item.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
