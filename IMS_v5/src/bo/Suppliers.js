import React, { useState, useEffect } from "react";
import axios from "axios";
import { fetchQueryData, fetchData } from "../api/fetchData";
import "bootstrap/dist/css/bootstrap.min.css";
import "../css/loading.css";
import "../css/tables.css";
import "../css/forms.css";
import DataTable from "../api/dataTable";

const SuppliersManagement = () => {
    const [suppliers, setSuppliers] = useState([]);
  
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const columns = [
    { name: "Edit", key: "edit" },
    { name: "Supplier ID", key: "supplier_id" },
    { name: "Name", key: "name" },
    { name: "Contact Info", key: "contact_info" },
    { name: "Address", key: "address" },
    { name: "Payment Terms", key: "payment_terms" },
  ];
  const [newSupplier, setNewSupplier] = useState({
    name: "",
    contact_info: "",
    address: "",
    payment_terms: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewSupplier({ ...newSupplier, [name]: value });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const trimmedInventory = {
      name: newSupplier.name.trim(),
      contact_info: newSupplier.contact_info.trim(),
      address: newSupplier.address.trim(),
      payment_terms: newSupplier.payment_terms.trim(),
    };

    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        throw new Error("No token found");
      }

      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/insert/suppliers`,
        trimmedInventory,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Inventory created successfully", response.data);
      const suppliersData = await fetchQueryData(token, {
        table: "iposal.suppliers",
        columns: "*",
      });

      setSuppliers(suppliersData);
      setNewSupplier({
        name: "",
        contact_info: "",
        address: "",
        payment_terms: "",
      });
    } catch (error) {
      console.error(
        "There was an error creating the inventory:",
        error.response ? error.response.data : error.message
      );
      alert(`Error: ${error.response ? error.response.data : error.message}`); // Popup error message
    }
  };

  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("accessToken");
        if (!token) throw new Error("No token found");

        const suppliersData = await fetchQueryData(token, {
          table: "iposal.suppliers",
          columns: "*",
        });

        setSuppliers(suppliersData);
      } catch (error) {
        console.error("Error fetching Suppliers:", error);
        alert(`Error: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchSuppliers();
  }, []);

  // Scrollable table columns
  return (
    <div className="container-fluid">
      {loading && (
        <div className="loading-bar-container">
          <div className="loading-bar"></div>
        </div>
      )}

      {/* First Row: Add & View Supplier */}
      <div className="row">
        <div className="col-md-8">
          <div className="card p-3 h-100">
            <DataTable
              columns={columns}
              data={suppliers}
              modalOpen={modalOpen}
              title="Suppliers Management"
              rows={10}
            />
          </div>
        </div>

        <div className="col-md-4">
          <div className="card p-3 h-100">
            <h4>Add New Supplier</h4>
            <form onSubmit={handleFormSubmit} className="container">

              <div className="row mb-3">
                <div className="col-12">
                  <label>Supplier Name</label>
                  <input
                    name="name"
                    className="form-control"
                    placeholder="Supplier Name"
                    value={newSupplier.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="row mb-3">
                <div className="col-12">
                  <label>Contact Info</label>
                  <input
                    name="contact_info"
                    className="form-control"
                    placeholder="Contact Info"
                    value={newSupplier.contact_info}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="row mb-3">
                <div className="col-12">
                  <label>Address</label>
                  <input
                    name="address"
                    className="form-control"
                    placeholder="Address"
                    value={newSupplier.address}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="row mb-3">
                <div className="col-12">
                  <label>Payment Terms</label>
                  <input
                    name="payment_terms"
                    className="form-control"
                    placeholder="Payment Terms"
                    value={newSupplier.payment_terms}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>


              <button type="submit" className="btn btn-primary">
                Add New Supplier
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuppliersManagement;
