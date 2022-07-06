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
  console.log(`Pribavljen user iz localStorage: ${user}`);

  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    }
  }, [user]);

  return (
    <AppContext.Provider value={{ user, setUser }}>
      {children}
    </AppContext.Provider>
  );
};

export const useGlobalContext = () => {
  return useContext(AppContext);
};

export { AppContext, AppProvider };
