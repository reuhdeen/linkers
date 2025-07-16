// src/bo/tabs/AttributesTab.jsx

import React, { useState, useEffect } from "react";
import axios from "axios";
import { updateQueryData } from "../../api/updateData";

const AttributesTab = ({ data = [], onChange, isEditMode = false, productId }) => {
  const [attributes, setAttributes] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    setAttributes(data?.length ? data : []);
  }, [data]);

  const handleAttributeChange = (index, key, value) => {
    const updated = [...attributes];
    updated[index] = { ...updated[index], [key]: value };
    setAttributes(updated);
    onChange(updated);
  };

  const handleAddAttribute = () => {
    setAttributes([...attributes, { key: "", value: "" }]);
  };

  const handleDeleteAttribute = (index) => {
    const updated = attributes.filter((_, i) => i !== index);
    setAttributes(updated);
    onChange(updated);
  };

  const handleSaveAttributes = async () => {
    if (!isEditMode || !productId) {
      setErrorMessage("❌ Product must be created before saving attributes.");
      return;
    }

    setIsSaving(true);
    setErrorMessage("");

    try {
      const token = localStorage.getItem("accessToken");
      if (!token) throw new Error("Missing access token");

      await updateQueryData(
        token,
        "products",
        { attributes: JSON.stringify(attributes) },
        { product_id: productId }
      );

      alert("✅ Attributes saved successfully");
    } catch (err) {
      console.error("Attribute save failed:", err.response?.data || err.message);
      setErrorMessage("❌ Failed to save attributes.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="card mb-4">
      <div className="card-body">
        <h5 className="mb-4">Product Attributes</h5>

        {attributes.map((attr, index) => (
          <div className="row mb-2" key={index}>
            <div className="col-md-5">
              <input
                type="text"
                className="form-control"
                placeholder="Attribute Key"
                value={attr.key}
                onChange={(e) => handleAttributeChange(index, "key", e.target.value)}
              />
            </div>
            <div className="col-md-5">
              <input
                type="text"
                className="form-control"
                placeholder="Attribute Value"
                value={attr.value}
                onChange={(e) => handleAttributeChange(index, "value", e.target.value)}
              />
            </div>
            <div className="col-md-2">
              <button
                type="button"
                className="btn btn-outline-danger w-100"
                onClick={() => handleDeleteAttribute(index)}
              >
                🗑 Remove
              </button>
            </div>
          </div>
        ))}

        <div className="d-flex justify-content-between mt-4">
          <button
            type="button"
            className="btn btn-success"
            onClick={handleAddAttribute}
          >
            ➕ Add Attribute
          </button>

          <button
            type="button"
            className="btn btn-primary"
            onClick={handleSaveAttributes}
            disabled={isSaving || !isEditMode}
          >
            {isSaving ? "Saving..." : "Save Attributes"}
          </button>
        </div>

        {errorMessage && (
          <div className="text-danger mt-3">{errorMessage}</div>
        )}
      </div>
    </div>
  );
};

export default AttributesTab;