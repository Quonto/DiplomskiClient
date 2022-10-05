import { useRef, useState } from "react";
import "./imageSlider.css";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

const ImageSlider = ({ images, handleSelectedImage }) => {
  const [distance, setDistance] = useState(0);

  const imagesRef = useRef(null);

  const handleDistance = (direction) => {
    if (direction === "left") {
      setDistance((distance) => distance + 115);
      imagesRef.current.style.transform = `translateX(${distance + 115}px)`;
    }
    if (direction === "right") {
      setDistance((distance) => distance - 115);
      imagesRef.current.style.transform = `translateX(${distance - 115}px)`;
    }
  };

  const checkDisableLeft = () => {
    if (distance === 0) return true;
    return false;
  };

  const checkDisableRight = () => {
    if (Math.abs(distance) === (images.length - 3) * 115 || images.length <= 3)
      return true;
    return false;
  };

  return (
    <section className="images">
      <button
        type="button"
        className="arrow left"
        onClick={() => handleDistance("left")}
        disabled={checkDisableLeft()}
      >
        {<ArrowBackIosIcon />}
      </button>
      <div className="wrapper" ref={imagesRef}>
        {images.map((image, index) => {
          return (
            <article key={index} className="image-wrapper">
              <img
                src={image.data}
                alt=""
                onClick={() => handleSelectedImage(image)}
              />
            </article>
          );
        })}
      </div>
      <button
        type="button"
        className="arrow right"
        onClick={() => handleDistance("right")}
        disabled={checkDisableRight()}
      >
        {" "}
        {<ArrowForwardIosIcon />}
      </button>
    </section>
  );
};

export default ImageSlider;
