import "../user-products/userproducts.css";
import "./cart.css";
import { useGlobalContext } from "../../context/Context";
import axios from "axios";

const Cart = () => {
  const { cart, setCart, user } = useGlobalContext();

  const handleRemove = async (id_product) => {
    await axios.put(`https://localhost:7113/User/InputPurchase/${id_product}`, {
      addToCart: false,
    });
    let newCart = cart.filter((cartItem) => cartItem.id !== id_product);
    setCart(newCart);
  };

  const handleBuyProducts = async () => {
    console.log(cart);
    await axios.put(`https://localhost:7113/User/InputBuy/${user.id}`, cart);
    setCart([]);
  };

  return (
    <div className="cart">
      {cart ? (
        cart.map((cartItem) => {
          console.log(cartItem);
          return (
            <article className="cart-article">
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
    </div>
  );
};

export default Cart;
