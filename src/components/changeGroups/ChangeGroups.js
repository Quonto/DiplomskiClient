import { useEffect, useRef, useState } from "react";
import ImageEditor from "../../pages/imageEditor/ImageEditor";
import "./changeGroup.css";
import axios from "axios";

const ChangeGroups = ({ categories }) => {
  const [isImageEditorActive, setIsImageEditorActive] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [saveGroup, setSaveGroup] = useState(false);
  const [indexGroup, setIndexGroup] = useState(null);
  const [groupName, setGroupName] = useState("");
  const [groups, setGroups] = useState([]);
  const [selectedImageGroup, setSelectedImageGroup] = useState({
    id: 0,
    name: "",
    data: null,
  });
  const inputRef = useRef(null);

  const handleEditImage = async (image) => {
    setSelectedImageGroup({ ...selectedImageGroup, data: image, name: "" });
  };

  const changeGroup = (e) => {
    if (e.target.value !== "") setSelectedCategory(categories[e.target.value]);
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

  const handleChangeGroup = (group, index) => {
    console.log(group);
    setSelectedImageGroup({
      ...selectedImageGroup,
      data: group.picture.data,
      name: group.picture.name,
    });
    setIndexGroup(index);
    setGroupName(group.name);
    setSaveGroup(true);
  };

  const handleUpdateGroup = async (group, index) => {
    group.picture.data = selectedImageGroup.data;
    group.picture.name = selectedImageGroup.name;
    group.name = groupName;
    console.log(group);
    await axios.put("https://localhost:7113/Group/UpdateGroup", group);
    setSelectedImageGroup({ id: 0, name: "", data: null });
    setGroupName("");
    setIndexGroup(index);
    setSaveGroup(false);
  };

  const inputGroup = async () => {
    let newGroup = {
      name: groupName,
      picture: selectedImageGroup,
    };

    const response = await axios.post(
      `https://localhost:7113/Group/WriteGroup/${selectedCategory.id}`,
      newGroup
    );
    setGroups([...groups, response.data]);
  };

  const handleUploadFile = (e) => {
    readFileDataAsBase64(e).then((data, name) => {
      setSelectedImageGroup({ ...selectedImageGroup, data, name: "" });
      inputRef.current.value = "";
    });
  };

  useEffect(() => {
    if (selectedCategory) setGroups([{ name: "" }, ...selectedCategory.groups]);
    console.log("Setovane grupe");
  }, [selectedCategory]);

  console.log(selectedImageGroup);

  return (
    <section className="change-group">
      <h3>Izmena grupe</h3>
      <div className="category-container">
        <select className="group-settings-select" onChange={changeGroup}>
          {categories.map((category, index) => {
            return (
              <option key={index} value={index}>
                {category.name}
              </option>
            );
          })}
        </select>
      </div>
      {selectedCategory && (
        <section className="add-group">
          <div className="category-item">
            <div className="category-picture">
              <label htmlFor="input-slika-group" className="input-btn">
                Dodaj sliku
                <input
                  style={{ display: "none" }}
                  id="input-slika-group"
                  ref={inputRef}
                  type="file"
                  onChange={handleUploadFile}
                />
              </label>
              <>
                <div className="image-preview">
                  <img
                    className="add-product-image"
                    src={selectedImageGroup?.data}
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
              <label className="category-name-label">Naziv Grupe</label>
              <input
                type="text"
                className="category-name-input"
                value={groupName}
                onChange={(e) => {
                  setGroupName(e.target.value);
                }}
              />
              <button className="category-input-button" onClick={inputGroup}>
                Dodaj
              </button>
            </div>
            <div className="categories-group">
              <h3> Grupe </h3>
              <div className="groups-review">
                {groups.length !== 0 &&
                  groups.map((group, index) => {
                    return (
                      <>
                        {group.name !== "" && (
                          <article key={index}>
                            <p>{group.name}</p>
                            <button
                              onClick={() => {
                                saveGroup && index === indexGroup
                                  ? handleUpdateGroup(group, index)
                                  : handleChangeGroup(group, index);
                              }}
                            >
                              {saveGroup && index === indexGroup
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
          {isImageEditorActive && (
            <ImageEditor
              selectedImage={selectedImageGroup}
              setIsImageEditorActive={setIsImageEditorActive}
              handleEditImage={handleEditImage}
            />
          )}
        </section>
      )}
    </section>
  );
};

export default ChangeGroups;
