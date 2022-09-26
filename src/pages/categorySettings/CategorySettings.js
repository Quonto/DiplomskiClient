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

  const fetchProducts = async () => {
    const response = await axios.get(
      `https://localhost:7113/Product/FetchProducts/${id_group}`
    );

    setProducts(response.data);
    setFilteredProducts(response.data);
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
          <ProductSettings
            group={group}
            filteredProducts={filteredProducts}
            setFilteredProducts={setFilteredProducts}
            fetchProducts={fetchProducts}
          />
        </>
      )}
    </section>
  );
};

export default CategorySettings;
