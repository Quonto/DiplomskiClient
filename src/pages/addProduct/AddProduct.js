import { useEffect, useRef, useState } from "react";
import "./addProduct.css";
import { useGlobalContext } from "../../context/Context";
import axios from "axios";
import ImageEditor from "../imageEditor/ImageEditor";
import ProductInfo from "../../components/productInformation/ProductInfo";

const AddProduct = () => {
  const [categories, setCategories] = useState([]);
  const [groups, setGroups] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [images, setImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState({
    name: "",
    data: null,
    index: "",
  });
  const [place, setPlace] = useState({
    name: "",
  });
  const [isImageEditorActive, setIsImageEditorActive] = useState(false);
  const [productInformation, setProductInformation] = useState([]);
  const [product, setProduct] = useState({
    name: "",
    price: "",
    details: "",
    place: null,
    auction: false,
  });
  const [places, setPlaces] = useState(null);

  const [time, setTime] = useState(1);

  const inputRef = useRef(null);

  const { user } = useGlobalContext();

  const handleChangePlaces = (e) => {
    setPlace({ name: places[e.target.value].name.toString() });
  };

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
    });
  };

  const handleSelectedImage = (image) => {
    setSelectedImage({
      ...selectedImage,
      data: image.data,
      name: image.name,
      index: image.index,
    });
  };

  const handleChangePi = (e, name) => {
    setProductInformation(
      productInformation.map((pi) => {
        if (pi.name === name) return { ...pi, data: e.target.value };
        else return pi;
      })
    );
  };

  const handleEditImage = (image) => {
    if (image === null) {
      const newImages = images.filter(
        (img) => img.index !== selectedImage.index
      );
      setImages(newImages);
      setSelectedImage({
        name: "",
        data: null,
        index: "",
      });
    } else {
      setSelectedImage({ ...selectedImage, data: image });
      const newImages = images.map((img, index) => {
        if (index === selectedImage.index) {
          return {
            data: image,
            name: "",
            index: selectedImage.index,
          };
        }
        return img;
      });
      setImages(newImages);
    }
  };

  const handleUploadFile = (e) => {
    readFileDataAsBase64(e).then((data, name) => {
      setSelectedImage({ ...selectedImage, data, name, index: images.length });
      setImages([
        ...images,
        {
          name: selectedImage?.name || "",
          data,
          index: images.length,
        },
      ]);
      inputRef.current.value = "";
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
      picture: images,
      place: place,
      date: currentTime,
      details: product.details,
      data: productInformation,
      auction: product.auction,
    };
    console.log(newProduct);

    const response = await axios.post(
      `https://localhost:7113/Product/InputProductBuy/${user.id}/${selectedGroup.id}`,
      newProduct
    );
    console.log(response);
    if (product.auction) {
      currentTime.setDate(currentTime.getDate() + time);
      const newAuction = {
        time: currentTime,
        minimumPrice: parseInt((product.price / 100) * 5),
      };
      console.log(newAuction);
      const responseAuction = await axios.post(
        `https://localhost:7113/Auction/InputAuction/${response.data}`,
        newAuction
      );
      console.log(responseAuction);
    }

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

  useEffect(() => {
    const fetchCategories = async () => {
      const response = await axios.get(
        "https://localhost:7113/Category/FetchCategories"
      );
      setCategories([{ name: "" }, ...response.data]);
      const response2 = await axios.get(
        `https://localhost:7113/Place/FetchPlace`
      );
      setPlaces([{ name: "" }, ...response2.data]);
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchGroups = async () => {
      if (selectedCategory) {
        const response = await axios.get(
          `https://localhost:7113/Group/FetchGroups/${selectedCategory?.id}`
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
          `https://localhost:7113/ProductInformation/FetchProductInformation/${selectedGroup?.id}`
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
    <>
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
          <ProductInfo
            product={product}
            setProduct={setProduct}
            place={place}
            setPlace={setPlace}
            places={places}
            handleChangePlaces={handleChangePlaces}
            handleChangePurchase={handleChangePurchase}
            handleChangeTime={handleChangeTime}
            handleUploadFile={handleUploadFile}
            images={images}
            selectedImage={selectedImage}
            setIsImageEditorActive={setIsImageEditorActive}
            handleSelectedImage={handleSelectedImage}
            handleChangePi={handleChangePi}
            productInformation={productInformation}
            inputRef={inputRef}
          ></ProductInfo>
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
      {isImageEditorActive && (
        <ImageEditor
          selectedImage={selectedImage}
          setIsImageEditorActive={setIsImageEditorActive}
          handleEditImage={handleEditImage}
        />
      )}
    </>
  );
};

export default AddProduct;
