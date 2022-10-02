import "./pagination.css";

const Pagination = ({ postsPerPage, totalPosts, paginate, currentPage }) => {
  const pageNumbers = [];

  for (let i = 1; i <= Math.ceil(totalPosts / postsPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="paginations-div">
      {" "}
      <ul className="pagination">
        {pageNumbers.map((number) => {
          return (
            <li
              key={number}
              className={`page-item ${currentPage === number && "current"} `}
            >
              <button
                onClick={() => paginate(number)}
                className={`page-link ${currentPage === number && "current"} `}
              >
                {number}
              </button>
            </li>
          );
        })}
      </ul>{" "}
    </div>
  );
};

export default Pagination;
