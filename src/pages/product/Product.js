import { useParams } from "react-router-dom";
import "./product.css";

const Product = () => {
  const { id_product } = useParams();
  console.log(id_product);

  return <h2>Product page</h2>;
};

export default Product;
