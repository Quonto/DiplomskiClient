import "./navbar.css";
import { Link } from "react-router-dom";
import { useGlobalContext } from "../../context/Context";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import LogoutIcon from "@mui/icons-material/Logout";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { useState } from "react";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";

const Navbar = () => {
  const { user, setUser, setCart } = useGlobalContext();
  const [minWidth, setMinWidth] = useState(false);
  const [openMenu, setOpenMenu] = useState(false);

  window.onresize = () => {
    if (window.innerWidth < 500) {
      setMinWidth(true);
    } else setMinWidth(false);
  };

  const handleLogout = () => {
    localStorage.setItem("user", null);
    setUser(null);
    setCart([]);
    window.location.replace("/");
  };

  const handleOpenMenu = () => {
    setOpenMenu(!openMenu);
  };

  return (
    <header
      className="navbar"
      style={{ position: minWidth ? "relative" : "sticky" }}
    >
      {minWidth ? (
        <>
          <Link to="/" className="navbar-link">
            Webshop
          </Link>
          <MenuIcon
            style={{ color: "white", marginRight: "15px", cursor: "pointer" }}
            onClick={handleOpenMenu}
          />
          <div
            className="navbar-container"
            style={{ display: openMenu ? "flex" : "none" }}
          >
            <CloseIcon
              style={{
                color: "#fff",
                position: "absolute",
                top: "0",
                right: "0",
              }}
              onClick={handleOpenMenu}
            />
            <Link to="/categories" className="menu-item-link">
              Kategorije
            </Link>
            <Link className="menu-item-link" to={`/profile/${user.id}`}>
              <img
                className="menu-item-img"
                src={user.picture}
                alt="profilna"
              />{" "}
              Profil
            </Link>
            <Link className="menu-item-link" to="/add-product">
              <AddCircleIcon style={{ marginRight: "10px" }} /> Dodaj proizvod
            </Link>
            <Link className="menu-item-link" to="/user-products">
              <AddShoppingCartIcon style={{ marginRight: "10px" }} /> Kupljeni
              proizvodi
            </Link>
            <Link className="menu-item-link" to="/cart ">
              <ShoppingCartIcon style={{ marginRight: "10px" }} /> Korpa
            </Link>
            <button className="menu-item-link" onClick={handleLogout}>
              <LogoutIcon style={{ marginRight: "10px" }} /> Odjavi se
            </button>
          </div>
        </>
      ) : (
        <>
          <div className="navbar-links">
            <Link to="/" className="navbar-link">
              Webshop
            </Link>
            <Link to="/categories" className="navbar-link">
              Kategorije
            </Link>
          </div>
          {user ? (
            <div className="navbar-profile">
              <Link className="profile-link" to={`/profile/${user.id}`}>
                <img
                  className="navbar-profile-image"
                  src={user.picture}
                  alt="profilna"
                />
              </Link>
              <Link className="navbar-link-add" to="/add-product">
                <AddCircleIcon />
              </Link>
              <Link className="user-product" to="/user-products">
                <AddShoppingCartIcon />
              </Link>
              <Link className="navbar-cart" to="/cart ">
                <ShoppingCartIcon />
              </Link>
              <button className="logout-btn" onClick={handleLogout}>
                <LogoutIcon />
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
        </>
      )}
    </header>
  );
};

export default Navbar;
