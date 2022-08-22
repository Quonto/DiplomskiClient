import Home from "./pages/home/Home";
import Navbar from "./components/navbar/Navbar";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Categories from "./pages/categories/Categories";
import CategorySettings from "./pages/categorySettings/CategorySettings";
import Register from "./pages/register/Register";
import Login from "./pages/login/Login";
import AddProduct from "./pages/addProduct/AddProduct";
import AdminPanel from "./pages/adminPanel/AdminPanel";
import { useGlobalContext } from "./context/Context";
import Product from "./pages/product/Product";
import Cart from "./pages/cart/Cart";
import UserProducts from "./pages/user-products/UserProducts";
import Profile from "./pages/profile/Profile";

const App = () => {
  const { user } = useGlobalContext();

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={user?.isAdmin ? <AdminPanel /> : <Home />} />
        <Route path="/categories" element={<Categories />} />
        <Route
          path="/categories/group/:id_group"
          element={<CategorySettings />}
        />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/add-product" element={<AddProduct />} />
        <Route
          path="/categories/group/:id_group/product/:id_product"
          element={<Product />}
        />
        <Route path="/cart" element={<Cart />} />
        <Route path="/user-products" element={<UserProducts />}></Route>
        <Route path="/profile/:id_user" element={<Profile />}></Route>
      </Routes>
    </Router>
  );
};

export default App;
