import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "./productSettings.css";

const ProductSettings = ({ group, filteredProducts, setFilteredProducts }) => {
  const sortMethods = [
    { label: "Opadajuci po ceni", method: "oc" },
    { label: "Rastuci po ceni", method: "rc" },
    { label: "Opadajuci po nazivu", method: "on" },
    { label: "Rastuci po nazivu", method: "rn" },
    { label: "Rastuci po vremenu", method: "rv" },
    { label: "Opadajuci po vremenu", method: "ov" },
  ];

  const { pathname } = useLocation();

  const [sort, setSort] = useState("");
  const [mark, setMark] = useState(0);

  const nekiRef = useRef(null);

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
      case "ov": {
        sorted = filteredProducts
          .sort((a, b) => {
            let x = a.date.toLowerCase();
            let y = b.date.toLowerCase();
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
      case "rv": {
        sorted = filteredProducts.sort((a, b) => {
          let x = a.date.toLowerCase();
          let y = b.date.toLowerCase();
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

  const handleDate = (date) => {
    const d = date.split("T");
    const da = d[0].split("-");

    return da[2] + "." + da[1] + "." + da[0];
  };

  const handleTime = (time) => {
    const d = time.split("T");
    const da = d[1].split(":");

    return da[0] + ":" + da[1];
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
      <div className="products" ref={nekiRef}>
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
                  style={{
                    textDecoration: "none",
                    color: "black",
                    margin: "0px 10px",
                  }}
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
                  <Link
                    style={{
                      textDecoration: "none",
                      color: "black",
                      margin: "5px auto",
                    }}
                    to={`/profile/${product.user.id}`}
                  >
                    <span>{product.user.username}</span>
                  </Link>
                </div>
              </div>
              <div className="product-contact">
                <label>Grad/Mesto</label>
                <span>{product.place.name}</span>
                <label>Kontakt</label>
                <span>{product.phone} </span>
                <label>Vreme</label>
                <span>{handleTime(product.date)} </span>
                <span>{handleDate(product.date)} </span>
              </div>
              <div className="button-list">
                <div className="button-info">{`${product.numberOfWish.length} zeli `}</div>
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
