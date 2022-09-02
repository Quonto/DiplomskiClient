import "./profile.css";
import axios from "axios";
import { useParams, useLocation, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import ImageEditor from "../imageEditor/ImageEditor";
import UpdateProduct from "../updateProduct/UpdateProduct";
import { useGlobalContext } from "../../context/Context";

const Profile = () => {
  const { id_user } = useParams();
  const [userProfile, setUserProfile] = useState(null);
  const [isImageEditorActive, setIsImageEditorActive] = useState(false);
  const [userProducts, setUserProducts] = useState([]);
  const [isChangeActive, setIsChangeActive] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedPI, setSelectedPI] = useState(false);
  const [updateUser, setUpdateUser] = useState(null);
  const [places, setPlaces] = useState([]);

  const { user, setUser } = useGlobalContext();

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

  useEffect(() => {
    const fetchProfile = async () => {
      const response = await axios.get(
        `https://localhost:7113/User/FetchUser/${id_user}`
      );
      setUserProfile(response.data);
      setUpdateUser(response.data.userInformation);
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

  const handleEditImage = async (image) => {
    setUserProfile({ ...userProfile, picture: image });
    const response = await axios.put(
      `https://localhost:7113/User/UpdateUserPicture`,
      { id: userProfile.id, picture: image }
    );
    setUser({ ...user, picture: image });
  };

  const handleDelete = async (id) => {
    await axios.delete(`https://localhost:7113/User/RemoveProduct/${id}`);
    setUserProducts(() => {
      return userProducts.filter((product) => product.id !== id);
    });
  };

  const handleChangeProfileInfo = () => {
    setSelectedPI(!selectedPI);
  };

  const handleChangePlaces = (e) => {
    console.log(e.target.value);
    console.log(updateUser);
    setUpdateUser({
      ...updateUser,
      place: places[e.target.value],
    });
  };

  const handleUpdateInfo = async () => {
    console.log(userProfile);
    const response = await axios.put(
      "https://localhost:7113/User/UpdateUserProductInformation",
      updateUser
    );
    if (response) {
      setUserProfile({ ...userProfile, userInformation: updateUser });
    }
    setSelectedPI(false);
  };

  useEffect(() => {
    const fetchPlaces = async () => {
      const response = await axios.get(
        `https://localhost:7113/Category/FetchPlace`
      );
      setPlaces([{ name: "" }, ...response.data]);
    };
    fetchPlaces();
  }, []);

  if (userProfile) {
    return (
      <>
        <div className="profile">
          <section className="section-profile-image">
            {isImageEditorActive && (
              <ImageEditor
                selectedImage={{ data: userProfile.picture }}
                setIsImageEditorActive={setIsImageEditorActive}
                handleEditImage={handleEditImage}
              />
            )}
            <img src={userProfile.picture} alt="" className="profile-image" />
            {user.id == userProfile.id && (
              <button
                className="edit-button"
                onClick={() => setIsImageEditorActive(true)}
              >
                Izmeni sliku
              </button>
            )}
            <div className="time-create-user">
              {" "}
              <label htmlFor="" className="time-create-user-label">
                Vreme kreiranja naloga
              </label>
              <label className="date-create-profile">
                {handleTime(updateUser.date) + " "}
                {handleDate(updateUser.date)}
              </label>
            </div>
          </section>
          <section className="profile-information">
            <div className="current-information-wrapper">
              <div className="current-information">
                <label htmlFor="name" className="profile-name-label">
                  Ime
                </label>
                {selectedPI ? (
                  <input
                    defaultValue={updateUser.nameUser}
                    onChange={(e) =>
                      setUpdateUser({ ...updateUser, nameUser: e.target.value })
                    }
                    placeholder="Ime"
                  />
                ) : (
                  <div className="profile-name" htmlFor="name">
                    {userProfile.userInformation.nameUser}
                  </div>
                )}
              </div>
              <div className="current-information">
                <label htmlFor="name" className="profile-name-label">
                  Prezime
                </label>
                {selectedPI ? (
                  <input
                    placeholder="Prezime"
                    defaultValue={updateUser.surename}
                    onChange={(e) =>
                      setUpdateUser({
                        ...updateUser,
                        surename: e.target.value,
                      })
                    }
                  />
                ) : (
                  <div className="profile-name" htmlFor="name">
                    {userProfile.userInformation.surename}
                  </div>
                )}
              </div>
            </div>
            <div className="current-information-wrapper">
              <div className="current-information">
                <label htmlFor="name" className="profile-name-label">
                  Mesto
                </label>
                {selectedPI ? (
                  <select
                    className="add-product-select"
                    onChange={handleChangePlaces}
                  >
                    {places.length !== 0 &&
                      places.map((p, i) => {
                        console.log(p);
                        return (
                          <option
                            selected={updateUser.place.name === p.name}
                            key={i}
                            value={i}
                          >
                            {p.name}
                          </option>
                        );
                      })}
                  </select>
                ) : (
                  <div className="profile-name" htmlFor="name">
                    {userProfile.userInformation.place.name}
                  </div>
                )}
              </div>
              <div className="current-information">
                <label htmlFor="name" className="profile-name-label">
                  Broj Telefona
                </label>
                {selectedPI ? (
                  <input
                    placeholder="Phone"
                    defaultValue={updateUser.phone}
                    onChange={(e) =>
                      setUpdateUser({
                        ...updateUser,
                        phone: e.target.value,
                      })
                    }
                  />
                ) : (
                  <div className="profile-name" htmlFor="name">
                    {userProfile.userInformation.phone}
                  </div>
                )}
              </div>
            </div>
            <div className="current-information-details">
              <div className="current-information">
                <label className="profile-name-label">Opis</label>
                {selectedPI ? (
                  <textarea
                    className="user-data"
                    defaultValue={updateUser.data}
                    onChange={(e) =>
                      setUpdateUser({
                        ...updateUser,
                        data: e.target.value,
                      })
                    }
                  ></textarea>
                ) : (
                  <p className="user-data">
                    <i>{`"${updateUser.data}"`}</i>
                  </p>
                )}
              </div>
            </div>
            <div className="current-information-wrapper">
              {" "}
              <div className="current-information">
                {user.id == userProfile.id && (
                  <button
                    className="edit-button"
                    onClick={
                      selectedPI ? handleUpdateInfo : handleChangeProfileInfo
                    }
                  >
                    {selectedPI ? "Sacuvaj" : "Izmeni"}
                  </button>
                )}
              </div>
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
            </div>
            <div className="current-information">
              <div className="current-information-info">
                {user.id == userProfile.id && (
                  <label htmlFor="name" className="profile-name-password">
                    Sifra
                  </label>
                )}
              </div>
            </div>
            <div className="current-information-wrapper">
              <div className="current-information">
                {user.id == userProfile.id && (
                  <button className="edit-button">Izmeni</button>
                )}
              </div>
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
                  {user.id == userProfile.id && (
                    <div className="product-profile-button">
                      <button
                        className="change-product"
                        onClick={() => handleDelete(product.id)}
                      >
                        Izbrisi
                      </button>
                      <button
                        className="change-product"
                        onClick={() => handleOpenUpdate(product)}
                      >
                        Izmeni
                      </button>
                    </div>
                  )}
                </div>
              </>
            );
          })}
        </div>
        {isChangeActive && (
          <UpdateProduct
            setIsChangeActive={setIsChangeActive}
            selectedPr={selectedProduct}
            setSelectedPr={setSelectedProduct}
            setUserProducts={setUserProducts}
            userProducts={userProducts}
          ></UpdateProduct>
        )}
      </>
    );
  }
};

export default Profile;
