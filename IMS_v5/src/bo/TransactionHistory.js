import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaEye } from "react-icons/fa";
import { fetchQueryData } from "../api/fetchData";
import { decodeBase64 } from "../api/decodeBase64";
import { CustomDropdown } from "../api/dropDown";
import TransactionModal from "../api/transactionModal"; // Ensure the correct path
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
  LineChart,
  Line,
} from "recharts";

const TransactionsManagement = () => {
  const transactionData = [
    { type: "Received", count: 120 },
    { type: "Shipped", count: 80 },
    { type: "Returned", count: 20 },
  ];

  const inventoryLevels = [
    { date: "Feb 1", level: 1000 },
    { date: "Feb 5", level: 900 },
    { date: "Feb 10", level: 950 },
    { date: "Feb 15", level: 870 },
    { date: "Feb 20", level: 920 },
  ];

  const [transactions, setTransactions] = useState([]);
  const [newTransaction, setNewTransaction] = useState({
    product_id: "",
    location_id: "",
    transaction_type: "",
    quantity: "",
    reference_id: "",
    batch_number: "",
    handling_notes: "",
  });
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const rowsPerPage = 5; // Number of transactions to show per page
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
            "iposarv3.sales INNER JOIN cashiers ON sales.cashier_id = cashiers.cashier_id",
          columns:
            "sales.*, cashiers.name AS cashierName",
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTransaction({ ...newTransaction, [name]: value });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (
      !newTransaction.product_id ||
      !newTransaction.location_id ||
      !newTransaction.transaction_type.trim() ||
      !newTransaction.quantity ||
      !newTransaction.reference_id.trim() ||
      !newTransaction.batch_number.trim() ||
      !newTransaction.handling_notes.trim()
    ) {
      alert("Please fill in all fields.");
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("accessToken");
      if (!token) throw new Error("No token found");

      const now = new Date();
      const gmtPlus8Date = new Date(now.getTime() + 8 * 60 * 60 * 1000);
      const currentDateTime = gmtPlus8Date
        .toISOString()
        .slice(0, 19)
        .replace("T", " ");

      const trimmedTransaction = {
        ...newTransaction,
        product_id: parseInt(newTransaction.product_id, 10),
        location_id: parseInt(newTransaction.location_id, 10),
        quantity: parseInt(newTransaction.quantity, 10),
        transaction_date: currentDateTime,
      };

      await axios.post(
        `${process.env.REACT_APP_API_URL}/insert/inventory_transactions`,
        trimmedTransaction,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      alert("Transaction added successfully!");
      setNewTransaction({
        product_id: "",
        location_id: "",
        transaction_type: "",
        quantity: "",
        reference_id: "",
        batch_number: "",
        handling_notes: "",
      });
    } catch (error) {
      console.error("Error creating transaction:", error);
      alert(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Refresh transactions list after an update
  const refreshTransactions = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("accessToken");
      const transactionsData = await fetchQueryData(token, {
        table:
          "iposarv3.inventory_transactions INNER JOIN inventory_locations ON inventory_transactions.location_id = inventory_locations.location_id INNER JOIN products ON inventory_transactions.product_id = products.product_id",
        columns:
          "transaction_id AS iTransaction_id, products.product_id AS pProduct_id, barcode AS pBarcode, products.name AS pName,inventory_locations.location_id AS lLocation_id, inventory_locations.name AS lName, transaction_type AS iTransaction_type, quantity AS iQuantity, transaction_date AS iTransaction_date, reference_id AS iReference_id, inventory_transactions.batch_number AS iBatch_number, handling_notes AS iHandling_notes",
      });
      setTransactions(transactionsData);
    } catch (error) {
      console.error("Error refreshing transactions:", error);
      alert(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid">
      {loading && (
        <div className="loading-bar-container">
          <div className="loading-bar"></div>
        </div>
      )}

      {/* First Row: Add & View Transactions */}
      <div className="row">
      <div className="col-md-8">
          <div className="card p-3 h-100">
            <h4>List of Sales</h4>

            <table className="table">
              <thead>
                <tr>
                  <th>Receipt</th>
                  <th
                    onClick={() => handleSort("sale_id")}
                    style={{ cursor: "pointer" }}
                  >
                    Sale No.
                    {sortConfig.key === "sale_id"
                      ? sortConfig.direction === "asc"
                        ? " ↑"
                        : " ↓"
                      : null}
                  </th>
                  <th
                    onClick={() => handleSort("total_amount")}
                    style={{ cursor: "pointer" }}
                  >
                    Total Amount
                    {sortConfig.key === "total_amount"
                      ? sortConfig.direction === "asc"
                        ? " ↑"
                        : " ↓"
                      : null}
                  </th>
                  <th
                    onClick={() => handleSort("payment_method")}
                    style={{ cursor: "pointer" }}
                  >
                    Payment Method
                    {sortConfig.key === "payment_method"
                      ? sortConfig.direction === "asc"
                        ? " ↑"
                        : " ↓"
                      : null}
                  </th>
                  <th
                    onClick={() => handleSort("cashierName")}
                    style={{ cursor: "pointer" }}
                  >
                    Cashier Name
                    {sortConfig.key === "cashierName"
                      ? sortConfig.direction === "asc"
                        ? " ↑"
                        : " ↓"
                      : null}
                  </th>
                  <th
                    onClick={() => handleSort("sale_date")}
                    style={{ cursor: "pointer" }}
                  >
                    Sale Date
                    {sortConfig.key === "sale_date"
                      ? sortConfig.direction === "asc"
                        ? " ↑"
                        : " ↓"
                      : null}
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginatedTransactions.map((transaction) => (
                  <tr key={transaction.sale_id}>
                    <td>
                      <button
                        className="btn btn-sm btn-warning"
                        onClick={() => {
                          setSelectedTransaction(transaction);
                          setModalOpen(true);
                        }}
                      >
                        <FaEye />
                      </button>
                    </td>
                    <td>{transaction.sale_id}</td>
                    <td>{decodeBase64(transaction.total_amount)}</td>
                    <td>{decodeBase64(transaction.payment_method)}</td>
                    <td>{decodeBase64(transaction.cashierName)}</td>
                    <td>{decodeBase64(transaction.sale_date)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination Controls */}
            <div className="d-flex justify-content-between">
              <button
                className="btn btn-secondary"
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Previous
              </button>
              <span>
                Page {currentPage} of {totalPages}
              </span>
              <button
                className="btn btn-secondary"
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card p-3 h-100">
            <h4>Add New Transaction</h4>
            <form onSubmit={handleFormSubmit}>
              <div className="row">
                {/* Product and Location in the same row */}
                <div className="col-md-6">
                  <CustomDropdown
                    endpoint="products"
                    name="product_id"
                    value={newTransaction.product_id}
                    onChange={handleInputChange}
                    label="Product"
                    idField="product_id"
                    nameField="name"
                  />
                </div>
                <div className="col-md-6">
                  <CustomDropdown
                    endpoint="inventory_locations"
                    name="location_id"
                    value={newTransaction.location_id}
                    onChange={handleInputChange}
                    label="Location"
                    idField="location_id"
                    nameField="name"
                  />
                </div>
              </div>

              <div className="row">
                {/* Type and Quantity in the same row */}
                <div className="col-md-6">
                  <input
                    name="transaction_type"
                    placeholder="Type"
                    value={newTransaction.transaction_type}
                    onChange={handleInputChange}
                    className="form-control my-2"
                  />
                </div>
                <div className="col-md-6">
                  <input
                    name="quantity"
                    placeholder="Quantity"
                    value={newTransaction.quantity}
                    onChange={handleInputChange}
                    className="form-control my-2"
                  />
                </div>
              </div>

              <div className="row">
                {/* Reference ID and Batch Number in the same row */}
                <div className="col-md-6">
                  <input
                    name="reference_id"
                    placeholder="Reference ID"
                    value={newTransaction.reference_id}
                    onChange={handleInputChange}
                    className="form-control my-2"
                  />
                </div>
                <div className="col-md-6">
                  <input
                    name="batch_number"
                    placeholder="Batch Number"
                    value={newTransaction.batch_number}
                    onChange={handleInputChange}
                    className="form-control my-2"
                  />
                </div>
              </div>

              <div className="row">
                {/* Handling Notes in a single row */}
                <div className="col-12">
                  <textarea
                    name="handling_notes"
                    placeholder="Handling Notes"
                    value={newTransaction.handling_notes}
                    onChange={handleInputChange}
                    className="form-control my-2"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary w-100"
              >
                {loading ? "Loading..." : "Add Transaction"}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Second Row: 2 Cards */}
      <div className="row mt-4">
        {/* Card 1 - Bar Chart: Transactions by Type */}
        <div className="col-md-6">
          <div className="card p-3">
            <h5>Transactions by Type</h5>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={transactionData}>
                <XAxis dataKey="type" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#007bff" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Card 2 - Line Chart: Inventory Levels Over Time */}
        <div className="col-md-6">
          <div className="card p-3">
            <h5>Inventory Levels Over Time</h5>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={inventoryLevels}>
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="level" stroke="#28a745" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <TransactionModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        transaction={selectedTransaction}
        onSubmit={refreshTransactions}
      />
    </div>
  );
};  

export default TransactionsManagement;
