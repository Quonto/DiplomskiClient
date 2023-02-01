import { useEffect, useRef, useState } from "react";
import SnackBar from "../snackbar/Snackbar";
import { CircularProgress } from "@mui/material";
import axios from "axios";

const ChangePlace = () => {
  const [singlePlace, setSinglePlace] = useState({
    name: "",
  });
  const [place, setPlace] = useState([]);
  const [indexPlace, setIndexPlace] = useState(null);
  const [savePlace, setSavePlace] = useState(false);
  const [placeName, setPlaceName] = useState("");
  const placeRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [updated, setUpdated] = useState(null);
  const [severity, setSeverity] = useState("");
  const [message, setMessage] = useState("");

  const addPlace = async () => {
    let newPlace = {
      name: singlePlace.name,
    };
    let response;
    try {
      response = await axios.post(
        `https://localhost:7113/Place/InputPlace`,
        newPlace
      );
    } catch (error) {
      setMessage(error.response.data);
      setSeverity("error");
      setUpdated(true);
      return;
    }
    newPlace = { ...newPlace, id: response.data };
    setPlace([...place, newPlace]);
    placeRef.current.value = "";
    setMessage("Uspešno dodato mesto");
    setSeverity("success");
    setUpdated(true);
  };

  const handleDeletePlace = async (pi) => {
    await axios.delete(`https://localhost:7113/Place/RemovePlace/${pi.id}`);

    let newPlace = place.filter((p) => p.id !== pi.id);
    setPlace(newPlace);
  };

  const handleChangeProductInformation = (p, index) => {
    setPlaceName(p.name);
    setIndexPlace(index);
    setSavePlace(true);
  };

  const handleSaveProductInformation = async (p, index) => {
    const returnProductInfo = {
      name: p.name,
    };

    p.name = placeName;
    try {
      await axios.put("https://localhost:7113/Place/UpdatePlace", p);
    } catch (error) {
      setMessage(error.response.data);
      setSeverity("error");
      setUpdated(true);
      p.name = returnProductInfo.name;
      return;
    }
    setIndexPlace(index);
    setSavePlace(false);
    setMessage("Uspešno ste izmenili naziv mesta");
    setSeverity("success");
    setUpdated(true);
  };

  useEffect(() => {
    const fetchPlace = async () => {
      setLoading(true);
      let response;
      try {
        response = await axios.get("https://localhost:7113/Place/FetchPlace");
      } catch (error) {
        return;
      }
      setPlace(response.data);
      setLoading(false);
    };
    fetchPlace();
  }, []);

  const handleCloseSnackbarUpdated = () => {
    setUpdated(false);
  };

  return (
    <section className="place-settings">
      <h3> Mesta </h3>
      {loading ? (
        <CircularProgress />
      ) : (
        <div className="groups-review">
          {place.length !== 0 &&
            place.map((p, index) => {
              return (
                <article key={index}>
                  {savePlace && index === indexPlace ? (
                    <input
                      value={placeName}
                      onChange={(e) => {
                        setPlaceName(e.target.value);
                      }}
                    ></input>
                  ) : (
                    <p>{p.name}</p>
                  )}
                  <button
                    onClick={() => {
                      savePlace && index === indexPlace
                        ? handleSaveProductInformation(p, index)
                        : handleChangeProductInformation(p, index);
                    }}
                  >
                    {savePlace && index === indexPlace ? "Sacuvaj" : "Izmeni"}
                  </button>
                  <button onClick={() => handleDeletePlace(p)}>Izbrisi</button>{" "}
                </article>
              );
            })}
        </div>
      )}
      <div className="groups-place-add">
        <label htmlFor="name" className="add-place-label">
          Naziv
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
        <button className="add-btn" onClick={addPlace}>
          Dodaj
        </button>
      </div>
      <SnackBar
        boolean={updated}
        handleClose={handleCloseSnackbarUpdated}
        severity={severity}
        message={message}
      />
    </section>
  );
};

export default ChangePlace;
