import { useRef, useState } from "react";
import "./imageSlider.css";

const ImageSlider = ({ images, handleSelectedImage }) => {
  const [distance, setDistance] = useState(0);

  const imagesRef = useRef(null);

  const handleDistance = (direction) => {
    if (direction === "left") {
      setDistance((distance) => distance + 100);
      imagesRef.current.style.transform = `translateX(${distance + 100}px)`;
    }
    if (direction === "right") {
      setDistance((distance) => distance - 100);
      imagesRef.current.style.transform = `translateX(${distance - 100}px)`;
    }
  };

  const checkDisableLeft = () => {
    if (distance === 0) return true;
    return false;
  };

  const checkDisableRight = () => {
    if (Math.abs(distance) === (images.length - 3) * 100 || images.length <= 3)
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
        dangerouslySetInnerHTML={{ __html: "<" }}
      ></button>
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
        dangerouslySetInnerHTML={{ __html: ">" }}
      ></button>
    </section>
  );
};

export default ImageSlider;
