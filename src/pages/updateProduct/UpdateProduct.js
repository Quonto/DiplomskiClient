import { useState, useRef, useEffect } from "react";
import axios from "axios";
import ImageEditor from "../imageEditor/ImageEditor";
import "../addProduct/addProduct.css";
import ImageSlider from "../../components/imageSlider/ImageSlider";

import "./updateproduct.css";
import SnackBar from "../../components/snackbar/Snackbar";

const UpdateProduct = ({
  setIsChangeActive,
  selectedPr,
  setSelectedPr,
  setUserProducts,
  userProducts,
}) => {
  const [places, setPlaces] = useState(null);
  const [place, setPlace] = useState(selectedPr.place);
  const [update, setUpdate] = useState(null);
  const [severity, setSeverity] = useState("");
  const [message, setMessage] = useState("");
  const [images, setImages] = useState(() => {
    return selectedPr.picture.map((img, index) => {
      return {
        data: img.data,
        id: img.id,
        name: img.name,
        index,
      };
    });
  });
  const [selectedImage, setSelectedImage] = useState({
    name: "",
    data: null,
    index: "",
  });
  const [isImageEditorActive, setIsImageEditorActive] = useState(false);
  const [productInformation, setProductInformation] = useState(selectedPr.data);

  const inputRef = useRef(null);

  const handleEditImage = (image) => {
    if (image === null) {
      const newImages = images.filter(
        (img) => img.index !== selectedImage.index
      );
      setImages(newImages);
      setSelectedImage({
        id: 0,
        name: "",
        data: null,
        index: "",
      });
    } else {
      setSelectedImage({ ...selectedImage, data: image });
      const newImages = images.map((img, index) => {
        if (index === selectedImage.index) {
          return {
            id: 0,
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

  const handleChangePlaces = (e) => {
    setPlace({ name: places[e.target.value].name.toString() });
  };

  const handleChangePi = (e, name) => {
    setProductInformation(
      productInformation.map((pi) => {
        if (pi.productInformation.name === name)
          return { ...pi, data: e.target.value };
        else return pi;
      })
    );
  };

  const handleUploadFile = (e) => {
    readFileDataAsBase64(e).then((data, name) => {
      setSelectedImage({ ...selectedImage, data, name, index: images.length });
      setImages([
        ...images,
        {
          id: 0,
          name: selectedImage?.name || "",
          data,
          index: images.length,
        },
      ]);
      inputRef.current.value = "";
    });
  };

  const handleSelectedImage = (image) => {
    setSelectedImage({
      ...selectedImage,
      data: image.data,
      name: image.name,
      index: image.index || image.id,
    });
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const currentTime = new Date();
    currentTime.setHours(currentTime.getHours() + 2);
    const changedProduct = {
      id: selectedPr.id,
      name: selectedPr.name,
      price: selectedPr.price === "" ? 0 : parseInt(selectedPr.price),
      phone: selectedPr.phone,
      picture: images,
      place: place,
      date: currentTime,
      details: selectedPr.details,
      data: productInformation,
      auction: selectedPr.auction,
    };
    let response;

    try {
      response = await axios.put(
        `https://localhost:7113/Product/UpdateProduct`,
        changedProduct
      );
    } catch (error) {
      console.log(error.response.data);
      setMessage(error.response.data);
      setSeverity("error");
      setUpdate(true);
      return;
    }
    setUserProducts(() => {
      return userProducts.map((product) => {
        if (product.id === changedProduct.id) {
          return response.data;
        } else {
          return product;
        }
      });
    });
    setIsChangeActive(false);
  };

  useEffect(() => {
    const fetchPlaces = async () => {
      let response;
      try {
        response = await axios.get(`https://localhost:7113/Place/FetchPlace`);
      } catch (error) {
        setMessage(error.response.data);
        setSeverity("error");
        setUpdate(true);
        return;
      }
      setPlaces([{ name: "" }, ...response.data]);
    };
    fetchPlaces();
  }, []);

  const handleCloseSnackbarUpdated = () => {
    setUpdate(false);
  };

  return (
    <section className="modal-update">
      <div className="modal-wrapper-update">
        <button
          className="exit-modal-edit-image"
          onClick={() => setIsChangeActive(false)}
        >
          X
        </button>
        <section className="add-product-information">
          <div className="left-container">
            <label className="add-product-label" htmlFor="name">
              Ime:
            </label>
            <input
              name="name"
              className="add-product-input"
              placeholder="Ime"
              defaultValue={selectedPr.name}
              onChange={(e) =>
                setSelectedPr({ ...selectedPr, name: e.target.value })
              }
            ></input>
            {!selectedPr.auction && (
              <>
                <label className="add-product-label" htmlFor="price">
                  Cena:
                </label>
                <input
                  name="price"
                  type="number"
                  className="add-product-input"
                  placeholder="Cena"
                  defaultValue={selectedPr.price}
                  onChange={(e) =>
                    setSelectedPr({ ...selectedPr, price: e.target.value })
                  }
                ></input>
              </>
            )}

            <label className="add-product-label" htmlFor="place">
              Mesto:
            </label>
            {places && (
              <select
                className="add-product-select"
                onChange={handleChangePlaces}
                defaultValue={selectedPr.place.name}
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
            <div className="purchase"></div>
            <label className="add-product-label" htmlFor="contact">
              Kontakt:
            </label>
            <input
              name="contact"
              className="add-product-input"
              placeholder="Kontakt"
              defaultValue={selectedPr.phone}
              onChange={(e) =>
                setSelectedPr({ ...selectedPr, phone: e.target.value })
              }
            ></input>
            <label className="add-product-label" htmlFor="details">
              Opis:
            </label>
            <textarea
              name="details"
              className="add-product-details"
              defaultValue={selectedPr.details}
              onChange={(e) =>
                setSelectedPr({ ...selectedPr, details: e.target.value })
              }
            />
          </div>
          <div className="middle-container">
            <label htmlFor="input-slika" className="input-btn">
              Dodaj sliku
              <input
                style={{ display: "none" }}
                id="input-slika"
                ref={inputRef}
                type="file"
                onChange={handleUploadFile}
              />
            </label>
            {images && (
              <>
                <div className="image-preview">
                  <img
                    className="add-product-image"
                    src={selectedImage?.data}
                    alt=""
                  />
                </div>
                <button
                  className="image-edit-btn"
                  onClick={() => setIsImageEditorActive(true)}
                  type="button"
                >
                  Image edit
                </button>
                <ImageSlider
                  images={images}
                  handleSelectedImage={handleSelectedImage}
                ></ImageSlider>
              </>
            )}
          </div>
          {productInformation && (
            <div className="right-container">
              {productInformation.map((pi, index) => {
                return (
                  <article key={index}>
                    <label htmlFor="name" className="pi-label">
                      {pi.productInformation.name}
                    </label>
                    <input
                      className="pi-input"
                      name="name"
                      defaultValue={pi.data}
                      placeholder={pi.productInformation.name}
                      onChange={(e) =>
                        handleChangePi(e, pi.productInformation.name)
                      }
                    />
                  </article>
                );
              })}
            </div>
          )}
        </section>
        <button className="input-btn upd" onClick={handleSubmit}>
          Sacuvaj izmene
        </button>
      </div>
      {isImageEditorActive && (
        <ImageEditor
          selectedImage={selectedImage}
          setIsImageEditorActive={setIsImageEditorActive}
          handleEditImage={handleEditImage}
        />
      )}
      <SnackBar
        boolean={update}
        handleClose={handleCloseSnackbarUpdated}
        severity={severity}
        message={message}
      />
    </section>
  );
};

export default UpdateProduct;
