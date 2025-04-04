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

const ProductsManagement = () => {
  const [products, setProducts] = useState([]);
  const [SelectedCategory, setSelectedCategory] = useState({});
  const [SelectedProductType, setSelectedProductType] = useState({});
  const [SelectedSupplier, setSelectedSupplier] = useState({});
  const [loading, setLoading] = useState(true);
  const [SelectedProductCategory, setSelectedProductCategory] = useState({});

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

  const fetchProducts = async (categoryId) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("accessToken");
      if (!token) throw new Error("No token found");

      const productsData = await fetchQueryData(token, {
        table:
          "iposarv3.products INNER JOIN categories on categories.category_id = products.category_id INNER JOIN product_types ON products.product_type_id = product_types.product_type_id INNER JOIN suppliers ON products.supplier_id = suppliers.supplier_id",
        columns:
          "products.*, categories.name AS categoryName, product_types.name AS productTypeName, suppliers.name AS supplierName",
        where: `products.category_id = '${categoryId}'`,
      });

      setProducts(productsData);
    } catch (error) {
      console.error("Error fetching products:", error);
      alert(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Trigger fetchProducts when SelectedProductCategory changes
  const handleCategoryChange = (category) => {
    setSelectedProductCategory(category);
    if (category.id) {
      fetchProducts(category.id);
    }
  };

  const columns = [
    { name: "Edit", key: "edit" },
    { name: "Img", key: "product_id" },
    { name: "Name", key: "name" },
    { name: "Description", key: "description" },
    { name: "Category", key: "categoryName" },
    { name: "Product Type", key: "productTypeName" },
    { name: "Quantity In Stock", key: "quantity_in_stock" },
    { name: "Reorder Level", key: "reorder_level" },
    { name: "Supplier", key: "supplierName" },
    { name: "Barcode", key: "barcode" },
    { name: "Expiration Date", key: "expiration_date" },
    { name: "Unit of Measure", key: "unit_of_measure" },
    { name: "Markup Percentage", key: "markup_percentage" },
    { name: "Selling Price", key: "selling_price" },
    { name: "Cost Price", key: "cost_price" },
    { name: "Batch Number", key: "batch_number" },
    { name: "Warehouse Zone", key: "warehouse_zone" },
    { name: "SKU", key: "SKU" },
  ];
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    category_id: "",
    quantity_in_stock: "",
    reorder_level: "",
    supplier_id: "",
    barcode: "",
    expiration_date: "",
    unit_of_measure: "",
    markup_percentage: "",
    selling_price: "",
    cost_price: "",
    batch_number: "",
    warehouse_zone: "",
    SKU: "",
    product_type_id: "",
  });

  const generateBarcode = () => {
    const timestamp = Date.now();
    setNewProduct({ ...newProduct, barcode: `YNG${timestamp}` });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct({ ...newProduct, [name]: value });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const trimmedInventory = {
      name: newProduct.name.trim(),
      description: newProduct.description.trim(),
      category_id: SelectedCategory.id,
      quantity_in_stock: newProduct.quantity_in_stock.trim(),
      reorder_level: newProduct.reorder_level.trim(),
      supplier_id: SelectedSupplier.id,
      barcode: newProduct.barcode.trim(),
      expiration_date: newProduct.expiration_date.trim(),
      unit_of_measure: newProduct.unit_of_measure.trim(),
      markup_percentage: newProduct.markup_percentage.trim(),
      selling_price: newProduct.selling_price.trim(),
      cost_price: newProduct.cost_price.trim(),
      batch_number: newProduct.batch_number.trim(),
      warehouse_zone: newProduct.warehouse_zone.trim(),
      SKU: newProduct.SKU.trim(),
      product_type_id: SelectedProductType.id,
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
        `${process.env.REACT_APP_API_URL}/insert/products`,
        trimmedInventory,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Inventory created successfully", response.data);
      const productsData = await fetchQueryData(token, {
        table:
          "iposarv3.products INNER JOIN categories on categories.category_id = products.category_id INNER JOIN product_types ON products.product_type_id = product_types.product_type_id INNER JOIN suppliers ON products.supplier_id = suppliers.supplier_id",
        columns:
          "products.*, categories.name AS categoryName, product_types.name AS productTypeName, suppliers.name AS supplierName",
        where: `products.category_id = '${SelectedProductCategory.id}'`,
      });

      setProducts(productsData);
      setNewProduct({
        name: "",
        description: "",
        category_id: "",
        quantity_in_stock: "",
        reorder_level: "",
        supplier_id: "",
        barcode: "",
        expiration_date: "",
        unit_of_measure: "",
        markup_percentage: "",
        selling_price: "",
        cost_price: "",
        batch_number: "",
        warehouse_zone: "",
        SKU: "",
        product_type_id: "",
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

      {/* First Row: Add & View products */}
      <div className="row">
        <div className="col-md-8">
          <div className="card p-3 h-100">
            <h4>Product Management</h4>
            <label>Category</label>
            <CustomDropdown
              endpoint="categories"
              name="category_id"
              value={SelectedProductCategory.id || ""}
              onChange={(e) => handleCategoryChange({ id: e.target.value })}
              idField="category_id"
              nameField="name"
              required
            />

            <hr></hr>
            <DataTable
              columns={columns}
              data={products}
              title=""
              rows={10}
              onEdit={handleOpenEditModal} 
            />
          </div>
        </div>

        <div className="col-md-4">
          <div className="card p-3 h-100">
            <h4>Add New Product</h4>
            <form onSubmit={handleFormSubmit} className="container">
              <div className="row mb-3">
                <div className="col-md-6">
                  <label>Name</label>
                  <input
                    name="name"
                    className="form-control"
                    placeholder="Name"
                    value={newProduct.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label className="d-flex align-items-center">
                    Barcode
                    <button
                      type="button"
                      className="btn btn-sm btn-primary ms-2"
                      onClick={generateBarcode}
                    >
                      Generate
                    </button>
                  </label>
                  <input
                    name="barcode"
                    className="form-control"
                    placeholder="Barcode"
                    value={newProduct.barcode}
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
                    value={newProduct.description}
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
                  <label>Type</label>
                  <CustomDropdown
                    endpoint="product_types"
                    name="product_type_id"
                    value={SelectedProductType.id || ""}
                    onChange={(e) =>
                      setSelectedProductType({ id: e.target.value })
                    }
                    idField="product_type_id"
                    nameField="name"
                    required
                  />
                </div>
              </div>

              <div className="row mb-3">
                <div className="col-12">
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

              <div className="row mb-3">
                <div className="col-md-6">
                  <label>Quantity in Stock</label>
                  <input
                    name="quantity_in_stock"
                    className="form-control"
                    type="number"
                    placeholder="Quantity in Stock"
                    value={newProduct.quantity_in_stock}
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
                    value={newProduct.reorder_level}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="row mb-3">
                <div className="col-md-6">
                  <label>Unit of Measure</label>
                  <input
                    name="unit_of_measure"
                    className="form-control"
                    placeholder="Unit of Measure"
                    value={newProduct.unit_of_measure}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label>Expiration Date</label>
                  <input
                    name="expiration_date"
                    className="form-control"
                    type="date"
                    placeholder="Expiration Date"
                    value={newProduct.expiration_date}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="row mb-3">
                <div className="col-md-4">
                  <label>Cost Price</label>
                  <input
                    name="cost_price"
                    className="form-control"
                    type="number"
                    placeholder="Cost Price"
                    value={newProduct.cost_price}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="col-md-4">
                  <label>Selling Price</label>
                  <input
                    name="selling_price"
                    className="form-control"
                    type="number"
                    placeholder="Selling Price"
                    value={newProduct.selling_price}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="col-md-4">
                  <label>Markup Percentage</label>
                  <input
                    name="markup_percentage"
                    className="form-control"
                    type="number"
                    placeholder="Markup Percentage"
                    value={newProduct.markup_percentage}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="row mb-3">
                <div className="col-md-4">
                  <label>Warehouse Zone</label>
                  <input
                    name="warehouse_zone"
                    className="form-control"
                    placeholder="Warehouse Zone"
                    value={newProduct.warehouse_zone}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="col-md-4">
                  <label>Batch Number</label>
                  <input
                    name="batch_number"
                    className="form-control"
                    placeholder="Batch Number"
                    value={newProduct.batch_number}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="col-md-4">
                  <label>SKU</label>
                  <input
                    name="SKU"
                    className="form-control"
                    placeholder="SKU"
                    value={newProduct.SKU}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <button type="submit" className="btn btn-primary">
                Add New Product
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
                { key: "quantity_in_stock", label: "Quantity In Stock", type: "number" },
                { key: "reorder_level", label: "Reorder Level", type: "number" },
                { key: "barcode", label: "Barcode", type: "text" },
                { key: "expiration_date", label: "Expiration Date", type: "text" },
                { key: "unit_of_measure", label: "Unit of Measure", type: "text" },
                { key: "selling_price", label: "Selling Price", type: "number" },
                { key: "cost_price", label: "Cost Price", type: "number" },
                { key: "batch_number", label: "Batch Number", type: "text" },
                { key: "warehouse_zone", label: "Warehouse Zone", type: "text" },
                { key: "SKU", label: "SKU", type: "text" },
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
