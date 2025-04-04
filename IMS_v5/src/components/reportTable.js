import { useState, useMemo } from "react";
import {
  FaCaretUp,
  FaCaretDown,
  FaChevronLeft,
  FaChevronRight,
  FaEdit,
  FaFileExcel,
} from "react-icons/fa";
import { decodeBase64 } from "../api/decodeBase64";
import "../css/loading.css";
import "../css/tables.css";
import "../css/forms.css";
import "bootstrap/dist/css/bootstrap.min.css";
import * as XLSX from "xlsx";

const DataTable = ({ columns, data, modalOpen, rows, dropdown, title }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(rows);
  const [filters, setFilters] = useState({});

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

  const handleFilterChange = (key, value) => {
    setFilters((prevFilters) => ({ ...prevFilters, [key]: value }));
  };

  const sortedData = useMemo(() => {
    let sortableData = [...data];
    if (sortConfig.key) {
      sortableData.sort((a, b) => {
        if (decodeBase64(a[sortConfig.key]) < decodeBase64(b[sortConfig.key])) {
          return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (decodeBase64(a[sortConfig.key]) > decodeBase64(b[sortConfig.key])) {
          return sortConfig.direction === "asc" ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableData;
  }, [data, sortConfig]);

  const filteredData = useMemo(() => {
    return sortedData.filter((item) =>
      columns.every((col) => {
        const value = decodeBase64(item[col.key])
          ? decodeBase64(item[col.key]).toLowerCase()
          : "";

        // Ensure the filter is applied correctly
        if (
          filters[col.key] &&
          filters[col.key] !== "" &&
          value !== filters[col.key].toLowerCase()
        ) {
          return false;
        }

        // Apply search term filtering
        return !searchTerm || value.includes(searchTerm.toLowerCase());
      })
    );
  }, [sortedData, filters, searchTerm]);

  const totalPages = Math.ceil(filteredData.length / rowsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const handleDownloadExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      data.map((row) =>
        Object.fromEntries(
          columns.map((col) => {
            const value = row[col.key];

            // Check if the value is an integer, if not, decode it
            const processedValue = Number.isInteger(value)
              ? value
              : decodeBase64(value) || "";

            return [col.name, processedValue];
          })
        )
      )
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Report");

    XLSX.writeFile(workbook, `${title || "Report"}.xlsx`);
  };

  return (
    <div>
      <h4 className="mb-3">{title}</h4>
      <div className="row align-items-center mb-3">
        <div className="col-md-4">
          <input
            type="text"
            className="form-control"
            placeholder="Search..."
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
        <div className="col-md-8 text-end">
        <button
              className="btn btn-sm btn-success mx-2"
              onClick={handleDownloadExcel}
            >
              <FaFileExcel size={14} />
              &nbsp; Export Excel
            </button>
          {dropdown.map((colKey) => (
            <div key={colKey} className="d-inline-block mx-2">
              <label className="me-1">
                {columns.find((col) => col.key === colKey)?.name}
              </label>
              <select
                className="form-control"
                onChange={(e) => handleFilterChange(colKey, e.target.value)}
              >
                <option value="">All</option>{" "}
                {/* Ensure there's a reset option */}
                {[...new Set(data.map((item) => decodeBase64(item[colKey])))]
                  .filter(Boolean)
                  .map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
              </select>
            </div>
          ))}
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
                        onClick={() => modalOpen(item.product_id)}
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
    </div>
  );
};

export default DataTable;
