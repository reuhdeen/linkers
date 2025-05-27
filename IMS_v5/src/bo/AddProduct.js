import React, { useState, useEffect } from "react";
import { CustomDropdown } from "../api/CustomDropdown";
import { Link } from "react-router-dom";

import {
  FaChevronDown,
  FaChevronUp,
  FaInfoCircle,
  FaBox,
  FaArrowLeft,
  FaClipboardList,
} from "react-icons/fa";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "../css/loading.css";
import "../css/tables.css";
import "../css/forms.css";

const AddProduct = () => {
  const [SelectedCategory, setSelectedCategory] = useState({});
  const [SelectedProductType, setSelectedProductType] = useState({});
  const [SelectedSupplier, setSelectedSupplier] = useState({});
  const [measurementType, setMeasurementType] = useState("single");

  
  const [openSections, setOpenSections] = useState({
    productInfo: true,
    specifications: true,
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
    // Basic Info
    name: "",
    description: "",
    category: "",
    subcategory: "",
    product_code: "",
    image: null,

    // Specifications
    brand_name: "",
    model_number: "",
    serial_number: "",
    length: "",
    width: "",
    height: "",
    weight: "",
    specifications: "",
    warranty_period: "",

    // Stock Info
    barcode: "",
    sku: "",
    batch_number: "",
    warehouse_zone: "",

    // Measurement Type: Single or Multiple
    unit_of_measure: "", // for single
    quantity_in_stock: "",

    main_unit: "", // for multiple
    sub_unit: "",
    conversion_factor: "",
    quantity_in_stock_main_unit: "",
    quantity_in_stock_sub_unit: "",

  });

  const insertProduct = async () => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      throw new Error("No token found");
    }

    const productData = {
      supplier_id: SelectedSupplier.id,
      name: newProduct.name.trim(),
      category_id: SelectedCategory.id,
      barcode: newProduct.barcode.trim(),
      brand_name: newProduct.brand_name.trim(),
      product_type_id: SelectedProductType.id,
      // custom_attributes: JSON.stringify({
      //   color: newProduct.color,
      //   battery_life: newProduct.battery_life,
      // }), 
    };

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/insert/products`,
        productData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Product inserted:", response.data);
      return response.data.id; // Assuming the response returns the product_id
    } catch (error) {
      console.error(
        "Error inserting product:",
        error.response ? error.response.data : error.message
      );
      throw new Error("Failed to insert product");
    }
  };
  const insertProductDetails = async (productId) => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      throw new Error("No token found");
    }

    const productDetailsData = {
      product_id: productId,
      description: newProduct.description.trim(),
      model_number: newProduct.model_number.trim(),
      specifications: newProduct.specifications.trim(),
      warranty_period: parseInt(newProduct.warranty_period),
      serial_number: newProduct.serial_number.trim(),

      batch_number: newProduct.batch_number.trim(),
      tax_class: "taxable", // You can adjust based on your requirements
      status: "active", // You can adjust based on your requirements
      media_url: newProduct.media_url.trim(),

    };

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/insert/product_details`,
        productDetailsData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Product details inserted:", response.data);
    } catch (error) {
      console.error(
        "Error inserting product details:",
        error.response ? error.response.data : error.message
      );
      throw new Error("Failed to insert product details");
    }
  };
  const insertProductUnit = async (productId) => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      throw new Error("No token found");
    }
  
    const productUnits = [];
  
    if (measurementType === "single") {
      // Single unit entry
      productUnits.push({
        product_id: productId,
        unit_name: newProduct.unit_of_measure.trim(),
        conversion_factor: 1,
        barcode: newProduct.barcode?.trim() || "", // Optional chaining in case it's undefined
      });
    } else if (measurementType === "multiple") {
      // Sub unit entry (conversion_factor = 1)
      productUnits.push({
        product_id: productId,
        unit_name: newProduct.sub_unit.trim(),
        conversion_factor: 1,
        barcode: newProduct.barcode?.trim() || "", // Using same barcode or could make it dynamic
      });
  
      // Main unit entry
      productUnits.push({
        product_id: productId,
        unit_name: newProduct.main_unit.trim(),
        conversion_factor: parseInt(newProduct.conversion_factor),
        barcode: "", // Leave empty or add another barcode field if needed
      });
    }
  
    try {
      const insertedIds = [];
  
      for (const unit of productUnits) {
        const response = await axios.post(
          `${process.env.REACT_APP_API_URL}/insert/product_units`,
          unit,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        console.log("Inserted unit:", response.data);
        insertedIds.push(response.data.product_unit_id);
      }
  
      return insertedIds;
    } catch (error) {
      console.error(
        "Error inserting product units:",
        error.response ? error.response.data : error.message
      );
      throw new Error("Failed to insert product units");
    }
  };
  
  const generateBarcode = () => {
    const timestamp = Date.now();
    setNewProduct({ ...newProduct, barcode: `YNG${timestamp}` });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct((prevProduct) => ({ ...prevProduct, [name]: value }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    try {
      // Insert product
      const productId = await insertProduct();

      // Insert product details
      await insertProductDetails(productId);

      // Insert product unit
      await insertProductUnit(productId);

      // Reset the form after successful insertions
      setNewProduct({
        // Basic Info
        name: "",
        description: "",
        category: "",
        subcategory: "",
        product_code: "",
        image: null, // or ""

        // Specifications
        brand_name: "",
        model_number: "",
        serial_number: "",
        length: "",
        width: "",
        height: "",
        weight: "",
        specifications: "",
        warranty_period: "",

        // Stock Info
        barcode: "",
        sku: "",
        batch_number: "",
        warehouse_zone: "",

        // Measurement Type: Single or Multiple
        unit_of_measure: "", // for single
        quantity_in_stock: "",

        main_unit: "", // for multiple
        sub_unit: "",
        conversion_factor: "",
        quantity_in_stock_main_unit: "",
        quantity_in_stock_sub_unit: "",

      });

      alert("Product created successfully!");
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  };

  // Scrollable table columns
  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-12">
          <form onSubmit={handleFormSubmit}>


      <div className="row align-items-center mb-3">
        <div className="col-md-6">
        <h3>Create Product</h3>
        <span className="text-muted">Add a new product to the list</span>
        </div>
        <div className="col-md-6 text-end">
          <Link to="/products" className="btn btn-md btn-warning">
            <FaArrowLeft size={14} />
            &nbsp; Back to Products
          </Link>

        </div>
      </div>
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
                <span>
                  {openSections.productInfo ? (
                    <FaChevronUp />
                  ) : (
                    <FaChevronDown />
                  )}
                </span>
              </div>
              {openSections.productInfo && (
                <div className="card-body">
                  <div className="row mb-3">
                    <div className="col-md-12">
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
                  </div>
                  <div className="row mb-3">
                    <div className="col-12">
                      <label>Description</label>{" "}
                      <span class="text-danger">*</span>
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
                        showAllOption={false}  // Hide "All Categories" option

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
                        showAllOption={false}  // Hide "All Categories" option

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
                        showAllOption={false}  // Hide "All Categories" option

                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label>Image URL</label>
                      <input
                        name="media_url"
                        className="form-control"
                        placeholder="Image URL"
                        value={newProduct.media_url}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Specifications */}
            <div className="card mt-3">
              <div
                className="card-header d-flex justify-content-between align-items-center"
                onClick={() => toggleSection("specifications")}
                style={{ cursor: "pointer" }}
              >
                <h4 className="mb-2 mt-2">
                  <FaClipboardList className="edit-button" /> Specifications
                </h4>
                <span>
                  {openSections.specifications ? (
                    <FaChevronUp />
                  ) : (
                    <FaChevronDown />
                  )}
                </span>
              </div>
              {openSections.specifications && (
                <div className="card-body">
                  <div className="row mb-3">
                    <div className="col-md-4">
                      <label>Brand Name</label>
                      <input
                        name="brand_name"
                        className="form-control"
                        placeholder="Brand Name"
                        value={newProduct.brand_name}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="col-md-4">
                      <label>Model Number</label>
                      <input
                        name="model_number"
                        className="form-control"
                        placeholder="Model Number"
                        value={newProduct.model_number}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="col-md-4">
                      <label>Serial Number</label>
                      <input
                        name="serial_number"
                        className="form-control"
                        placeholder="Serial Number"
                        value={newProduct.serial_number}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="row mb-3">
                    <div className="col-md-6">
                      <label>Specifications</label>
                      <input
                        name="specifications"
                        className="form-control"
                        placeholder="Specifications"
                        value={newProduct.specifications}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label>Warranty Period</label>
                      <input
                        name="warranty_period"
                        className="form-control"
                        placeholder="Warranty Period"
                        type="number"
                        value={newProduct.warranty_period}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>
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
                <span>
                  {openSections.productInfo ? (
                    <FaChevronUp />
                  ) : (
                    <FaChevronDown />
                  )}
                </span>
              </div>
              {openSections.stockInfo && (
                <div className="card-body">
                  <div className="row mb-3">
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
                          className="btn btn-sm btn-secondary"
                          onClick={generateBarcode}
                        >
                          Generate
                        </button>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <label>SKU</label>
                      <input
                        name="sku"
                        className="form-control"
                        placeholder="SKU"
                        value={newProduct.sku}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="row mb-3">
                    <div className="col-md-6">
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
                    <div className="col-md-6">
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
                  </div>
                  <div className="row mb-3">
                    <div className="col-12">
                      <label className="form-label d-block">
                        Unit of Measurement
                      </label>
                      <div className="form-check form-check-inline">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="measurementType"
                          id="single"
                          value="single"
                          checked={measurementType === "single"}
                          onChange={() => setMeasurementType("single")}
                        />
                        <label className="form-check-label" htmlFor="single">
                          Single
                        </label>
                      </div>
                      <div className="form-check form-check-inline">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="measurementType"
                          id="multiple"
                          value="multiple"
                          checked={measurementType === "multiple"}
                          onChange={() => setMeasurementType("multiple")}
                        />
                        <label className="form-check-label" htmlFor="multiple">
                          Multiple
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Conditional Inputs */}
                  {measurementType === "single" && (
                    <div className="row mb-3">
                      <div className="col-md-6">
<label>Measurement Name</label>
<select
  name="unit_of_measure"
  className="form-control"
  value={newProduct.unit_of_measure}
  onChange={handleInputChange}
  required
>
  <option value="" disabled>Select a unit</option>
  <option value="Piece">Piece</option>
  <option value="Box">Box</option>
  <option value="Pack">Pack</option>
  <option value="Kilogram">Kilogram</option>
  <option value="Liter">Liter</option>
  {/* Add more units as needed */}
</select>

                      </div>

                    </div>
                  )}

                  {measurementType === "multiple" && (
                    <>
                      <div className="row mb-3">
                        <div className="col-md-4">
                          <label>Main Unit</label>

                          <select
  name="main_unit"
  className="form-control"
  value={newProduct.main_unit}
  onChange={handleInputChange}
  required
>
  <option value="" disabled>Select a unit</option>
  <option value="Piece">Piece</option>
  <option value="Box">Box</option>
  <option value="Pack">Pack</option>
  <option value="Kilogram">Kilogram</option>
  <option value="Liter">Liter</option>
  {/* Add more units as needed */}
</select>
                        </div>
                        <div className="col-md-4">
                          <label>Sub Unit</label>

                                                    <select
  name="sub_unit"
  className="form-control"
  value={newProduct.sub_unit}
  onChange={handleInputChange}
  required
>
  <option value="" disabled>Select a unit</option>
  <option value="Piece">Piece</option>
  <option value="Box">Box</option>
  <option value="Pack">Pack</option>
  <option value="Kilogram">Kilogram</option>
  <option value="Liter">Liter</option>
  {/* Add more units as needed */}
</select>
                        </div>
                        <div className="col-md-4">
                          <label>Conversion Factor</label>
                          <input
                            name="conversion_factor"
                            className="form-control"
                            type="number"
                            placeholder="e.g., 10 (pieces in a box)"
                            value={newProduct.conversion_factor}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div className="text-center mt-3">
              <button type="submit" className="btn btn-primary">
                Add New Product
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddProduct;
