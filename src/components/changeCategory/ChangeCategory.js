import ImageEditor from "../../pages/imageEditor/ImageEditor";
import { useRef, useState } from "react";
import axios from "axios";

const ChangeCategory = ({ categories, setCategories }) => {
  const [isImageEditorActive, setIsImageEditorActive] = useState(false);
  const [saveCategory, setSaveCategory] = useState(false);
  const [indexCategory, setIndexCategory] = useState(null);
  const [categoryName, setCategoryName] = useState("");
  const [selectedImage, setSelectedImage] = useState({
    id: 0,
    name: "",
    data: null,
  });

  const inputRef = useRef(null);

  const handleChangeCategory = (category, index) => {
    setSelectedImage({
      ...selectedImage,
      data: category.picture.data,
      name: category.picture.name,
    });

    setCategoryName(category.name);
    setIndexCategory(index);
    setSaveCategory(true);
  };

  const handleUpdateCategory = async (category, index) => {
    category.picture.data = selectedImage.data;
    category.picture.name = selectedImage.name;
    category.name = categoryName;
    await axios.put("https://localhost:7113/Category/UpdateCategory", category);
    setSelectedImage({ id: 0, name: "", data: null });
    setCategoryName("");
    setIndexCategory(index);
    setSaveCategory(false);
  };

  const inputCategory = async () => {
    let newCategory = {
      name: categoryName,
      picture: selectedImage,
    };

    const response = await axios.post(
      "https://localhost:7113/Category/InputCategory",
      newCategory
    );
    setCategories([...categories, response.data]);
  };

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

  return (
    <section className="add-category">
      <div className="category-container">
        <h3 className="category-label">Izmena kategorije </h3>
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
              value={categoryName}
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
                            onClick={() => {
                              saveCategory && index === indexCategory
                                ? handleUpdateCategory(p, index)
                                : handleChangeCategory(p, index);
                            }}
                          >
                            {saveCategory && index === indexCategory
                              ? "Sacuvaj"
                              : "Izmeni"}
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
  );
};

export default ChangeCategory;
