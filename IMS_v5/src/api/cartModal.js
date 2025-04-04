import React, { useState, useEffect } from "react";
import axios from "axios";
import "../css/modal.css";
import { decodeBase64 } from "../api/decodeBase64";
import { fetchQueryData } from "../api/fetchData";

const CartModal = ({ isOpen, onClose, userId, setOrders }) => {
  const [carts, setCarts] = useState([]);
  const [selectedCartId, setSelectedCartId] = useState(null); // State to store cart_id
  useEffect(() => {
    if (isOpen) {
      fetchCarts();
    }
  }, [isOpen]);

  const fetchCarts = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) throw new Error("No token found");

      const response = await fetchQueryData(token, {
        table: "cart",
        columns: "*",
        where: `user_id = '${userId}'`,
      });

      console.log("Cart API Response:", response);

      setCarts(response);
    } catch (error) {
      console.error("Error fetching carts:", error);
    }
  };

  const fetchCartDetails = async (cart_id) => {
    try {
      localStorage.setItem("selectedCartId", cart_id); // Store selected cart_id
      console.log("Selected Cart ID:", cart_id); // Debugging log
  
      const token = localStorage.getItem("accessToken");
      if (!token) throw new Error("No token found");
  
      const cartDetails = await fetchQueryData(token, {
        table: "cart_details INNER JOIN products ON cart_details.product_id = products.product_id LEFT JOIN discounts ON products.product_id = discounts.product_id ",
        columns: "products.*, cart_details.quantity, products.product_id AS productID, products.name AS productName, discounts.discount_percent, CASE WHEN discounts.product_id IS NULL THEN 'none' WHEN NOW() BETWEEN discounts.start_date AND discounts.end_date THEN 'active' WHEN NOW() > discounts.end_date THEN 'expired' ELSE 'none' END AS discount_status, CASE WHEN NOW() BETWEEN discounts.start_date AND discounts.end_date THEN products.selling_price - (discounts.discount_percent * products.selling_price) ELSE products.selling_price END AS current_price",
        where: `cart_id = '${cart_id}'`,
      });
  
      const existingOrders = cartDetails.map((detail) => ({
        id: detail.productID,
        name: decodeBase64(detail.productName),
        selling_price: detail.selling_price || 0,
        quantity: detail.quantity,
        discount_percent: detail.discount_percent,
        discount_status: detail.discount_status,
        current_price: detail.current_price,
        description: decodeBase64(detail.description),

      }));
      
  
      setOrders(existingOrders);
      onClose(); // Close the modal when a cart is selected
    } catch (error) {
      console.error("Error fetching cart details:", error);
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
    localStorage.setItem("selectedCartId", newCartId); // Store selected cart_id
    // Refresh cart list
    fetchCarts();

    // Close the modal
    onClose();
  } catch (error) {
    console.error("Error starting new transaction:", error);
    alert("Failed to create a new cart. Please try again.");
  }
};

  

  if (!isOpen) return null;

  return (
    <div
      className="modal show d-block"
      tabIndex="-1"
      role="dialog"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
    >
      <div className="modal-dialog" role="document">
        <div className="modal-content p-4">
          <div className="modal-header">
            <h3>Unfinished Transactions</h3>
          </div>
          <div className="modal-body">
            {carts.length > 0 ? (
              <div className="table-responsive">
                <table className="table table-striped table-hover">
                  <thead>
                    <tr>
                      <th>Cart ID</th>
                      <th>Updated At</th>
                    </tr>
                  </thead>
                  <tbody>
                    {carts.map((cart) => (
                      <tr
                        key={cart.cart_id}
                        onClick={() => fetchCartDetails(cart.cart_id)}
                        style={{ cursor: "pointer" }}
                      >
                        <td>{cart.cart_id}</td>
                        <td>{decodeBase64(cart.updated_at)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p>No carts found.</p>
            )}
          </div>
          <div className="modal-footer">
            <button className="btn btn-primary" onClick={startNewTransaction}>
              Start New Transaction
            </button>
          </div>
        </div>
      </div>
    </div>
  );
  
};

export default CartModal;
