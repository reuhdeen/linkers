import React, { useEffect, useState } from "react";
import axios from "axios";
import "../css/modal.css";
import { decodeBase64 } from "../api/decodeBase64";
import { fetchQueryData } from "../api/fetchData";

const ReceiptModal = ({ isOpen, onClose, userId, salesID, orders, cashNumber  }) => {
  const [sales, setSales] = useState([]);

  useEffect(() => {
    if (isOpen) {
      fetchSales();
    }
  }, [isOpen]);

  const fetchSales = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) throw new Error("No token found");

      const response = await fetchQueryData(token, {
        table: "sales",
        columns: "*",
        where: `sale_id = '${salesID}'`,
      });

      setSales(response);
    } catch (error) {
      console.error("Error fetching sales:", error);
    }
  };

  const startNewTransaction = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) throw new Error("No token found");
  
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/insert/cart`,
        { user_id: userId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
  
      const newCartId = response.data.id;
      localStorage.setItem("selectedCartId", newCartId);
  
      onClose();
      window.location.reload(); // 🔄 Reload page after closing modal
    } catch (error) {
      console.error("Error starting new transaction:", error);
      alert("Failed to create a new cart. Please try again.");
    }
  };
  
  const handleClose = () => {
    onClose();
    window.location.reload(); // 🔄 Reload page after clicking close button
  };
  

  if (!isOpen) return null;

  return (
    <div className="receipt-modal modal-overlay">
      <div className="receipt-modal-content">
        <button className="close-button" onClick={handleClose}>
          &times;
        </button>
        <h3 className="modal-title">Receipt</h3>

        <div className="modal-body">
          {sales.map((sale, index) => (
            <h6 key={index} className="modal-head">
              {decodeBase64(sale.payment_method)} - {decodeBase64(sale.sale_date)}
            </h6>
          ))}

<table className="table w-100 receipt-table">
              {/* Table Header */}
              <thead>

                <tr>
                  <th className="w-40">DESCRIPTION</th>
                  <th className="w-20 text-end">QTY</th>
                  <th className="w-20 text-end">PRICE</th>
                  <th className="w-20 text-end">AMOUNT</th>
                </tr>
              </thead>
              {/* Table Body */}
              <tbody>
                {orders.map((order, index) => (
                  <React.Fragment key={index}>
                    {/* First row: Product name and description */}
                    <tr>
                      <td colSpan="4" className="text-uppercase">
                        {decodeBase64(order.name)} {order.description}
                      </td>
                    </tr>

                    {/* Second row: Quantity, Selling Price, and Total */}
                    <tr className="row-order">
                      <td className="w-40"></td>
                      <td className="text-end w-20">
                        <div className="d-flex justify-content-between">
                          <span>{order.quantity}</span> <span>x</span>
                        </div>
                      </td>
                      <td className="text-end w-20">
                        ₱{decodeBase64(order.current_price)}
                      </td>
                      <td className="text-end w-20">
                        ₱
                        {(
                          Number(decodeBase64(order.current_price)) *
                          order.quantity
                        ).toFixed(2)}
                      </td>
                    </tr>
                  </React.Fragment>
                ))}
                <tr>
                  <td></td>
                  <td></td>
                  <td className="text-end fw-bold w-20">Total:</td>
                  <td className="text-end w-20">
                    {orders
                      .reduce(
                        (total, order) =>
                          total +
                          decodeBase64(order.current_price) * order.quantity,
                        0
                      )
                      .toFixed(2)}
                  </td>
                </tr>
                <tr>
                  <td></td>
                  <td></td>
                  {sales.map((sale, index) => (
                    <td key={index} className="text-end fw-bold w-20">
                      {decodeBase64(sale.payment_method)}:
                    </td>
                  ))}
                  <td className="text-end w-20">
                    {sales.map((sale, index) => (
                      <span key={index}>
                        {decodeBase64(sale.payment_method) !== "Cash"
                          ? orders
                              .reduce(
                                (total, order) =>
                                  total +
                                  Number(decodeBase64(order.current_price)) *
                                    order.quantity,
                                0
                              )
                              .toFixed(2)
                          : cashNumber}
                      </span>
                    ))}
                  </td>
                </tr>

                <tr>
                  <td></td>
                  <td></td>
                  <td className="text-end fw-bold w-20">Change:</td>
                  <td className="text-end w-20">
                    {sales.map((sale, index) => (
                      <span key={index}>
                        {decodeBase64(sale.payment_method) !== "Cash"
                          ? 0
                          : orders
                              .reduce(
                                (total, order) =>
                                  cashNumber -
                                  (total +
                                    decodeBase64(order.current_price) *
                                      order.quantity),
                                0
                              )
                              .toFixed(2)}
                      </span>
                    ))}
                  </td>
                </tr>
              </tbody>
            </table>
        </div>
        <div className="modal-footer">
          <button className="btn btn-primary" onClick={startNewTransaction}>
            Start New Transaction
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReceiptModal;
