// src/bo/tabs/VariantsTab.jsx

import React, { useState, useEffect } from "react";
import axios from "axios";
import { fetchQueryData } from "../../api/fetchData";
import { updateQueryData } from "../../api/updateData";
import { decodeBase64 } from "../../utils/decode";
import { FaRegEdit, FaRegTrashAlt } from "react-icons/fa";

// blank variant factory
const blankVariant = (productId) => ({
  product_variant_id: 0,
  product_id: productId,
  sku: "",
  barcode: "",
  unit_name: "",
  model_number: "",
  serial_number: "",
  color: "",
  size: "",
  warranty_period: "",
  tax_class: "",
  status: "active",
  attributes: {},
});

// dropdown lists
const UNIT_OPTIONS = [
  "Piece", "Box", "Pack", "Kg", "Gram",
  "Meter", "Liter", "Set"
];

const COLOR_OPTIONS = [
  "Red", "Blue", "Green", "Black", "White",
  "Yellow", "Orange", "Purple", "Gray", "Brown"
];

const TAX_CLASS_OPTIONS = [
  "VATable (12%)",
  "Zero-Rated (0%)",
  "Exempt"
];

const VariantsTab = ({
  data = [],
  onChange,
  isEditMode = false,
  productId,
}) => {
  const [warrantyUnit, setWarrantyUnit] = useState("months");
  const [variants, setVariants] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState({
    type: "", // can be 'success' or 'error'
    message: ""
  });

  const [showModal, setShowModal] = useState(false);
  const [modalVariant, setModalVariant] = useState(blankVariant(productId));
  const [editingIndex, setEditingIndex] = useState(null);
  const [modalAttributes, setModalAttributes] = useState([]);

  // Auto-generate 12-digit barcode
  const generateRandomBarcode = () => {
    // Only generate a new barcode if the field is empty
    if (modalVariant.barcode) {
      return;
    }
    const code = Math.floor(100000000000 + Math.random() * 900000000000)
      .toString();
    setModalVariant((prev) => ({ ...prev, barcode: code }));
  };
  // 1) Mirror parent `data` prop into local state on every change
  useEffect(() => {
    setVariants(data);
  }, [data]);

  // 2) Fetch from backend once when you actually have an ID & edit mode
  useEffect(() => {
    if (!isEditMode || !productId) {
      setVariants([]);
      return;
    }

    setIsLoading(true);
    setStatusMessage({ type: "", message: "" });

    fetchQueryData(localStorage.getItem("accessToken"), {
      table: "product_variants",
      columns: "*",
      where: `product_id = ${productId}`,
      order: "product_variant_id ASC",
    })
      .then((rows) => {
        const parsed = (rows || []).map((v) => {
          // parse & decode attributes
          let attrs = {};
          if (v.attributes) {
            if (typeof v.attributes === "string") {
              try {
                attrs = JSON.parse(v.attributes);
              } catch {
                try {
                  attrs = JSON.parse(window.atob(v.attributes));
                } catch {
                  attrs = {};
                }
              }
            } else if (typeof v.attributes === "object") {
              attrs = v.attributes;
            }
          }
          return {
            ...v,
            sku: v.sku ? decodeBase64(v.sku) : "",
            barcode: v.barcode ? decodeBase64(v.barcode) : "",
            unit_name: v.unit_name ? decodeBase64(v.unit_name) : "",
            model_number: v.model_number ? decodeBase64(v.model_number) : "",
            serial_number: v.serial_number
              ? decodeBase64(v.serial_number)
              : "",
            color: v.color ? decodeBase64(v.color) : "",
            size: v.size ? decodeBase64(v.size) : "",
            warranty_period: v.warranty_period
              ? Number(decodeBase64(v.warranty_period))
              : null,
            tax_class: v.tax_class ? decodeBase64(v.tax_class) : "",
            status: v.status ? decodeBase64(v.status) : "",
            attributes: attrs,
          };
        });

        setVariants(parsed);
        onChange(parsed);
      })
      .catch((err) => {
        console.error("Error loading variants:", err);
        setStatusMessage({ type: "error", message: "Failed to load variants." });
      })
      .finally(() => setIsLoading(false));
  }, [isEditMode, productId]);

  // Sync local state up to parent
  const syncUp = (next) => {
    setVariants(next);
    onChange(next);
  };

  const handleAddClick = () => {
    setModalVariant(blankVariant(productId));
    setEditingIndex(null);
    setModalAttributes([]);
    setStatusMessage({ type: "", message: "" });
    setShowModal(true);
  };

  const handleEditClick = (idx) => {
    const v = variants[idx];
    setModalVariant({ ...v });
    setEditingIndex(idx);
    setModalAttributes(
      Object.entries(v.attributes || {}).map(([key, value]) => ({ key, value }))
    );
    setStatusMessage({ type: "", message: "" });
    setShowModal(true);
  };

  const handleDelete = async (idx) => {
    const v = variants[idx];
    if (v.product_variant_id > 0) {
      setIsSaving(true);
      setStatusMessage({ type: "", message: "" });
      try {
        const token = localStorage.getItem("accessToken");
        await axios.delete(
          `${process.env.REACT_APP_API_URL}/delete/product_variants`,
          {
            data: { product_variant_id: v.product_variant_id },
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setStatusMessage({ type: "success", message: "Variant deleted successfully." });
      } catch (err) {
        console.error("Error deleting variant:", err);
        setStatusMessage({ type: "error", message: "Failed to delete variant." });
        return;
      } finally {
        setIsSaving(false);
      }
    }
    const next = variants.filter((_, i) => i !== idx);
    syncUp(next);
  };

  // Updated handleModalSave with SKU duplication checks
  const handleModalSave = async () => {
    setStatusMessage({ type: "", message: "" });

    // Require SKU
    if (!modalVariant.sku.trim()) {
      setStatusMessage({ type: "error", message: "SKU cannot be empty." });
      return;
    }
    // Client-side duplicate check
    const dup = variants.some(
      (v, i) => v.sku.trim() === modalVariant.sku.trim() && i !== editingIndex
    );
    if (dup) {
      setStatusMessage({ type: "error", message: `SKU "${modalVariant.sku}" already exists.` });
      return;
    }

    // Build attributes object
    const attrsObj = modalAttributes.reduce((acc, { key, value }) => {
      if (key) acc[key] = value;
      return acc;
    }, {});

    // Update local list
    const toSave = { ...modalVariant, attributes: attrsObj };
    const next = [...variants];
    if (editingIndex === null) next.push(toSave);
    else next[editingIndex] = toSave;
    syncUp(next);
    setShowModal(false);

    // Persist immediately if in edit mode
    if (isEditMode) {
      setIsSaving(true);
      try {
        const token = localStorage.getItem("accessToken");
        const payload = {
          product_id: productId,
          sku: modalVariant.sku.trim(),
          barcode: modalVariant.barcode,
          unit_name: modalVariant.unit_name,
          model_number: modalVariant.model_number,
          serial_number: modalVariant.serial_number,
          color: modalVariant.color,
          size: modalVariant.size,
          warranty_period:
            modalVariant.warranty_period !== ""
              ? parseInt(modalVariant.warranty_period, 10)
              : null,
          tax_class: modalVariant.tax_class,
          status: modalVariant.status,
          attributes: JSON.stringify(attrsObj),
        };

        if (modalVariant.product_variant_id > 0) {
          await updateQueryData(
            token,
            "product_variants",
            payload,
            { product_variant_id: modalVariant.product_variant_id }
          );
          setStatusMessage({ type: "success", message: "Variant updated successfully! ✨" });
        } else {
          await axios.post(
            `${process.env.REACT_APP_API_URL}/insert/product_variants`,
            payload,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          setStatusMessage({ type: "success", message: "New variant added successfully! ✨" });
        }
      } catch (err) {
        console.error("Error saving variant:", err);
        // Handle duplicate-SKU error from server
        if (err.response?.data?.errno === 1062) {
          setStatusMessage({ type: "error", message: `SKU "${modalVariant.sku}" already exists in the database.` });
        } else {
          setStatusMessage({ type: "error", message: "Failed to save variant." });
        }
      } finally {
        setIsSaving(false);
      }
    }
  };

  // Persist all variants to the server
  const saveAll = async () => {
    if (!productId) {
      setStatusMessage({ type: "error", message: "Please save product info first." });
      return;
    }
    setIsSaving(true);
    setStatusMessage({ type: "", message: "" });

    try {
      const token = localStorage.getItem("accessToken");

      for (const v of variants) {
        const payload = {
          product_id: productId,
          sku: v.sku,
          barcode: v.barcode,
          unit_name: v.unit_name,
          model_number: v.model_number,
          serial_number: v.serial_number,
          color: v.color,
          size: v.size,
          warranty_period: parseInt(v.warranty_period, 10) || null,
          tax_class: v.tax_class,
          status: v.status,
          attributes: JSON.stringify(v.attributes),
        };

        if (v.product_variant_id > 0) {
          await updateQueryData(
            token,
            "product_variants",
            payload,
            { product_variant_id: v.product_variant_id }
          );
        } else {
          await axios.post(
            `${process.env.REACT_APP_API_URL}/insert/product_variants`,
            payload,
            { headers: { Authorization: `Bearer ${token}` } }
          );
        }
      }

      setStatusMessage({ type: "success", message: "✅ Variants saved successfully" });
    } catch (err) {
      console.error("Error saving variants:", err);
      if (err.response?.data?.errno === 1062) {
        setStatusMessage({ type: "error", message: "Duplicate SKU detected during save." });
      } else {
        setStatusMessage({ type: "error", message: "Failed to save variants." });
      }
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      {statusMessage.message && (
        <div className={`alert alert-${statusMessage.type === "success" ? "success" : "danger"}`}>
          {statusMessage.message}
        </div>
      )}

      <div
        className="table-responsive mb-3"
        style={{ maxHeight: "300px", overflowY: "auto" }}
      >
        <table className="table table-striped table-hover table-sm align-middle">
          <thead className="table-dark sticky-top">
            <tr>
              <th style={{ width: "3%" }}>#</th>
              <th style={{ width: "10%" }}>SKU</th>
              <th style={{ width: "10%" }}>Barcode</th>
              <th style={{ width: "8%" }}>Unit</th>
              <th style={{ width: "10%" }}>Model</th>
              <th style={{ width: "10%" }}>Serial</th>
              <th style={{ width: "8%" }}>Color</th>
              <th style={{ width: "5%" }}>Size</th>
              <th style={{ width: "5%" }}>Warranty</th>
              <th style={{ width: "10%" }}>Tax Class</th>
              <th style={{ width: "5%" }}>Status</th>
              <th style={{ width: "6%" }}></th>
            </tr>
          </thead>
          <tbody>
            {variants.map((v, i) => (
              <tr key={i}>
                <td className="text-center">{v.product_variant_id || "-"}</td>
                <td className="text-truncate" style={{ maxWidth: "100px" }}>
                  {v.sku}
                </td>
                <td className="text-truncate" style={{ maxWidth: "120px" }}>
                  {v.barcode}
                </td>
                <td>{v.unit_name}</td>
                <td className="text-truncate" style={{ maxWidth: "120px" }}>
                  {v.model_number}
                </td>
                <td className="text-truncate" style={{ maxWidth: "120px" }}>
                  {v.serial_number}
                </td>
                <td>{v.color}</td>
                <td>{v.size}</td>
                <td>{v.warranty_period}</td>
                <td>{v.tax_class}</td>
                <td>{v.status}</td>
                <td className="text-end">
                  <button type="button"
                    className="btn btn-sm btn-outline-primary me-1"
                    onClick={() => handleEditClick(i)}
                  >
                    <FaRegEdit />
                  </button>
                  <button type="button"
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => handleDelete(i)}
                  >
                    <FaRegTrashAlt />
                  </button>
                </td>
              </tr>
            ))}
            {!variants.length && (
              <tr>
                <td colSpan="12" className="text-center text-muted py-4">
                  No variants yet
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="d-flex justify-content-between mb-3">
        <button type="button" className="btn btn-success" onClick={handleAddClick}>
          ➕ Add Variant
        </button>
      </div>

      {/* Modal */}
      {showModal && (
        <div
          className="modal fade show d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {editingIndex === null ? "Add Variant" : "Edit Variant"}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                />
              </div>
              {/* Prominent error banner */}
              {statusMessage.message && statusMessage.type === "error" && (
                <div className="alert alert-danger m-3 position-sticky top-0 zindex-modal">
                  {statusMessage.message}
                </div>
              )}
              <div className="modal-body">
                <div className="row g-3">
                  {Object.keys(blankVariant(productId))
                    .filter((f) =>
                      !["product_variant_id", "product_id", "attributes"].includes(
                        f
                      )
                    )
                    .map((field) => {
                      if (field === "unit_name") {
                        return (
                          <div className="col-md-6" key={field}>
                            <label className="form-label">Unit Name</label>
                            <input
                              list="unit-list"
                              className="form-control"
                              value={modalVariant.unit_name}
                              onChange={(e) =>
                                setModalVariant({
                                  ...modalVariant,
                                  unit_name: e.target.value,
                                })
                              }
                            />
                            <datalist id="unit-list">
                              {UNIT_OPTIONS.map((u) => (
                                <option key={u} value={u} />
                              ))}
                            </datalist>
                          </div>
                        );
                      }
                      if (field === "color") {
                        return (
                          <div className="col-md-6" key={field}>
                            <label className="form-label">Color</label>
                            <input
                              list="color-list"
                              className="form-control"
                              value={modalVariant.color}
                              onChange={(e) =>
                                setModalVariant({
                                  ...modalVariant,
                                  color: e.target.value,
                                })
                              }
                            />
                            <datalist id="color-list">
                              {COLOR_OPTIONS.map((c) => (
                                <option key={c} value={c} />
                              ))}
                            </datalist>
                          </div>
                        );
                      }
                      if (field === "tax_class") {
                        return (
                          <div className="col-md-6" key={field}>
                            <label className="form-label">Tax Class</label>
                            <input
                              list="taxclass-list"
                              className="form-control"
                              value={modalVariant.tax_class}
                              onChange={(e) =>
                                setModalVariant({
                                  ...modalVariant,
                                  tax_class: e.target.value,
                                })
                              }
                            />
                            <datalist id="taxclass-list">
                              {TAX_CLASS_OPTIONS.map((t) => (
                                <option key={t} value={t} />
                              ))}
                            </datalist>
                          </div>
                        );
                      }
                      if (field === "barcode") {
                        return (
                          <div className="col-md-6" key={field}>
                            <label className="form-label">Barcode</label>
                            <div className="input-group">
                              <input
                                type="text"
                                className="form-control"
                                value={modalVariant.barcode || ""}
                                onChange={(e) =>
                                  setModalVariant({
                                    ...modalVariant,
                                    barcode: e.target.value,
                                  })
                                }
                              />
                              <button
                                type="button"
                                className="btn btn-outline-secondary"
                                onClick={generateRandomBarcode}
                              >
                                Generate
                              </button>
                            </div>
                          </div>
                        );
                      }
                      if (field === "status") {
                        return (
                          <div className="col-md-6" key={field}>
                            <label className="form-label">Status</label>
                            <select
                              className="form-select"
                              value={modalVariant.status}
                              onChange={(e) =>
                                setModalVariant({
                                  ...modalVariant,
                                  status: e.target.value,
                                })
                              }
                            >
                              <option value="active">active</option>
                              <option value="inactive">inactive</option>
                            </select>
                          </div>
                        );
                      }
                      if (field === "warranty_period") {
                        return (
                          <div className="col-md-6" key={field}>
                            <label className="form-label">Warranty Period</label>
                            <div className="input-group">
                              <input
                                type="number"
                                className="form-control"
                                value={modalVariant.warranty_period || ""}
                                onChange={(e) => {
                                  const value = e.target.value;
                                  setModalVariant({ ...modalVariant, warranty_period: value });
                                }}
                                min="0"
                              />
                              <select
                                className="form-select"
                                value={warrantyUnit}
                                onChange={(e) => setWarrantyUnit(e.target.value)}
                              >
                                <option value="days">Days</option>
                                <option value="weeks">Weeks</option>
                                <option value="months">Months</option>
                                <option value="years">Years</option>
                              </select>
                            </div>
                          </div>
                        );
                      }
                      const type = field === "warranty_period" ? "number" : "text";
                      return (
                        <div className="col-md-6" key={field}>
                          <label className="form-label">
                            {field.replace(/_/g, " ").replace(/\b\w/g, (l) =>
                              l.toUpperCase()
                            )}
                          </label>
                          <input
                            type={type}
                            className="form-control"
                            value={modalVariant[field] || ""}
                            onChange={(e) =>
                              setModalVariant({
                                ...modalVariant,
                                [field]:
                                  field === "warranty_period"
                                    ? e.target.value.replace(/\D/, "")
                                    : e.target.value,
                              })
                            }
                          />
                        </div>
                      );
                    })}

                  {/* Additional Attributes */}
                  <div className="col-12 mt-4">
                    <h6>Additional Attributes</h6>
                    {modalAttributes.map((attr, idx) => (
                      <div className="row g-2 align-items-center mb-2" key={idx}>
                        <div className="col-md-5">
                          <input
                            className="form-control"
                            placeholder="Attribute Key"
                            value={attr.key}
                            onChange={(e) => {
                              const copy = [...modalAttributes];
                              copy[idx].key = e.target.value;
                              setModalAttributes(copy);
                            }} />
                        </div>
                        <div className="col-md-5">
                          <input
                            className="form-control"
                            placeholder="Attribute Value"
                            value={attr.value}
                            onChange={(e) => {
                              const copy = [...modalAttributes];
                              copy[idx].value = e.target.value;
                              setModalAttributes(copy);
                            }} />
                        </div>
                        <div className="col-md-2 text-end">
                          <button
                            type="button"
                            className="btn btn-outline-danger btn-sm"
                            onClick={() => {
                              const copy = modalAttributes.filter((_, i) => i !== idx);
                              setModalAttributes(copy);
                            }}
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ))}
                    <button
                      type="button"
                      className="btn btn-link p-0"
                      onClick={() =>
                        setModalAttributes([...modalAttributes, { key: "", value: "" }])
                      }
                    >
                      ➕ Add Attribute
                    </button>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button className="btn btn-primary" onClick={handleModalSave}>
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default VariantsTab;