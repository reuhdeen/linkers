import React, { useState, useEffect } from "react";
import { CustomDropdown } from "../api/CustomDropdown";
import { fetchQueryData, fetchData } from "../api/fetchData";
import { Link } from "react-router-dom";

import {
  FaCaretUp,
  FaCaretDown,
  FaChevronLeft,
  FaPlusCircle,
  FaEdit,
  FaFileExcel,
} from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";
import "../css/loading.css";
import "../css/tables.css";
import "../css/forms.css";
import ProductTable from "../api/productTable";
import ProductDetails from "../api/productDetails";
import ProductInventory from "../api/singleProductInventory";
import EditModal from "../api/editModal";
import InsertVariant from "../api/insertVariantModal";

const ProductsManagement = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [SelectedProductCategory, setSelectedProductCategory] = useState({});
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [productInventory, setProductInventory] = useState([]); // State for product inventory

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

  //edit details
  const [editDetailsModalOpen, setEditDetailsModalOpen] = useState(false);
  const [editDetailsData, setEditDetailsData] = useState(null);
  // 🛠️ Open Edit Modal with Selected Data
  const handleOpenEditDetailsModal = (category) => {
    setEditDetailsData(category);
    setEditDetailsModalOpen(true);
  };
  // 🛠️ Close Edit Modal
  const handleCloseEditDetailsModal = () => {
    setEditDetailsModalOpen(false);
    setEditDetailsData(null);
  };

  //insert Variant
  const [insertModalOpen, setInsertModalOpen] = useState(false);
  const [insertData, setInsertData] = useState(null);
  // 🛠️ Open insert Modal with Selected Data
  const handleOpenInsertModal = (category) => {
    setInsertData(category);
    setInsertModalOpen(true);
  };
  // 🛠️ Close insert Modal
  const handleCloseInsertModal = () => {
    setInsertModalOpen(false);
    setInsertData(null);
  };

  const handleViewProduct = (product) => {
    setSelectedProduct(product);
    fetchProductInventory(product.product_id); // Fetch inventory when a product is selected
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

  const fetchProductInventory = async (productId) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("accessToken");
      if (!token) throw new Error("No token found");

      const inventoryData = await fetchQueryData(token, {
        table:
          "products p INNER JOIN product_variants pv ON p.product_id = pv.product_id INNER JOIN variant_attributes va ON pv.product_variant_id = va.product_variant_id INNER JOIN attribute_values av ON va.attribute_value_id = av.attribute_value_id INNER JOIN attributes a ON av.attribute_id = a.attribute_id INNER JOIN inventory i ON pv.product_variant_id = i.product_variant_id INNER JOIN warehouses w ON i.warehouse_id = w.warehouse_id INNER JOIN inventory_type it ON i.inventory_type_id = it.inventory_type_id",
        columns:
          "p.product_id, p.name AS product_name, pv.product_variant_id, pv.sku AS variant_sku, av.attribute_value_id, a.attribute_name AS attribute_name, av.value AS attribute_value, i.inventory_id, i.warehouse_id, w.name AS WName, i.inventory_type_id, it.name AS inventory_type_name, i.quantity_in_stock, i.reorder_level, i.batch_number, i.expiration_date, i.storage_zone",
        where: `p.product_id = '${productId}'`, // Only fetch inventory for the selected product
      });

      setProductInventory(inventoryData);
    } catch (error) {
      console.error("Error fetching product inventory:", error);
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
  const columnsMap = {
    ...columns.reduce((acc, col) => {
      if (col.key && col.name) acc[col.key] = col.name;
      return acc;
    }, {}),
    description: "Description",
    brand_name: "Brand",
    batch_number: "Batch No.",
    model_number: "Model No.",
    serial_number: "Serial No.",
    specifications: "Specifications",
    warranty_period: "Warranty",
    tax_class: "Tax Class",
    warehouse_zone: "Warehouse Zone",
    media_url: "Media URL",
    status: "Status",
    // created_at: "Created At",
    // updated_at: "Updated At",
    // add more columns here...
  };

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

        {/* Display Product Details and Inventory */}
        {selectedProduct && (
          <div className="col-md-4 product-columns">
            <div className="card p-3 product_column">
              <ProductDetails
                product={selectedProduct}
                columnsMap={columnsMap}
                onEdit={handleOpenEditDetailsModal}
                onInsert={handleOpenInsertModal}
              />
            </div>

            <div className="card p-3 mt-4 product_invcolumn">
              <ProductInventory
                inventory={productInventory}
                onEdit={handleOpenInsertModal}
              
              />
            </div>
          </div>
        )}
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

      <EditModal
        isOpen={editDetailsModalOpen}
        onClose={handleCloseEditDetailsModal}
        data={editDetailsData}
        fields={[
          { key: "description", label: "Description", type: "text" },
          { key: "model_number", label: "Model Number", type: "text" },
          { key: "specifications", label: "Specifications", type: "text" },
          { key: "warranty_period", label: "Warranty Period", type: "text" },
          { key: "serial_number", label: "Serial Number", type: "text" },
          { key: "batch_number", label: "Batch Number", type: "text" },
          { key: "media_url", label: "Media URL", type: "text" },
        ]}
        onSubmit={() => window.location.reload()} // Refresh categories after edit
        apiEndpoint="/update/product_details"
        primaryKey="product_detail_id"
        title="Edit Product Details"
      />

      <InsertVariant
        isOpen={insertModalOpen}
        onClose={handleCloseInsertModal}
        data={insertData}
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
        title="Add Variant"
      />
    </div>
  );
};

export default ProductsManagement;
