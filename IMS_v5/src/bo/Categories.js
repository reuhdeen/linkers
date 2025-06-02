import React, { useState, useEffect } from "react";
import axios from "axios";
import { fetchQueryData, fetchData } from "../api/fetchData";
import "bootstrap/dist/css/bootstrap.min.css";
import "../css/loading.css";
import "../css/tables.css";
import "../css/forms.css";
import DataTable from "../api/dataTable";
import EditModal from "../api/editModal";

const CategoriesManagement = () => {
    const [categories, setCategories] = useState([]);
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
    { name: "Category ID", key: "category_id" },
    { name: "Name", key: "name" },
    { name: "Description", key: "description" },
  ];
  const [newCategory, setNewCategory] = useState({
    name: "",
    description: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCategory({ ...newCategory, [name]: value });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const trimmedInventory = {
      name: newCategory.name.trim(),
      description: newCategory.description.trim(),
    };

    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        throw new Error("No token found");
      }

      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/insert/categories`,
        trimmedInventory,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Inventory created successfully", response.data);
      const categoriesData = await fetchQueryData(token, {
        table: "iposarv3.categories order by category_id desc",
        columns: "*",
      });

      setCategories(categoriesData);
      setNewCategory({
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
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("accessToken");
        if (!token) throw new Error("No token found");

        const categoriesData = await fetchQueryData(token, {
        table: "iposarv3.categories order by category_id desc",
          columns: "*",
        });

        setCategories(categoriesData);
      } catch (error) {
        console.error("Error fetching Categories:", error);
        alert(`Error: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Scrollable table columns
  return (
    <div className="container-fluid">
      {loading && (
        <div className="loading-bar-container">
          <div className="loading-bar"></div>
        </div>
      )}

      {/* First Row: Add & View Category */}
      <div className="row">
        <div className="col-md-8">
          <div className="card p-3 h-100">
          <DataTable
              columns={columns}
              data={categories}
              title="Categories Management"
              rows={10}
              onEdit={handleOpenEditModal} 
            />
          </div>
        </div>

        <div className="col-md-4">
          <div className="card p-3 h-100">
            <h4>Add New Category</h4>
            <form onSubmit={handleFormSubmit} className="container">

              <div className="row mb-3">
                <div className="col-12">
                  <label>Category Name</label>
                  <input
                    name="name"
                    className="form-control"
                    placeholder="Category Name"
                    value={newCategory.name}
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
                    placeholder="Contact Info"
                    value={newCategory.description}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <button type="submit" className="btn btn-primary">
                Add New Category
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
        apiEndpoint="/update/categories"
        primaryKey="category_id"
        title="Edit Category"
      />

    </div>
  );
};

export default CategoriesManagement;
