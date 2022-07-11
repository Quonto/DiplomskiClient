import { useRef, useState } from "react";
import "./filterSettings.css";

const FilterSettings = ({
  productInformation,
  setFilteredProducts,
  products,
}) => {
  const [cena, setCena] = useState({
    od: "",
    do: "",
  });
  const [korisnik, setKorisnik] = useState("");

  const handleFilters = () => {
    let newProducts = products;
    if (cena.do !== "" && cena.od !== "") {
      const parseCena = {
        od: parseInt(cena.od),
        do: parseInt(cena.do),
      };
      if (parseCena.od >= 0 && parseCena.do >= 0) {
        newProducts = products.filter(
          (product) =>
            product.price >= parseCena.od && product.price <= parseCena.do
        );
      }
    }
    if (korisnik !== "") {
      newProducts = newProducts.filter(
        (product) => korisnik === product.user.username
      );
    }
    setFilteredProducts(newProducts);
  };

  const handleResetFilter = () => {
    setFilteredProducts(products);
    setCena({
      od: "",
      do: "",
    });
    setKorisnik("");
  };

  return (
    <section className="product-filter">
      <h4>Filter</h4>
      <button className="filter-btn" onClick={handleFilters}>
        Primeni filtere
      </button>
      <button className="filter-btn" onClick={handleResetFilter}>
        Resetuj filtere
      </button>
      {productInformation?.length !== 0 && (
        <div className="filter-list">
          <h4>Stanje</h4>
          <div className="checkbox">
            <input name="neiskorisceno" type="checkbox" value="Neiskorisceno" />
            <label htmlFor="neiskorisceno">Neiskorisceno</label>
          </div>
          <div className="checkbox">
            <input name="polovno" type="checkbox" value="Polovno" />
            <label htmlFor="polovno">Polovno</label>
          </div>
          <div className="checkbox">
            <input name="neispravno" type="checkbox" value="Neispravno" />
            <label htmlFor="neispravno">Neispravno</label>
          </div>
          <h4>Nacin kupovine</h4>
          <div className="checkbox">
            <input name="aukcija" type="checkbox" value="Aukcija" />
            <label htmlFor="aukcija">Aukcija</label>
          </div>
          <div className="checkbox">
            <input name="placanje" type="checkbox" value="Placanje" />
            <label htmlFor="placanje">Placanje</label>
          </div>
          <h4>Cena</h4>
          <div className="checkbox">
            <label htmlFor="od">od</label>
            <input
              type="text"
              className="cena-input"
              onChange={(e) => setCena({ ...cena, od: e.target.value })}
            />
            <label>RSD</label>
          </div>
          <div className="checkbox">
            <label htmlFor="od">do</label>
            <input
              type="text"
              className="cena-input"
              onChange={(e) => setCena({ ...cena, do: e.target.value })}
            />
            <label>RSD</label>
          </div>
          <h4>Korisnik</h4>
          <div className="checkbox">
            <input
              className="korisnik-input"
              onChange={(e) => setKorisnik(e.target.value)}
            />
          </div>
        </div>
      )}
    </section>
  );
};

export default FilterSettings;
