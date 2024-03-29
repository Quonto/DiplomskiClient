import axios from "axios";
import { useEffect, useState } from "react";
import ImageEditor from "../../pages/imageEditor/ImageEditor";
import Review from "../review/Review";
import SnackBar from "../snackbar/Snackbar";
import "./changeUser.css";

const ChangeUser = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isImageEditorActive, setIsImageEditorActive] = useState(false);
  const [selectedInfo, setSelectedInfo] = useState(false);
  const [updateUser, setUpdateUser] = useState(null);
  const [places, setPlaces] = useState([]);
  const [isReviewActive, setIsReviewActive] = useState(false);
  const [updated, setUpdated] = useState(null);
  const [severity, setSeverity] = useState("");
  const [message, setMessage] = useState("");

  const handleSetUser = (u) => {
    setSelectedUser(u);
  };

  const handleChangePlaces = (e) => {
    setUpdateUser({
      ...updateUser,
      place: places[e.target.value],
    });
  };

  const handleEditImage = async (image) => {
    try {
      await axios.put(`https://localhost:7113/User/UpdateUserPicture`, {
        id: selectedUser.id,
        picture: image,
      });
    } catch (error) {
      console.log(error);
      setMessage(error.response.data);
      setSeverity("error");
      setUpdated(true);
      return;
    }
    setSelectedUser({ ...selectedUser, picture: image });
    const newUsers = users.map((user) => {
      if (user.id === selectedUser.id) return { ...user, picture: image };
      else return user;
    });
    setUsers(newUsers);
    setMessage("Uspešno izmenjena slika");
    setSeverity("success");
    setUpdated(true);
  };

  const handleChangeInformation = () => {
    setUpdateUser(selectedUser.userInformation);
    setSelectedInfo(true);
  };

  const handleImageEditor = () => {
    setIsImageEditorActive(true);
  };

  const handleCancel = () => {
    setUpdateUser(null);
    setSelectedInfo(false);
  };

  const handleUpdateInfo = async () => {
    try {
      await axios.put(
        "https://localhost:7113/User/UpdateUserProductInformation",
        updateUser
      );
    } catch (error) {
      setMessage(error.response.data);
      setSeverity("error");
      setUpdated(true);
      return;
    }
    setSelectedUser({ ...selectedUser, userInformation: updateUser });
    setSelectedInfo(false);
    const newUsers = users.map((user) => {
      if (user.id === selectedUser.id)
        return { ...user, userInformation: updateUser };
      else return user;
    });
    setUpdateUser(null);
    setUsers(newUsers);
    setMessage("Uspešno izmenjene informacije korisnika");
    setSeverity("success");
    setUpdated(true);
  };

  const handleDelete = async (id) => {
    console.log(id);
    await axios.delete(`https://localhost:7113/User/RemoveUser/${id}`);
    const newUsers = users.filter((user) => id !== user.id);
    setUsers(newUsers);
  };

  useEffect(() => {
    const fetchUsers = async () => {
      let response;
      try {
        response = await axios.get("https://localhost:7113/User/FetchAllUsers");
      } catch (error) {
        setMessage(error.response.data);
        setSeverity("info");
        setUpdated(true);
        return;
      }
      setUsers(response.data);
    };

    const fetchPlaces = async () => {
      let response;
      try {
        response = await axios.get(`https://localhost:7113/Place/FetchPlace`);
      } catch (error) {
        setMessage(error.response.data);
        setSeverity("info");
        setUpdated(true);
        return;
      }

      setPlaces([{ name: "" }, ...response.data]);
    };
    fetchPlaces();
    fetchUsers();
  }, []);

  const handleCloseSnackbarUpdated = () => {
    setUpdated(false);
  };

  return (
    <>
      <div className="change-user">
        {users.length !== 0 && (
          <div className="change-user-list">
            {users.map((user) => {
              return (
                <div
                  className="change-single-user"
                  key={user.id}
                  onClick={(e) => handleSetUser(user)}
                >
                  <div className="change-user-img-container">
                    <img
                      src={user.picture}
                      alt=""
                      className="change-user-image"
                    />
                  </div>

                  <label className="change-user-name">
                    {user.userInformation.nameUser}{" "}
                    {user.userInformation.surename}
                  </label>
                  <label className="change-user-username">
                    {user.username}
                  </label>
                  <button
                    className="change-user-delete"
                    onClick={(e) => handleDelete(user.id)}
                  >
                    Izbrisi
                  </button>
                </div>
              );
            })}
          </div>
        )}
        <div className="change-user-info">
          {selectedUser && (
            <>
              <div className="change-user-info-image-container">
                <img
                  className="change-user-info-profile-image"
                  src={selectedUser.picture}
                  alt=""
                />
                <button
                  className="change-user-edit-image"
                  onClick={handleImageEditor}
                >
                  Izmena slike
                </button>
                {selectedInfo ? (
                  <>
                    <button
                      className="change-user-edit-image"
                      onClick={handleUpdateInfo}
                    >
                      Sačuvaj izmene
                    </button>
                    <button
                      className="change-user-edit-image"
                      onClick={handleCancel}
                    >
                      Izbriši izmene
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      className="change-user-edit-image"
                      onClick={handleChangeInformation}
                    >
                      Izmena informacija
                    </button>
                    <button
                      className="change-user-edit-image"
                      onClick={() => setIsReviewActive(true)}
                    >
                      Recenzije
                    </button>
                  </>
                )}
              </div>
              <div className="change-user-info-userInfo">
                <label htmlFor="firstname" className="change-user-info-label">
                  Ime:
                </label>
                {selectedInfo ? (
                  <input
                    placeholder="Ime"
                    className="change-user-input"
                    defaultValue={selectedUser.userInformation.nameUser}
                    onChange={(e) =>
                      setUpdateUser({ ...updateUser, nameUser: e.target.value })
                    }
                  />
                ) : (
                  <h4 className="change-user-time-text" name="firstname">
                    {selectedUser.userInformation.nameUser}
                  </h4>
                )}

                <label htmlFor="lastname" className="change-user-info-label">
                  Prezime:
                </label>

                {selectedInfo ? (
                  <input
                    placeholder="Prezime"
                    className="change-user-input"
                    defaultValue={selectedUser.userInformation.surename}
                    onChange={(e) =>
                      setUpdateUser({ ...updateUser, surename: e.target.value })
                    }
                  />
                ) : (
                  <h4 className="change-user-time-text" name="lastname">
                    {selectedUser.userInformation.surename}
                  </h4>
                )}

                <label htmlFor="place" className="change-user-info-label">
                  Mesto:
                </label>
                {selectedInfo ? (
                  <select
                    className="add-product-select"
                    onChange={handleChangePlaces}
                    defaultValue={{
                      label: updateUser.place.name,
                      value: updateUser.place.name,
                    }}
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
                  <h4 className="change-user-time-text" name="place">
                    {selectedUser.userInformation.place.name}
                  </h4>
                )}

                <label htmlFor="number" className="change-user-info-label">
                  Broj telefona:
                </label>
                {selectedInfo ? (
                  <input
                    placeholder="Broj telefona"
                    className="change-user-input"
                    defaultValue={selectedUser.userInformation.phone}
                    onChange={(e) =>
                      setUpdateUser({ ...updateUser, phone: e.target.value })
                    }
                  />
                ) : (
                  <h4 className="change-user-time-text" name="number">
                    {selectedUser.userInformation.phone}
                  </h4>
                )}

                <label htmlFor="desc" className="change-user-info-label">
                  Opis:
                </label>
                {selectedInfo ? (
                  <textarea
                    placeholder="Opis"
                    className="change-user-input-textarea"
                    defaultValue={selectedUser.userInformation.data}
                    onChange={(e) =>
                      setUpdateUser({
                        ...updateUser,
                        data: e.target.value,
                      })
                    }
                  ></textarea>
                ) : (
                  <h4 className="change-user-time-text" name="desc">
                    {selectedUser.userInformation.data}
                  </h4>
                )}
              </div>
            </>
          )}
        </div>
      </div>
      {isImageEditorActive && (
        <ImageEditor
          selectedImage={{ data: selectedUser.picture }}
          setIsImageEditorActive={setIsImageEditorActive}
          handleEditImage={handleEditImage}
        />
      )}
      {isReviewActive && (
        <Review
          setIsReviewActive={setIsReviewActive}
          isProduct={false}
          id={selectedUser.id}
        />
      )}
      <SnackBar
        boolean={updated}
        handleClose={handleCloseSnackbarUpdated}
        severity={severity}
        message={message}
      />
    </>
  );
};

export default ChangeUser;
