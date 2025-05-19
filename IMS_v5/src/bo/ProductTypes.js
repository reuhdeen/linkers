import React, { useState, useEffect } from "react";
import axios from "axios";
import { CustomDropdown } from "../api/CustomDropdown";
import { fetchQueryData, fetchData } from "../api/fetchData";
import "bootstrap/dist/css/bootstrap.min.css";
import "../css/loading.css";
import "../css/tables.css";
import "../css/forms.css";
import EditModal from "../api/editModal";

import DataTable from "../api/dataTable";

const ProductTypesManagement = () => {
  const [productTypes, setProductTypes] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  // 🛠️ Open Edit Modal with Selected Data
  const handleOpenEditModal = (category) => {
    setEditData(category);
    setEditModalOpen(true);
  };

  // 🛠️ Close Edit Modal
  const handleCloseEditModal = () => {
    setEditModalOpen(false);
    setEditData(null);
  };

  const columns = [
    { name: "Edit", key: "edit" },
    { name: "ID", key: "product_type_id" },
    { name: "Name", key: "name" },
    { name: "Description", key: "description" },
  ];
  const [newProductType, setNewProductType] = useState({
    name: "",
    description: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProductType({ ...newProductType, [name]: value });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const trimmedInventory = {
      name: newProductType.name.trim(),
      description: newProductType.description.trim(),
    };


    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        throw new Error("No token found");
      }

      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/insert/product_types`,
        trimmedInventory,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Inventory created successfully", response.data);
      const productTypesData = await fetchQueryData(token, {
        table:
          "iposarv3.product_types",
        columns: "*",
      });

      setProductTypes(productTypesData);
      setNewProductType({
        name: "",
        description: "",
      });
                  alert("Added successfuly!");

    } catch (error) {
      console.error(
        "There was an error creating the inventory:",
        error.response ? error.response.data : error.message
      );
      alert(`Error: ${error.response ? error.response.data : error.message}`); // Popup error message
    }
  };

  useEffect(() => {
    const fetchProductTypes = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("accessToken");
        if (!token) throw new Error("No token found");

        const productTypesData = await fetchQueryData(token, {
          table:
            "iposarv3.product_types",
          columns: "*",
        });

        setProductTypes(productTypesData);
      } catch (error) {
        console.error("Error fetching productTypes:", error);
        alert(`Error: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchProductTypes();
  }, []);

  // Scrollable table columns
  return (
    <div className="container-fluid">
      {loading && (
        <div className="loading-bar-container">
          <div className="loading-bar"></div>
        </div>
      )}

      {/* First Row: Add & View productTypes */}
      <div className="row">
        <div className="col-md-8">
          <div className="card p-3 h-100">
            <DataTable
              columns={columns}
              data={productTypes}
              modalOpen={modalOpen}
              title="Product Types Management"
              rows={10}
              onEdit={handleOpenEditModal} 
            />
          </div>
        </div>

        <div className="col-md-4">
          <div className="card p-3 h-100">
            <h4>Add New Product Type</h4>
            <form onSubmit={handleFormSubmit} className="container">


              <div className="row mb-3">
                <div className="col-12">
                  <label>Product Type Name</label>
                  <input
                    name="name"
                    className="form-control"
                    placeholder="Product Type Name"
                    value={newProductType.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              
              <div className="row mb-3">
                <div className="col-12">
                  <label>Description</label>
                  <input
                    name="description"
                    className="form-control"
                    placeholder="Description"
                    value={newProductType.description}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              <button type="submit" className="btn btn-primary">
                Add New Product Type
              </button>
            </form>
          </div>
        </div>
      </div>
      <EditModal
        isOpen={editModalOpen}
        onClose={handleCloseEditModal}
        data={editData}
        fields={[
          { key: "name", label: "Category Name", type: "text" },
          { key: "description", label: "Description", type: "text" },
        ]}
        onSubmit={() => window.location.reload()} // Refresh categories after edit
        apiEndpoint="/update/product_types"
        primaryKey="product_type_id"
        title="Edit Product Type"
      />

    </div>
  );
};

export default ProductTypesManagement;
