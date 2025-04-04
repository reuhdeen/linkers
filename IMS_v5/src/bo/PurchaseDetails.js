import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaEye } from "react-icons/fa";
import { fetchQueryData } from "../api/fetchData";
import { decodeBase64 } from "../api/decodeBase64";
import { CustomDropdown } from "../api/dropDown";
import "../css/loading.css";

const PurchaseOrder = () => {
  const [purchases, setPurchases] = useState([]);
  const [newPurchase, setNewPurchase] = useState({
    order_id: "",
    name: "",
    order_date: "",
    expected_delivery_date: "",
    status: "",
  });
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrdersAndSuppliers = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("accessToken");
        if (!token) throw new Error("No token found");

        const purchasesData = await fetchQueryData(token, {
          table:
            "iposal.purchase_orders INNER JOIN suppliers ON purchase_orders.supplier_id = suppliers.supplier_id",
          columns: "*",
        });

        setPurchases(purchasesData);
      } catch (error) {
        console.error("Error fetching purchases:", error);
        alert(`Error: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchOrdersAndSuppliers();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewPurchase({ ...newPurchase, [name]: value });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (
      !newPurchase.username.trim() ||
      !newPurchase.password.trim() ||
      !newPurchase.role_id
    ) {
      alert("Please fill in all fields.");
      return;
    }

    const trimmedPurchase = {
      username: newPurchase.username.trim(),
      password: newPurchase.password.trim(),
      role_id: parseInt(newPurchase.role_id, 10) || "",
    };

    try {
      setLoading(true);

      const token = localStorage.getItem("accessToken");
      if (!token) {
        throw new Error("No token found");
      }

      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/insert/users`,
        trimmedPurchase,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Purchase created successfully:", response.data);

      const purchasesData = await fetchQueryData(token, {
        table:
          "iposal.purchase_orders INNER JOIN suppliers ON purchase_orders.supplier_id = suppliers.supplier_id",
        columns: "*",
      });

      setPurchases(purchasesData);

      setNewPurchase({
        order_id: "",
        name: "",
        order_date: "",
        expected_delivery_date: "",
        status: "",
      });
    } catch (error) {
      console.error(
        "There was an error creating the purchase:",
        error.response?.data || error.message
      );
      alert(`Error: ${error.response?.data || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleViewClick = (orderId) => {
    navigate(`/bo/PurchaseDetails?order_id=${orderId}`);
  };

  return (
    <div>
      <h1>Purchase Details</h1>
      {loading && (
        <div className="loading-bar-container">
          <div className="loading-bar"></div>
        </div>
      )}
      <form onSubmit={handleFormSubmit}>
        <input
          name="username"
          placeholder="Username"
          value={newPurchase.username}
          onChange={handleInputChange}
        />
        <input
          name="password"
          placeholder="Password"
          type="password"
          value={newPurchase.password}
          onChange={handleInputChange}
        />
        <CustomDropdown
          endpoint="roles"
          name="role_id"
          value={newPurchase.role_id}
          onChange={(e) =>
            setNewPurchase({ ...newPurchase, role_id: e.target.value })
          }
          label="Role"
          idField="role_id"
          nameField="role_name"
          direction="down"
        />
        <button type="submit" disabled={loading}>
          {loading ? "Loading..." : "Add Purchase"}
        </button>
      </form>

      <h2>Purchase Orders</h2>
      <table className="table-border">
        <thead>
          <tr>
            <th>View</th>
            <th>Order ID</th>
            <th>Supplier Name</th>
            <th>Order Date</th>
            <th>Expected Delivery Date</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {purchases.map((purchase) => (
            <tr key={purchase.order_id}>
              <td>
                <button onClick={() => handleViewClick(purchase.order_id)}>
                  <FaEye size={18} />
                </button>
              </td>
              <td>{purchase.order_id}</td>
              <td>{decodeBase64(purchase.name)}</td>
              <td>{decodeBase64(purchase.order_date)}</td>
              <td>{decodeBase64(purchase.expected_delivery_date)}</td>
              <td>{decodeBase64(purchase.status)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PurchaseOrder;
