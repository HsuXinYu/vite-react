import PropTypes from "prop-types";

function Pagination({ pagination, changePage }) {
  //   console.log(pagination);
  const handleChangePage = (event, page) => {
    event.preventDefault();
    changePage(page);
  };

  return (
    <>
      <nav
        className="d-flex justify-content-center"
        aria-label="Page navigation"
      >
        <ul className="pagination">
          <li className="page-item">
            <a
              href="/"
              aria-label="Previous"
              className={`page-link ${pagination.has_pre ? "" : "disabled"}`}
              onClick={(event) =>
                handleChangePage(event, pagination.current_page - 1)
              }
            >
              <span aria-hidden="true">&laquo;</span>
            </a>
          </li>
          {[...new Array(pagination.total_pages)].map((_, i) => (
            <li className="page-item" key={`${i}_page`}>
              <a
                className={`page-link ${
                  i + 1 === pagination.current_page && "active"
                }`}
                href="/"
                onClick={(event) => handleChangePage(event, i + 1)}
              >
                {i + 1}
              </a>
            </li>
          ))}
          <li className="page-item">
            <a
              className={`page-link ${pagination.has_next ? "" : "disabled"}`}
              onClick={(event) =>
                handleChangePage(event, pagination.current_page + 1)
              }
              href="/"
              aria-label="Next"
            >
              <span aria-hidden="true">&raquo;</span>
            </a>
          </li>
        </ul>
      </nav>
    </>
  );
}

Pagination.propTypes = {
  pagination: PropTypes.shape({
    total_pages: PropTypes.number,
    current_page: PropTypes.number,
    has_pre: PropTypes.bool,
    has_next: PropTypes.bool,
  }).isRequired,
  changePage: PropTypes.func.isRequired,
};

export default Pagination;
