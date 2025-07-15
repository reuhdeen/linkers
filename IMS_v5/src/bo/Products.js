import React, { useState, useEffect } from "react";
import { CustomDropdown } from "../api/CustomDropdown";
import { fetchQueryData } from "../api/fetchData";
import { Link } from "react-router-dom";
import axios from "axios";

import { FaPlusCircle, FaFileExcel } from "react-icons/fa";
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

  // 🧠 Fetch products when category changes
  useEffect(() => {
    fetchProducts(SelectedProductCategory.id);
  }, [SelectedProductCategory]);

  const handleOpenEditModal = (product) => {
    setEditData(product);
    setEditModalOpen(true);
  };

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
          : "";

      const productsData = await fetchQueryData(token, {
        table:
          "iposarv3.products INNER JOIN categories ON categories.category_id = products.category_id INNER JOIN product_types ON products.product_type_id = product_types.product_type_id INNER JOIN suppliers ON products.supplier_id = suppliers.supplier_id LEFT JOIN product_details ON products.product_id = product_details.product_id",
        columns:
          "products.*, products.product_id AS ProdID, product_details.*, categories.name AS categoryName, product_types.name AS productTypeName, suppliers.name AS supplierName",
        where: whereClause,
        order: "products.product_id DESC", // ✅ moved here
      });

      setProducts(productsData);
    } catch (error) {
      console.error("Error fetching products:", error);
      alert(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

const handleDeleteProduct = async (productId) => {
  try {
    const token = localStorage.getItem("accessToken");
    if (!token) throw new Error("No token found");

    const deletedata = {
      data: { product_id: productId },
    };

    await axios.delete(
      `${process.env.REACT_APP_API_URL}/delete/products`,
      deletedata,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    fetchProducts(SelectedProductCategory.id);
    alert("✅ Product deleted successfully!");
  } catch (error) {
    console.error("Error deleting product:", error);

    const message = error.response?.data;

    if (
      typeof message === "string" &&
      message.includes("foreign key constraint fails")
    ) {
      alert("❌ Cannot delete this product because it is linked to existing sales records.");
    } else {
      alert(`❌ Failed to delete product: ${message || error.message}`);
    }
  }
};

  const handleCategoryChange = (category) => {
    setSelectedProductCategory(category); // useEffect will handle fetch
  };

  // 🖼️ Custom render for image column
  const renderImageCell = (url) => {
     const fullUrl = `${process.env.REACT_APP_API_URL}/${url}`;
     return (
      <img
        src={fullUrl}
        alt="product"
        style={{ width: "50px", height: "50px", objectFit: "cover" }}
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = "/placeholder.png"; // fallback image
        }}
      />
    );
    return <span>[image]</span>; // Temporary placeholder
  };

  const columns = [
    {
      name: "Img",
      key: "media_url",
      render: (row) => renderImageCell(row.media_url),
    },
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

      <div className="row align-items-center mb-3">
        <div className="col-md-6">
          <h3>Product Management</h3>
          <span className="text-muted">List of Products</span>
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
              showAllOption={true}
            />
            <hr />
            <ProductTable
              columns={columns}
              data={products}
              title=""
              rows={10}
              onView={handleViewProduct}
              onEdit={handleOpenEditModal}
              onDelete={handleDeleteProduct}
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
        onSubmit={() => window.location.reload()}
        apiEndpoint="/update/products"
        primaryKey="product_id"
        title="Edit Product"
      />
    </div>
  );
};

export default ProductsManagement;