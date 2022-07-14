import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "./productSettings.css";

const ProductSettings = ({ group, filteredProducts, setFilteredProducts }) => {
  const sortMethods = [
    { label: "Opadajuci po ceni", method: "oc" },
    { label: "Rastuci po ceni", method: "rc" },
    { label: "Opadajuci po nazivu", method: "on" },
    { label: "Rastuci po nazivu", method: "rn" },
  ];

  const { pathname } = useLocation();

  const [sort, setSort] = useState("");
  const [mark, setMark] = useState(0);

  const handleSort = (sort) => {
    let sorted = filteredProducts.reverse();
    switch (sort) {
      case "oc": {
        sorted = filteredProducts.sort((a, b) => a.price - b.price).reverse();
        break;
      }
      case "rc": {
        sorted = filteredProducts.sort((a, b) => a.price - b.price);
        break;
      }
      case "on": {
        sorted = filteredProducts
          .sort((a, b) => {
            let x = a.name.toLowerCase();
            let y = b.name.toLowerCase();
            if (x < y) {
              return -1;
            }
            if (x > y) {
              return 1;
            }
            return 0;
          })
          .reverse();
        break;
      }
      case "rn": {
        sorted = filteredProducts.sort((a, b) => {
          let x = a.name.toLowerCase();
          let y = b.name.toLowerCase();
          if (x < y) {
            return -1;
          }
          if (x > y) {
            return 1;
          }
          return 0;
        });
        break;
      }
    }
    setFilteredProducts([...sorted]);
  };

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

  useEffect(() => {
    sort !== "" && handleSort(sort);
  }, [sort]);

  return (
    <section className="product-list">
      <div className="header-sort">
        <h3>{group.name}</h3>
        <div className="sort">
          <label htmlFor="select">Sortiraj po:</label>
          <select
            className="select-sort"
            name="select"
            onChange={(e) => setSort(e.target.value)}
          >
            {sortMethods.map((sm) => {
              return <option value={sm.method}>{sm.label}</option>;
            })}
          </select>
        </div>
      </div>
      <div className="products">
        {filteredProducts.map((product) => {
          return (
            <article className="product" key={product.id}>
              <Link
                className="product-image"
                to={`${pathname}/product/${product.id}`}
              >
                <img
                  src={
                    product.picture.length === 0 ? "" : product.picture[0].data
                  }
                  alt=""
                />
              </Link>
              <div className="product-details">
                <Link
                  style={{ textDecoration: "none", color: "black" }}
                  to={`${pathname}/product/${product.id}`}
                >
                  <h4>{product.name}</h4>
                </Link>
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
                <button className="wishlist-btn">Dodaj</button>
                <div className="button-info">{`${product.numberOfWish.length} zeli ovaj proizvod`}</div>
                <div className="button-info">{`${product.numberOfViewers.length} pregleda`}</div>
                <div className="button-info">{`${product.numberOfLike.length} lajkova`}</div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
};

export default ProductSettings;
