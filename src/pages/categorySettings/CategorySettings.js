import "./categorySettings.css";

const CategorySettings = () => {
  return (
    <section className="category-settings">
      <section className="product-filter">filter</section>
      <section className="product-list">
        <div className="header-sort">
          <h3>Naslov kategorije</h3>
          <div className="sort">
            <label htmlFor="select">Sortiraj po:</label>
            <select className="select-sort" name="select"></select>
          </div>
        </div>
        <div className="subscribe-line">
          <hr />
          <button className="subscribe-btn">Prati</button>
        </div>
        <div className="products">
          <article className="product">
            <img
              className="product-image"
              src="https://cdn2.emmezeta.rs/media/catalog/product/cache/01cb2cb658d395381faf29e7336ee183/g/1/g1nienburg-nienburg-spavaca-soba_1.jpg"
              alt=""
            />
            <div className="product-details">
              <h4>Naslov proizvoda</h4>
              <label>Cena:</label>
              <label>Stanje:</label>
              <div className="product-user-info">
                {/* Ikona */}
                <p>Ime korisnika</p>
              </div>
            </div>
            <div className="button-list">
              <button className="wishlist-btn">Dodaj</button>
              <div className="button-info">{/* Ikona */}1 zeli</div>
              <div className="button-info">{/* Ikona */}2 dana</div>
              <div className="button-info">{/* Ikona */}0 ponuda</div>
            </div>
          </article>
          <article className="product">
            <img
              className="product-image"
              src="https://cdn2.emmezeta.rs/media/catalog/product/cache/01cb2cb658d395381faf29e7336ee183/g/1/g1nienburg-nienburg-spavaca-soba_1.jpg"
              alt=""
            />
            <div className="product-details">
              <h4>Naslov proizvoda</h4>
              <label>Cena:</label>
              <label>Stanje:</label>
              <div className="product-user-info">
                {/* Ikona */}
                <p>Ime korisnika</p>
              </div>
            </div>
            <div className="button-list">
              <button className="wishlist-btn">Dodaj</button>
              <div className="button-info">{/* Ikona */}1 zeli</div>
              <div className="button-info">{/* Ikona */}2 dana</div>
              <div className="button-info">{/* Ikona */}0 ponuda</div>
            </div>
          </article>
          <article className="product">
            <img
              className="product-image"
              src="https://cdn2.emmezeta.rs/media/catalog/product/cache/01cb2cb658d395381faf29e7336ee183/g/1/g1nienburg-nienburg-spavaca-soba_1.jpg"
              alt=""
            />
            <div className="product-details">
              <h4>Naslov proizvoda</h4>
              <label>Cena:</label>
              <label>Stanje:</label>
              <div className="product-user-info">
                {/* Ikona */}
                <p>Ime korisnika</p>
              </div>
            </div>
            <div className="button-list">
              <button className="wishlist-btn">Dodaj</button>
              <div className="button-info">{/* Ikona */}1 zeli</div>
              <div className="button-info">{/* Ikona */}2 dana</div>
              <div className="button-info">{/* Ikona */}0 ponuda</div>
            </div>
          </article>
          <article className="product">
            <img
              className="product-image"
              src="https://cdn2.emmezeta.rs/media/catalog/product/cache/01cb2cb658d395381faf29e7336ee183/g/1/g1nienburg-nienburg-spavaca-soba_1.jpg"
              alt=""
            />
            <div className="product-details">
              <h4>Naslov proizvoda</h4>
              <label>Cena:</label>
              <label>Stanje:</label>
              <div className="product-user-info">
                {/* Ikona */}
                <p>Ime korisnika</p>
              </div>
            </div>
            <div className="button-list">
              <button className="wishlist-btn">Dodaj</button>
              <div className="button-info">{/* Ikona */}1 zeli</div>
              <div className="button-info">{/* Ikona */}2 dana</div>
              <div className="button-info">{/* Ikona */}0 ponuda</div>
            </div>
          </article>
          <article className="product">
            <img
              className="product-image"
              src="https://cdn2.emmezeta.rs/media/catalog/product/cache/01cb2cb658d395381faf29e7336ee183/g/1/g1nienburg-nienburg-spavaca-soba_1.jpg"
              alt=""
            />
            <div className="product-details">
              <h4>Naslov proizvoda</h4>
              <label>Cena:</label>
              <label>Stanje:</label>
              <div className="product-user-info">
                {/* Ikona */}
                <p>Ime korisnika</p>
              </div>
            </div>
            <div className="button-list">
              <button className="wishlist-btn">Dodaj</button>
              <div className="button-info">{/* Ikona */}1 zeli</div>
              <div className="button-info">{/* Ikona */}2 dana</div>
              <div className="button-info">{/* Ikona */}0 ponuda</div>
            </div>
          </article>
          <article className="product">
            <img
              className="product-image"
              src="https://cdn2.emmezeta.rs/media/catalog/product/cache/01cb2cb658d395381faf29e7336ee183/g/1/g1nienburg-nienburg-spavaca-soba_1.jpg"
              alt=""
            />
            <div className="product-details">
              <h4>Naslov proizvoda</h4>
              <label>Cena:</label>
              <label>Stanje:</label>
              <div className="product-user-info">
                {/* Ikona */}
                <p>Ime korisnika</p>
              </div>
            </div>
            <div className="button-list">
              <button className="wishlist-btn">Dodaj</button>
              <div className="button-info">{/* Ikona */}1 zeli</div>
              <div className="button-info">{/* Ikona */}2 dana</div>
              <div className="button-info">{/* Ikona */}0 ponuda</div>
            </div>
          </article>
          <article className="product">
            <img
              className="product-image"
              src="https://cdn2.emmezeta.rs/media/catalog/product/cache/01cb2cb658d395381faf29e7336ee183/g/1/g1nienburg-nienburg-spavaca-soba_1.jpg"
              alt=""
            />
            <div className="product-details">
              <h4>Naslov proizvoda</h4>
              <label>Cena:</label>
              <label>Stanje:</label>
              <div className="product-user-info">
                {/* Ikona */}
                <p>Ime korisnika</p>
              </div>
            </div>
            <div className="button-list">
              <button className="wishlist-btn">Dodaj</button>
              <div className="button-info">{/* Ikona */}1 zeli</div>
              <div className="button-info">{/* Ikona */}2 dana</div>
              <div className="button-info">{/* Ikona */}0 ponuda</div>
            </div>
          </article>
          <article className="product">
            <img
              className="product-image"
              src="https://cdn2.emmezeta.rs/media/catalog/product/cache/01cb2cb658d395381faf29e7336ee183/g/1/g1nienburg-nienburg-spavaca-soba_1.jpg"
              alt=""
            />
            <div className="product-details">
              <h4>Naslov proizvoda</h4>
              <label>Cena:</label>
              <label>Stanje:</label>
              <div className="product-user-info">
                {/* Ikona */}
                <p>Ime korisnika</p>
              </div>
            </div>
            <div className="button-list">
              <button className="wishlist-btn">Dodaj</button>
              <div className="button-info">{/* Ikona */}1 zeli</div>
              <div className="button-info">{/* Ikona */}2 dana</div>
              <div className="button-info">{/* Ikona */}0 ponuda</div>
            </div>
          </article>
        </div>
      </section>
    </section>
  );
};

export default CategorySettings;
