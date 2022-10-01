import "../user-products/userproducts.css";
import { useState } from "react";
import "./cart.css";
import { useGlobalContext } from "../../context/Context";
import axios from "axios";
import SnackBar from "../../components/snackbar/Snackbar";

const Cart = () => {
  const { cart, setCart, user } = useGlobalContext();
  const [updated, setUpdated] = useState(null);
  const [severity, setSeverity] = useState("");
  const [message, setMessage] = useState("");

  const handleRemove = async (id_product) => {
    try {
      await axios.put(
        `https://localhost:7113/Product/InputPurchase/${id_product}`,
        {
          addToCart: false,
        }
      );
    } catch (error) {
      setMessage(error.response.data);
      setSeverity("error");
      setUpdated(true);
      return;
    }
    let newCart = cart.filter((cartItem) => cartItem.id !== id_product);
    setCart(newCart);
    setMessage("Proizvod je izbačen iz korpe");
    setSeverity("success");
    setUpdated(true);
  };

  const handleBuyProducts = async () => {
    try {
      await axios.put(
        `https://localhost:7113/Product/InputBuy/${user.id}`,
        cart
      );
      setCart([]);
    } catch (error) {
      setMessage(error.data.value);
      setSeverity("success");
      setUpdated(true);
    }
    setMessage("Uspešno kupljen proizvod");
    setSeverity("success");
    setUpdated(true);
  };

  const handleCloseSnackbarUpdated = () => {
    setUpdated(false);
  };

  return (
    <div className="cart">
      {cart ? (
        cart.map((cartItem, index) => {
          return (
            <article className="cart-article" key={index}>
              <div className="product-image">
                <img
                  src={
                    cartItem.picture.length === 0
                      ? ""
                      : cartItem.picture[0].data
                  }
                  alt=""
                />
              </div>
              <div className="product-details">
                <div style={{ textDecoration: "none", color: "black" }}>
                  <h4>{cartItem.name}</h4>
                </div>
                <div className="product-details-info">
                  <label>Cena:</label>
                  <span>{cartItem.price}</span>
                </div>
                <div className="product-details-info">
                  <label className="user">
                    Korisnik: <span>{cartItem.user.username}</span>
                  </label>
                </div>
                <button
                  className="remove-product-btn"
                  onClick={() => handleRemove(cartItem.id)}
                >
                  Izbaci iz korpe
                </button>
              </div>
            </article>
          );
        })
      ) : (
        <div>Kart lista je prazna</div>
      )}
      <button
        disabled={cart.length === 0}
        className="buy-product"
        onClick={handleBuyProducts}
      >
        Kupovina
      </button>
      <SnackBar
        boolean={updated}
        handleClose={handleCloseSnackbarUpdated}
        severity={severity}
        message={message}
      />
    </div>
  );
};

export default Cart;
