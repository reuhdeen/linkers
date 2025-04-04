import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaEdit } from "react-icons/fa";
import { fetchQueryData } from "../api/fetchData";
import { decodeBase64 } from "../api/decodeBase64";
import { CustomDropdown } from "../api/dropDown";
import TransactionModal from "../api/transactionModal"; // Ensure the correct path
import "../css/loading.css";
import "../css/tables.css";

const RFIDTagsManagement = () => {
  const [rfidTags, setRFIDTags] = useState([]);
  const [newRFIDTag, setNewRFIDTag] = useState({
    product_id: "",
    location_id: "",
    last_scanned_time: "",
    quantity: "",
  });
  const [selectedRFIDTag, setSelectedRFIDTag] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Fetch RFIDTags on component mount
  useEffect(() => {
    const fetchRFIDTags = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("accessToken");
        if (!token) throw new Error("No token found");

        const rfidTagsData = await fetchQueryData(token, {
            table:
            "iposal.rfid_tags INNER JOIN inventory_locations ON rfid_tags.location_id = inventory_locations.location_id INNER JOIN products ON rfid_tags.product_id = products.product_id",
          columns:
            "tag_id AS rTag_id, products.product_id AS pProduct_id, barcode AS pBarcode, products.name AS pName, inventory_locations.name AS lName, rfid_tags.last_scanned_time AS rLast_scanned_time, rfid_tags.quantity AS rQuantity",
        });
  

        setRFIDTags(rfidTagsData);
      } catch (error) {
        console.error("Error fetching rfidTags:", error);
        alert(`Error: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchRFIDTags();
  }, []);

  // Handle input changes for the form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewRFIDTag({ ...newRFIDTag, [name]: value });
  };

  // Handle form submission for adding a new transaction
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (
      !newRFIDTag.product_id ||
      !newRFIDTag.location_id ||
      !newRFIDTag.quantity
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

      const trimmedRFIDTag = {
        ...newRFIDTag,
        product_id: parseInt(newRFIDTag.product_id, 10),
        location_id: parseInt(newRFIDTag.location_id, 10),
        last_scanned_time: currentDateTime,
        quantity: parseInt(newRFIDTag.quantity, 10),
      };

      await axios.post(
        `${process.env.REACT_APP_API_URL}/insert/rfid_tags`,
        trimmedRFIDTag,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      alert("RFIDTag added successfully!");

      // Refresh the transaction list
      const rfidTagsData = await fetchQueryData(token, {
        table:
        "iposal.rfid_tags INNER JOIN inventory_locations ON rfid_tags.location_id = inventory_locations.location_id INNER JOIN products ON rfid_tags.product_id = products.product_id",
      columns:
        "tag_id AS rTag_id, products.product_id AS pProduct_id, barcode AS pBarcode, products.name AS pName, inventory_locations.name AS lName, rfid_tags.last_scanned_time AS rLast_scanned_time, rfid_tags.quantity AS rQuantity",
    });

      setRFIDTags(rfidTagsData);

      // Reset the form
      setNewRFIDTag({
        product_id: "",
        location_id: "",
        last_scanned_time: "",
        quantity: "",
      });
    } catch (error) {
      console.error("Error creating RFIDTag:", error);
      alert(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Open modal with selected rfidTag details
  const handleModalOpen = (rfidTag) => {
    setSelectedRFIDTag(rfidTag);
    setModalOpen(true);
  };

  // Close modal
  const handleModalClose = () => {
    setSelectedRFIDTag(null);
    setModalOpen(false);
  };

  // Refresh rfidTag list after an update
  const refreshRFIDTags = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("accessToken");
      const rfidTagsData = await fetchQueryData(token, {
        table:
        "iposal.rfid_tags INNER JOIN inventory_locations ON rfid_tags.location_id = inventory_locations.location_id INNER JOIN products ON rfid_tags.product_id = products.product_id",
      columns:
        "tag_id AS rTag_id, products.product_id AS pProduct_id, barcode AS pBarcode, products.name AS pName, inventory_locations.name AS lName, rfid_tags.last_scanned_time AS rLast_scanned_time, rfid_tags.quantity AS rQuantity",
    });
      setRFIDTags(rfidTagsData);
    } catch (error) {
      console.error("Error refreshing rfidTag:", error);
      alert(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>RFID Tags</h1>
      {loading && (
        <div className="loading-bar-container">
          <div className="loading-bar"></div>
        </div>
      )}

      <form onSubmit={handleFormSubmit}>
        <CustomDropdown
          endpoint="products"
          name="product_id"
          value={newRFIDTag.product_id}
          onChange={(e) =>
            setNewRFIDTag({ ...newRFIDTag, product_id: e.target.value })
          }
          label="Product"
          idField="product_id"
          nameField="name"
          direction="down"
        />
        <CustomDropdown
          endpoint="inventory_locations"
          name="location_id"
          value={newRFIDTag.location_id}
          onChange={(e) =>
            setNewRFIDTag({
              ...newRFIDTag,
              location_id: e.target.value,
            })
          }
          label="Location"
          idField="location_id"
          nameField="name"
          direction="down"
        />
        <input
          name="quantity"
          placeholder="Quantity"
          value={newRFIDTag.quantity}
          onChange={handleInputChange}
        />
        <button type="submit" disabled={loading}>
          {loading ? "Loading..." : "Add RFIDTag"}
        </button>
      </form>

      <table className="table-border">
        <thead>
          <tr>
            <th>Edit</th>
            <th>RFID Tag</th>
            <th>Barcode</th>
            <th>Product</th>
            <th>Location</th>
            <th>Last Scanned Time</th>
            <th>Quantity</th>
          </tr>
        </thead>
        <tbody>
          {rfidTags.map((rfidTag) => (
            <tr key={rfidTag.iTransaction_id}>
              <td>
                <button onClick={() => handleModalOpen(rfidTag)}>
                  <FaEdit size={18} />
                </button>
              </td>
              <td>{rfidTag.rTag_id}</td>
              <td>{decodeBase64(rfidTag.pBarcode)}</td>
              <td>{decodeBase64(rfidTag.pName)}</td>
              <td>{decodeBase64(rfidTag.lName)}</td>
              <td>{decodeBase64(rfidTag.rLast_scanned_time)}</td>
              <td>{rfidTag.rQuantity}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <TransactionModal
        isOpen={modalOpen}
        onClose={handleModalClose}
        rfidTag={selectedRFIDTag}
        onSubmit={refreshRFIDTags}
      />
    </div>
  );
};

export default RFIDTagsManagement;
