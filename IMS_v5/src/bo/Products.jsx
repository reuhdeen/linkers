import React, { useState, useEffect } from "react";
import { CustomDropdown } from "../api/CustomDropdown";
import { fetchQueryData } from "../api/fetchData";
import { Link } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import { FaPlusCircle, FaFileExcel } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";
import "../css/loading.css";
import "../css/tables.css";
import "../css/forms.css";
import ProductTable from "../api/productTable";
import EditModal from "../api/editModal";

const rowOptions = [
  { id: 10, name: "10 rows" },
  { id: 20, name: "20 rows" },
  { id: 50, name: "50 rows" },
  { id: 100, name: "100 rows" },
  { id: 250, name: "250 rows" },
  { id: 500, name: "500 rows" },
  { id: 1000, name: "1000 rows" },
];

const ProductsManagement = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [SelectedProductCategory, setSelectedProductCategory] = useState({});
  const [SelectedBrand, setSelectedBrand] = useState({});
  const [SelectedSupplier, setSelectedSupplier] = useState({});
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const navigate = useNavigate();

  const handleOpenEditModal = (product) => {
    navigate(`/products/edit/${product.product_id}`);
  };

  const handleCloseEditModal = () => {
    setEditModalOpen(false);
    setEditData(null);
  };

  const handleViewProduct = (product) => {
    setSelectedProduct(product);
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("accessToken");
      if (!token) throw new Error("No token found");

      const clauses = [];

      if (SelectedProductCategory.id && SelectedProductCategory.id !== "all") {
        clauses.push(`products.category_id = '${SelectedProductCategory.id}'`);
      }

      if (SelectedBrand.id && SelectedBrand.id !== "all") {
        clauses.push(`products.brand_id = '${SelectedBrand.id}'`);
      }

      if (SelectedSupplier.id && SelectedSupplier.id !== "all") {
        clauses.push(`products.supplier_id = '${SelectedSupplier.id}'`);
      }

      const whereClause = clauses.length ? clauses.join(" AND ") : "";

      const productsData = await fetchQueryData(token, {
        table:
          "products " +
          "LEFT JOIN categories ON categories.category_id = products.category_id " +
          "LEFT JOIN suppliers ON suppliers.supplier_id = products.supplier_id " +
          "LEFT JOIN brands ON brands.brand_id = products.brand_id",
        columns:
          "products.*, categories.name AS categoryName, suppliers.name AS supplierName, brands.brand_name",
        where: whereClause,
        order: "products.product_id DESC",
      });

      setProducts(productsData);
      // console.log("Fetched products:", productsData);
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

      await axios.delete(`${process.env.REACT_APP_API_URL}/delete/products`, {
        data: { product_id: productId },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      fetchProducts();
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

  useEffect(() => {
    fetchProducts();
  }, [SelectedProductCategory, SelectedBrand, SelectedSupplier]);

  const columns = [
    { name: "ID", key: "product_id" },
    {
      name: "Image",
      key: "media_url",
      render: (row) =>
        row.media_url ? (
          <img
            src={row.media_url}
            alt="Product"
            className="img-thumbnail"
            style={{ height: "50px" }}
          />
        ) : (
          <span className="text-muted">No Image</span>
        ),
    },
    { name: "Brand", key: "brand_name" },
    { name: "Name", key: "name" },
    { name: "Category", key: "categoryName" },
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
        <div className={selectedProduct ? "col-md-8 product-column" : "col-md-12"}>
          <div className="card p-3 h-100">
            <div className="row mb-3">
              <div className="col-md-3">
                <label>Category</label>
                <CustomDropdown
                  endpoint="categories"
                  name="category_id"
                  value={SelectedProductCategory.id || ""}
                  onChange={(e) => setSelectedProductCategory({ id: e.target.value })}
                  idField="category_id"
                  nameField="name"
                  showAllOption={true}
                />
              </div>

              <div className="col-md-3">
                <label>Brand</label>
                <CustomDropdown
                  endpoint="brands"
                  name="brand_id"
                  value={SelectedBrand.id || ""}
                  onChange={(e) => setSelectedBrand({ id: e.target.value })}
                  idField="brand_id"
                  nameField="brand_name"
                  showAllOption={true}
                />
              </div>

              <div className="col-md-3">
                <label>Supplier</label>
                <CustomDropdown
                  endpoint="suppliers"
                  name="supplier_id"
                  value={SelectedSupplier.id || ""}
                  onChange={(e) => setSelectedSupplier({ id: e.target.value })}
                  idField="supplier_id"
                  nameField="name"
                  showAllOption={true}
                />
              </div>

              <div className="col-md-3">
                <label>Rows per page</label>
                <CustomDropdown
                  name="rows"
                  value={rowsPerPage}
                  onChange={(e) => setRowsPerPage(+e.target.value)}
                  options={rowOptions}
                  idField="id"
                  nameField="name"
                />
              </div>
            </div>

            <ProductTable
              key={rowsPerPage}
              columns={columns}
              data={products}
              rows={rowsPerPage}
              title=""
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
          { key: "category_id", label: "Category", type: "" },
          { key: "supplier_id", label: "Supplier", type: "" },
          { key: "brand_id", label: "Brand", type: "" },
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