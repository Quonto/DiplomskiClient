import "./review.css";

const Review = ({ setIsReviewActive }) => {
  return (
    <section className="modal-return-review">
      <div className="modal-wrapper-review">
        <button
          className="exit-modal-review"
          onClick={() => setIsReviewActive(false)}
        >
          X
        </button>
      </div>
    </section>
  );
};

export default Review;
