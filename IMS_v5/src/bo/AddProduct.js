import React, { useState, useEffect } from "react";
import { CustomDropdown } from "../api/CustomDropdown";
import {
  FaChevronDown,
  FaChevronUp,
  FaInfoCircle,
  FaBox,
  FaDollarSign,
  FaClipboardList,
} from "react-icons/fa";

import "bootstrap/dist/css/bootstrap.min.css";
import "../css/loading.css";
import "../css/tables.css";
import "../css/forms.css";

const AddProduct = () => {
  const [SelectedCategory, setSelectedCategory] = useState({});
  const [SelectedProductType, setSelectedProductType] = useState({});
  const [SelectedSupplier, setSelectedSupplier] = useState({});
  const [openSections, setOpenSections] = useState({
    productInfo: true,
    stockInfo: true,
    pricingInfo: true,
    otherInfo: true,
  });

  const toggleSection = (section) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

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
  };

  // Scrollable table columns
  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-12">
          <h3>Create Product</h3>
          <span className="text-muted">Add a new product to the list</span>

          {/* Product Information */}
          <div className="card mt-3">
            <div
              className="card-header d-flex justify-content-between align-items-center"
              onClick={() => toggleSection("productInfo")}
              style={{ cursor: "pointer" }}
            >
              <h4 className="mb-2 mt-2">
                <FaInfoCircle className="edit-button" /> Product Information
              </h4>
              <span>{openSections.productInfo ? <FaChevronUp/> : <FaChevronDown/>}</span>
            </div>
            {openSections.productInfo && (
              <div className="card-body">
                <form onSubmit={handleFormSubmit}>
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
                      <label>Barcode</label>
                      <div className="input-group">
                        <input
                          name="barcode"
                          className="form-control"
                          placeholder="Barcode"
                          value={newProduct.barcode}
                          onChange={handleInputChange}
                          required
                        />
                        <button
                          type="button"
                          className="btn btn-sm btn-primary"
                          onClick={generateBarcode}
                        >
                          Generate
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="row mb-3">
                    <div className="col-12">
                      <label>Description</label> <span class="text-danger">*</span>
                      <textarea
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
                    <div className="col-md-6">
                      <label>Image URL</label>
                      <input
                        name="media_url"
                        className="form-control"
                        placeholder="Image URL"
                        value={newProduct.name}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>
                </form>
              </div>
            )}
          </div>

          {/* Stock Information */}
          <div className="card mt-3">
            <div
              className="card-header d-flex justify-content-between align-items-center"
              onClick={() => toggleSection("stockInfo")}
              style={{ cursor: "pointer" }}
            >
              <h4 className="mb-2 mt-2">
                <FaClipboardList className="edit-button" /> Stocks
              </h4>
              <span>{openSections.productInfo ? <FaChevronUp/> : <FaChevronDown/>}</span>
            </div>
            {openSections.stockInfo && (
              <div className="card-body">
                <div className="row mb-3">
                  <div className="col-md-6">
                    <label>Quantity in Stock</label>
                    <input
                      name="quantity_in_stock"
                      className="form-control"
                      type="number"
                      placeholder="Quantity"
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
              </div>
            )}
          </div>

          {/* Pricing Information */}
          <div className="card mt-3">
            <div
              className="card-header d-flex justify-content-between align-items-center"
              onClick={() => toggleSection("pricingInfo")}
              style={{ cursor: "pointer" }}
            >
              <h4 className="mb-2 mt-2">
                <FaDollarSign className="edit-button" /> Pricing
              </h4>
              <span>{openSections.productInfo ? <FaChevronUp/> : <FaChevronDown/>}</span>
            </div>
            {openSections.pricingInfo && (
              <div className="card-body">
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
                </div>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="text-center mt-3">
            <button type="submit" className="btn btn-primary">
              Add New Product
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddProduct;
