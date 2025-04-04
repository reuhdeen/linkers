import React, { useState, useEffect } from "react";
import axios from "axios";
import { fetchQueryData } from "../api/fetchData";
import { CustomDropdown } from "../api/dropDown";
import TransactionModal from "../api/transactionModal"; // Ensure the correct path
import "../css/loading.css";
import "../css/tables.css";
import "bootstrap/dist/css/bootstrap.min.css";
import DataTable from "../api/dataTable";

import { SearchProduct } from "../api/searchProduct";

const TransactionsManagement = () => {
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
  const [productFound, setProductFound] = useState(false);

  const columns = [
    { name: "Edit", key: "edit" },
    { name: "Transaction ID", key: "iTransaction_id" },
    { name: "Barcode", key: "pBarcode" },
    { name: "Name", key: "pName" },

    { name: "Location", key: "lName" },
    { name: "Type", key: "iTransaction_type" },
    { name: "Quantity", key: "iQuantity" },
  ];

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("accessToken");
        if (!token) throw new Error("No token found");

        const transactionsData = await fetchQueryData(token, {
          table:
            "iposal.inventory_transactions LEFT JOIN inventory_locations ON inventory_transactions.location_id = inventory_locations.location_id INNER JOIN products ON inventory_transactions.product_id = products.product_id",
          columns:
            "transaction_id AS iTransaction_id, products.product_id AS pProduct_id, barcode AS pBarcode, products.name AS pName,inventory_locations.location_id AS lLocation_id, inventory_locations.name AS lName, transaction_type AS iTransaction_type, quantity AS iQuantity, transaction_date AS iTransaction_date, reference_id AS iReference_id, inventory_transactions.batch_number AS iBatch_number, handling_notes AS iHandling_notes",
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
          "iposal.inventory_transactions LEFT JOIN inventory_locations ON inventory_transactions.location_id = inventory_locations.location_id INNER JOIN products ON inventory_transactions.product_id = products.product_id",
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
        <div className="col-md-4">
          <div className="card p-3 h-100">
            <h4>Add New Transaction</h4>
            <form onSubmit={handleFormSubmit} onKeyDown={(e) => e.key === "Enter" && e.preventDefault()}>
            {/* <div className="row">
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
              </div> */}
              <div className="row mb-3">
                <div className="col-12">
                  <SearchProduct
                    endpoint="products"
                    name="product_id"
                    value={newTransaction.product_id}
                    onChange={(e) => {
                      handleInputChange(e);
                      setProductFound(!!e.target.value); // Show fields only if a product is found
                    }}
                    label="Enter Product Barcode"
                    idField="product_id"
                    nameField="name"
                  />
                </div>
              </div>

              {productFound && (
                <>
                  <div className="row">
                    <div className="col-md-6">
                      <label>Transaction Type</label>
                      <select
                        id="statusSelect"
                        name="transaction_type"
                        className="form-control"
                        value={newTransaction.transaction_type}
                        onChange={handleInputChange}
                      >
                        <option value="">-- Select Status --</option>
                        <option value="Stock-in">Stock-in</option>
                        <option value="Damaged">Damaged</option>
                        <option value="Expired">Expired</option>
                      </select>
                    </div>
                    <div className="col-md-6">
                    <label>Quantity</label>
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
                    <div className="col-md-6">
                    <label>Reference ID</label>
                      <input
                        name="reference_id"
                        placeholder="Reference ID"
                        value={newTransaction.reference_id}
                        onChange={handleInputChange}
                        className="form-control my-2"
                      />
                    </div>
                    <div className="col-md-6">
                    <label>Batch Number</label>
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
                    <div className="col-12">
                    <label>Handling Notes</label>
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
                </>
              )}
            </form>
          </div>
        </div>

        <div className="col-md-8">
          <div className="card p-3 h-100">
            <DataTable
              columns={columns}
              data={transactions}
              modalOpen={modalOpen}
              title="Transactions"
              rows={10}
            />
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
