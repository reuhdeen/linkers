import React, { useState, useEffect } from "react";
import axios from "axios";
import "../css/modal.css";
import { decodeBase64 } from "../api/decodeBase64";

const TransactionModal = ({ isOpen, onClose, transaction, onSubmit }) => {
  const [formData, setFormData] = useState({
    pProduct_id: "",
    lLocation_id: "",
    iTransaction_type: "",
    iQuantity: "",
    iReference_id: "",
    iBatch_number: "",
    iHandling_notes: "",
  });

  useEffect(() => {
    if (transaction) {
      setFormData({
        pProduct_id: transaction.pProduct_id || "",
        lLocation_id: transaction.lLocation_id || "",
        iTransaction_type: decodeBase64(transaction.iTransaction_type) || "",
        iQuantity: transaction.iQuantity || "",
        iReference_id: transaction.iReference_id || "",
        iBatch_number: decodeBase64(transaction.iBatch_number) || "",
        iHandling_notes: decodeBase64(transaction.iHandling_notes) || "",
      });
    }
  }, [transaction]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("accessToken");
      if (!token) throw new Error("No token found");

      const updatedData = {
        data: {
          product_id: formData.pProduct_id,
          location_id: formData.lLocation_id,
          transaction_type: formData.iTransaction_type,
          quantity: formData.iQuantity,
          reference_id: formData.iReference_id,
          batch_number: formData.iBatch_number,
          handling_notes: formData.iHandling_notes,
        },
        conditions: {
          transaction_id: transaction.iTransaction_id,
        },
      };

      // Change the HTTP method from POST to PUT
      await axios.put(
        `${process.env.REACT_APP_API_URL}/update/inventory_transactions`,
        updatedData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      alert("Transaction updated successfully!");
      onSubmit(); // Notify parent to refresh data
      onClose();  // Close the modal
    } catch (error) {
      console.error("Error updating transaction:", error);
      alert(`Error: ${error.message}`);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-button" onClick={onClose}>
          &times;
        </button>
        <h2>Edit Transaction</h2>
        <form onSubmit={handleSubmit}>
          <p>
            <strong>Transaction ID:</strong> {transaction?.iTransaction_id}
          </p>
          <p>
            <strong>Transaction Date:</strong>{" "}
            {decodeBase64(transaction?.iTransaction_date)}
          </p>
          <div>
            <label>
              Product ID:
              <input
                type="number"
                name="pProduct_id"
                value={formData.pProduct_id}
                onChange={handleChange}
              />
            </label>
          </div>
          <div>
            <label>
              Location ID:
              <input
                type="number"
                name="lLocation_id"
                value={formData.lLocation_id}
                onChange={handleChange}
              />
            </label>
          </div>
          <div>
            <label>
              Transaction Type:
              <input
                type="text"
                name="iTransaction_type"
                value={decodeBase64(formData.iTransaction_type)}
                onChange={handleChange}
              />
            </label>
          </div>
          <div>
            <label>
              Quantity:
              <input
                type="number"
                name="iQuantity"
                value={formData.iQuantity}
                onChange={handleChange}
              />
            </label>
          </div>
          <div>
            <label>
              Reference ID:
              <input
                type="text"
                name="iReference_id"
                value={formData.iReference_id}
                onChange={handleChange}
              />
            </label>
          </div>
          <div>
            <label>
              Batch Number:
              <input
                type="text"
                name="iBatch_number"
                value={decodeBase64(formData.iBatch_number)}
                onChange={handleChange}
              />
            </label>
          </div>
          <div>
            <label>
              Handling Notes:
              <textarea
                name="iHandling_notes"
                value={decodeBase64(formData.iHandling_notes)}
                onChange={handleChange}
              />
            </label>
          </div>
          <button type="submit">Save Changes</button>
        </form>
      </div>
    </div>
  );
};

export default TransactionModal;
