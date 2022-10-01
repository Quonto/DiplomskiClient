import { useEffect, useRef, useState } from "react";
import "./addProduct.css";
import { useGlobalContext } from "../../context/Context";
import axios from "axios";
import ImageEditor from "../imageEditor/ImageEditor";
import ProductInfo from "../../components/productInformation/ProductInfo";
import SnackBar from "../../components/snackbar/Snackbar";

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
  const [loading, setLoading] = useState(false);
  const [updated, setUpdated] = useState(null);
  const [severity, setSeverity] = useState("");
  const [message, setMessage] = useState("");
  const [isImageEditorActive, setIsImageEditorActive] = useState(false);
  const [productInformation, setProductInformation] = useState([]);
  const [product, setProduct] = useState({
    name: "",
    price: 0,
    details: "",
    place: "",
    auction: false,
    phone: "",
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
      price: product.price === "" ? 0 : parseInt(product.price),
      phone: product.phone,
      picture: images,
      place: place,
      date: currentTime,
      details: product.details,
      data: productInformation,
      auction: product.auction,
    };

    let response;
    try {
      response = await axios.post(
        `https://localhost:7113/Product/InputProductBuy/${user.id}/${selectedGroup.id}`,
        newProduct
      );
    } catch (error) {
      setMessage(error.response.data);
      setSeverity("error");
      setUpdated(true);
    }

    if (product.auction) {
      currentTime.setDate(currentTime.getDate() + time);
      const newAuction = {
        time: currentTime,
        minimumPrice: parseInt((product.price / 100) * 5),
      };
      try {
        await axios.post(
          `https://localhost:7113/Auction/InputAuction/${response.data}`,
          newAuction
        );
      } catch (error) {
        setMessage(error.response.data);
        setSeverity("error");
        setUpdated(true);
      }
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

  const handleCloseSnackbarUpdated = () => {
    setUpdated(false);
  };

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      let response;
      try {
        response = await axios.get(
          "https://localhost:7113/Category/FetchCategories"
        );
      } catch (error) {
        return;
      }
      setCategories([{ name: "" }, ...response.data]);
      let responsePlace;
      try {
        responsePlace = await axios.get(
          `https://localhost:7113/Place/FetchPlace`
        );
      } catch (error) {
        return;
      }
      setPlaces([{ name: "" }, ...responsePlace.data]);
      setLoading(false);
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchGroups = async () => {
      if (selectedCategory) {
        setLoading(true);
        let response;
        try {
          response = await axios.get(
            `https://localhost:7113/Group/FetchGroups/${selectedCategory?.id}`
          );
        } catch (error) {
          return;
        }
        setGroups([{ name: "" }, ...response.data]);
        setLoading(false);
      }
    };
    fetchGroups();
  }, [selectedCategory]);

  useEffect(() => {
    const fetchPi = async () => {
      if (selectedGroup) {
        setLoading(true);
        let response;
        try {
          response = await axios.get(
            `https://localhost:7113/ProductInformation/FetchProductInformation/${selectedGroup?.id}`
          );
        } catch (error) {
          return;
        }
        setProductInformation(
          response.data.map((item) => {
            return {
              name: item.name,
              data: item.data,
              idInfo: item.id,
            };
          })
        );
        setLoading(false);
      }
    };
    fetchPi();
  }, [selectedGroup]);

  return (
    <>
      <form className="add-product-form" onSubmit={handleSubmit}>
        {loading ? (
          <h2>Loading...</h2>
        ) : (
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
              <select
                className="add-product-select"
                onChange={handleChangeGroup}
              >
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
        )}
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
      <SnackBar
        boolean={updated}
        handleClose={handleCloseSnackbarUpdated}
        severity={severity}
        message={message}
      />
    </>
  );
};

export default AddProduct;
