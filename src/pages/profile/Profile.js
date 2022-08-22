import "./profile.css";
import axios from "axios";
import { useParams, useLocation, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import UpdateProduct from "../updateProduct/UpdateProduct";

const Profile = () => {
  const { id_user } = useParams();
  const [userProfile, setUserProfile] = useState(null);
  const [userProducts, setUserProducts] = useState([]);
  const [isChangeActive, setIsChangeActive] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedPI, setSelectedPI] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const response = await axios.get(
        `https://localhost:7113/User/FetchUser/${id_user}`
      );
      setUserProfile(response.data);
    };
    fetchProfile();
  }, [id_user]);

  useEffect(() => {
    const fetchUserProducts = async () => {
      const response = await axios.get(
        `https://localhost:7113/User/GetUserProducts/${id_user}`
      );
      setUserProducts(response.data);
    };
    if (userProfile) {
      fetchUserProducts();
    }
  }, [userProfile]);

  const handleOpenUpdate = (p) => {
    setSelectedProduct(p);
    setIsChangeActive(true);
  };

  if (userProfile) {
    return (
      <>
        <div className="profile">
          <section className="section-profile-image">
            <img src={userProfile.picture} alt="" className="profile-image" />
          </section>
          <section className="profile-information">
            <div className="current-information">
              <div className="current-information-info">
                <label htmlFor="name" className="profile-name-label">
                  Ime
                </label>
                <div className="profile-name" htmlFor="name">
                  {userProfile.userInformation.nameUser}
                </div>
              </div>
              <button className="edit-button">Izmeni</button>
            </div>
            <div className="current-information">
              <div className="current-information-info">
                <label htmlFor="name" className="profile-name-label">
                  Prezime
                </label>
                <div className="profile-name" htmlFor="name">
                  {userProfile.userInformation.surename}
                </div>
              </div>
              <button className="edit-button">Izmeni</button>
            </div>
            <div className="current-information">
              <div className="current-information-info">
                <label htmlFor="name" className="profile-name-label">
                  Mesto
                </label>
                <div className="profile-name" htmlFor="name">
                  {userProfile.userInformation.place.name}
                </div>
              </div>
              <button className="edit-button">Izmeni</button>
            </div>
            <div className="current-information">
              <div className="current-information-info">
                <label htmlFor="name" className="profile-name-label">
                  Broj Telefona
                </label>
                <div className="profile-name" htmlFor="name">
                  {userProfile.userInformation.phone}
                </div>
              </div>
              <button className="edit-button">Izmeni</button>
            </div>
          </section>
          <section className="profile-information">
            <div className="current-information">
              <div className="current-information-info">
                <label htmlFor="name" className="profile-name-label">
                  Korisničko ime
                </label>
                <div className="profile-name" htmlFor="name">
                  {userProfile.username}
                </div>
              </div>
              <button className="edit-button">Izmeni</button>
            </div>
            <div className="current-information">
              <div className="current-information-info">
                <label htmlFor="name" className="profile-name-label">
                  Mail
                </label>
                <div className="profile-name" htmlFor="name">
                  {userProfile.email}
                </div>
              </div>
              <button className="edit-button">Izmeni</button>
            </div>
            <div className="current-information">
              <div className="current-information-info">
                <label htmlFor="name" className="profile-name-password">
                  Sifra
                </label>
              </div>
              <button className="edit-button">Izmeni</button>
            </div>
          </section>
        </div>
        <div className="profile-product">
          {userProducts.map((product) => {
            return (
              <>
                <div className="current-profile-product">
                  <Link
                    className="profile-product-link"
                    to={`/categories/group/${product.group}/product/${product.id}`}
                  >
                    <div className="profile-product">
                      <img
                        src={product.picture[0].data}
                        alt=""
                        className="profile-product-image"
                      />
                      <label className="profile-product-name">
                        {product.name}
                      </label>
                    </div>
                  </Link>
                  <div className="product-profile-button">
                    <button className="change-product">Izbrisi</button>
                    <button
                      className="change-product"
                      onClick={() => handleOpenUpdate(product)}
                    >
                      Izmeni
                    </button>
                  </div>
                </div>
              </>
            );
          })}
        </div>
        {isChangeActive && (
          <UpdateProduct
            setIsChangeActive={setIsChangeActive}
            pr={selectedProduct}
          ></UpdateProduct>
        )}
      </>
    );
  }
};

export default Profile;
