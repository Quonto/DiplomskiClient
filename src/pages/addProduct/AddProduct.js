import { useEffect, useState } from "react";
import "./addProduct.css";
import { useGlobalContext } from "../../context/Context";
import axios from "axios";

const AddProduct = () => {
  const [categories, setCategories] = useState([]);
  const [groups, setGroups] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [productImage, setProductImage] = useState([
    {
      name: "",
      data: "",
    },
  ]);
  const [productInformation, setProductInformation] = useState([]);
  const [product, setProduct] = useState({
    name: "",
    price: "",
    details: "",
  });

  const { user } = useGlobalContext();

  const readFileDataAsBase64 = (e) => {
    const file = e.target.files[0];

    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (event) => {
        resolve(event.target.result);
      };

      reader.onerror = (err) => {
        reject(err);
      };

      reader.readAsDataURL(file);
      setProductImage({ ...productImage, name: file.name });
    });
  };

  const handleUploadFile = (e) => {
    readFileDataAsBase64(e).then((data) => {
      setProductImage([{ ...productImage, data }]);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newProduct = {
      name: product.name,
      price: product.price,
      picture: productImage,
      details: product.details,
      data: productInformation,
    };
    const response = await axios.post(
      `https://localhost:7113/User/InputProduct?id_user=${user.id}&id_group=${selectedGroup.id}`,
      newProduct
    );
    response &&
      window.location.replace(
        `/categories/group/${selectedGroup.id}/product/${response?.data}`
      );
  };

  const handleChangeCategory = (e) => {
    setSelectedCategory(categories[e.target.value]);
    setProductInformation([]);
    setSelectedGroup(null);
  };

  const handleChangeGroup = (e) => {
    setSelectedGroup(groups[e.target.value]);
  };

  const handleChangePi = (e, name) => {
    setProductInformation(
      productInformation.map((pi) => {
        if (pi.name === name) return { ...pi, data: e.target.value };
        else return pi;
      })
    );
  };

  useEffect(() => {
    const fetchCategories = async () => {
      const response = await axios.get(
        "https://localhost:7113/Category/FetchCategories"
      );
      setCategories([{ name: "" }, ...response.data]);
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchGroups = async () => {
      if (selectedCategory) {
        const response = await axios.get(
          `https://localhost:7113/Category/FetchGroups/?id_category=${selectedCategory?.id}`
        );
        setGroups([{ name: "" }, ...response.data]);
      }
    };
    fetchGroups();
  }, [selectedCategory]);

  useEffect(() => {
    const fetchPi = async () => {
      if (selectedGroup) {
        const response = await axios.get(
          `https://localhost:7113/User/FetchProductInformation/?id_group=${selectedGroup?.id}`
        );
        setProductInformation(
          response.data.map((item) => {
            return {
              name: item.name,
              data: item.data,
              idInfo: item.id,
            };
          })
        );
      }
    };
    fetchPi();
  }, [selectedGroup]);

  return (
    <form className="add-product-form" onSubmit={handleSubmit}>
      <div className="select-container">
        {categories.length !== 0 && (
          <select
            onChange={handleChangeCategory}
            className="add-product-select"
          >
            {categories.map((category, i) => {
              return (
                <option key={i} value={i}>
                  {category.name}
                </option>
              );
            })}
          </select>
        )}
        {groups?.length !== 0 && (
          <select className="add-product-select" onChange={handleChangeGroup}>
            {groups.map((group, i) => {
              return (
                <option key={i} value={i}>
                  {group.name}
                </option>
              );
            })}
          </select>
        )}
      </div>
      {selectedGroup && (
        <section className="add-product-information">
          <div className="left-container">
            <label className="add-product-label" htmlFor="name">
              Name:
            </label>
            <input
              name="name"
              className="add-product-input"
              placeholder="name..."
              onChange={(e) => setProduct({ ...product, name: e.target.value })}
            ></input>
            <label className="add-product-label" htmlFor="price">
              Price:
            </label>
            <input
              name="price"
              className="add-product-input"
              placeholder="price..."
              onChange={(e) =>
                setProduct({ ...product, price: e.target.value })
              }
            ></input>
            <label className="add-product-label" htmlFor="details">
              Details:
            </label>
            <textarea
              name="details"
              className="add-product-details"
              onChange={(e) =>
                setProduct({ ...product, details: e.target.value })
              }
            />
          </div>
          <div className="middle-container">
            <input type="file" onChange={handleUploadFile} />
            {productImage[0]?.data && (
              <div className="image-preview">
                <img
                  className="add-product-image"
                  src={productImage[0].data}
                  alt=""
                />
              </div>
            )}
          </div>
          {productInformation.length !== 0 && (
            <div className="right-container">
              {productInformation.map((pi, index) => {
                return (
                  <>
                    <label htmlFor="name" className="pi-label">
                      {pi.name}
                    </label>
                    <input
                      className="pi-input"
                      name="name"
                      placeholder={pi.name}
                      onChange={(e) => handleChangePi(e, pi.name)}
                    />
                  </>
                );
              })}
            </div>
          )}
        </section>
      )}
      {selectedGroup && (
        <button
          className="add-product-btn"
          onClick={handleSubmit}
          type="submit"
        >
          Add product
        </button>
      )}
    </form>
  );
};

export default AddProduct;
