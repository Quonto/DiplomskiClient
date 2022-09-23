import "./imageEditor.css";
import ReactImagePickerEditor from "react-image-picker-editor";
import "react-image-picker-editor/dist/index.css";

const ImageEditor = ({
  selectedImage,
  setIsImageEditorActive,
  handleEditImage,
}) => {
  const config2 = {
    borderRadius: "8px",
    language: "sr",
    width: "500px",
    height: "500px",
    objectFit: "contain",
    compressInitial: null,
  };

  console.log(selectedImage);

  return (
    <section className="modal-return-edit-image">
      <div className="modal-wrapper-edit-image">
        <button
          className="exit-modal-edit-image"
          onClick={() => setIsImageEditorActive(false)}
        >
          X
        </button>
        <div>
          <ReactImagePickerEditor
            config={config2}
            imageSrcProp={selectedImage.data}
            imageChanged={(image) => {
              handleEditImage(image);
            }}
          />
        </div>
      </div>
    </section>
  );
};

export default ImageEditor;
