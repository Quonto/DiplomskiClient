import React, { useContext, useEffect, useState } from "react";

const AppContext = React.createContext();

const getLocalStorage = () => {
  let newUser = localStorage.getItem("user");
  if (newUser) {
    return (newUser = JSON.parse(localStorage.getItem("user")));
  } else return null;
};

const AppProvider = ({ children }) => {
  const [user, setUser] = useState(getLocalStorage());
  const [cart, setCart] = useState([]);

  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    }
  }, [user]);

  return (
    <AppContext.Provider value={{ user, setUser, cart, setCart }}>
      {children}
    </AppContext.Provider>
  );
};

export const useGlobalContext = () => {
  return useContext(AppContext);
};

export { AppContext, AppProvider };
