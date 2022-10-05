import ImageSlider from "../imageSlider/ImageSlider";

const ProductInfo = ({
  product,
  setProduct,
  handleChangePurchase,
  places,
  handleChangePlaces,
  handleChangeTime,
  handleUploadFile,
  images,
  selectedImage,
  setIsImageEditorActive,
  handleSelectedImage,
  handleChangePi,
  productInformation,
  inputRef,
}) => {
  return (
    <>
      <section className="add-product-information">
        <div className="left-container">
          <label className="add-product-label" htmlFor="name">
            Naziv:
          </label>
          <input
            name="name"
            className="add-product-input"
            placeholder="Ime"
            onChange={(e) => setProduct({ ...product, name: e.target.value })}
          ></input>
          <label className="add-product-label" htmlFor="price">
            Cena:
          </label>
          <input
            name="price"
            type="number"
            className="add-product-input"
            placeholder="Cena"
            onChange={(e) => setProduct({ ...product, price: e.target.value })}
          ></input>
          <label className="add-product-label" htmlFor="place">
            Mesto:
          </label>
          {places && (
            <select
              className="add-product-select"
              onChange={handleChangePlaces}
            >
              {places.map((p, i) => {
                return (
                  <option key={i} value={i}>
                    {p.name}
                  </option>
                );
              })}
            </select>
          )}
          <div className="purchase">
            <div className="purchase-product">
              <label className="add-product-label" htmlFor="place">
                Nacin kupovine:
              </label>
              <select
                className="add-product-select"
                onChange={handleChangePurchase}
              >
                <option value={false}>Kupovina</option>
                <option value={true}>Aukcija</option>
              </select>
            </div>

            {product.auction && (
              <div className="purchase-product">
                <label className="add-product-label" htmlFor="place">
                  Vreme aukcije:
                </label>
                <select
                  className="add-product-select"
                  onChange={handleChangeTime}
                  defaultValue={1}
                >
                  <option value={1}>Jedan dan</option>
                  <option value={2}>Dva dana</option>
                  <option value={3}>Tri dana</option>
                  <option value={4}>Cetiri dana</option>
                </select>
              </div>
            )}
          </div>
          <label className="add-product-label" htmlFor="contact">
            Kontakt:
          </label>
          <input
            name="contact"
            className="add-product-input"
            placeholder="Kontakt"
            onChange={(e) => setProduct({ ...product, phone: e.target.value })}
          ></input>
          <label className="add-product-label" htmlFor="details">
            Opis:
          </label>
          <textarea
            name="details"
            className="add-product-details"
            onChange={(e) =>
              setProduct({ ...product, details: e.target.value })
            }
          />
        </div>
        {productInformation && (
          <div className="right-container">
            {productInformation.map((pi, index) => {
              return (
                <article key={index}>
                  <label htmlFor="name" className="pi-label">
                    {pi.name + " "}
                  </label>
                  <input
                    className="pi-input"
                    name="name"
                    placeholder={pi.name}
                    onChange={(e) => handleChangePi(e, pi.name)}
                  />
                </article>
              );
            })}
          </div>
        )}
        <div className="middle-container">
          {images && (
            <>
              <div className="image-preview">
                <img
                  className="add-product-image"
                  src={selectedImage?.data}
                  alt=""
                />
              </div>
              <div className="add-product-picture-input">
                <button
                  className="input-btn"
                  onClick={() => setIsImageEditorActive(true)}
                  type="button"
                >
                  Izmena slike
                </button>
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
              </div>
              <ImageSlider
                images={images}
                handleSelectedImage={handleSelectedImage}
              ></ImageSlider>
            </>
          )}
        </div>
      </section>
    </>
  );
};

export default ProductInfo;
