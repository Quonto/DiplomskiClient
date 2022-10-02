import { useState } from "react";
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
  const [place, setPlace] = useState("");
  const [auction, setAuction] = useState(false);
  const [buy, setBuy] = useState(false);

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

    if (auction === false && buy !== false) {
      newProducts = newProducts.filter(
        (product) => auction === product.auction
      );
    }
    if (buy === false && auction !== false) {
      newProducts = newProducts.filter((product) => buy !== product.auction);
    }

    if (place !== "") {
      newProducts = newProducts.filter(
        (product) => place === product.place.name
      );
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
    setAuction(false);
    setBuy(false);
  };

  return (
    <div className="filter-div">
      <h3>Filteri</h3>
      <div className="filter-button">
        <div className="purshace-product">
          <button className="filter-btn" onClick={handleFilters}>
            Primeni filtere
          </button>
          <button className="filter-btn" onClick={handleResetFilter}>
            Resetuj filtere
          </button>
        </div>
        {productInformation?.length !== 0 && (
          <>
            <div className="purshace-product">
              <h4>Nacin kupovine</h4>
              <div className="checkbox">
                <input
                  name="aukcija"
                  type="checkbox"
                  value="Aukcija"
                  checked={auction}
                  onChange={() => setAuction(!auction)}
                />
                <label htmlFor="aukcija">Aukcija</label>
              </div>
              <div className="checkbox">
                <input
                  name="placanje"
                  type="checkbox"
                  value="Placanje"
                  checked={buy}
                  onChange={() => setBuy(!buy)}
                />
                <label htmlFor="placanje">Placanje</label>
              </div>
            </div>
            <div className="purshace-product">
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
            </div>
            <div className="purshace-product">
              <h4>Korisnik</h4>
              <div className="checkbox">
                <input
                  className="korisnik-input"
                  onChange={(e) => setKorisnik(e.target.value)}
                />
              </div>
            </div>
            <div className="purshace-product">
              <h4>Mesto</h4>
              <div className="checkbox">
                <input
                  className="korisnik-input"
                  onChange={(e) => setPlace(e.target.value)}
                />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default FilterSettings;
