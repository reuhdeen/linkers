import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { CustomDropdown } from "../api/CustomDropdown";
import {
  FaChevronDown,
  FaChevronUp,
  FaBox,
  FaClipboardList,
  FaArrowLeft,
} from "react-icons/fa";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "../css/loading.css";
import "../css/tables.css";
import "../css/forms.css";

const AddEditProduct = ({ isEditMode = false, existingProduct = {} }) => {
  // ── FORM STATE ─────────────────────────────────────────────────────────
  const [product, setProduct] = useState({
    name: "",
    supplier_id: "",
    category_id: "",
    product_type_id: "",
    media_url: "",
    status: "active",
  });
  const [details, setDetails] = useState({
    description: "",
    model_number: "",
    serial_number: "",
    specifications: "",
    warranty_period: "",
    tax_class: "taxable",
    status: "active",
  });
  const [unitsData, setUnitsData] = useState({
    barcode: "",
    unit_of_measure: "",
    main_unit: "",
    sub_unit: "",
    conversion_factor: "",
  });
  const [measurementType, setMeasurementType] = useState("single");
  const [openSections, setOpenSections] = useState({
    core: true,
    details: true,
    units: true,
  });

  // ── PREFILL ON EDIT ─────────────────────────────────────────────────────
  useEffect(() => {
    if (isEditMode && existingProduct.product_id) {
      // Core product
      setProduct({
        name: existingProduct.name || "",
        supplier_id: existingProduct.supplier_id || "",
        category_id: existingProduct.category_id || "",
        product_type_id: existingProduct.product_type_id || "",
        media_url: existingProduct.media_url || "",
        status: existingProduct.status || "active",
      });
      // Details
      setDetails({
        description: existingProduct.description || "",
        model_number: existingProduct.model_number || "",
        serial_number: existingProduct.serial_number || "",
        specifications: existingProduct.specifications || "",
        warranty_period:
          existingProduct.warranty_period?.toString() || "",
        tax_class: existingProduct.tax_class || "taxable",
        status: existingProduct.detail_status || "active",
      });
      // Units (assume first variant)
      if (
        existingProduct.units &&
        existingProduct.units.length === 1
      ) {
        const u = existingProduct.units[0];
        setUnitsData({
          barcode: u.barcode || "",
          unit_of_measure: u.unit_name || "",
          main_unit: "",
          sub_unit: "",
          conversion_factor: "1",
        });
        setMeasurementType("single");
      } else if (
        existingProduct.units &&
        existingProduct.units.length === 2
      ) {
        const [sub, main] = existingProduct.units;
        setUnitsData({
          barcode: sub.barcode || "",
          unit_of_measure: "",
          main_unit: main.unit_name || "",
          sub_unit: sub.unit_name || "",
          conversion_factor: main.conversion_factor?.toString() || "",
        });
        setMeasurementType("multiple");
      }
    }
    // eslint-disable-next-line
  }, [isEditMode, existingProduct]);

  // ── HELPERS ─────────────────────────────────────────────────────────────
  const toggleSection = (sec) =>
    setOpenSections((prev) => ({ ...prev, [sec]: !prev[sec] }));

  const handleProductChange = (e) => {
    const { name, value } = e.target;
    setProduct((p) => ({ ...p, [name]: value }));
  };
  const handleDetailsChange = (e) => {
    const { name, value } = e.target;
    setDetails((d) => ({ ...d, [name]: value }));
  };
  const handleUnitsChange = (e) => {
    const { name, value } = e.target;
    setUnitsData((u) => ({ ...u, [name]: value }));
  };

  const generateBarcode = () => {
    setUnitsData((u) => ({
      ...u,
      barcode: "PRD" + Date.now(),
    }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("image", file);
    try {
      const token = localStorage.getItem("accessToken");
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/image/upload`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setProduct((p) => ({ ...p, media_url: res.data.image_url }));
    } catch {
      alert("Image upload failed.");
    }
  };

  // ── SUBMIT ──────────────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) throw new Error("No token");

      // 1. Core product
      const corePayload = {
        ...product,
      };
      let coreResp;
      if (isEditMode) {
        coreResp = await axios.put(
          `${process.env.REACT_APP_API_URL}/products/${existingProduct.product_id}`,
          corePayload,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        coreResp = await axios.post(
          `${process.env.REACT_APP_API_URL}/insert/products`,
          corePayload,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }
      const productId = isEditMode
        ? existingProduct.product_id
        : coreResp.data.id;

      // 2. Product details
      await axios.post(
        `${process.env.REACT_APP_API_URL}/insert/product_details`,
        {
          product_id: productId,
          ...details,
          warranty_period: parseInt(details.warranty_period || 0, 10),
          media_url: product.media_url,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // 3. Product units
      // If edit: you may want to delete existing units first
      const unitsToInsert = [];
      if (measurementType === "single") {
        unitsToInsert.push({
          product_id: productId,
          unit_name: unitsData.unit_of_measure,
          conversion_factor: 1,
          barcode: unitsData.barcode,
        });
      } else {
        unitsToInsert.push({
          product_id: productId,
          unit_name: unitsData.sub_unit,
          conversion_factor: 1,
          barcode: unitsData.barcode,
        });
        unitsToInsert.push({
          product_id: productId,
          unit_name: unitsData.main_unit,
          conversion_factor: parseFloat(
            unitsData.conversion_factor || 1
          ),
          barcode: "",
        });
      }
      await Promise.all(
        unitsToInsert.map((u) =>
          axios.post(
            `${process.env.REACT_APP_API_URL}/insert/product_units`,
            u,
            { headers: { Authorization: `Bearer ${token}` } }
          )
        )
      );

      alert(
        isEditMode
          ? "Product updated successfully!"
          : "Product created successfully!"
      );
    } catch (err) {
      console.error(err);
      alert(`Error: ${err.response?.data || err.message}`);
    }
  };

  // ── RENDER ─────────────────────────────────────────────────────────────
  return (
    <div className="container-fluid">
      <form onSubmit={handleSubmit}>
        {/* Header */}
        <div className="row align-items-center mb-4">
          <div className="col-md-6">
            <h3>
              {isEditMode ? "Edit Product" : "Add New Product"}
            </h3>
          </div>
          <div className="col-md-6 text-end">
            <Link to="/products" className="btn btn-warning">
              <FaArrowLeft /> Back to Products
            </Link>
          </div>
        </div>

        {/* 1. Core Product */}
        <div className="card mb-4">
          <div
            className="card-header product-section d-flex justify-content-between"
            onClick={() => toggleSection("core")}
          >
            <h4 className="mb-0">
              <FaBox className="me-2" />
              Core Product
            </h4>
            {openSections.core ? (
              <FaChevronUp />
            ) : (
              <FaChevronDown />
            )}
          </div>
          {openSections.core && (
            <div className="card-body">
              <p className="section-description">
                Basic product record (products table).
              </p>
              <div className="row mb-3">
                <div className="col-md-6">
                  <label>Name</label>
                  <input
                    name="name"
                    value={product.name}
                    onChange={handleProductChange}
                    className="form-control"
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label>Supplier</label>
                  <CustomDropdown
                    endpoint="suppliers"
                    name="supplier_id"
                    value={product.supplier_id}
                    onChange={handleProductChange}
                    idField="supplier_id"
                    nameField="name"
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
                    value={product.category_id}
                    onChange={handleProductChange}
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
                    value={product.product_type_id}
                    onChange={handleProductChange}
                    idField="product_type_id"
                    nameField="name"
                    required
                  />
                </div>
              </div>
              <div className="mb-3">
                <label>Image</label>
                <input
                  type="file"
                  accept="image/*"
                  className="form-control"
                  onChange={handleImageUpload}
                />
                {product.media_url && (
                  <img
                    src={product.media_url}
                    alt="preview"
                    className="product-image-preview"
                  />
                )}
              </div>
              <div className="mb-3">
                <label>Status</label>
                <select
                  name="status"
                  value={product.status}
                  onChange={handleProductChange}
                  className="form-control"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* 2. Product Details */}
        <div className="card mb-4">
          <div
            className="card-header d-flex justify-content-between"
            onClick={() => toggleSection("details")}
          >
            <h4 className="mb-0">
              <FaClipboardList className="me-2" />
              Product Details
            </h4>
            {openSections.details ? (
              <FaChevronUp />
            ) : (
              <FaChevronDown />
            )}
          </div>
          {openSections.details && (
            <div className="card-body">
              <p className="section-description">
                Extended info (product_details table).
              </p>
              <div className="mb-3">
                <label>Description</label>
                <textarea
                  name="description"
                  value={details.description}
                  onChange={handleDetailsChange}
                  className="form-control"
                  required
                />
              </div>
              <div className="row mb-3">
                <div className="col-md-4">
                  <label>Model No.</label>
                  <input
                    name="model_number"
                    value={details.model_number}
                    onChange={handleDetailsChange}
                    className="form-control"
                  />
                </div>
                <div className="col-md-4">
                  <label>Serial No.</label>
                  <input
                    name="serial_number"
                    value={details.serial_number}
                    onChange={handleDetailsChange}
                    className="form-control"
                  />
                </div>
                <div className="col-md-4">
                  <label>Warranty (months)</label>
                  <input
                    name="warranty_period"
                    type="number"
                    value={details.warranty_period}
                    onChange={handleDetailsChange}
                    className="form-control"
                  />
                </div>
              </div>
              <div className="mb-3">
                <label>Specifications</label>
                <input
                  name="specifications"
                  value={details.specifications}
                  onChange={handleDetailsChange}
                  className="form-control"
                />
              </div>
              <div className="mb-3">
                <label>Tax Class</label>
                <select
                  name="tax_class"
                  value={details.tax_class}
                  onChange={handleDetailsChange}
                  className="form-control"
                >
                  <option value="taxable">Taxable</option>
                  <option value="non-taxable">Non-taxable</option>
                </select>
              </div>
              <div className="mb-3">
                <label>Status</label>
                <select
                  name="status"
                  value={details.status}
                  onChange={handleDetailsChange}
                  className="form-control"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* 3. Units */}
        <div className="card mb-4">
          <div
            className="card-header d-flex justify-content-between"
            onClick={() => toggleSection("units")}
          >
            <h4 className="mb-0">
              <FaClipboardList className="me-2" />
              Units
            </h4>
            {openSections.units ? (
              <FaChevronUp />
            ) : (
              <FaChevronDown />
            )}
          </div>
          {openSections.units && (
            <div className="card-body">
              <p className="section-description">
                How you measure & barcode this product.
              </p>
              <div className="mb-3">
                <label>Barcode</label>
                <div className="input-group">
                  <input
                    name="barcode"
                    value={unitsData.barcode}
                    onChange={handleUnitsChange}
                    className="form-control"
                    required
                  />
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={generateBarcode}
                  >
                    Generate
                  </button>
                </div>
              </div>
              <div className="mb-3">
                <label>Measurement Mode</label>
                <div>
                  <label className="me-3">
                    <input
                      type="radio"
                      name="measurementType"
                      value="single"
                      checked={measurementType === "single"}
                      onChange={() => setMeasurementType("single")}
                    />{" "}
                    Single
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="measurementType"
                      value="multiple"
                      checked={measurementType === "multiple"}
                      onChange={() => setMeasurementType("multiple")}
                    />{" "}
                    Multiple
                  </label>
                </div>
              </div>

              {measurementType === "single" && (
                <div className="mb-3">
                  <label>Unit of Measure</label>
                  <select
                    name="unit_of_measure"
                    value={unitsData.unit_of_measure}
                    onChange={handleUnitsChange}
                    className="form-control"
                    required
                  >
                    <option value="">Select unit</option>
                    <option>Piece</option>
                    <option>Box</option>
                    <option>Kilogram</option>
                    <option>Liter</option>
                  </select>
                </div>
              )}

              {measurementType === "multiple" && (
                <div className="row mb-3">
                  <div className="col-md-4">
                    <label>Sub‐Unit</label>
                    <select
                      name="sub_unit"
                      value={unitsData.sub_unit}
                      onChange={handleUnitsChange}
                      className="form-control"
                      required
                    >
                      <option value="">Select sub unit</option>
                      <option>Piece</option>
                      <option>Liter</option>
                    </select>
                  </div>
                  <div className="col-md-4">
                    <label>Main‐Unit</label>
                    <select
                      name="main_unit"
                      value={unitsData.main_unit}
                      onChange={handleUnitsChange}
                      className="form-control"
                      required
                    >
                      <option value="">Select main unit</option>
                      <option>Box</option>
                      <option>Pack</option>
                    </select>
                  </div>
                  <div className="col-md-4">
                    <label>Conversion Factor</label>
                    <input
                      name="conversion_factor"
                      type="number"
                      value={unitsData.conversion_factor}
                      onChange={handleUnitsChange}
                      className="form-control"
                      placeholder="e.g. 12"
                      required
                    />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Submit */}
        <div className="text-center mb-5">
          <button type="submit" className="btn btn-primary btn-lg">
            {isEditMode ? "Save Changes" : "Add Product"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddEditProduct;