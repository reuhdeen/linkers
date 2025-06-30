import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaCaretUp,
  FaCaretDown,
  FaChevronLeft,
  FaChevronRight,
  FaRegEdit,
  FaRegEye,
  FaRegTrashAlt,
} from "react-icons/fa";
import { decodeBase64 } from "../api/decodeBase64";
import "../css/loading.css";
import "../css/tables.css";
import "../css/forms.css";
import "bootstrap/dist/css/bootstrap.min.css";

const ProductTable = ({ columns, data, title, rows, onEdit, onDelete }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(rows);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const navigate = useNavigate(); // 👈 NEW

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const sortedData = useMemo(() => {
    let sortableData = [...data];
    if (sortConfig.key) {
      sortableData.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "asc" ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableData;
  }, [data, sortConfig]);

  const filteredData = sortedData.filter((item) =>
    columns.some(
      (col) =>
        item[col.key] &&
        decodeBase64(item[col.key])
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
    )
  );

  const totalPages = Math.ceil(filteredData.length / rowsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const handleDeleteClick = (product) => {
    setProductToDelete(product);
    setShowDeleteModal(true);
  };
  const confirmDelete = async () => {
    if (productToDelete) {
      await onDelete(productToDelete.ProdID); // Call the delete function passed as a prop
      setShowDeleteModal(false);
      setProductToDelete(null);
    }
  };
  return (
    <div>
      <div className="row align-items-center mb-3">
        <div className="col-md-8">
          <h4>{title}</h4>
        </div>
        <div className="col-md-4 text-end">
          <input
            type="text"
            className="form-control"
            placeholder="Search..."
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
      </div>

      <div className="table-responsive">
        <table className="table">
          <thead>
            <tr>
              {columns.map((col) => (
                <th
                  className="align-middle"
                  key={col.key}
                  onClick={() =>
                    col.key !== "edit" &&
                    col.key !== "media_url" && // Changed ProdID to media_url
                    handleSort(col.key)
                  }
                  style={{
                    cursor:
                      col.key !== "edit" && col.key !== "media_url" // Changed ProdID to media_url
                        ? "pointer"
                        : "default",
                    textAlign: "left",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "5px",
                    }}
                  >
                    <span>{col.name.toUpperCase()}</span>
                    {col.key !== "edit" &&
                      col.key !== "media_url" && ( // Changed ProdID to media_url
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            lineHeight: "1",
                          }}
                        >
                          <FaCaretUp
                            size={12}
                            style={{
                              marginBottom: "-3px",
                              visibility:
                                sortConfig.key === col.key &&
                                sortConfig.direction !== "asc"
                                  ? "hidden"
                                  : "visible",
                            }}
                          />
                          <FaCaretDown
                            size={12}
                            style={{
                              marginTop: "-3px",
                              visibility:
                                sortConfig.key === col.key &&
                                sortConfig.direction !== "desc"
                                  ? "hidden"
                                  : "visible",
                            }}
                          />
                        </div>
                      )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((item) => (
              <tr key={item.ProdID}>
                {columns.map((col) => (
                  <td key={col.key} className="align-middle">
                    {col.key === "edit" ? (
                      <div className="d-flex gap-2">
                        <FaRegEdit
                          className="action-icon"
                          size={16}
                          onClick={() => onEdit(item)}
                          style={{ cursor: "pointer" }}
                        />
                        <FaRegEye
                          className="action-icon"
                          size={16}
                          onClick={() =>
                            navigate(`/products/${item.ProdID}`, {
                              state: { product: item },
                            })
                          }
                          style={{ cursor: "pointer" }}
                        />
                        <FaRegTrashAlt
                          className="action-icon"
                          size={16}
                          onClick={() => handleDeleteClick(item)}
                          style={{ cursor: "pointer" }}
                        />
                      </div>
                    ) : col.key === "media_url" ? ( // Changed ProdID to media_url
                      <img
                        src={decodeBase64(item.media_url)} // Use media_url directly
                        className="img-table"
                        alt={decodeBase64(item.name)} // Changed ProdID to name for alt text
                      />
                    ) : typeof item[col.key] === "number" ? (
                      item[col.key]
                    ) : (
                      decodeBase64(item[col.key])
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination - Kept as per request */}
      <div className="d-flex justify-content-between align-items-center mt-3">
        <span>
          Showing {(currentPage - 1) * rowsPerPage + 1} to{" "}
          {Math.min(currentPage * rowsPerPage, data.length)} of {data.length}{" "}
          entries
        </span>
        <div className="d-flex align-items-center">
          <button
            className="btn btn-sm pagination-button me-2"
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <FaChevronLeft size={12} />
          </button>
          {Array.from({ length: 3 }, (_, i) => currentPage - 1 + i)
            .filter((page) => page > 0 && page <= totalPages)
            .map((page) => (
              <button
                key={page}
                className={`btn btn-sm mx-1 ${
                  page === currentPage
                    ? "btn-pagination-active"
                    : "btn-pagination"
                }`}
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </button>
            ))}
          <button
            className="btn btn-sm pagination-button ms-2"
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            <FaChevronRight size={12} />
          </button>
        </div>
        <div className="d-flex align-items-center">
          <span>Go to page</span> &nbsp; &nbsp;
          <input
            type="number"
            className="pagination-form text-center"
            min="1"
            max={totalPages}
            placeholder={currentPage}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                const page = Number(e.target.value);
                if (page >= 1 && page <= totalPages) {
                  setCurrentPage(page);
                }
              }
            }}
          />
        </div>
      </div>
      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button
              className="close-button"
              onClick={() => setShowDeleteModal(false)}
            >
              &times;
            </button>
            <h3>Confirm Delete</h3>
            <p>
              Are you sure you want to delete the product "
              {productToDelete && decodeBase64(productToDelete.name)}"? This
              action cannot be undone.
            </p>
            <button className="btn btn-danger" onClick={confirmDelete}>
              Delete
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => setShowDeleteModal(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductTable;
