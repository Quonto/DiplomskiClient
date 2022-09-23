import { useEffect, useRef, useState } from "react";
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

  const handleChangeProductInformation = (p, index) => {
    setPlaceName(p.name);
    setIndexPlace(index);
    setSavePlace(true);
  };

  const handleSaveProductInformation = async (p, index) => {
    p.name = placeName;
    console.log(p);
    await axios.put("https://localhost:7113/Place/UpdatePlace", p);

    setIndexPlace(index);
    setSavePlace(false);
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

  return (
    <section className="place-settings">
      <h3> Mesta </h3>
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
                <button>Izbrisi</button>{" "}
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
  );
};

export default ChangePlace;
