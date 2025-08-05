import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaEdit } from "react-icons/fa";
import { fetchQueryData } from "../api/fetchData";
import { decodeBase64 } from "../api/decodeBase64";
import { CustomDropdown } from "../api/dropDown";
import TransactionModal from "../api/transactionModal"; // Ensure the correct path
import "../css/loading.css";
import "../css/tables.css";

const AuditsManagement = () => {
  const [audits, setAudits] = useState([]);
  const [newAudit, setNewAudit] = useState({
    product_id: "",
    location_id: "",
    audit_date: "",
    quantity_on_hand: "",
    auditor_name: "",
  });
  const [selectedAudit, setSelectedAudit] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Fetch Audits on component mount
  useEffect(() => {
    const fetchAudits = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("accessToken");
        if (!token) throw new Error("No token found");

        const auditsData = await fetchQueryData(token, {
          table:
          "iposarv3.audit_report",
        columns:
          "*",
        });

        setAudits(auditsData);
      } catch (error) {
        console.error("Error fetching audits:", error);
        alert(`Error: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchAudits();
  }, []);

  // Handle input changes for the form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewAudit({ ...newAudit, [name]: value });
  };

  // Handle form submission for adding a new transaction
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (
      !newAudit.product_id ||
      !newAudit.location_id ||
      !newAudit.quantity_on_hand ||
      !newAudit.auditor_name.trim()
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

      const trimmedAudit = {
        ...newAudit,
        product_id: parseInt(newAudit.product_id, 10),
        location_id: parseInt(newAudit.location_id, 10),
        quantity_on_hand: parseInt(newAudit.quantity_on_hand, 10),
        audit_date: currentDateTime,
      };

      await axios.post(
        `${process.env.REACT_APP_API_URL}/insert/inventory_audit`,
        trimmedAudit,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      alert("Audit added successfully!");

      // Refresh the transaction list
      const auditsData = await fetchQueryData(token, {
        table:
        "iposarv3.audit_report",
      columns:
        "*",
      });

      setAudits(auditsData);

      // Reset the form
      setNewAudit({
        product_id: "",
        location_id: "",
        audit_date: "",
        quantity_on_hand: "",
        auditor_name: "",
      });
    } catch (error) {
      console.error("Error creating Audit:", error);
      alert(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Open modal with selected Audit details
  const handleModalOpen = (audit) => {
    setSelectedAudit(audit);
    setModalOpen(true);
  };

  // Close modal
  const handleModalClose = () => {
    setSelectedAudit(null);
    setModalOpen(false);
  };

  // Refresh Audits list after an update
  const refreshAudits = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("accessToken");
      const auditsData = await fetchQueryData(token, {
        table:
        "iposarv3.audit_report",
      columns:
        "*",
      });
      setAudits(auditsData);
    } catch (error) {
      console.error("Error refreshing audits:", error);
      alert(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Inventory Audit</h1>
      {loading && (
        <div className="loading-bar-container">
          <div className="loading-bar"></div>
        </div>
      )}

      <form onSubmit={handleFormSubmit}>
        <CustomDropdown
          endpoint="products"
          name="product_id"
          value={newAudit.product_id}
          onChange={(e) =>
            setNewAudit({ ...newAudit, product_id: e.target.value })
          }
          label="Product"
          idField="product_id"
          nameField="name"
          direction="down"
        />
        <CustomDropdown
          endpoint="inventory_locations"
          name="location_id"
          value={newAudit.location_id}
          onChange={(e) =>
            setNewAudit({
              ...newAudit,
              location_id: e.target.value,
            })
          }
          label="Location"
          idField="location_id"
          nameField="name"
          direction="down"
        />
        <input
          name="quantity_on_hand"
          placeholder="Quantity on Hand"
          value={newAudit.quantity_on_hand}
          onChange={handleInputChange}
        />
        <input
          name="auditor_name"
          placeholder="Auditor's Name"
          value={newAudit.auditor_name}
          onChange={handleInputChange}
        />
        <button type="submit" disabled={loading}>
          {loading ? "Loading..." : "Add Audit"}
        </button>
      </form>

      <table className="table-border">
        <thead>
          <tr>
            <th>Edit</th>
            <th>Audit ID</th>
            <th>Barcode</th>
            <th>Product</th>
            <th>Location</th>
            <th>Audit Date</th>
            <th>Unit of Measure</th>
            <th>Quantity on Hand</th>
            <th>Transaction-based Inventory </th>
            <th>Auditor's Name</th>
          </tr>
        </thead>
        <tbody>
          {audits.map((audit) => (
            <tr key={audit.iTransaction_id}>
              <td>
                <button onClick={() => handleModalOpen(audit)}>
                  <FaEdit size={18} />
                </button>
              </td>
              <td>{audit.aAudit_id}</td>
              <td>{decodeBase64(audit.pBarcode)}</td>
              <td>{decodeBase64(audit.pName)}</td>
              <td>{decodeBase64(audit.lName)}</td>
              <td>{decodeBase64(audit.aAudit_date)}</td>
              <td>{decodeBase64(audit.pUnit_of_measure)}</td>
              <td>{audit.aQuantity_on_hand}</td>
              <td>{decodeBase64(audit.transaction_based_quantity)}</td>
              <td>{decodeBase64(audit.aAuditor_name)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <TransactionModal
        isOpen={modalOpen}
        onClose={handleModalClose}
        audit={selectedAudit}
        onSubmit={refreshAudits}
      />
    </div>
  );
};

export default AuditsManagement;
