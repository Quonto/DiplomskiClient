import axios from "axios";
import { useState, useEffect } from "react";
import SnackBar from "../../components/snackbar/Snackbar";
import "./register.css";

const Register = () => {
  const [places, setPlaces] = useState([]);
  const [place, setPlace] = useState({});
  const [updated, setUpdated] = useState(null);
  const [severity, setSeverity] = useState("");
  const [message, setMessage] = useState("");

  const [registeredUser, setRegisteredUser] = useState({
    username: "",
    email: "",
    password: "",
    picture: "",
  });

  const [userInformation, setUserInformation] = useState({
    nameUser: "",
    surename: "",
    phone: "",
    place: {},
    date: new Date(),
    data: "",
  });

  useEffect(() => {
    const fetchPlace = async () => {
      let response;
      try {
        response = await axios.get("https://localhost:7113/Place/FetchPlace");
      } catch (error) {
        return;
      }
      setPlaces(response.data);
      setPlace(response.data[0]);
    };
    fetchPlace();
  }, []);

  const handleRegister = async (e) => {
    e.preventDefault();
    const { username, email, password, picture } = registeredUser;

    const newUseInf = {
      ...userInformation,
      place: place,
    };

    const newUser = {
      username,
      email,
      password,
      picture,
      products: [],
      userInformation: newUseInf,
    };

    let response;
    try {
      response = await axios.post(
        "https://localhost:7113/User/InputUser",
        newUser
      );
    } catch (error) {
      console.log(error);
      setMessage(error.response.data);
      setSeverity("error");
      setUpdated(true);
      return;
    }
    setMessage("Uspešno dodat korisnik");
    setSeverity("success");
    setUpdated(true);
    response && window.location.replace("/login");
  };

  const readFileDataAsBase64 = (e) => {
    const file = e.target.files[0];

    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (event) => {
        resolve(event.target.result);
      };

      reader.onerror = (err) => {
        reject(err);
      };

      reader.readAsDataURL(file);
    });
  };

  const handleUploadFile = (e) => {
    readFileDataAsBase64(e).then((data) => {
      setRegisteredUser({ ...registeredUser, picture: data });
    });
  };

  const handleCloseSnackbarUpdated = () => {
    setUpdated(false);
  };

  const handleChangePlaces = (e) => {
    setPlace(places[e.target.value]);
  };

  return (
    <section className="register">
      <form className="register-form" onSubmit={handleRegister}>
        <label htmlFor="username" className="register-label">
          Username
        </label>
        <input
          name="username"
          className="register-input"
          placeholder="Username"
          onChange={(e) =>
            setRegisteredUser({ ...registeredUser, username: e.target.value })
          }
        ></input>
        <label htmlFor="email" className="register-label">
          Email
        </label>
        <input
          name="email"
          className="register-input"
          placeholder="Email"
          onChange={(e) =>
            setRegisteredUser({ ...registeredUser, email: e.target.value })
          }
        ></input>
        <label htmlFor="password" className="register-label">
          Password
        </label>
        <input
          name="password"
          type="password"
          className="register-input"
          placeholder="Password"
          onChange={(e) =>
            setRegisteredUser({ ...registeredUser, password: e.target.value })
          }
        ></input>
        <label htmlFor="name" className="register-label">
          Name
        </label>
        <input
          name="name"
          className="register-input"
          placeholder="Name"
          onChange={(e) =>
            setUserInformation({ ...userInformation, nameUser: e.target.value })
          }
        ></input>
        <label htmlFor="surename" className="register-label">
          Surename
        </label>
        <input
          name="surename"
          className="register-input"
          placeholder="Surename"
          onChange={(e) =>
            setUserInformation({ ...userInformation, surename: e.target.value })
          }
        ></input>
        <label htmlFor="phone" className="register-label">
          Phone
        </label>
        <input
          name="phone"
          className="register-input"
          placeholder="Phone"
          onChange={(e) =>
            setUserInformation({ ...userInformation, phone: e.target.value })
          }
        ></input>
        <label htmlFor="place" className="register-label">
          Place
        </label>
        {places && (
          <select
            className="register-input"
            name="place"
            onChange={handleChangePlaces}
          >
            {places?.map((p, i) => {
              return (
                <option key={i} value={i}>
                  {p.name}
                </option>
              );
            })}
          </select>
        )}
        <button type="submit" className="register-button">
          Register
        </button>
      </form>
      <section className="section-register-image">
        <label htmlFor="picture" className="register-label">
          Picture
        </label>
        <input
          type="file"
          name="picture"
          className="section-input-file"
          onChange={handleUploadFile}
        ></input>
        {registeredUser.picture !== "" && (
          <div className="section-image">
            <img
              className="section-image-preview"
              src={registeredUser.picture}
              alt="Slika"
            />
          </div>
        )}
        <label htmlFor="data" className="register-label">
          Description
        </label>
        <textarea
          name="data"
          className="register-description"
          placeholder="Description"
          onChange={(e) =>
            setUserInformation({ ...userInformation, data: e.target.value })
          }
        ></textarea>
      </section>
      <SnackBar
        boolean={updated}
        handleClose={handleCloseSnackbarUpdated}
        severity={severity}
        message={message}
      />
    </section>
  );
};

export default Register;
