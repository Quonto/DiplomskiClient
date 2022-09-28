import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Pagination from "../pagination/Pagination";
import "./review.css";

const Review = ({ setIsReviewActive, isProduct, id }) => {
  const [reviews, setReviews] = useState([]);
  const [isUpdate, setIsUpdate] = useState(false);
  const [updateReview, setUpdateReview] = useState(null);

  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(4);
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = reviews.slice(indexOfFirstPost, indexOfLastPost);

  const handleUpdateReview = (p) => {
    setUpdateReview(p);
    setIsUpdate(!isUpdate);
  };

  const handleDeleteReview = async (id) => {
    await axios.delete(`https://localhost:7113/User/RemoveReview/${id}`);

    setReviews(reviews.filter((review) => review.id !== id));
  };

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleCancel = () => {
    setUpdateReview(null);
    setIsUpdate(false);
  };

  const handleUpdate = () => {
    axios.put("https://localhost:7113/User/UpdateReview ", updateReview);

    setReviews(
      reviews.map((review) => {
        if (review.id === updateReview.id) {
          return updateReview;
        }
        return review;
      })
    );

    setIsUpdate(false);
  };

  useEffect(() => {
    const fetchReviews = async () => {
      let response;
      setLoading(true);
      if (isProduct) {
        response = await axios.get(
          `https://localhost:7113/User/FetchProductReviews/${id}`
        );
      } else {
        response = await axios.get(
          `https://localhost:7113/User/FetchReviews/${id}`
        );
      }
      setReviews(response.data);
      setLoading(false);
    };
    fetchReviews();
  }, []);

  return (
    <section className="modal-return-review">
      {loading ? (
        <h2>Loading...</h2>
      ) : (
        <div className="modal-wrapper-review">
          <button
            className="exit-modal-review"
            onClick={() => setIsReviewActive(false)}
          >
            X
          </button>
          <section className="ap-review-section">
            {currentPosts.map((p, index) => {
              return (
                <article className="ap-review-article" key={index}>
                  <div className="ap-review-header">
                    <Link
                      to={`/profile/${p.user.id}`}
                      className="ap-user-header-product"
                    >
                      <img
                        className="ap-img-user-review"
                        src={p.user.picture}
                        alt=""
                      />
                    </Link>
                    <div className="ap-review-mark">
                      <label className="ap-mark-review">Korisnik</label>
                      <span className="ap-review-text">{p.user.username}</span>
                      <label className="ap-mark-review">Ocena </label>
                      {isUpdate && p.id === updateReview.id ? (
                        <input
                          type="number"
                          className="ap-review-text"
                          defaultValue={p.mark}
                          onChange={(e) =>
                            setUpdateReview({
                              ...updateReview,
                              mark: e.target.value,
                            })
                          }
                        />
                      ) : (
                        <span className="ap-review-text"> {p.mark}</span>
                      )}
                    </div>
                  </div>
                  <div className="ap-review-body-comment">
                    <h3>Komentar</h3>
                    {isUpdate && p.id === updateReview.id ? (
                      <textarea
                        className="ap-comment-review"
                        onChange={(e) =>
                          setUpdateReview({
                            ...updateReview,
                            coment: e.target.value,
                          })
                        }
                        defaultValue={updateReview.coment}
                      ></textarea>
                    ) : (
                      <p className="ap-comment-review">{p.coment}</p>
                    )}
                    <div className="ap-buttons-review">
                      <button
                        className="ap-review-button"
                        onClick={
                          isUpdate ? handleUpdate : () => handleUpdateReview(p)
                        }
                      >
                        {isUpdate && p.id === updateReview.id
                          ? "Sacuvaj"
                          : "Izmeni"}
                      </button>
                      {isUpdate && p.id === updateReview.id && (
                        <button
                          className="ap-review-button"
                          onClick={handleCancel}
                        >
                          Otkazi
                        </button>
                      )}
                      <button
                        disabled={isUpdate}
                        className="ap-review-button"
                        onClick={() => handleDeleteReview(p.id)}
                      >
                        Izbrisi
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
            <Pagination
              postsPerPage={postsPerPage}
              totalPosts={reviews.length}
              paginate={paginate}
            />
          </section>
        </div>
      )}
    </section>
  );
};

export default Review;