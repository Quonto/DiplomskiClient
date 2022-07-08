import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./categorySettings.css";

const CategorySettings = () => {
  const [products, setProducts] = useState([]);

  const { id_group } = useParams();

  useEffect(() => {
    const fetchProducts = async () => {
      const response = await axios.get(
        `https://localhost:7113/User/FetchProduct?id_group=${id_group}`
      );
      console.log(response);
      setProducts(response.data);
    };
    fetchProducts();
  }, []);

  return (
    <section className="category-settings">
      <section className="product-filter">filter</section>
      <section className="product-list">
        <div className="header-sort">
          <h3>Naslov kategorije</h3>
          <div className="sort">
            <label htmlFor="select">Sortiraj po:</label>
            <select className="select-sort" name="select"></select>
          </div>
        </div>
        <div className="subscribe-line">
          <hr />
          <button className="subscribe-btn">Prati</button>
        </div>
        <div className="products">
          {products.map((product) => {
            return (
              <article className="product">
                <img
                  className="product-image"
                  src={product.picture[0]?.data}
                  alt=""
                />
                <div className="product-details">
                  <h4>{product.name}</h4>
                  <label>Cena:</label>
                  <span>{product.price}</span>
                </div>
                <div className="button-list">
                  <button className="wishlist-btn">Dodaj</button>
                  <div className="button-info">{`${product.numberOfWish} zeli ovaj proizvod`}</div>
                  <div className="button-info">{`${product.numberOfViewers.length} pregleda`}</div>
                  <div className="button-info">{`${product.numberOfLike} lajkova`}</div>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </section>
  );
};

export default CategorySettings;
