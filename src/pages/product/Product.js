import axios from "axios";
import { useState } from "react";
import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import "./product.css";
import { useGlobalContext } from "../../context/Context";

const Product = () => {
  const [isAddActive, setIsAddActive] = useState(false);
  const [addReview, setAddReview] = useState({
    mark: "",
    coment: "",
  });

  const { id_product } = useParams();

  const { user, setCart } = useGlobalContext();

  const [product, setProduct] = useState(null);

  const handleModal = () => {
    setIsAddActive(!isAddActive);
  };
  const handleAddReview = async () => {
    console.log(addReview);
    const response = await axios.post(
      `https://localhost:7113/User/InputReview?id_product=${id_product}&id_user=${user.id}`,
      addReview
    );
    const newReview = {
      id: response.data.id,
      mark: parseInt(addReview.mark),
      coment: addReview.coment,
      user: response.data.user,
    };
    const newReviews = [...product.reviews, newReview];
    setProduct({ ...product, reviews: newReviews });
    setIsAddActive(false);
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
    const response = await axios.post(
      `https://localhost:7113/User/InputNumberOfWish?id_product=${id_product}`,
      { idUser: user.id }
    );
    let newWishlist = [
      ...product.numberOfWish,
      { id: response.data, idUser: user.id },
    ];
    setProduct({ ...product, numberOfWish: newWishlist });
  };
  const handleLike = async () => {
    const response = await axios.post(
      `https://localhost:7113/User/InputNumberOfLike?id_product=${id_product}`,
      { idUser: user.id }
    );
    let newLikelist = [
      ...product.numberOfLike,
      { id: response.data, idUser: user.id },
    ];
    setProduct({ ...product, numberOfLike: newLikelist });
  };
  const handleUnwish = async () => {
    let wish = product.numberOfWish.find((nm) => nm.idUser === user.id);

    await axios.delete(
      `https://localhost:7113/User/RemoveNumberOfWish/${wish.id}`
    );
    let newWishlist = product.numberOfWish.filter((wsh) => wsh.id !== wish.id);
    setProduct({ ...product, numberOfWish: newWishlist });
  };
  const handleDislike = async () => {
    let like = product.numberOfLike.find((nm) => nm.idUser === user.id);
    await axios.delete(
      `https://localhost:7113/User/RemoveNumberOfLike/${like.id}`
    );

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
  useEffect(() => {
    const fetchProduct = async () => {
      const res = await axios.post(
        `https://localhost:7113/User/InputNumberOfView?id_product=${id_product}`,
        { idUser: user.id }
      );
      const response = await axios.get(
        `https://localhost:7113/User/FetchSingleProduct?id_product=${id_product} `
      );
      setProduct(response.data);
    };
    fetchProduct();
  }, [id_product]);

  if (product) {
    return (
      <>
        <section className="section-product">
          <div className="product-picture">
            <img
              src={product?.picture[0].data}
              alt=""
              className="product-picture-img"
            />
          </div>
          <div className="product-buy">
            <h3 className="product-name">{product.name}</h3>
            <label className="product-price">
              Cena:
              <span className="product-price-span">{product.price} RSD</span>
            </label>
            <button className="product-buy-button">Kupi</button>
            <div className="like-div">
              <button
                className="like-product"
                onClick={checkLike() ? handleDislike : handleLike}
              >
                {`${checkLike() ? "Dislike" : "Like"}`}
              </button>
              <div className="number-of-like-wish">
                <label className="number-of-like">
                  {`${product.numberOfLike.length} ${
                    product.numberOfLike.length === 1 ? "like" : "likes"
                  }`}
                </label>
                <label className="number-of-wish">
                  {product.numberOfWish.length} osoba zeli
                </label>
              </div>
            </div>
            <button
              className="product-buy-button"
              onClick={checkIfWishlist() ? handleUnwish : handleWish}
            >
              {`${checkIfWishlist() ? "Dodat" : "Dodaj"} u listi zelja`}
            </button>

            <label className="number-of-view">{calculateMark()} ocena</label>
            <label className="number-of-view">
              {product.numberOfViewers.length} pregleda
            </label>
          </div>
          <div className="user-information">
            <div className="user-header">
              <h3>User information</h3>
              <img src={product.user.picture} alt="" />
            </div>
            <label className="user-information-label">
              Korisnicko ime:
              <span>{product.user.username}</span>
            </label>
            <label className="user-information-label">
              Ime:
              <span className="product-information-span">
                {product.user.userInformation?.name}
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
                {product.user.userInformation?.place}
              </span>
            </label>
            <label className="user-information-label">
              Broj telefona:
              <span className="product-information-span">
                {product.user.userInformation?.phone}
              </span>
            </label>
            <label className="user-information-label">
              Vreme kreiranja naloga:
              <span className="product-information-span">
                {product.user.userInformation?.date}
              </span>
            </label>
          </div>
        </section>
        <section className="section-product-details">
          <div className="product-info">
            <h3>Detalji proizvoda</h3>
            <div className="product-inform">
              {product.data.map((p) => {
                return (
                  <>
                    <div className="product-information">
                      <label>{p.productInformation.name} </label>
                      <label>{p.data}</label>
                    </div>
                    <hr className="product-hr" />
                  </>
                );
              })}
            </div>
          </div>
          <div className="product-details-text">
            <h3>Opis proizvoda</h3>
            <p>{product.details}</p>
          </div>
        </section>
        {!isAddActive && (
          <button className="input-review" onClick={handleModal}>
            Add review
          </button>
        )}
        <hr className="line-comment"></hr>
        <section className="review-section">
          {product.reviews.map((p) => {
            return (
              <article className="review-article">
                <div className="review-header">
                  <img
                    className="img-user-review"
                    src={p.user.picture}
                    alt=""
                  />
                  <label className="mark-review">
                    Ocena: <span className="mark-review-span"> {p.mark}</span>
                  </label>
                </div>
                <div className="review-body-comment">
                  <h3>Komentar</h3>
                  <p className="comment-review">{p.coment}</p>
                </div>
              </article>
            );
          })}
        </section>
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
      </>
    );
  }
};

export default Product;
