import { useState, useMemo } from "react";
import { FaCaretUp, FaCaretDown, FaChevronLeft, FaChevronRight, FaEdit } from "react-icons/fa";
import { decodeBase64 } from "../api/decodeBase64";
import EditModal from "../api/editModal"; // Import modal component
import "../css/loading.css";
import "../css/tables.css";
import "../css/forms.css";
import "bootstrap/dist/css/bootstrap.min.css";

const DataTable = ({ columns, data, title, rows, onEdit  }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(rows);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  const handleEditClick = (transaction) => {
    setSelectedTransaction(transaction);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedTransaction(null);
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
    columns.some((col) =>
      item[col.key] && decodeBase64(item[col.key]).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const totalPages = Math.ceil(filteredData.length / rowsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

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
                    col.key !== "product_id" &&
                    handleSort(col.key)
                  }
                  style={{
                    cursor:
                      col.key !== "edit" && col.key !== "product_id"
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
                    {col.key !== "edit" && col.key !== "product_id" && (
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
              <tr key={item.product_id}>
                {columns.map((col) => (
                  <td key={col.key} className="align-middle">
                    {col.key === "edit" ? (
                  <FaEdit
                  className="edit-button"
                  size={16}
                  onClick={() => onEdit(item)} // ✅ Pass entire item to edit modal
                  style={{ cursor: "pointer" }}
                />

                    ) : col.key === "product_id" ? (
                      <img
                        src={`/product_images/${item.product_id}.png`}
                        className="img-table"
                        alt={decodeBase64(item.product_id)}
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
          {Math.min(currentPage * rowsPerPage, data.length)} of{" "}
          {data.length} entries
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

      {/* Edit Modal with Current Data as Placeholder */}
      <EditModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        data={selectedTransaction}
        primaryKey="iTransaction_id"
        apiEndpoint="/update/inventory_transactions"
        onSubmit={() => console.log("Data updated!")} 
        fields={[
          { key: "pProduct_id", label: "Product ID", type: "number", placeholder: selectedTransaction?.pProduct_id },
          { key: "lLocation_id", label: "Location ID", type: "number", placeholder: selectedTransaction?.lLocation_id },
          { key: "iTransaction_type", label: "Transaction Type", type: "text", placeholder: selectedTransaction?.iTransaction_type },
          { key: "iQuantity", label: "Quantity", type: "number", placeholder: selectedTransaction?.iQuantity },
        ]}
      />
    </div>
  );
};

export default DataTable;
