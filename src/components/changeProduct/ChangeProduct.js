import { useEffect, useRef, useState } from "react";
import "./changeProduct.css";
import Review from "../review/Review";
import { Link } from "react-router-dom";
import UpdateProduct from "../../pages/updateProduct/UpdateProduct";

import axios from "axios";
import Pagination from "../pagination/Pagination";
import SnackBar from "../snackbar/Snackbar";

const ChangeProduct = ({ categories }) => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [currentGroups, setCurrentGroups] = useState([]);
  const [isChangeActive, setIsChangeActive] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [products, setProducts] = useState([]);
  const [isReviewActive, setIsReviewActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(4);
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = products.slice(indexOfFirstPost, indexOfLastPost);
  const [updated, setUpdated] = useState(null);
  const [severity, setSeverity] = useState("");
  const [message, setMessage] = useState("");

  const inputRef = useRef();

  const changeGroup = (e) => {
    if (e.target.value !== "") setSelectedGroup(currentGroups[e.target.value]);
  };

  const changeCategory = (e) => {
    if (e.target.value !== "") setSelectedCategory(categories[e.target.value]);
  };

  const fetchProducts = async () => {
    setLoading(true);
    let response;
    try {
      response = await axios.get(
        `https://localhost:7113/Product/FetchProducts/${selectedGroup.id}`
      );
    } catch (error) {
      return;
    }
    setProducts(response.data);
    setLoading(false);
  };

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleDelete = async (id) => {
    await axios.delete(`https://localhost:7113/Product/RemoveProduct/${id}`);
    setProducts(() => {
      return products.filter((product) => product.id !== id);
    });
  };

  const handleReview = (p) => {
    setSelectedProduct(p);
    setIsReviewActive(true);
  };

  const handleProductName = async () => {
    let response;
    setCurrentPage(1);
    try {
      response = await axios.get(
        `https://localhost:7113/Product/FetchProductName/${selectedGroup.id}/${inputRef.current.value}`
      );
    } catch (error) {
      return;
    }

    setProducts(response.data);
  };

  const handleRefresh = () => {
    inputRef.current.value = "";
    fetchProducts();
  };

  const handleUpdated = () => {
    setMessage("Uspešno ste izmenili proizvod");
    setSeverity("success");
    setUpdated(true);
  };

  useEffect(() => {
    if (selectedGroup) {
      fetchProducts();
    }
  }, [selectedGroup]);

  useEffect(() => {
    if (selectedCategory)
      setCurrentGroups([{ name: "" }, ...selectedCategory.groups]);
  }, [selectedCategory]);

  const handleEditProduct = (p) => {
    setSelectedProduct(p);
    setIsChangeActive(true);
  };

  const handleCloseSnackbarUpdated = () => {
    setUpdated(false);
  };

  return (
    <>
      <div className="ap-change-product">
        <h3>Izmena proizvod</h3>
        <div className="product-category-container">
          <select className="group-settings-select" onChange={changeCategory}>
            {categories.map((category, index) => {
              return (
                <option key={index} value={index}>
                  {category.name}
                </option>
              );
            })}
          </select>
          {selectedCategory && (
            <select className="group-settings-select" onChange={changeGroup}>
              {currentGroups.length !== 0 &&
                currentGroups.map((group, index) => {
                  return (
                    <option key={index} value={index}>
                      {group.name}
                    </option>
                  );
                })}
            </select>
          )}
        </div>
        {selectedGroup && (
          <div className="ap-search-name-product">
            <input
              placeholder="Ime proizvoda..."
              className="ap-search-input"
              ref={inputRef}
            />
            <button className="ap-btn" onClick={handleProductName}>
              Pretraga
            </button>
            <button className="ap-btn" onClick={handleRefresh}>
              Osvezi
            </button>
          </div>
        )}

        {currentPosts.length !== 0 && (
          <>
            {loading ? (
              <h2>Loading...</h2>
            ) : (
              <section className="section-products-pagination">
                <section className="ap-section-products">
                  {currentPosts.map((product, index) => {
                    return (
                      <div className="ap-single-product" key={index}>
                        <Link
                          className="ap-product-link"
                          to={`/categories/group/${product.group}/product/${product.id}`}
                        >
                          <img
                            src={product.picture[0]?.data}
                            alt=""
                            className="ap-product-image"
                          />
                          <label className="ap-product-name">
                            {product.name}
                          </label>
                        </Link>
                        <div className="ap-product-profile-buttons">
                          <button
                            className="ap-product-profile-button"
                            onClick={() => handleDelete(product.id)}
                          >
                            Izbrisi
                          </button>
                          <button
                            className="ap-product-profile-button"
                            onClick={(e) => handleEditProduct(product)}
                          >
                            Izmeni
                          </button>
                          <button
                            className="ap-product-profile-button"
                            onClick={() => handleReview(product)}
                          >
                            Recenzije
                          </button>
                        </div>
                      </div>
                    );
                  })}
                  <Pagination
                    postsPerPage={postsPerPage}
                    totalPosts={products.length}
                    paginate={paginate}
                    currentPage={currentPage}
                  />
                </section>
              </section>
            )}
          </>
        )}
      </div>
      {isChangeActive && (
        <UpdateProduct
          setIsChangeActive={setIsChangeActive}
          selectedPr={selectedProduct}
          setSelectedPr={setSelectedProduct}
          setUserProducts={setProducts}
          userProducts={products}
          handleUpdated={handleUpdated}
        ></UpdateProduct>
      )}
      {isReviewActive && (
        <Review
          setIsReviewActive={setIsReviewActive}
          isProduct={true}
          id={selectedProduct.id}
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

export default ChangeProduct;
