import axios from "axios";
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import "./product.css";
import { useGlobalContext } from "../../context/Context";
import { HubConnectionBuilder } from "@microsoft/signalr";
import * as signalR from "@microsoft/signalr";
import ImageSlider from "../../components/imageSlider/ImageSlider";
import Pagination from "../../components/pagination/Pagination";
import SnackBar from "../../components/snackbar/Snackbar";

const Product = () => {
  const [isAddActive, setIsAddActive] = useState(false);
  const [addReview, setAddReview] = useState({
    mark: "",
    coment: "",
  });
  const [auction, setAuction] = useState(null);
  const [auctionTime, setAuctionTime] = useState(null);
  const [connection, setConnection] = useState(null);
  const [newPrice, setNewPrice] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [updated, setUpdated] = useState(null);
  const [severity, setSeverity] = useState("");
  const [message, setMessage] = useState("");

  let interval;

  const { id_product } = useParams();

  const { user, setCart, cart } = useGlobalContext();

  const checkAddedToCart = () => {
    if (cart && product) {
      let productCart = cart.find((item) => item.id === product.id);
      if (productCart) {
        return true;
      } else {
        return false;
      }
    }
    return false;
  };

  const [product, setProduct] = useState(null);
  const [addedToCart, setAddedToCart] = useState(checkAddedToCart());

  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(4);
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = product?.reviews.slice(
    indexOfFirstPost,
    indexOfLastPost
  );

  const handleSelectedImage = (image) => {
    setSelectedImage({
      ...selectedImage,
      data: image.data,
      name: image.name,
      index: image.index,
    });
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

  const handleAddToCart = async () => {
    setCart([...cart, product]);
    setAddedToCart(true);
  };

  const handleModal = () => {
    setIsAddActive(!isAddActive);
  };

  const handleAuction = async () => {
    const newProduct = {
      id: product.id,
      price: parseInt(newPrice === "" ? 0 : newPrice),
    };

    try {
      await axios.put(
        `https://localhost:7113/Auction/UpdateAuction/${user.id}`,
        newProduct
      );
    } catch (error) {
      setMessage(error.response.data);
      setSeverity("error");
      setUpdated(true);
      return;
    }
    setMessage("Uspešno ažurirana aukcija");
    setSeverity("success");
    setUpdated(true);
  };

  const convertMinutes = (totalMinutes) => {
    const secondInDay = 24 * 60 * 60;
    const secondInHour = 60 * 60;
    const secondInMinute = 60;

    let days = Math.floor(totalMinutes / secondInDay);
    let remaininghours = totalMinutes % secondInDay;

    let hours = Math.floor(remaininghours / secondInHour);
    let remainingMinute = remaininghours % secondInHour;

    let minutes = Math.floor(remainingMinute / secondInMinute);
    let second = Math.round(remainingMinute % secondInMinute);

    return `${days}d:${hours}h:${Math.round(minutes)}m:${second}s`;
  };

  const handleAuctionTime = async (au) => {
    const currentTime = new Date().toISOString();

    let remainingTime = (new Date(au) - new Date(currentTime)) / 1000;

    if (auction) {
      if (remainingTime < 0) {
        if (auction.user === null) {
          try {
            await axios.put(`https://localhost:7113/Product/InputBuy/${0}`, [
              product,
            ]);
          } catch (error) {
            return;
          }
        } else {
          try {
            await axios.put(
              `https://localhost:7113/Product/InputBuy/${auction.user.id}`,
              [product]
            );
          } catch (error) {
            return;
          }
        }
        window.location.replace("/");
      }
    }

    setAuctionTime(convertMinutes(remainingTime));
  };

  const handleAddReview = async () => {
    let response;
    try {
      response = await axios.post(
        `https://localhost:7113/User/InputReview/${id_product}/${user.id}`,
        addReview
      );
    } catch (error) {
      setMessage(error.response.data);
      setSeverity("error");
      setUpdated(true);
      return;
    }
    const newReview = {
      id: response.data.id,
      mark: parseInt(addReview.mark),
      coment: addReview.coment,
      user: response.data.user,
    };
    const newReviews = [...product.reviews, newReview];
    setProduct({ ...product, reviews: newReviews });
    setIsAddActive(false);
    setMessage("Uspešno ste dodali komentar");
    setSeverity("success");
    setUpdated(true);
  };

  const checkIfWishlist = () => {
    let bul = false;
    product.numberOfWish.map((now) => {
      if (now.idUser === user.id) bul = true;
      return now;
    });
    return bul;
  };

  const handleWish = async () => {
    let response;
    try {
      response = await axios.post(
        `https://localhost:7113/Product/InputNumberOfWish/${id_product}`,
        { idUser: user.id }
      );
    } catch (error) {
      return;
    }
    let newWishlist = [
      ...product.numberOfWish,
      { id: response.data, idUser: user.id },
    ];
    setProduct({ ...product, numberOfWish: newWishlist });
  };

  const handleLike = async () => {
    let response;
    try {
      response = await axios.post(
        `https://localhost:7113/Product/InputNumberOfLike/${id_product}`,
        { idUser: user.id }
      );
    } catch (error) {
      return;
    }
    let newLikelist = [
      ...product.numberOfLike,
      { id: response.data, idUser: user.id },
    ];
    setProduct({ ...product, numberOfLike: newLikelist });
  };

  const handleUnwish = async () => {
    let wish = product.numberOfWish.find((nm) => nm.idUser === user.id);
    try {
      await axios.delete(
        `https://localhost:7113/Product/RemoveNumberOfWish/${wish.id}`
      );
    } catch (error) {
      return;
    }
    let newWishlist = product.numberOfWish.filter((wsh) => wsh.id !== wish.id);
    setProduct({ ...product, numberOfWish: newWishlist });
  };

  const handleDislike = async () => {
    let like = product.numberOfLike.find((nm) => nm.idUser === user.id);
    try {
      await axios.delete(
        `https://localhost:7113/Product/RemoveNumberOfLike/${like.id}`
      );
    } catch (error) {
      return;
    }

    let newLikelist = product.numberOfLike.filter((nmb) => nmb.id !== like.id);
    setProduct({ ...product, numberOfLike: newLikelist });
  };

  const checkLike = () => {
    let lk = false;
    product.numberOfLike.map((like) => {
      if (user.id === like.idUser) {
        lk = true;
      }
      return like;
    });
    return lk;
  };

  const calculateMark = () => {
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

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      if (user !== null) {
        try {
          await axios.post(
            `https://localhost:7113/Product/InputNumberOfView/${id_product}`,
            { idUser: user.id }
          );
        } catch (error) {
          return;
        }
      }

      let response;
      try {
        setLoading(true);
        response = await axios.get(
          `https://localhost:7113/Product/FetchSingleProduct/${id_product} `
        );
      } catch (error) {
        return;
      }

      if (response.data.auction === true) {
        const responseAuction = await axios.get(
          `https://localhost:7113/Auction/FetchAuction/${id_product} `
        );
        setAuction(responseAuction.data);
        handleAuctionTime(responseAuction.data.time);
      }

      setProduct(response.data);
      setLoading(false);
    };
    fetchProduct();
  }, [id_product]);

  useEffect(() => {
    if (product) {
      setAddedToCart(checkAddedToCart());
      setSelectedImage({
        name: product?.picture[0]?.name,
        index: 0,
        data: product?.picture[0]?.data,
      });
    }
  }, [product]);

  useEffect(() => {
    if (connection) {
      connection
        .start()
        .then(() => {
          connection.on("BroadcastMessage", (product, au) => {
            setProduct(product);
            setAuction(au);
          });
        })
        .catch((error) => console.log(error));
    }
  }, [connection]);

  useEffect(() => {
    const connect = new HubConnectionBuilder()
      .configureLogging(signalR.LogLevel.Information)
      .withUrl(`https://localhost:7113/chatHub`)
      .withAutomaticReconnect()
      .build();
    setConnection(connect);
  }, []);

  useEffect(() => {
    interval = setInterval(() => {
      if (auction?.time) handleAuctionTime(auction.time);
    }, 1000);

    return () => clearInterval(interval);
  }, [auction]);

  const handleCloseSnackbarUpdated = () => {
    setUpdated(false);
  };

  if (product) {
    return (
      <>
        {loading ? (
          <h2>Loading...</h2>
        ) : (
          <>
            <section className="section-product">
              {selectedImage && (
                <div className="product-picture">
                  <div className="product-picture-wrapper">
                    <img
                      src={selectedImage.data}
                      alt=""
                      className="product-picture-img"
                    />
                  </div>
                  <ImageSlider
                    images={product.picture}
                    handleSelectedImage={handleSelectedImage}
                  ></ImageSlider>
                </div>
              )}
              <div className=" product-buy">
                <h3 className="product-name">{product.name}</h3>

                {!product.auction && product.user.id !== user?.id && (
                  <div className="purchase-container">
                    <label className="product-price">
                      Cena:
                      <span className="product-price-span">
                        {product.price} RSD
                      </span>
                    </label>
                    {user !== null && (
                      <button
                        disabled={addedToCart}
                        className="product-buy-button"
                        onClick={handleAddToCart}
                      >
                        Dodaj u korpu
                      </button>
                    )}
                  </div>
                )}
                {product.auction && (
                  <div className="purchase-container">
                    <div className="product-price-div">
                      <label className="product-price">Trenutna cena:</label>
                      <span className="product-price-span">
                        {parseInt(product.price)} RSD
                      </span>
                    </div>
                    {user !== null && product.user.id !== user?.id && (
                      <div className="auction-input-price">
                        <input
                          className="price-input"
                          type="number"
                          placeholder="Cena"
                          onChange={(e) => {
                            setNewPrice(e.target.value);
                          }}
                        />
                        <button
                          className="product-buy-button-auction"
                          onClick={handleAuction}
                        >
                          Licitiraj
                        </button>
                      </div>
                    )}
                    <div className="auction-information">
                      {user !== null && (
                        <label className="minimum-price">{`${
                          auction.minimumPrice + parseInt(product.price)
                        } minimum`}</label>
                      )}
                      {auction.user !== null && (
                        <Link
                          to={`/profile/${auction.user.id}`}
                          className="user-header-user"
                        >
                          <label className="user-auction-information">
                            Korisnik: {auction.user.username}
                          </label>
                        </Link>
                      )}
                    </div>
                    <label className="user-auction-information">
                      Preostalo vreme: {auctionTime}
                    </label>
                  </div>
                )}
                <div className="like-div">
                  {user !== null && (
                    <button
                      className="like-product"
                      onClick={checkLike() ? handleDislike : handleLike}
                    >
                      {`${checkLike() ? "Dislike" : "Like"}`}
                    </button>
                  )}
                  <div className="number-of-like-wish">
                    <label className="number-of-like">
                      {`${product.numberOfLike.length} ${
                        product.numberOfLike.length === 1 ? "lajk" : "lajkovi"
                      }`}
                    </label>
                    <label className="number-of-wish">
                      {product.numberOfWish.length} osoba zeli
                    </label>
                  </div>
                </div>
                {user !== null && (
                  <button
                    className="product-wish-button"
                    onClick={checkIfWishlist() ? handleUnwish : handleWish}
                  >
                    {`${checkIfWishlist() ? "Dodat" : "Dodaj"} u listi zelja`}
                  </button>
                )}
                <div className="number-of-view-div">
                  <label className="number-of-view">
                    {calculateMark()} ocena
                  </label>
                  <label className="number-of-view">
                    {product.numberOfViewers.length} pregleda
                  </label>
                </div>
                <div className="number-of-view-div">
                  <label className="number-of-view">{product.place.name}</label>
                  <label className="number-of-view"> {product.phone}</label>
                </div>
                <label className="number-of-view">
                  {handleTime(product.date)} {handleDate(product.date)}
                </label>
              </div>
            </section>
            <section className="section-product-info">
              <div className="user-information">
                <div className="user-header">
                  <h3>User information</h3>
                  <Link
                    to={`/profile/${product.user.id}`}
                    className="user-header-product"
                  >
                    <img src={product.user.picture} alt="" />
                  </Link>
                </div>
                <div className="user-information-labels">
                  <label className="user-information-label">
                    Korisnicko ime:
                    <Link
                      style={{
                        textDecoration: "none",
                        color: "black",

                        justifyContent: "right",
                      }}
                      to={`/profile/${product.user.id}`}
                    >
                      <span>{product.user.username}</span>
                    </Link>
                  </label>
                  <label className="user-information-label">
                    Ime:
                    <span className="product-information-span">
                      {product.user.userInformation?.nameUser}
                    </span>
                  </label>
                  <label className="user-information-label">
                    Prezime:
                    <span className="product-information-span">
                      {product.user.userInformation?.surename}
                    </span>
                  </label>
                  <label className="user-information-label">
                    Mesto:
                    <span className="product-information-span">
                      {product.user.userInformation?.place.name}
                    </span>
                  </label>
                  <label className="user-information-label">
                    Broj telefona:
                    <span className="product-information-span">
                      {product.user.userInformation?.phone}
                    </span>
                  </label>
                  <div className="user-information-label">
                    <label className="user-information-label">
                      Vreme kreiranja naloga:
                    </label>
                    <div className="user-information-data-time">
                      <span>
                        {handleTime(product.user.userInformation.date)}{" "}
                      </span>
                      <span>
                        {handleDate(product.user.userInformation.date)}{" "}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="product-info">
                <h3>Detalji proizvoda</h3>
                <div className="product-inform">
                  {product.data.map((p, index) => {
                    return (
                      <article key={index}>
                        <div className="product-information">
                          <label>{p.productInformation.name + " "} </label>
                          <label>{p.data}</label>
                        </div>
                        <hr className="product-hr" />
                      </article>
                    );
                  })}
                </div>
              </div>
            </section>
            <section className="section-product-details">
              <div className="product-details-text">
                <h3>Opis proizvoda</h3>
                <p>{product.details}</p>
              </div>
            </section>
            {!isAddActive && user !== null && (
              <button className="input-review" onClick={handleModal}>
                Add review
              </button>
            )}
            <section className="review-section">
              {currentPosts.map((p, index) => {
                return (
                  <article className="review-article" key={index}>
                    <div className="review-header">
                      <Link
                        to={`/profile/${p.user.id}`}
                        className="user-header-product"
                      >
                        <img
                          className="img-user-review"
                          src={p.user?.picture}
                          alt=""
                        />
                      </Link>
                      <div className="review-mark">
                        <label className="mark-review">
                          Korisnik: {p.user.username}
                        </label>
                        <label className="mark-review">
                          Ocena:{" "}
                          <span className="mark-review-span"> {p.mark}</span>
                        </label>
                      </div>
                    </div>
                    <div className="review-body-comment">
                      <h3>Komentar</h3>
                      <p className="comment-review">{p.coment}</p>
                    </div>
                  </article>
                );
              })}
            </section>
            <Pagination
              postsPerPage={postsPerPage}
              totalPosts={product?.reviews.length}
              paginate={paginate}
              currentPage={currentPage}
            />
            {isAddActive && (
              <div className="section-modal-wrapper">
                <section className="section-modal">
                  <button
                    className="exit-modal"
                    onClick={() => setIsAddActive(false)}
                  >
                    X
                  </button>
                  <h3>Dodaj recenziju</h3>
                  <div className="modal-content">
                    <input
                      type="number"
                      className="modal-input"
                      placeholder="Ocena.."
                      onChange={(e) => {
                        setAddReview({ ...addReview, mark: e.target.value });
                      }}
                    />
                    <textarea
                      className="modal-textarea"
                      placeholder="Komentar..."
                      onChange={(e) => {
                        setAddReview({ ...addReview, coment: e.target.value });
                      }}
                    />
                  </div>
                  <button className="add-review-btn" onClick={handleAddReview}>
                    Dodaj recenziju
                  </button>
                </section>
              </div>
            )}
            <SnackBar
              boolean={updated}
              handleClose={handleCloseSnackbarUpdated}
              severity={severity}
              message={message}
            />
          </>
        )}
      </>
    );
  }
};

export default Product;
