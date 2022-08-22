import { useState, useRef, useEffect } from "react";
import ProductInfo from "../../components/productInformation/ProductInfo";
import axios from "axios";
import ImageEditor from "../imageEditor/ImageEditor";

const UpdateProduct = ({ setIsChangeActive, pr }) => {
  const [places, setPlaces] = useState(null);
  const [place, setPlace] = useState({
    name: "",
  });
  const [time, setTime] = useState(pr.date);
  const [images, setImages] = useState(pr.picture);
  const [selectedImage, setSelectedImage] = useState({
    name: "",
    data: null,
    index: "",
  });
  const [isImageEditorActive, setIsImageEditorActive] = useState(false);
  const [productInformation, setProductInformation] = useState(pr.data);

  const inputRef = useRef(null);

  const handleEditImage = (image) => {
    if (image === null) {
      const newImages = images.filter(
        (img) => img.index !== selectedImage.index
      );
      setImages(newImages);
      setSelectedImage({
        name: "",
        data: null,
        index: "",
      });
    } else {
      setSelectedImage({ ...selectedImage, data: image });
      const newImages = images.map((img, index) => {
        if (index === selectedImage.index) {
          return {
            data: image,
            name: "",
            index: selectedImage.index,
          };
        }
        return img;
      });
      setImages(newImages);
    }
  };

  return (
    <section className="modal-return-edit-image">
      <div className="modal-wrapper-edit-image">
        <button
          className="exit-modal-edit-image"
          onClick={() => setIsChangeActive(false)}
        >
          X
        </button>
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

export default UpdateProduct;
