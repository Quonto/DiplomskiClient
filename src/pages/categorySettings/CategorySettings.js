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
  const [postsPerPage] = useState(2);
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredProducts.slice(
    indexOfFirstPost,
    indexOfLastPost
  );

  const { id_group } = useParams();

  const fetchProducts = async () => {
    setLoading(true);
    const response = await axios.get(
      `https://localhost:7113/Product/FetchProducts/${id_group}`
    );
    setFilteredProducts(response.data);
    setLoading(false);

    setProducts(response.data);
  };

  useEffect(() => {
    const fetchGroup = async () => {
      const response = await axios.get(
        `https://localhost:7113/Group/FetchGroup/${id_group}`
      );
      setGroup(response.data);
      setProductInformation(response.data.productInformation);
    };
    fetchProducts();
    fetchGroup();
  }, [id_group]);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <section className="category-settings">
      {group && (
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
            />
            {!loading && (
              <Pagination
                postsPerPage={postsPerPage}
                totalPosts={filteredProducts.length}
                paginate={paginate}
              />
            )}
          </div>
        </>
      )}
    </section>
  );
};

export default CategorySettings;
