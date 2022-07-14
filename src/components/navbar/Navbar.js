import "./navbar.css";
import { Link, useLocation } from "react-router-dom";
import { useGlobalContext } from "../../context/Context";

const Navbar = () => {
  const { user, setUser } = useGlobalContext();

  const { pathname } = useLocation();

  const handleLogout = () => {
    localStorage.setItem("user", null);
    setUser(null);
    window.location.replace("/");
  };

  return (
    <header className="navbar">
      <div className="navbar-links">
        <Link to="/" className="navbar-link">
          Webshop
        </Link>
        <Link to="/categories" className="navbar-link">
          Kategorije
        </Link>
      </div>

      <div className="navbar-settings"></div>
      {user ? (
        <div className="navbar-profile">
          <img
            className="navbar-profile-image"
            src={user.picture}
            alt="profilna"
          />
          <Link className="navbar-link-add" to="/add-product">
            +
          </Link>
          <Link className="user-product" to="/user-products">
            My Product
          </Link>
          <Link className="navbar-cart" to="/cart ">
            Cart
          </Link>
          <Link className="notification" to="">
            Notification
          </Link>
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      ) : (
        <>
          <Link to="/register" className="navbar-link">
            Register
          </Link>
          <Link to="/login" className="navbar-link">
            Login
          </Link>
        </>
      )}
    </header>
  );
};

export default Navbar;
