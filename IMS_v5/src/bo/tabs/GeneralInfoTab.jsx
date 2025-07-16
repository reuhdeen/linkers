import React, { useState, useEffect } from "react";
import axios from "axios";
import { fetchQueryData } from "../../api/fetchData";
import { decodeBase64 } from "../../utils/decode";
import { updateQueryData } from "../../api/updateData";

const GeneralInfoTab = ({ data = {}, onChange, isEditMode = false }) => {
  const [suppliers, setSuppliers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) return;
    (async () => {
      try {
        const [sData, cData, bData] = await Promise.all([
          fetchQueryData(token, {
            table: "suppliers",
            columns: "*",
            order: "name ASC",
          }),
          fetchQueryData(token, {
            table: "categories",
            columns: "*",
            order: "name ASC",
          }),
          fetchQueryData(token, {
            table: "brands",
            columns: "*",
            order: "brand_name ASC",
          }),
        ]);

        setSuppliers(sData.map((s) => ({ ...s, name: decodeBase64(s.name) })));
        setCategories(cData.map((c) => ({ ...c, name: decodeBase64(c.name) })));
        setBrands(bData.map((b) => ({ ...b, brand_name: decodeBase64(b.brand_name) })));
      } catch (err) {
        console.error("Dropdown fetch error:", err);
      }
    })();
  }, []);

  const handleChange = (key, value) => {
    onChange({ ...data, [key]: value });
  };

  const handleSaveGeneralInfo = async () => {
  const token = localStorage.getItem("accessToken");
  if (!token) {
    alert("❌ No access token");
    return;
  }

  const values = {
    name: data.name || "",
    brand_id: data.brand_id || "",
    supplier_id: data.supplier_id || "",
    category_id: data.category_id || "",
    description: data.description || "",
    slug: data.slug || data.name?.toLowerCase().replace(/\s+/g, "-") || "",
    visibility: data.visibility || "public", // not encoded anymore
    is_featured: data.is_featured === 1 ? 1 : 0,
  };

  console.log("🧾 Save payload values:", values);

  try {
    if (isEditMode) {
      await updateQueryData(
        token,
        "products",
        values,
        { product_id: parseInt(data.product_id, 10) }
      );
      alert("✅ Product info updated");
    } else {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/insert/products`,
        values,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const newId = response.data?.id;
      if (!newId) throw new Error("No ID returned after insert");

      alert("✅ Product created");

      // 🔧 Update formState.product with the new product_id
      onChange({ ...data, product_id: newId });
    }
  } catch (err) {
    console.error(
      "❌ Save failed:",
      err.response?.status,
      err.response?.data || err.message
    );
    alert("❌ Unable to save product data.");
  }
};

  const decodedVisibility = decodeBase64(data.visibility) || "public";

  return (
    <div className="card mb-4">
      <div className="card-body">
        <div className="row gy-3">
          {data.product_id && (
            <div className="col-md-6">
              <label className="form-label">Product ID</label>
              <input
                type="text"
                className="form-control"
                value={data.product_id}
                readOnly
              />
            </div>
          )}

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
            <label className="form-label">Brand</label>
            <select
              className="form-select"
              value={data.brand_id || ""}
              onChange={(e) => handleChange("brand_id", e.target.value)}
            >
              <option value="">Select brand</option>
              {brands.map((b) => (
                <option key={b.brand_id} value={b.brand_id}>
                  {b.brand_name}
                </option>
              ))}
            </select>
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
              value={decodedVisibility}
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
                onChange={(e) =>
                  handleChange("is_featured", e.target.checked ? 1 : 0)
                }
                id="is_featured"
              />
              <label className="form-check-label" htmlFor="is_featured">
                Featured Product
              </label>
            </div>
          </div>
        </div>

        <div className="text-end mt-4">
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleSaveGeneralInfo}
          >
            {isEditMode ? "Update Product Info" : "Save Product Info"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default GeneralInfoTab;