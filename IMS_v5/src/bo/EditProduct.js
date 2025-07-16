import React, { useState, useEffect } from "react";
import { fetchQueryData } from "../api/fetchData";

const GeneralInfoTab = ({ data, onChange }) => {
  const [suppliers, setSuppliers] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const loadDropdowns = async () => {
      try {
        const supplierData = await fetchQueryData("suppliers");
        const categoryData = await fetchQueryData("categories");
        setSuppliers(supplierData);
        setCategories(categoryData);
      } catch (err) {
        console.error("Failed to fetch dropdowns:", err);
      }
    };

    loadDropdowns();
  }, []);

  const handleChange = (key, value) => {
    onChange({ ...data, [key]: value });
  };

  return (
    <div className="row gy-3">
      <div className="col-md-6">
        <label className="form-label">Product Name</label>
        <input
          type="text"
          className="form-control"
          value={data.name || ""}
          onChange={(e) => handleChange("name", e.target.value)}
          placeholder="Enter product name"
        />
      </div>

      <div className="col-md-6">
        <label className="form-label">Brand Name</label>
        <input
          type="text"
          className="form-control"
          value={data.brand_name || ""}
          onChange={(e) => handleChange("brand_name", e.target.value)}
          placeholder="Enter brand name"
        />
      </div>

      <div className="col-md-6">
        <label className="form-label">Supplier</label>
        <select
          className="form-select"
          value={data.supplier_id || ""}
          onChange={(e) => handleChange("supplier_id", e.target.value)}
        >
          <option value="">Select supplier</option>
          {suppliers.map((s) => (
            <option key={s.supplier_id} value={s.supplier_id}>
              {s.name}
            </option>
          ))}
        </select>
      </div>

      <div className="col-md-6">
        <label className="form-label">Category</label>
        <select
          className="form-select"
          value={data.category_id || ""}
          onChange={(e) => handleChange("category_id", e.target.value)}
        >
          <option value="">Select category</option>
          {categories.map((c) => (
            <option key={c.category_id} value={c.category_id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      <div className="col-md-12">
        <label className="form-label">Description</label>
        <textarea
          className="form-control"
          rows="4"
          value={data.description || ""}
          onChange={(e) => handleChange("description", e.target.value)}
          placeholder="Describe the product"
        />
      </div>

      <div className="col-md-6">
        <label className="form-label">Slug</label>
        <input
          type="text"
          className="form-control"
          value={data.slug || ""}
          onChange={(e) => handleChange("slug", e.target.value)}
          placeholder="product-name-url"
        />
      </div>

      <div className="col-md-6">
        <label className="form-label">Visibility</label>
        <select
          className="form-select"
          value={data.visibility || "public"}
          onChange={(e) => handleChange("visibility", e.target.value)}
        >
          <option value="public">Public</option>
          <option value="private">Private</option>
          <option value="archived">Archived</option>
        </select>
      </div>

      <div className="col-md-6">
        <div className="form-check mt-3">
          <input
            className="form-check-input"
            type="checkbox"
            checked={!!data.is_featured}
            onChange={(e) => handleChange("is_featured", e.target.checked ? 1 : 0)}
            id="is_featured"
          />
          <label className="form-check-label" htmlFor="is_featured">
            Featured Product
          </label>
        </div>
      </div>
    </div>
  );
};

export default GeneralInfoTab;