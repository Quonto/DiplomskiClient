import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import FilterSettings from "../../components/filterSettings/FilterSettings";
import ProductSettings from "../../components/productSettings/ProductSettings";
import "./categorySettings.css";

const CategorySettings = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [group, setGroup] = useState(null);
  const [productInformation, setProductInformation] = useState([]);

  const { id_group } = useParams();

  useEffect(() => {
    const fetchProducts = async () => {
      const response = await axios.get(
        `https://localhost:7113/User/FetchProducts?id_group=${id_group}`
      );
      console.log(response.data);
      setProducts(response.data);
      setFilteredProducts(response.data);
    };
    const fetchGroup = async () => {
      const response = await axios.get(
        `https://localhost:7113/Category/FetchGroup?id_group=${id_group}`
      );
      setGroup(response.data);
      setProductInformation(response.data.productInformation);
    };
    fetchProducts();
    fetchGroup();
  }, [id_group]);

  return (
    <section className="category-settings">
      {filteredProducts.length !== 0 && (
        <>
          <FilterSettings
            productInformation={productInformation}
            filteredProducts={filteredProducts}
            setFilteredProducts={setFilteredProducts}
            products={products}
          />
          <ProductSettings
            group={group}
            filteredProducts={filteredProducts}
            setFilteredProducts={setFilteredProducts}
          />
        </>
      )}
    </section>
  );
};

export default CategorySettings;
