import React, { useState, useEffect } from "react";
import {
  FaChevronLeft,
  FaChevronRight,
  FaCaretUp,
  FaCaretDown,
} from "react-icons/fa";
import { fetchQueryData } from "../api/fetchData";
import { decodeBase64 } from "../api/decodeBase64";

import LineGraph from "../components/lineGraph";
import TopCategoriesProfit from "../components/topCategoriesProfit";
import TopProductTypeProfit from "../components/topProductTypeProfit";

import "../css/loading.css";
import "../css/tables.css";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const TransactionsManagement = () => {
  const transactionData = [
    { type: "Received", count: 120 },
    { type: "Shipped", count: 80 },
    { type: "Returned", count: 20 },
  ];

  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const rowsPerPage = 7; // Number of transactions to show per page
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  // Function to sort the data
  const sortedTransactions = () => {
    const sortableTransactions = [...transactions];
    if (sortConfig.key) {
      sortableTransactions.sort((a, b) => {
        const aValue = decodeBase64(a[sortConfig.key]) || a[sortConfig.key];
        const bValue = decodeBase64(b[sortConfig.key]) || b[sortConfig.key];

        if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }
    return sortableTransactions;
  };

  // Handle sorting by clicking a column header
  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  // Filtered transactions (pagination only)
  const totalPages = Math.ceil(transactions.length / rowsPerPage);
  const paginatedTransactions = sortedTransactions().slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("accessToken");
        if (!token) throw new Error("No token found");

        const transactionsData = await fetchQueryData(token, {
          table:
            "products p LEFT JOIN sale_details sd ON p.product_id = sd.product_id GROUP BY p.product_id, p.name, sd.discounted_price, p.cost_price",
          columns:
            "    p.product_id AS ProductID, p.name AS Product, p.description AS Description, COALESCE(COUNT(sd.product_id), 0) AS Sold, COALESCE(sd.discounted_price, 0) AS Price, COALESCE(COUNT(sd.product_id) * sd.discounted_price, 0) AS Revenue, COALESCE((COUNT(sd.product_id) * sd.discounted_price) - (p.cost_price * COUNT(sd.product_id)), 0) AS Profit",
        });

        setTransactions(transactionsData);
      } catch (error) {
        console.error("Error fetching transactions:", error);
        alert(`Error: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  return (
    <div className="container-fluid">
      {loading && (
        <div className="loading-bar-container">
          <div className="loading-bar"></div>
        </div>
      )}

      <div class="grid-container">
        <div class="sale_summary-products">
          <div className="card p-3 h-100">
            <h4>Top Selling Products</h4>
            {/* <img
              src={`/menu_icons/home-icon.svg`}
              className="my-icon"
              alt="dadad"
            /> */}

            <table className="table">
              <thead>
                <tr>
                  <th
                    colSpan={2}
                    onClick={() => handleSort("Product")}
                    style={{ cursor: "pointer", textAlign: "left" }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "5px",
                      }}
                    >
                      <span>PRODUCT</span>
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
                              sortConfig.key === "Product" &&
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
                              sortConfig.key === "Product" &&
                              sortConfig.direction !== "desc"
                                ? "hidden"
                                : "visible",
                          }}
                        />
                      </div>
                    </div>
                  </th>

                  {["Price", "Sold", "Revenue", "Profit"].map((column) => (
                    <th
                      key={column}
                      onClick={() => handleSort(column)}
                      style={{
                        cursor: "pointer",
                        textAlign: column === "Profit" ? "right" : "left",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "5px",
                        }}
                      >
                        <span>{column.toUpperCase()}</span>
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
                                sortConfig.key === column &&
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
                                sortConfig.key === column &&
                                sortConfig.direction !== "desc"
                                  ? "hidden"
                                  : "visible",
                            }}
                          />
                        </div>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {paginatedTransactions.map((transaction, index) => (
                  <>
                    {/* First row */}
                    <tr key={transaction.ProductID + "-row1"}>
                      {/* Merged column using rowspan */}
                      <td rowSpan="2" className="custom-width align-middle">
                        <img
                          src={`/product_images/${transaction.ProductID}.png`}
                          className="img-table"
                          alt={decodeBase64(transaction.Product)}
                        />
                      </td>
                      <td className="no-border align-middle">
                        <b>{decodeBase64(transaction.Product)}</b>
                      </td>
                      <td rowSpan="2" className="align-middle">
                        ₱{decodeBase64(transaction.Price)}
                      </td>
                      <td rowSpan="2" className="align-middle">
                        {transaction.Sold}
                      </td>
                      <td rowSpan="2" className="align-middle">
                        ₱{decodeBase64(transaction.Revenue)}
                      </td>
                      <td rowSpan="2" className="text-end align-middle">
                        ₱{decodeBase64(transaction.Profit)}
                      </td>
                    </tr>

                    {/* Second row */}
                    <tr key={transaction.ProductID + "-row2"}>
                      <td className="align-middle">
                        {decodeBase64(transaction.Description)}
                      </td>
                    </tr>
                  </>
                ))}
              </tbody>
            </table>

            {/* Pagination Controls */}
            <div className="d-flex justify-content-between align-items-center mt-3">
              <span>
                Showing {(currentPage - 1) * rowsPerPage + 1} to{" "}
                {Math.min(currentPage * rowsPerPage, transactions.length)} of{" "}
                {transactions.length} entries
              </span>

              <div className="d-flex align-items-center">
                {/* Previous Button */}
                <button
                  className="btn btn-sm pagination-button me-2"
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  <FaChevronLeft size={12} />
                </button>

                {/* Page Numbers */}
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

                {/* Next Button */}
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
                {/* Jump to Page Input */}
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
        </div>
        <div class="sale_summary-1">
        <div className="card p-3 h-100">
            <h4>Total Items Sold</h4>

          </div>
        </div>
        <div class="sale_summary-2">
        <div className="card p-3 h-100">
            <h4>Total Revenue</h4>

          </div>
        </div>
        <div class="sale_summary-3">
        <div className="card p-3 h-100">
            <h4>Total Profit</h4>
          </div>
        </div>
        <div class="sale_summary-category">
          <div className="card p-3 h-100">
            <h4>Profit Per Category</h4>
            <TopCategoriesProfit />
          </div>
        </div>
        <div class="sale_summary-type">
          <div className="card p-3 h-100">
            <h4>Profit Per Product Type</h4>
            <TopProductTypeProfit />
          </div>
        </div>
      </div>

      {/* Second Row: 2 Cards */}
      <div className="row mt-4">
        {/* Card 2 - Line Chart: Inventory Levels Over Time */}
        <div className="col-md-12">
          <div className="card p-3">
            <h4>Inventory Levels Over Time</h4>
            <LineGraph />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionsManagement;
