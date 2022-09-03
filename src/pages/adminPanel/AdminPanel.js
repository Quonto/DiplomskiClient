import { useEffect, useRef, useState } from "react";
import "./adminPanel.css";
import axios from "axios";
import ImageEditor from "../imageEditor/ImageEditor";

const AdminPanel = () => {
  const [categories, setCategories] = useState([]);
  const [groups, setGroups] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [productInformation, setProductInformation] = useState([]);
  const [place, setPlace] = useState([]);
  const [isImageEditorActive, setIsImageEditorActive] = useState(false);
  const [categoryName, setCategoryName] = useState("");
  const [saveCategory, setSaveCategory] = useState(false);
  const [singleProductInformation, setSingleProductInformation] = useState({
    name: "",
    data: "",
  });
  const [singlePlace, setSinglePlace] = useState({
    name: "",
  });
  const [selectedImage, setSelectedImage] = useState({
    name: "",
    data: null,
  });

  const inputRef = useRef(null);
  const nameRef = useRef(null);
  const placeRef = useRef(null);

  const changeCategory = (e) => {
    if (e.target.value !== "") setSelectedCategory(categories[e.target.value]);
  };

  const changeGroup = (e) => {
    setSelectedGroup(groups[e.target.value]);
    setProductInformation(groups[e.target.value].productInformation);
  };

  const inputCategory = async () => {
    let newCategory = {
      name: categoryName,
      picture: selectedImage,
    };
    console.log(newCategory);
    const response = await axios.post(
      "https://localhost:7113/Category/InputCategory",
      newCategory
    );
    setCategories([...categories, response.data]);
  };

  const addPlace = async () => {
    let newPlace = {
      name: singlePlace.name,
    };
    const response = await axios.post(
      `https://localhost:7113/Place/InputPlace`,
      newPlace
    );
    newPlace = { ...newPlace, id: response.data };
    setPlace([...place, newPlace]);
    placeRef.current.value = "";
  };

  const handleChangeCategory = (category) => {
    setCategories();
  };

  const handleUpdateCategory = (category) => {};

  const handleEditImage = async (image) => {
    setSelectedImage({ ...selectedImage, data: image, name: "" });
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

  const handleUploadFile = (e) => {
    readFileDataAsBase64(e).then((data, name) => {
      setSelectedImage({ ...selectedImage, data, name: "" });
      inputRef.current.value = "";
    });
  };

  const addProductInformation = async () => {
    let newPi = {
      name: singleProductInformation.name,
      data: "",
    };
    const response = await axios.post(
      `https://localhost:7113/ProductInformation/InputProductInformation/${selectedGroup.id}`,
      newPi
    );
    newPi = { ...newPi, id: response };
    setProductInformation([...productInformation, newPi]);
    setGroups((groups) =>
      groups.map((group) => {
        if (selectedGroup.id === group.id) {
          return {
            ...group,
            productInformation: [...productInformation, newPi],
          };
        } else return group;
      })
    );
    nameRef.current.value = "";
  };

  useEffect(() => {
    const fetchPlace = async () => {
      const response = await axios.get(
        "https://localhost:7113/Place/FetchPlace"
      );
      setPlace(response.data);
    };
    fetchPlace();
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      const response = await axios.get(
        "https://localhost:7113/Category/FetchCategoriesAndGroups"
      );
      response && setCategories([{ name: "" }, ...response.data]);
    };
    fetchCategories();
  }, []);
  console.log(categories);

  useEffect(() => {
    if (selectedCategory) setGroups([{ name: "" }, ...selectedCategory.groups]);
  }, [selectedCategory]);

  return (
    <>
      <section className="admin-panel">
        <section className="group-settings">
          <h3> Informacije proizvoda </h3>
          <select className="group-settings-select" onChange={changeCategory}>
            {categories.map((category, index) => {
              return (
                <option key={index} value={index}>
                  {category.name}
                </option>
              );
            })}
          </select>
          {selectedCategory && (
            <select className="group-settings-select" onChange={changeGroup}>
              {groups.length !== 0 &&
                groups.map((group, index) => {
                  return (
                    <option key={index} value={index}>
                      {group.name}
                    </option>
                  );
                })}
            </select>
          )}
          {selectedGroup && (
            <>
              <div className="groups-review">
                {productInformation?.length !== 0 &&
                  productInformation.map((pi, index) => {
                    return (
                      <article key={index}>
                        <p>{pi.name}</p>
                        <p>{pi.data}</p>
                      </article>
                    );
                  })}
              </div>
              <div className="groups-pi-add">
                <label htmlFor="name" className="add-pi-label">
                  Name
                </label>
                <input
                  className="add-pi-input"
                  name="name"
                  ref={nameRef}
                  onChange={(e) =>
                    setSingleProductInformation({
                      ...singleProductInformation,
                      name: e.target.value,
                    })
                  }
                />
                <button className="add-pi-btn" onClick={addProductInformation}>
                  Dodaj
                </button>
              </div>
            </>
          )}
        </section>
        <section className="place-settings">
          <h3> Mesta </h3>
          <div className="groups-review">
            {place.length !== 0 &&
              place.map((p, index) => {
                return (
                  <article key={index}>
                    <p>{p.name}</p>
                  </article>
                );
              })}
          </div>
          <div className="groups-place-add">
            <label htmlFor="name" className="add-place-label">
              Name
            </label>
            <input
              className="add-place-input"
              name="name"
              ref={placeRef}
              onChange={(e) =>
                setSinglePlace({
                  ...singlePlace,
                  name: e.target.value,
                })
              }
            />
            <button className="add-place-btn" onClick={addPlace}>
              Dodaj
            </button>
          </div>
        </section>
      </section>
      <section className="add-category">
        <div className="category-container">
          <h3 className="category-label">Izmena Kategorije </h3>
          <div className="category-item">
            <div className="category-picture">
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
              </>
            </div>
            <div className="category-name">
              <label className="category-name-label">Naziv kategorije</label>
              <input
                type="text"
                className="category-name-input"
                onChange={(e) => {
                  setCategoryName(e.target.value);
                }}
              />
              <button className="category-input-button" onClick={inputCategory}>
                Dodaj
              </button>
            </div>
            <div className="categories-group">
              <h3> Kategorije </h3>
              <div className="groups-review">
                {categories.length !== 0 &&
                  categories.map((p, index) => {
                    return (
                      <>
                        {p.name !== "" && (
                          <article key={index}>
                            <p>{p.name}</p>
                            <button
                              onClick={(p) => {
                                saveCategory
                                  ? handleUpdateCategory(p)
                                  : handleChangeCategory(p);
                              }}
                            >
                              {saveCategory ? "Sacuvaj" : "Izmeni"}
                            </button>
                            <button>Izbrisi</button>{" "}
                          </article>
                        )}
                      </>
                    );
                  })}
              </div>
            </div>
          </div>
        </div>
        {isImageEditorActive && (
          <ImageEditor
            selectedImage={selectedImage}
            setIsImageEditorActive={setIsImageEditorActive}
            handleEditImage={handleEditImage}
          />
        )}
      </section>
    </>
  );
};

export default AdminPanel;
