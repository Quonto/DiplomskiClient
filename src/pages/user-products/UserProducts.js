import { useEffect, useState } from "react";
import axios from "axios";
import { useGlobalContext } from "../../context/Context";
import "./userproducts.css";

const UserProducts = () => {
  const [myProducts, setMyProducts] = useState([]);
  const { user } = useGlobalContext();

  useEffect(() => {
    const fetchProducts = async () => {
      const response = await axios.get(
        `https://localhost:7113/User/FetchUserProducts/${user.id}`
      );

      setMyProducts(response.data);
      console.log(response);
    };
    fetchProducts();
  }, []);

  const calculateMark = (product) => {
    if (product.reviews.length === 0) {
      return 0;
    }
    let sum = 0;
    product.reviews.map((r) => {
      sum = sum + r.mark;
      return r;
    });
    return Math.round(parseFloat(sum / product.reviews.length));
  };

  return (
    <div className="user-product-div">
      {myProducts.map((product) => {
        return (
          <article className="product" key={product.id}>
            <div className="product-image">
              <img
                src={
                  product.picture.length === 0 ? "" : product.picture[0].data
                }
                alt=""
              />
            </div>
            <div className="product-details">
              <div style={{ textDecoration: "none", color: "black" }}>
                <h4>{product.name}</h4>
              </div>
              <div className="product-details-info">
                <label>Cena:</label>
                <span>{product.price}</span>
              </div>
              <div className="product-details-info">
                <label>Ocena:</label>
                <span>{calculateMark(product)}</span>
              </div>
              <div className="product-details-info">
                <label>Korisnik:</label>
                <span>{product.user.username}</span>
              </div>
            </div>
            <div className="button-list">
              <button className="sell-btn">Prodato</button>
              <button className="sell-btn">Vrati ponudu</button>
              <div className="button-info">{`${product.numberOfWish.length} zeli ovaj proizvod`}</div>
              <div className="button-info">{`${product.numberOfViewers.length} pregleda`}</div>
              <div className="button-info">{`${product.numberOfLike.length} lajkova`}</div>
            </div>
          </article>
        );
      })}
    </div>
  );
};

export default UserProducts;
