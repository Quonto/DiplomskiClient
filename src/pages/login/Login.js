import axios from "axios";
import { useState } from "react";
import "../login.css";

const Login = () => {
  const [login, setLogin] = useState({
    username: "",
    password: "",
  });

  const handleLogin = async (e) => {
    e.preventDefault();
    const response = await axios.post(
      "https://localhost:5001/User/FetchUser",
      login
    );
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
    </div>
  );
};

export default Login;
