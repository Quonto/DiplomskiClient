import axios from "axios";
import { useEffect } from "react";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "./home.css";

const Home = () => {
  const [mostWanted, setMostWanted] = useState([]);
  const [mostLiked, setMostLiked] = useState([]);
  const [mostPopular, setMostPopular] = useState([]);

  useEffect(() => {
    const handleMostWanted = async () => {
      const response = await axios.get(
        "https://localhost:7113/Product/FetchMostWanted"
      );
      setMostWanted(response.data);
    };
    const handleMostLiked = async () => {
      const response = await axios.get(
        "https://localhost:7113/Product/FetchLikeProduct"
      );

      setMostLiked(response.data);
    };
    const handleMostPopular = async () => {
      const response = await axios.get(
        "https://localhost:7113/Group/FetchPopularGroup"
      );
      console.log(response.data);
      setMostPopular(response.data);
    };

    handleMostWanted();
    handleMostLiked();
    handleMostPopular();
  }, []);

  return (
    <main className="home">
      {/* Most wanted products*/}
      <section className="wanted">
        <h3>Najtrazeniji predmeti</h3>
        <div className="wanted-list">
          {/* list of products */}
          {mostWanted.map((product) => {
            return (
              <Link
                className="wanted-product"
                to={`/categories/group/${product.group}/product/${product.id}`}
              >
                <article className="wanted-article">
                  <img
                    className="wanted-image"
                    src={product.picture[0].data}
                    alt=""
                  />
                  <div className="wanted-info">
                    <h4> {product.price} RSD</h4>
                    <p>{product.numberOfWish.length} ponuda</p>
                  </div>
                </article>
              </Link>
            );
          })}
        </div>
      </section>
      {/* Most newest products */}
      <section className="wanted">
        <h3>Istaknuti predmeti</h3>
        {/* List of products */}
        <div className="wanted-list">
          {mostLiked.map((product) => {
            return (
              <Link
                className="wanted-product"
                to={`/categories/group/${product.group}/product/${product.id}`}
              >
                <article className="wanted-article">
                  <img
                    className="wanted-image"
                    src={product.picture[0].data}
                    alt=""
                  />
                  <div className="wanted-info">
                    <h4> {product.price} RSD</h4>
                    <p>{product.numberOfLike.length} lajkovanih</p>
                  </div>
                </article>
              </Link>
            );
          })}
        </div>
      </section>
      {/*Categories */}
      <section className="popular-categories">
        <h3>Popularne kategorije</h3>
        <div className="popular-categories-list">
          {mostPopular.map((group) => {
            return (
              <Link
                className="wanted-product"
                to={`/categories/group/${group.id}`}
              >
                <article className="popular-category">
                  <div className="popular-image-wrapper">
                    <img
                      className="popular-category-image"
                      src={group.picture.data}
                      alt=""
                    />
                  </div>
                  <p>{group.name}</p>
                </article>
              </Link>
            );
          })}
        </div>
      </section>
    </main>
  );
};

export default Home;
