import axios from "axios";
import { useState } from "react";
import SnackBar from "../../components/snackbar/Snackbar";
import { useGlobalContext } from "../../context/Context";

import "./login.css";

const Login = () => {
  const [login, setLogin] = useState({
    username: "",
    password: "",
  });
  const [updated, setUpdated] = useState(null);
  const [severity, setSeverity] = useState("");
  const [message, setMessage] = useState("");

  const { setUser } = useGlobalContext();

  const handleLogin = async (e) => {
    e.preventDefault();
    let response;
    try {
      response = await axios.post(
        "https://localhost:7113/User/FetchUser",
        login
      );
    } catch (error) {
      setMessage(error.response.data);
      setSeverity("error");
      setUpdated(true);
      return;
    }

    setUser(response.data);
    setTimeout(() => window.location.replace("/"), 500);
  };

  const handleCloseSnackbarUpdated = () => {
    setUpdated(false);
  };

  return (
    <div className="login">
      <form className="login-form" onSubmit={handleLogin}>
        <label className="login-label" htmlFor="username">
          Username
        </label>
        <input
          className="login-input"
          name="username"
          placeholder="Username"
          onChange={(e) => setLogin({ ...login, username: e.target.value })}
        ></input>
        <label className="login-label" htmlFor="password">
          Password
        </label>
        <input
          className="login-input"
          name="password"
          placeholder="Password"
          onChange={(e) => setLogin({ ...login, password: e.target.value })}
          type="password"
        ></input>
        <button type="submit" className="login-button">
          Login
        </button>
      </form>
      <SnackBar
        boolean={updated}
        handleClose={handleCloseSnackbarUpdated}
        severity={severity}
        message={message}
      />
    </div>
  );
};

export default Login;
