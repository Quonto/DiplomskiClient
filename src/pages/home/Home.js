import axios from "axios";
import { useEffect } from "react";
import { useState } from "react";
import { CircularProgress } from "@mui/material";
import { Link } from "react-router-dom";
import "./home.css";

const Home = () => {
  const [mostWanted, setMostWanted] = useState([]);
  const [mostLiked, setMostLiked] = useState([]);
  const [mostPopular, setMostPopular] = useState([]);
  const [loadingMostWanted, setLoadingMostWanted] = useState(false);
  const [loadingLikeProduct, setLoadingLikeProduct] = useState(false);
  const [loadingPopularGroup, setLoadingPopularGroup] = useState(false);

  useEffect(() => {
    const handleMostWanted = async () => {
      setLoadingMostWanted(true);
      let response;
      try {
        response = await axios.get(
          "https://localhost:7113/Product/FetchMostWanted"
        );
      } catch (error) {
        return;
      }
      setMostWanted(response.data);
      setLoadingMostWanted(false);
    };
    const handleMostLiked = async () => {
      setLoadingLikeProduct(true);
      let response;
      try {
        response = await axios.get(
          "https://localhost:7113/Product/FetchLikeProduct"
        );
      } catch (error) {
        return;
      }
      setLoadingLikeProduct(false);
      setMostLiked(response.data);
    };
    const handleMostPopular = async () => {
      setLoadingPopularGroup(true);
      let response;
      try {
        response = await axios.get(
          "https://localhost:7113/Group/FetchPopularGroup"
        );
      } catch (error) {
        return;
      }
      setLoadingPopularGroup(false);
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
        {loadingMostWanted ? (
          <CircularProgress />
        ) : (
          <div className="wanted-list">
            {mostWanted.map((product, index) => {
              return (
                <article className="wanted-article" key={index}>
                  <Link
                    className="wanted-product"
                    to={`/categories/group/${product.group}/product/${product.id}`}
                  >
                    <img
                      className="wanted-image"
                      src={product.picture[0].data}
                      alt=""
                    />
                    <div className="wanted-info">
                      <h4> {product.price} RSD</h4>
                      <p>{product.numberOfWish.length} ponuda</p>
                    </div>
                  </Link>
                </article>
              );
            })}
          </div>
        )}
      </section>
      {/* Most newest products */}
      <section className="wanted">
        <h3>Istaknuti predmeti</h3>
        {loadingLikeProduct ? (
          <CircularProgress />
        ) : (
          <div className="wanted-list">
            {mostLiked.map((product, index) => {
              return (
                <article className="wanted-article" key={index}>
                  <Link
                    className="wanted-product"
                    to={`/categories/group/${product.group}/product/${product.id}`}
                  >
                    <img
                      className="wanted-image"
                      src={product.picture[0].data}
                      alt=""
                    />
                    <div className="wanted-info">
                      <h4> {product.price} RSD</h4>
                      <p>{product.numberOfLike.length} lajkovanih</p>
                    </div>
                  </Link>
                </article>
              );
            })}
          </div>
        )}
      </section>
      {/*Categories */}
      <section className="popular-categories">
        <h3>Popularne grupe</h3>
        {loadingPopularGroup ? (
          <CircularProgress />
        ) : (
          <div className="popular-categories-list">
            {mostPopular.map((group, index) => {
              return (
                <article className="popular-category" key={index}>
                  <Link
                    className="wanted-product"
                    to={`/categories/group/${group.id}`}
                  >
                    <div className="popular-image-wrapper">
                      <img
                        className="popular-category-image"
                        src={group.picture.data}
                        alt=""
                      />
                    </div>
                    <p>{group.name}</p>
                  </Link>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
};

export default Home;
