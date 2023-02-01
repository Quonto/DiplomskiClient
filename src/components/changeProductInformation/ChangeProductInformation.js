import axios from "axios";
import { useRef, useState } from "react";
import { CircularProgress } from "@mui/material";
import SnackBar from "../snackbar/Snackbar";

const ChangeProductInformation = ({
  groups,
  setSelectedCategory,
  categories,
  setGroups,
  selectedCategory,
}) => {
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [productInformation, setProductInformation] = useState([]);
  const [saveProductInformation, setSaveProductInformation] = useState(false);
  const [productInformationName, setProductInformationName] = useState("");
  const [indexProductInformation, setIndexProductInformation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [updated, setUpdated] = useState(null);
  const [severity, setSeverity] = useState("");
  const [message, setMessage] = useState("");
  const [singleProductInformation, setSingleProductInformation] = useState({
    name: "",
    data: "",
  });

  const nameRef = useRef(null);

  const changeCategory = (e) => {
    if (e.target.value !== "") setSelectedCategory(categories[e.target.value]);
  };

  const handleChangeProductInformation = (pi, index) => {
    setProductInformationName(pi.name);
    setIndexProductInformation(index);
    setSaveProductInformation(true);
  };

  const handleSaveProductInformation = async (pi, index) => {
    const returnProductInfo = {
      name: pi.name,
    };
    pi.name = productInformationName;
    try {
      await axios.put(
        "https://localhost:7113/ProductInformation/UpdateProductInformation",
        pi
      );
    } catch (error) {
      setMessage(error.response.data);
      setSeverity("error");
      setUpdated(true);
      pi.name = returnProductInfo.name;
      return;
    }

    setIndexProductInformation(index);
    setSaveProductInformation(false);
    setMessage("Uspešno ste izmenili naziv mesta");
    setSeverity("success");
    setUpdated(true);
  };

  const changeGroup = (e) => {
    setSelectedGroup(groups[e.target.value]);
    setProductInformation(groups[e.target.value].productInformation);
  };

  const handleDeleteProductInformation = async (pi) => {
    await axios.delete(
      `https://localhost:7113/ProductInformation/RemoveProductInformation/${pi.id}`
    );

    let newProductInformation = productInformation.filter(
      (p) => p.id !== pi.id
    );
    setProductInformation(newProductInformation);
  };

  const addProductInformation = async () => {
    setLoading(true);
    let newPi = {
      name: singleProductInformation.name,
      data: "",
      delete: false,
    };
    let response;
    try {
      response = await axios.post(
        `https://localhost:7113/ProductInformation/InputProductInformation/${selectedGroup.id}`,
        newPi
      );
    } catch (error) {
      setMessage(error.response.data);
      setSeverity("error");
      setUpdated(true);
      setLoading(false);
      return;
    }

    newPi = { ...newPi, id: response.data };
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
    setLoading(false);
    setMessage("Uspešno dodata informacija o proizvodu");
    setSeverity("success");
    setUpdated(true);
  };

  const handleCloseSnackbarUpdated = () => {
    setUpdated(false);
  };

  return (
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
          {loading ? (
            <CircularProgress />
          ) : (
            <div className="groups-review">
              {productInformation?.length !== 0 &&
                productInformation.map((pi, index) => {
                  return (
                    <article key={index}>
                      {saveProductInformation &&
                      index === indexProductInformation ? (
                        <input
                          value={productInformationName}
                          onChange={(e) => {
                            setProductInformationName(e.target.value);
                          }}
                        ></input>
                      ) : (
                        <p>{pi.name}</p>
                      )}
                      <button
                        onClick={() => {
                          saveProductInformation &&
                          index === indexProductInformation
                            ? handleSaveProductInformation(pi, index)
                            : handleChangeProductInformation(pi, index);
                        }}
                      >
                        {saveProductInformation &&
                        index === indexProductInformation
                          ? "Sacuvaj"
                          : "Izmeni"}
                      </button>
                      <button
                        onClick={() => handleDeleteProductInformation(pi)}
                      >
                        Izbrisi
                      </button>{" "}
                    </article>
                  );
                })}
            </div>
          )}
          <div className="groups-pi-add">
            <label htmlFor="name" className="add-pi-label">
              Naziv
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
            <button className="add-btn" onClick={addProductInformation}>
              Dodaj
            </button>
          </div>
        </>
      )}
      <SnackBar
        boolean={updated}
        handleClose={handleCloseSnackbarUpdated}
        severity={severity}
        message={message}
      />
    </section>
  );
};

export default ChangeProductInformation;
