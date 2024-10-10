import React, { useContext, useState, useEffect } from "react";
import "./Navbar.css";
import { assets } from "../../assets/assets";
import { Link, useNavigate } from "react-router-dom";
import { StoreContext } from "../../context/StoreContext";

const Navbar = ({ setShowLogin }) => {
  const [menu, setMenu] = useState("home");
  const { getTotalCartAmount, token, setToken } = useContext(StoreContext);
  const [searchVisible, setSearchVisible] = useState(false); // For toggling the search bar visibility
  const [searchTerm, setSearchTerm] = useState(""); // For managing the search input
  const [cartAmount, setCartAmount] = useState(getTotalCartAmount()); // Local state for cart amount
  const navigate = useNavigate();

  useEffect(() => {
    // Update local state whenever the cart amount changes
    setCartAmount(getTotalCartAmount());
  }, [getTotalCartAmount]);

  const logout = () => {
    localStorage.removeItem("token");
    setToken("");
    navigate("/");
  };

  const handleScroll = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Trigger search action when pressing the search icon
  const handleSearch = () => {
    if (searchTerm) {
      navigate(`/search?query=${searchTerm}`);
    }
  };

  return (
    <div className="navbar">
      <Link to="/">
        <img src={assets.logo} alt="logo" className="logo" />
      </Link>
      <ul className="navbar-menu">
        <Link
          to="/"
          onClick={() => setMenu("home")}
          className={menu === "home" ? "active" : ""}
        >
          Home
        </Link>
        <a
          href="#food-display"
          onClick={() => {
            setMenu("menu");
            handleScroll("food-display");
          }}
          className={menu === "menu" ? "active" : ""}
        >
          Menu
        </a>
        <a
          href="#app-download"
          onClick={() => {
            setMenu("mobile-app");
            handleScroll("app-download");
          }}
          className={menu === "mobile-app" ? "active" : ""}
        >
          Mobile App
        </a>
        <a
          href="#footer"
          onClick={() => {
            setMenu("contact-us");
            handleScroll("footer");
          }}
          className={menu === "contact-us" ? "active" : ""}
        >
          Contact Us
        </a>
      </ul>
      <div className="navbar-right">
        <div className="navbar-search">
          {/* Search input field */}
          {searchVisible && (
            <input
              type="text"
              className="search-input"
              placeholder="Search for food..."
              value={searchTerm}
              onChange={handleSearchChange}
              onKeyPress={(e) => e.key === "Enter" && handleSearch()} // Trigger search on Enter key
            />
          )}
          {/* Search icon */}
          <img
            src={assets.search_icon}
            alt="search icon"
            className="search-icon"
            onClick={() => setSearchVisible(!searchVisible)} // Toggle search bar visibility
          />
        </div>
        <div className="navbar-cart-icon">
          <Link to="/cart">
            <img src={assets.basket_icon} alt="basket icon" />
          </Link>
          <div className={cartAmount === 0 ? "" : "dot"}></div>
        </div>
        {!token ? (
          <button onClick={() => setShowLogin(true)}>Sign In</button>
        ) : (
          <div className="navbar-profile">
            <img src={assets.profile_icon} alt="" />
            <ul className="navbar-profile-dropdown">
              <li onClick={() => navigate("/myorders")}>
                <img src={assets.bag_icon} alt="" />
                <p>Orders</p>
              </li>
              <hr />
              <li onClick={logout}>
                <img src={assets.logout_icon} alt="" />
                <p>Logout</p>
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;