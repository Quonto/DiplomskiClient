import "./profile.css";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import ImageEditor from "../imageEditor/ImageEditor";
import UpdateProduct from "../updateProduct/UpdateProduct";
import { useGlobalContext } from "../../context/Context";
import Pagination from "../../components/pagination/Pagination";
import SnackBar from "../../components/snackbar/Snackbar";

const Profile = () => {
  const { id_user } = useParams();
  const [userProfile, setUserProfile] = useState(null);
  const [isImageEditorActive, setIsImageEditorActive] = useState(false);
  const [isChangeActive, setIsChangeActive] = useState(false);
  const [isChangePassword, setIsChangePassword] = useState(false);
  const [isChangeEmail, setIsChangeEmail] = useState(false);
  const [isChangeUsername, setIsChangeUsername] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedPI, setSelectedPI] = useState(false);
  const [userProducts, setUserProducts] = useState([]);
  const [updateUser, setUpdateUser] = useState(null);
  const [places, setPlaces] = useState([]);
  const [password, setPassword] = useState({
    current: "",
    new: "",
    confirm: "",
  });
  const { user, setUser } = useGlobalContext();

  const [mail, setMail] = useState(user.email);

  const [username, setUsername] = useState(user.username);

  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(4);
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = userProducts.slice(indexOfFirstPost, indexOfLastPost);
  const [updated, setUpdated] = useState(null);
  const [severity, setSeverity] = useState("");
  const [message, setMessage] = useState("");

  const handleDate = (date) => {
    const d = date.split("T");
    const da = d[0].split("-");

    return da[2] + "." + da[1] + "." + da[0];
  };

  const handleSavePassword = async () => {
    if (password.new === "") {
      setMessage("Niste uneli šifru");
      setSeverity("error");
      setUpdated(true);
      return;
    }

    const newUser = {
      id: updateUser.id,
      password: password.current,
    };
    try {
      await axios.post(`https://localhost:7113/User/CheckPassword`, newUser);
    } catch (error) {
      setMessage(error.response.data);
      setSeverity("error");
      setUpdated(true);
      return;
    }

    if (password.new !== password.confirm) {
      setMessage("Šifre nisu jednake");
      setSeverity("error");
      setUpdated(true);
      return;
    }

    if (password.current === password.new) {
      setMessage("Uuneli ste istu šifru kao trenutnu");
      setSeverity("error");
      setUpdated(true);
      return;
    }

    try {
      await axios.put("https://localhost:7113/User/UpdatePassword", {
        ...newUser,
        password: password.new,
      });
    } catch (e) {
      setMessage("Trenutna šifra nije validna");
      setSeverity("error");
      setUpdated(true);
    }
    setUser({ ...user, password: password.new });
    setIsChangePassword(false);
    setPassword({ current: "", new: "", confirm: "" });

    setMessage("Uspešno ste izmenili šifru");
    setSeverity("success");
    setUpdated(true);
  };

  const handleCloseSnackbarUpdated = () => {
    setUpdated(false);
  };

  const handleTime = (time) => {
    const d = time.split("T");
    const da = d[1].split(":");

    return da[0] + ":" + da[1];
  };

  const handleOpenUpdate = (p) => {
    setSelectedProduct(p);
    setIsChangeActive(true);
  };

  const handleEditImage = async (image) => {
    setUserProfile({ ...userProfile, picture: image });
    try {
      await axios.put(`https://localhost:7113/User/UpdateUserPicture`, {
        id: userProfile.id,
        picture: image,
      });
    } catch (error) {
      setMessage(error.response.data);
      setSeverity("error");
      setUpdated(true);
      return;
    }
    setUser({ ...user, picture: image });
    setMessage("Uspešno ste izmenili sliku profila");
    setSeverity("success");
    setUpdated(true);
  };

  const handleDelete = async (id) => {
    await axios.delete(`https://localhost:7113/Product/RemoveProduct/${id}`);
    setUserProducts(() => {
      return userProducts.filter((product) => product.id !== id);
    });
  };

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleCancelPassword = () => {
    setPassword({ current: "", new: "", confirm: "" });
    setIsChangePassword(false);
  };

  const handleEditMail = async () => {
    if (mail === "") {
      setMessage("Niste uneli mejl");
      setSeverity("error");
      setUpdated(true);
      return;
    }
    if (mail === userProfile.email) {
      setMessage("Isti mejl");
      setSeverity("error");
      setUpdated(true);
      return;
    }

    const newUser = {
      id: userProfile.id,
      email: mail,
    };
    try {
      await axios.put("https://localhost:7113/User/UpdateUserMail", newUser);
      setUser({ ...user, email: mail });
      setUserProfile({ ...userProfile, email: mail });
    } catch (error) {
      setMessage(error.response.data);
      setSeverity("error");
      setUpdated(true);
      return;
    }

    setIsChangeEmail(false);
    setMail("");
    setMessage("Uspešno ste izmenili mail");
    setSeverity("success");
    setUpdated(true);
  };

  const handleCancelMail = () => {
    setIsChangeEmail(false);
    setMail("");
  };

  const handleEditUsername = async () => {
    if (username === "") {
      setMessage("Korisničko ime je prazno");
      setSeverity("error");
      setUpdated(true);
      return;
    }
    if (username === userProfile.username) {
      setMessage("Korisničko ime je isto");
      setSeverity("error");
      setUpdated(true);
      return;
    }
    const newUser = {
      id: userProfile.id,
      username,
    };
    try {
      await axios.put(
        "https://localhost:7113/User/UpdateUserUsername",
        newUser
      );
      setUser({ ...user, username });
      setUserProfile({ ...userProfile, username });
    } catch (error) {
      setMessage("Korisničko ime već postoji");
      setSeverity("error");
      setUpdated(true);
      return;
    }
    setIsChangeUsername(false);
    setUsername("");
    setMessage("Uspešno ste izmenili korisničko ime");
    setSeverity("success");
    setUpdated(true);
  };

  const handleCancelUsername = () => {
    setIsChangeUsername(false);
  };

  const handleChangeProfileInfo = () => {
    setSelectedPI(!selectedPI);
  };

  const handleChangePlaces = (e) => {
    setUpdateUser({
      ...updateUser,
      place: places[e.target.value],
    });
  };

  const handleUpdateInfo = async () => {
    let response;
    try {
      response = await axios.put(
        "https://localhost:7113/User/UpdateUserProductInformation",
        updateUser
      );
    } catch (error) {
      setMessage(error.response.data);
      setSeverity("error");
      setUpdated(true);
      return;
    }
    if (response) {
      setUserProfile({ ...userProfile, userInformation: updateUser });
      setMessage("Uspešno ste izmenili informacije o korisniku");
      setSeverity("success");
      setUpdated(true);
      setSelectedPI(false);
    }
  };

  useEffect(() => {
    const fetchPlaces = async () => {
      let response;
      try {
        response = await axios.get(`https://localhost:7113/Place/FetchPlace`);
      } catch (error) {
        return;
      }
      setPlaces([{ name: "" }, ...response.data]);
    };
    fetchPlaces();
  }, []);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      let response;
      try {
        response = await axios.get(
          `https://localhost:7113/User/FetchUser/${id_user}`
        );
      } catch (error) {
        return;
      }
      setUserProfile(response.data);
      setUpdateUser(response.data.userInformation);
      setLoading(false);
    };
    fetchProfile();
  }, [id_user]);

  useEffect(() => {
    const fetchUserProducts = async () => {
      setLoading(true);
      let response;
      try {
        response = await axios.get(
          `https://localhost:7113/Product/GetUserProducts/${id_user}`
        );
      } catch (error) {
        return;
      }
      setUserProducts(response.data);
      setLoading(false);
    };
    if (userProfile) {
      fetchUserProducts();
    }
  }, [userProfile, id_user]);

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
            {user !== null && user?.id === userProfile.id && (
              <button
                className="edit-button-image"
                onClick={() => setIsImageEditorActive(true)}
              >
                Izmeni sliku
              </button>
            )}
            <div className="time-create-user">
              {" "}
              <h4 htmlFor="" className="time-create-user-label">
                Vreme kreiranja naloga
              </h4>
              <label className="date-create-profile">
                {handleTime(updateUser.date) + " "}
                {handleDate(updateUser.date)}
              </label>
            </div>
          </section>
          <section className="profile-information-user">
            <div className="current-information">
              <div className="current-information-info">
                <h4 htmlFor="name" className="profile-name-label">
                  Korisničko ime
                </h4>
                {isChangeUsername ? (
                  <input
                    className="change-username"
                    defaultValue={userProfile.username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                ) : (
                  <div className="profile-name" htmlFor="name">
                    {userProfile.username}
                  </div>
                )}
                {user !== null && user?.id === userProfile.id && (
                  <div className="change-password-div">
                    <button
                      className="edit-button"
                      onClick={
                        isChangeUsername
                          ? handleEditUsername
                          : () => setIsChangeUsername(true)
                      }
                    >
                      {isChangeUsername ? "Sacuvaj" : "Izmeni"}
                    </button>
                    {isChangeUsername && (
                      <button
                        className="edit-button"
                        onClick={handleCancelUsername}
                      >
                        Otkazi
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
            <div className="current-information">
              <div className="current-information-info">
                <h4 htmlFor="name" className="profile-name-label">
                  Mejl
                </h4>
                {isChangeEmail ? (
                  <input
                    className="change-mail"
                    defaultValue={userProfile.email}
                    onChange={(e) => setMail(e.target.value)}
                  />
                ) : (
                  <div className="profile-name" htmlFor="name">
                    {userProfile.email}
                  </div>
                )}
                {user !== null && user?.id === userProfile.id && (
                  <div className="change-password-div">
                    <button
                      className="edit-button"
                      onClick={
                        isChangeEmail
                          ? handleEditMail
                          : () => setIsChangeEmail(true)
                      }
                    >
                      {isChangeEmail ? "Sacuvaj" : "Izmeni"}
                    </button>
                    {isChangeEmail && (
                      <button
                        className="edit-button"
                        onClick={handleCancelMail}
                      >
                        Otkazi
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
            <div className="current-information">
              <div className="current-information-info">
                {user !== null && user?.id === userProfile.id && (
                  <h4 htmlFor="name" className="profile-name-password">
                    Sifra
                  </h4>
                )}
                {isChangePassword && (
                  <>
                    <label htmlFor="current" className="current-password-label">
                      Trenutna sifra
                    </label>
                    <input
                      type="password"
                      name="current"
                      className="current-password"
                      onChange={(e) =>
                        setPassword({ ...password, current: e.target.value })
                      }
                    />

                    <label htmlFor="new" className="current-password-label">
                      Nova sifra
                    </label>
                    <input
                      type="password"
                      name="new"
                      className="current-password"
                      onChange={(e) =>
                        setPassword({ ...password, new: e.target.value })
                      }
                    />

                    <label htmlFor="confirm" className="current-password-label">
                      Potvrdna sifra
                    </label>
                    <input
                      type="password"
                      name="confirm"
                      className="current-password"
                      onChange={(e) =>
                        setPassword({ ...password, confirm: e.target.value })
                      }
                    />
                  </>
                )}

                {user !== null && user?.id === userProfile.id && (
                  <div className="change-password-div">
                    <button
                      className="edit-button"
                      onClick={
                        isChangePassword
                          ? handleSavePassword
                          : () => setIsChangePassword(!isChangePassword)
                      }
                    >
                      {isChangePassword ? "Sacuvaj" : "Izmeni"}
                    </button>
                    <>
                      {isChangePassword && (
                        <button
                          className="edit-button"
                          onClick={handleCancelPassword}
                        >
                          Otkazi
                        </button>
                      )}
                    </>
                  </div>
                )}
              </div>
            </div>
          </section>
          <section className="profile-information">
            <div className="current-information-wrapper">
              <div className="current-information">
                <h4 htmlFor="name" className="profile-name-label">
                  Ime
                </h4>
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
                <h4 htmlFor="name" className="profile-name-label">
                  Prezime
                </h4>
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
                <h4 htmlFor="name" className="profile-name-label">
                  Mesto
                </h4>
                {selectedPI ? (
                  <select
                    className="profile-place-select"
                    onChange={handleChangePlaces}
                    defaultValue={updateUser.place.name}
                  >
                    {places.length !== 0 &&
                      places.map((p, i) => {
                        return (
                          <option key={i} value={i}>
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
                <h4 htmlFor="name" className="profile-name-label">
                  Broj Telefona
                </h4>
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
                <h4 className="profile-name-label">Opis</h4>
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
                  <p className="user-data-p">
                    <i>{`"${updateUser.data}"`}</i>
                  </p>
                )}
              </div>
            </div>{" "}
            <div className="current-information-button">
              {user !== null && user?.id === userProfile.id && (
                <>
                  <button
                    className="edit-button-information"
                    onClick={
                      selectedPI ? handleUpdateInfo : handleChangeProfileInfo
                    }
                  >
                    {selectedPI ? "Sacuvaj" : "Izmeni"}
                  </button>

                  {selectedPI && (
                    <button
                      className="edit-button-information"
                      onClick={() => setSelectedPI(!selectedPI)}
                    >
                      Otkaži
                    </button>
                  )}
                </>
              )}
            </div>
          </section>
        </div>
        <div className="profile-product">
          {loading ? (
            <h2>Loading...</h2>
          ) : (
            <>
              {currentPosts.map((product, index) => {
                return (
                  <div className="current-profile-product" key={index}>
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
                    {user !== null && user?.id === userProfile.id && (
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
                );
              })}{" "}
            </>
          )}
          {!loading && (
            <Pagination
              postsPerPage={postsPerPage}
              totalPosts={userProducts.length}
              paginate={paginate}
              currentPage={currentPage}
            />
          )}
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
        <SnackBar
          boolean={updated}
          handleClose={handleCloseSnackbarUpdated}
          severity={severity}
          message={message}
        />
      </>
    );
  }
};

export default Profile;
