import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import FilterSettings from "../../components/filterSettings/FilterSettings";
import Pagination from "../../components/pagination/Pagination";
import ProductSettings from "../../components/productSettings/ProductSettings";
import "./categorySettings.css";

const CategorySettings = () => {
  const [group, setGroup] = useState(null);
  const [productInformation, setProductInformation] = useState([]);

  const [products, setProducts] = useState([]);

  const [filteredProducts, setFilteredProducts] = useState([]);

  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(5);
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredProducts.slice(
    indexOfFirstPost,
    indexOfLastPost
  );

  const { id_group } = useParams();

  const fetchProducts = async () => {
    setLoading(true);
    let response;
    try {
      response = await axios.get(
        `https://localhost:7113/Product/FetchProducts/${id_group}`
      );
    } catch (error) {
      return;
    }
    setFilteredProducts(response.data);
    setLoading(false);

    setProducts(response.data);
  };

  useEffect(() => {
    const fetchGroup = async () => {
      setLoading(true);
      let response;
      try {
        response = await axios.get(
          `https://localhost:7113/Group/FetchGroup/${id_group}`
        );
      } catch (error) {
        return;
      }
      setGroup(response.data);
      setProductInformation(response.data.productInformation);
      setLoading(false);
    };
    fetchProducts();
    fetchGroup();
  }, [id_group]);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <section className="category-settings">
      <>
        <FilterSettings
          productInformation={productInformation}
          filteredProducts={filteredProducts}
          setFilteredProducts={setFilteredProducts}
          products={products}
        />
        <div className="product-settings">
          <ProductSettings
            group={group}
            filteredProducts={currentPosts}
            currentFilteredProducts={filteredProducts}
            setFilteredProducts={setFilteredProducts}
            fetchProducts={fetchProducts}
            loading={loading}
            setLoading={setLoading}
            setCurrentPage={setCurrentPage}
          />
          {!loading && (
            <Pagination
              postsPerPage={postsPerPage}
              totalPosts={filteredProducts.length}
              paginate={paginate}
              currentPage={currentPage}
            />
          )}
        </div>
      </>
    </section>
  );
};

export default CategorySettings;
