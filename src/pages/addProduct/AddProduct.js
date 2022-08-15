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
    place: null,
    auction: false,
  });
  const [places, setPlaces] = useState(null);
  const [place, setPlace] = useState({
    name: "",
  });
  const [time, setTime] = useState("");

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

  const handleChangePurchase = (e) => {
    setProduct({ ...product, auction: e.target.value === "true" });
  };

  const handleChangeTime = (e) => {
    setTime(parseInt(e.target.value));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const currentTime = new Date();
    currentTime.setHours(currentTime.getHours() + 2);
    const newProduct = {
      name: product.name,
      price: product.price,
      phone: product.phone,
      picture: productImage,
      place: place,
      date: currentTime,
      details: product.details,
      data: productInformation,
      auction: product.auction,
    };
    const response = await axios.post(
      `https://localhost:7113/User/InputProductBuy/${user.id}/${selectedGroup.id}`,
      newProduct
    );
    console.log(response.data);
    if (product.auction) {
      currentTime.setDate(currentTime.getDate() + time);
      console.log(currentTime);
      const newAuction = {
        time: currentTime,
        minimumPrice: parseInt((product.price / 100) * 5),
      };

      await axios.post(
        `https://localhost:7113/Auction/InputAuction/${response.data}`,
        newAuction
      );
    }
    /*
    response &&
      window.location.replace(
        `/categories/group/${selectedGroup.id}/product/${response?.data}`
      );
      */
  };

  const handleChangeCategory = (e) => {
    setSelectedCategory(categories[e.target.value]);
    setProductInformation([]);
    setSelectedGroup(null);
  };

  const handleChangePlaces = (e) => {
    setPlace({ name: places[e.target.value].name.toString() });
    console.log(places);
    console.log(e.target.value);
    console.log(place);
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
    const fetchPlace = async () => {
      if (product) {
        const response = await axios.get(
          `https://localhost:7113/Category/FetchPlace`
        );
        setPlaces([{ name: "" }, ...response.data]);
      }
    };
    fetchPlace();
  }, [product]);

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
              Ime:
            </label>
            <input
              name="name"
              className="add-product-input"
              placeholder="Ime"
              onChange={(e) => setProduct({ ...product, name: e.target.value })}
            ></input>
            <label className="add-product-label" htmlFor="price">
              Cena:
            </label>
            <input
              name="price"
              className="add-product-input"
              placeholder="Cena"
              onChange={(e) =>
                setProduct({ ...product, price: e.target.value })
              }
            ></input>
            <label className="add-product-label" htmlFor="place">
              Mesto:
            </label>
            {places?.length !== 0 && (
              <select
                className="add-product-select"
                onChange={handleChangePlaces}
              >
                {places.map((p, i) => {
                  return (
                    <option key={i} value={i}>
                      {p.name}
                    </option>
                  );
                })}
              </select>
            )}
            <div className="purchase">
              <div className="purchase-product">
                <label className="add-product-label" htmlFor="place">
                  Nacin kupovine:
                </label>
                <select
                  className="add-product-select"
                  onChange={handleChangePurchase}
                >
                  <option value={false}>Kupovina</option>
                  <option value={true}>Aukcija</option>
                </select>
              </div>

              {product.auction && (
                <div className="purchase-product">
                  <label className="add-product-label" htmlFor="place">
                    Vreme aukcije:
                  </label>
                  <select
                    className="add-product-select"
                    onChange={handleChangeTime}
                  >
                    <option value={1}>Jedan dan</option>
                    <option value={2}>Dva dana</option>
                    <option value={3}>Tri dana</option>
                    <option value={4}>Cetiri dana</option>
                  </select>
                </div>
              )}
            </div>
            <label className="add-product-label" htmlFor="contact">
              Kontakt:
            </label>
            <input
              name="contact"
              className="add-product-input"
              placeholder="Kontakt"
              onChange={(e) =>
                setProduct({ ...product, phone: e.target.value })
              }
            ></input>
            <label className="add-product-label" htmlFor="details">
              Opis:
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
          Dodaj Proizvod
        </button>
      )}
    </form>
  );
};

export default AddProduct;
