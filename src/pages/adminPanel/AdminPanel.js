import { useEffect, useRef, useState } from "react";
import "./adminPanel.css";
import axios from "axios";

const AdminPanel = () => {
  const [categories, setCategories] = useState([]);
  const [groups, setGroups] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [productInformation, setProductInformation] = useState([]);
  const [place, setPlace] = useState([]);
  const [singleProductInformation, setSingleProductInformation] = useState({
    name: "",
    data: "",
  });
  const [singlePlace, setSinglePlace] = useState({
    name: "",
  });

  const nameRef = useRef(null);
  const placeRef = useRef(null);

  const changeCategory = (e) => {
    if (e.target.value !== "") setSelectedCategory(categories[e.target.value]);
  };

  const changeGroup = (e) => {
    setSelectedGroup(groups[e.target.value]);
    setProductInformation(groups[e.target.value].productInformation);
  };

  const addPlace = async () => {
    let newPlace = {
      name: singlePlace.name,
    };
    const response = await axios.post(
      `https://localhost:7113/User/InputPlace`,
      newPlace
    );
    newPlace = { ...newPlace, id: response.data };
    setPlace([...place, newPlace]);
    placeRef.current.value = "";
  };

  const addProductInformation = async () => {
    let newPi = {
      name: singleProductInformation.name,
      data: "",
    };
    const response = await axios.post(
      `https://localhost:7113/User/InputProductInformation/?id_group=${selectedGroup.id}`,
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
        "https://localhost:7113/Category/FetchPlace"
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

  useEffect(() => {
    if (selectedCategory) setGroups([{ name: "" }, ...selectedCategory.groups]);
  }, [selectedCategory]);

  return (
    <section className="admin-panel">
      <section className="group-settings">
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
  );
};

export default AdminPanel;
