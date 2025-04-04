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

const SuppliesManagement = () => {
  const [supplies, setSupplies] = useState([]);
  const [SelectedCategory, setSelectedCategory] = useState({});
  const [SelectedSupplier, setSelectedSupplier] = useState({});
  const [loading, setLoading] = useState(true);
  const [SelectedSupplyCategory, setSelectedSupplyCategory] = useState({});

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

  const fetchSupplies = async (categoryId) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("accessToken");
      if (!token) throw new Error("No token found");

      const suppliesData = await fetchQueryData(token, {
        table:
          "iposal.supplies INNER JOIN categories on categories.category_id = supplies.category_id INNER JOIN suppliers ON supplies.supplier_id = suppliers.supplier_id",
        columns:
          "supplies.*, categories.name AS categoryName, suppliers.name AS supplierName",
        where: `supplies.category_id = '${categoryId}'`,
      });

      setSupplies(suppliesData);
    } catch (error) {
      console.error("Error fetching supplies:", error);
      alert(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Trigger fetchSupplies when SelectedSupplyCategory changes
  const handleCategoryChange = (category) => {
    setSelectedSupplyCategory(category);
    if (category.id) {
      fetchSupplies(category.id);
    }
  };

  const columns = [
    { name: "Edit", key: "edit" },
    { name: "ID", key: "supply_id" },
    { name: "Name", key: "name" },
    { name: "Description", key: "description" },
    { name: "Category", key: "categoryName" },
    { name: "Unit of Measure", key: "unit_of_measure" },
    { name: "Quantity On Hand", key: "quantity_on_hand" },
    { name: "Reorder Level", key: "reorder_level" },
    { name: "Supplier", key: "supplierName" },
    { name: "Updated At", key: "updated_at" },
  ];
  const [newSupply, setnewSupply] = useState({
    name: "",
    description: "",
    category_id: "",
    unit_of_measure: "",
    quantity_on_hand: "",
    reorder_level: "",
    supplier_id: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setnewSupply({ ...newSupply, [name]: value });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const trimmedInventory = {
      name: newSupply.name.trim(),
      description: newSupply.description.trim(),
      category_id: SelectedCategory.id,
      unit_of_measure: newSupply.unit_of_measure.trim(),
      quantity_on_hand: newSupply.quantity_on_hand.trim(),
      supplier_id: SelectedSupplier.id,
      reorder_level: newSupply.reorder_level.trim(),
    };

    if (!SelectedCategory.id || !SelectedSupplier.id) {
      alert("Please make sure all dropdowns have a selection.");
      return;
    }

    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        throw new Error("No token found");
      }

      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/insert/supplies`,
        trimmedInventory,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Inventory created successfully", response.data);
      const suppliesData = await fetchQueryData(token, {
        table:
          "iposal.supplies INNER JOIN categories on categories.category_id = supplies.category_id INNER JOIN suppliers ON supplies.supplier_id = suppliers.supplier_id",
        columns:
          "supplies.*, categories.name AS categoryName, suppliers.name AS supplierName",
        where: `supplies.category_id = '${SelectedSupplyCategory.id}'`,
      });

      setSupplies(suppliesData);
      setnewSupply({
        name: "",
        description: "",
        category_id: "",
        unit_of_measure: "",
        quantity_on_hand: "",
        reorder_level: "",
        supplier_id: "",
      });
    } catch (error) {
      console.error(
        "There was an error creating the inventory:",
        error.response ? error.response.data : error.message
      );
      alert(`Error: ${error.response ? error.response.data : error.message}`); // Popup error message
    }
  };

  // Scrollable table columns
  return (
    <div className="container-fluid">
      {loading && (
        <div className="loading-bar-container">
          <div className="loading-bar"></div>
        </div>
      )}

      {/* First Row: Add & View supplies */}
      <div className="row">
        <div className="col-md-8">
          <div className="card p-3 h-100">
            <h4>Supply Management</h4>
            <label>Category</label>
            <CustomDropdown
              endpoint="categories"
              name="category_id"
              value={SelectedSupplyCategory.id || ""}
              onChange={(e) => handleCategoryChange({ id: e.target.value })}
              idField="category_id"
              nameField="name"
              required
            />

            <hr></hr>
            <DataTable
              columns={columns}
              data={supplies}
              title=""
              rows={10}
              onEdit={handleOpenEditModal}
            />
          </div>
        </div>

        <div className="col-md-4">
          <div className="card p-3 h-100">
            <h4>Add New Supply</h4>
            <form onSubmit={handleFormSubmit} className="container">
              <div className="row mb-3">
                <div className="col-md-12">
                  <label>Name</label>
                  <input
                    name="name"
                    className="form-control"
                    placeholder="Name"
                    value={newSupply.name}
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
                    value={newSupply.description}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="row mb-3">
                <div className="col-12">
                  <label>Unit of Measure</label>
                  <input
                    name="unit_of_measure"
                    className="form-control"
                    placeholder="Unit of Measure"
                    value={newSupply.unit_of_measure}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="row mb-3">
                <div className="col-md-6">
                  <label>Quantity On Hand</label>
                  <input
                    name="quantity_on_hand"
                    className="form-control"
                    type="number"
                    placeholder="Quantity On Hand"
                    value={newSupply.quantity_on_hand}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label>Reorder Level</label>
                  <input
                    name="reorder_level"
                    className="form-control"
                    type="number"
                    placeholder="Reorder Level"
                    value={newSupply.reorder_level}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="row mb-3">
                <div className="col-md-6">
                  <label>Category</label>
                  <CustomDropdown
                    endpoint="categories"
                    name="category_id"
                    value={SelectedCategory.id || ""}
                    onChange={(e) =>
                      setSelectedCategory({ id: e.target.value })
                    }
                    idField="category_id"
                    nameField="name"
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label>Supplier</label>
                  <CustomDropdown
                    endpoint="suppliers"
                    name="supplier_id"
                    value={SelectedSupplier.id || ""}
                    onChange={(e) =>
                      setSelectedSupplier({ id: e.target.value })
                    }
                    idField="supplier_id"
                    nameField="name"
                    required
                  />
                </div>
              </div>
              <button type="submit" className="btn btn-primary">
                Add New Supply
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
          { key: "name", label: "Product Name", type: "text" },
          { key: "description", label: "Description", type: "text" },
          {
            key: "quantity_on_hand",
            label: "Quantity On Hand",
            type: "number",
          },
          { key: "reorder_level", label: "Reorder Level", type: "number" },
          { key: "unit_of_measure", label: "Unit of Measure", type: "text" },
        ]}
        onSubmit={() => window.location.reload()} // Refresh categories after edit
        apiEndpoint="/update/supplies"
        primaryKey="product_id"
        title="Edit Supply"
      />
    </div>
  );
};

export default SuppliesManagement;
