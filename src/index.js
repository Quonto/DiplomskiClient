import ReactDOM from "react-dom/client";
import App from "./App";
import "./global.css";
import { AppProvider } from "./context/Context";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <AppProvider>
    <App />
  </AppProvider>
);
