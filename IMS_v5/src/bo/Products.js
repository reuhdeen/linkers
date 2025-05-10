import React, { useState, useEffect } from "react";
import { CustomDropdown } from "../api/CustomDropdown";
import { fetchQueryData, fetchData } from "../api/fetchData";
import { Link } from "react-router-dom";

import {

  FaPlusCircle,

  FaFileExcel,
} from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";
import "../css/loading.css";
import "../css/tables.css";
import "../css/forms.css";
import ProductTable from "../api/productTable";
import EditModal from "../api/editModal";


const ProductsManagement = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [SelectedProductCategory, setSelectedProductCategory] = useState({});
  const [selectedProduct, setSelectedProduct] = useState(null);

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


  const handleViewProduct = (product) => {
    setSelectedProduct(product);
  };

  const fetchProducts = async (categoryId) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("accessToken");
      if (!token) throw new Error("No token found");

      const whereClause =
        categoryId && categoryId !== "all"
          ? `products.category_id = '${categoryId}'`
          : ""; // Empty string for all categories

      const productsData = await fetchQueryData(token, {
        table:
          "iposarv3.products INNER JOIN categories on categories.category_id = products.category_id INNER JOIN product_types ON products.product_type_id = product_types.product_type_id INNER JOIN suppliers ON products.supplier_id = suppliers.supplier_id LEFT JOIN product_details ON products.product_id = product_details.product_id",
        columns:
          "products.*, products.product_id AS ProdID, product_details.*, categories.name AS categoryName, product_types.name AS productTypeName, suppliers.name AS supplierName",
        where: whereClause,
      });

      setProducts(productsData);
    } catch (error) {
      console.error("Error fetching products:", error);
      alert(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };



  const handleCategoryChange = (category) => {
    setSelectedProductCategory(category);
    fetchProducts(category.id); // Pass even if it's "all"
  };

  const columns = [
    { name: "Img", key: "ProdID" },
    { name: "Barcode", key: "barcode" },
    { name: "Name", key: "name" },
    { name: "Category", key: "categoryName" },
    { name: "Product Type", key: "productTypeName" },
    { name: "Supplier", key: "supplierName" },
    { name: "", key: "edit" },
  ];

  return (
    <div className="container-fluid">
      {loading && (
        <div className="loading-bar-container">
          <div className="loading-bar"></div>
        </div>
      )}

      {/* First Row: Add & View products */}

      <div className="row align-items-center mb-3">
        <div className="col-md-6">
          <h3>Product Managment</h3>
          <span className="text-muted">List of Products </span>
        </div>
        <div className="col-md-6 text-end">
          <Link to="/add-product" className="btn btn-md btn-success mx-2">
            <FaPlusCircle size={14} />
            &nbsp; New Product
          </Link>

          <button className="btn btn-md btn-warning">
            <FaFileExcel size={14} />
            &nbsp; Export Product
          </button>
        </div>
      </div>
      <div className="row product-management-container">
        <div
          className={selectedProduct ? "col-md-8 product-column" : "col-md-12"}
        >
          <div className="card p-3 h-100">
            <label>Choose Category</label>
            <CustomDropdown
              endpoint="categories"
              name="category_id"
              value={SelectedProductCategory.id || ""}
              onChange={(e) => handleCategoryChange({ id: e.target.value })}
              idField="category_id"
              nameField="name"
              showAllOption={true} // Show "All Categories" option
            />

            <hr></hr>
            <ProductTable
              columns={columns}
              data={products}
              title=""
              rows={10}
              onView={handleViewProduct}
              onEdit={handleOpenEditModal}
            />
          </div>
        </div>


      </div>

      <EditModal
        isOpen={editModalOpen}
        onClose={handleCloseEditModal}
        data={editData}
        fields={[
          { key: "name", label: "Product Name", type: "text" },
          { key: "barcode", label: "Barcode", type: "text" },
          { key: "category_id", label: "Category", type: "" },
          { key: "product_type_id", label: "Product Type", type: "" },
          { key: "supplier_id", label: "Supplier", type: "" },
        ]}
        onSubmit={() => window.location.reload()} // Refresh categories after edit
        apiEndpoint="/update/products"
        primaryKey="product_id"
        title="Edit Product"
      />


    </div>
  );
};

export default ProductsManagement;
