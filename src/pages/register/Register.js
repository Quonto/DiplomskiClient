import axios from "axios";
import { useState } from "react";
import "./register.css";

const Register = () => {
  const [registeredUser, setRegisteredUser] = useState({
    username: "",
    email: "",
    password: "",
    picture: "",
  });

  const handleRegister = async (e) => {
    e.preventDefault();
    const { username, email, password, picture } = registeredUser;
    console.log(registeredUser);
    const newUser = { username, email, password, picture, products: [] };
    await axios.post("https://localhost:7113/User/InputUser", newUser);
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
        <button type="submit" className="register-button">
          Register
        </button>
      </form>
      <section className="section-register-image">
        <input
          type="file"
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
      </section>
    </section>
  );
};

export default Register;
