import { useEffect, useState } from "react";
import axios from "axios";
import { useGlobalContext } from "../../context/Context";
import { CircularProgress } from "@mui/material";
import { Link } from "react-router-dom";
import "./userproducts.css";
import SnackBar from "../../components/snackbar/Snackbar";

const UserProducts = () => {
  const [myProducts, setMyProducts] = useState([]);
  const [userBuy, setUserBuy] = useState([]);
  const [auctionTime, setAuctionTime] = useState(1);
  const [productPrice, setProductPrice] = useState("");
  const [isReturnActive, setIsReturnActive] = useState(false);
  const [updated, setUpdated] = useState(null);
  const [severity, setSeverity] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [auctionProduct, setAuctionProduct] = useState({});
  const { user } = useGlobalContext();

  const handleBackProduct = async (id) => {
    try {
      await axios.put(`https://localhost:7113/Product/InputProduct/${id}`);
    } catch (error) {
      setMessage(error.response.data);
      setSeverity("error");
      setUpdated(true);
      return;
    }
    let newProducts = myProducts.filter((product) => product.id !== id);
    setMyProducts(newProducts);

    setMessage("Uspešno dodat proizvod");
    setSeverity("success");
    setUpdated(true);
  };

  const handleSoldProduct = async (id) => {
    try {
      await axios.delete(`https://localhost:7113/Product/RemoveProduct/${id}`);
    } catch (error) {
      setMessage(error.response.data);
      setSeverity("error");
      setUpdated(true);
      return;
    }
    let newProducts = myProducts.filter((product) => product.id !== id);
    setMyProducts(newProducts);
    setMessage("Proizvod je uspešno prodat");
    setSeverity("success");
    setUpdated(true);
  };

  useEffect(() => {
    const fetchUsers = async () => {
      if (myProducts.length !== 0) {
        let users;
        try {
          users = await Promise.all(
            myProducts.map((product) => {
              if (product.buyUser === 0) {
                return null;
              }
              return axios.get(
                `https://localhost:7113/User/FetchUser/${product.buyUser}`
              );
            })
          );
        } catch (error) {
          return;
        }

        let userData = users.map((user) => {
          return user === null ? user : user.data;
        });
        setUserBuy(userData);
      }
    };
    fetchUsers();
  }, [myProducts]);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      let response;
      try {
        response = await axios.get(
          `https://localhost:7113/Product/FetchUserProducts/${user.id}`
        );
      } catch (error) {
        return;
      }

      setMyProducts(response.data);
      setLoading(false);
    };

    fetchProducts();
  }, [user.id]);

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

  const handleAuctionReturn = (product) => {
    setAuctionProduct(product);
    setIsReturnActive(true);
  };

  const handleChangeTime = (e) => {
    setAuctionTime(parseInt(e.target.value));
  };

  const handleAuction = async () => {
    let auction;
    try {
      auction = await axios.get(
        `https://localhost:7113/Auction/FetchAuction/${auctionProduct.id}`
      );
    } catch (error) {
      return;
    }

    const currentTime = new Date();
    currentTime.setHours(currentTime.getHours() + 1); //C# modifikacija baze

    const newProduct = {
      id: auctionProduct.id,
      price: parseInt(productPrice === "" ? 0 : productPrice),
      date: currentTime,
      buy: false,
      buyUser: 0,
    };

    try {
      await axios.put(
        `https://localhost:7113/Product/UpdateAuctionProduct`,
        newProduct
      );
    } catch (error) {
      setMessage(error.response.data);
      setSeverity("error");
      setUpdated(true);
      return;
    }

    currentTime.setDate(currentTime.getDate() + auctionTime);

    const newAuction = {
      id: auction.data.id,
      time: currentTime,
      minimumPrice: parseInt((productPrice / 100) * 5),
      product: newProduct.id,
    };

    try {
      await axios.put(
        `https://localhost:7113/Auction/UpdateAuction`,
        newAuction
      );
    } catch (error) {
      return;
    }

    let newProducts = myProducts.filter((p) => p.id !== auctionProduct.id);
    setMyProducts(newProducts);
    setMessage("Uspešno dodat proizvod");
    setSeverity("success");
    setUpdated(true);
    setIsReturnActive(false);
  };

  const handleCloseSnackbarUpdated = () => {
    setUpdated(false);
  };

  return (
    <div className="user-product-div">
      {loading ? (
        <CircularProgress />
      ) : (
        <>
          {myProducts.map((product, index) => {
            return (
              <article key={index}>
                <article className="product-user" key={product.id}>
                  <div className="product-image">
                    <img
                      src={
                        product.picture.length === 0
                          ? ""
                          : product.picture[0].data
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
                  </div>
                  <div className="button-list-sell">
                    <button
                      className="sell-btn"
                      onClick={() => handleSoldProduct(product.id)}
                    >
                      {userBuy[index] !== null ? "Prodato" : "Izbrisi Proizvod"}
                    </button>
                    <button
                      className="sell-btn"
                      onClick={() =>
                        product.auction
                          ? handleAuctionReturn(product)
                          : handleBackProduct(product.id)
                      }
                    >
                      Vrati ponudu
                    </button>
                    <div className="button-info-sell">{`${product.numberOfWish.length} zeli ovaj proizvod`}</div>
                    <div className="button-info-sell">{`${product.numberOfViewers.length} pregleda`}</div>
                    <div className="button-info-sell">{`${product.numberOfLike.length} lajkova`}</div>
                  </div>
                  {userBuy[index] && (
                    <div className="user-buy">
                      <div className="user-buy-information">
                        <label>Slika: </label>
                        <Link to={`/profile/${userBuy[index].id}`}>
                          <img
                            src={
                              userBuy[index].picture.length === 0
                                ? ""
                                : userBuy[index].picture
                            }
                            alt=""
                          />
                        </Link>
                      </div>
                      <div className="user-buy-information">
                        <label>Korisnik: </label>
                        <Link
                          to={`/profile/${userBuy[index].id}`}
                          className="user-buy-information-link"
                        >
                          <span>{userBuy[index].username}</span>
                        </Link>
                      </div>
                      <div className="user-buy-information">
                        <label>Ime: </label>
                        <span>{userBuy[index].userInformation.nameUser}</span>
                      </div>
                      <div className="user-buy-information">
                        <label>Prezime: </label>
                        <span>{userBuy[index].userInformation.surename}</span>
                      </div>
                      <div className="user-buy-information">
                        <label>Kontakt: </label>
                        <span>{userBuy[index].userInformation.phone}</span>
                      </div>
                      <div className="user-buy-information">
                        <label>Mesto: </label>
                        <span>{userBuy[index].userInformation.place.name}</span>
                      </div>
                    </div>
                  )}
                </article>
                <div>
                  {isReturnActive && (
                    <section className="modal-return">
                      <div className="modal-wrapper">
                        <button
                          className="exit-modal"
                          onClick={() => setIsReturnActive(false)}
                        >
                          X
                        </button>
                        <div className="start-price">
                          {" "}
                          <label htmlFor="price" className="label">
                            Pocetna cena
                          </label>
                          <input
                            name="price"
                            type="text"
                            className="input"
                            onChange={(e) => setProductPrice(e.target.value)}
                          />
                        </div>
                        <div className="start-price">
                          <label htmlFor="time" className="label">
                            Vreme trajanja
                          </label>
                          <select name="time" onChange={handleChangeTime}>
                            <option value={1}>Jedan dan</option>
                            <option value={2}>Dva dana</option>
                            <option value={3}>Tri dana</option>
                            <option value={4}>Cetiri dana</option>
                          </select>
                        </div>
                        <button className="sell-button" onClick={handleAuction}>
                          Vrati u ponudu
                        </button>
                      </div>
                    </section>
                  )}
                </div>
              </article>
            );
          })}
        </>
      )}
      <SnackBar
        boolean={updated}
        handleClose={handleCloseSnackbarUpdated}
        severity={severity}
        message={message}
      />
    </div>
  );
};

export default UserProducts;
