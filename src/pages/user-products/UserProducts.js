import { useEffect, useState } from "react";
import axios from "axios";
import { useGlobalContext } from "../../context/Context";
import "./userproducts.css";

const UserProducts = () => {
  const [myProducts, setMyProducts] = useState([]);
  const [userBuy, setUserBuy] = useState([]);
  const [auctionTime, setAuctionTime] = useState(null);
  const [productPrice, setProductPrice] = useState(null);
  const [isReturnActive, setIsReturnActive] = useState(false);
  const { user } = useGlobalContext();

  const handleBackProduct = async (id) => {
    await axios.put(`https://localhost:7113/User/InputProduct/${id}`);
    let newProducts = myProducts.filter((product) => product.id !== id);
    setMyProducts(newProducts);
  };

  const handleSoldProduct = async (id) => {
    const response = await axios.delete(
      `https://localhost:7113/User/RemoveProduct/${id}`
    );
    let newProducts = myProducts.filter((product) => product.id !== id);
    setMyProducts(newProducts);
  };

  useEffect(() => {
    const fetchProducts = async () => {
      const response = await axios.get(
        `https://localhost:7113/User/FetchUserProducts/${user.id}`
      );
      console.log(response.data);
      if (response.data.length !== 0) {
        try {
          const responseUser = await axios.get(
            `https://localhost:7113/User/FetchUser/${response.data[0].buyUser}`
          );
          setMyProducts(response.data);
          setUserBuy(responseUser.data);
        } catch (error) {
          setMyProducts(response.data);
          setUserBuy(null);
        }
      }
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

  const handleAuctionReturn = () => {
    setIsReturnActive(true);
  };

  const handleChangeTime = (e) => {
    setAuctionTime(parseInt(e.target.value));
  };

  const handleAuction = async (product) => {
    const auction = await axios.get(
      `https://localhost:7113/Auction/FetchAuction/${product.id}`
    );

    const currentTime = new Date();
    currentTime.setHours(currentTime.getHours() + 2);

    const newProduct = {
      id: product.id,
      price: parseInt(productPrice),
      date: currentTime,
      buy: false,
    };

    await axios.put(`https://localhost:7113/User/UpdateProduct`, newProduct);

    currentTime.setDate(currentTime.getDate() + auctionTime);

    const newAuction = {
      id: auction.data.id,
      time: currentTime,
      minimumPrice: parseInt((productPrice / 100) * 5),
      user: null,
    };
    console.log(newAuction);
    await axios.put(`https://localhost:7113/User/UpdateAuction`, newAuction);

    let newProducts = myProducts.filter((product) => product.id !== product.id);
    setMyProducts(newProducts);
  };

  return (
    <div className="user-product-div">
      {myProducts.map((product) => {
        return (
          <>
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
              </div>
              {userBuy && (
                <div className="user-buy">
                  <div className="user-buy-information">
                    <label>Slika: </label>
                    <img
                      src={userBuy.picture.length === 0 ? "" : userBuy.picture}
                      alt=""
                    />
                  </div>
                  <div className="user-buy-information">
                    <label>Korisnik: </label>
                    <span>{userBuy.username}</span>
                  </div>
                  <div className="user-buy-information">
                    <label>Ime: </label>
                    <span>{userBuy.userInformation.nameUser}</span>
                  </div>
                  <div className="user-buy-information">
                    <label>Prezime: </label>
                    <span>{userBuy.userInformation.surename}</span>
                  </div>
                  <div className="user-buy-information">
                    <label>Kontakt: </label>
                    <span>{userBuy.userInformation.phone}</span>
                  </div>
                  <div className="user-buy-information">
                    <label>Mesto: </label>
                    <span>{userBuy.userInformation.place.name}</span>
                  </div>
                </div>
              )}
              <div className="button-list">
                <button
                  className="sell-btn"
                  onClick={() => handleSoldProduct(product.id)}
                >
                  {userBuy !== null ? "Prodato" : "Izbrisi Proizvod"}
                </button>
                <button
                  className="sell-btn"
                  onClick={() =>
                    product.auction
                      ? handleAuctionReturn()
                      : handleBackProduct(product.id)
                  }
                >
                  Vrati ponudu
                </button>
                <div className="button-info">{`${product.numberOfWish.length} zeli ovaj proizvod`}</div>
                <div className="button-info">{`${product.numberOfViewers.length} pregleda`}</div>
                <div className="button-info">{`${product.numberOfLike.length} lajkova`}</div>
              </div>
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
                    <button
                      className="sell-button"
                      onClick={() => handleAuction(product)}
                    >
                      Vrati u ponudu
                    </button>
                  </div>
                </section>
              )}
            </div>
          </>
        );
      })}
    </div>
  );
};

export default UserProducts;
