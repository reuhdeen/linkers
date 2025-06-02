import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { decodeBase64 } from "../api/decodeBase64";

import { CustomDropdown } from "../api/CustomDropdown";
import {fetchQueryData } from "../api/fetchData";
import "../css/forms.css";

const AddRetailProduct = () => {
  const [selectedVariantId, setSelectedVariantId] = useState("");
  const [variants, setVariants] = useState([]);
  const [formData, setFormData] = useState({
    base_cost: "",
    retail_price: "",
    promo_price: "",
    margin_price: "",
    vat_tax: "",
    final_price: "",
  });

  const navigate = useNavigate();

useEffect(() => {
  const fetchVariants = async () => {
    const token = localStorage.getItem("accessToken");
    if (!token) return;

    const data = await fetchQueryData(token, {
        columns:
            `MAX(p.product_id) AS product_id,
  MAX(p.name) AS product_name,
  pv.product_variant_id,
  MAX(pv.sku) AS variant_sku,
  GROUP_CONCAT(CONCAT(a.attribute_name, ': ', av.value) SEPARATOR ', ') AS attributes,
  MAX(i.inventory_id) AS inventory_id,
  MAX(i.warehouse_id) AS warehouse_id,
  MAX(w.name) AS WName,
  MAX(i.inventory_type_id) AS inventory_type_id,
  MAX(it.name) AS inventory_type_name,
  MAX(i.quantity_in_stock) AS quantity_in_stock,
  MAX(i.reorder_level) AS reorder_level,
  MAX(i.batch_number) AS batch_number,
  MAX(i.expiration_date) AS expiration_date,
  MAX(i.storage_zone) AS storage_zone,
    MAX(sp.name) AS supplier`,
          table:
            `products p 
INNER JOIN product_variants pv ON p.product_id = pv.product_id 
INNER JOIN suppliers sp ON sp.supplier_id = p.supplier_id 
LEFT JOIN variant_attributes va ON pv.product_variant_id = va.product_variant_id 
LEFT JOIN attribute_values av ON va.attribute_value_id = av.attribute_value_id 
LEFT JOIN attributes a ON av.attribute_id = a.attribute_id 
INNER JOIN inventory i ON pv.product_variant_id = i.product_variant_id 
INNER JOIN warehouses w ON i.warehouse_id = w.warehouse_id 
INNER JOIN inventory_type it ON i.inventory_type_id = it.inventory_type_id
GROUP BY pv.product_variant_id`,

    });

    setVariants(data);
  };

  fetchVariants();
}, []);


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  if (!selectedVariantId) {
    alert("Please select a product variant.");
    return;
  }

  const payload = {
    product_variant_id: selectedVariantId,
    base_cost: parseFloat(formData.base_cost),
    retail_price: parseFloat(formData.retail_price),
    promo_price: parseFloat(formData.promo_price),
    margin_price: parseFloat(formData.margin_price),
    vat_tax: parseFloat(formData.vat_tax),
    final_price: parseFloat(formData.final_price),
  };

  try {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      throw new Error("No token found");
    }

    const response = await axios.post(
      `${process.env.REACT_APP_API_URL}/insert/retail_products`, // 👈 correct endpoint
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("Retail product added:", response.data);
    alert("Retail product added successfully!");
    navigate("/products");
  } catch (error) {
    console.error(
      "Error adding retail product:",
      error.response ? error.response.data : error.message
    );
    alert(`Error: ${error.response ? error.response.data : error.message}`);
  }
};


  return (
    <div className="container-fluid">
                  <div className="card p-3 h-100">
      <h3>Add Retail Product Pricing</h3>
      <form onSubmit={handleSubmit} className="form-card p-3 shadow-sm">
        <label>Select Product Variant</label>
        <select
          className="form-control mb-3"
          value={selectedVariantId}
          onChange={(e) => setSelectedVariantId(e.target.value)}
        >
          <option value="">-- Select Variant --</option>
          {variants.map((v) => (
            <option key={v.product_variant_id} value={v.product_variant_id}>
              {decodeBase64(v.product_name)} - {v.sku} {decodeBase64(v.attributes)}
            </option>
          ))}
        </select>

        <div className="row">
          {[
            "base_cost",
            "retail_price",
            "promo_price",
            "margin_price",
            "vat_tax",
            "final_price",
          ].map((field) => (
            <div className="col-md-6 mb-3" key={field}>
              <label className="form-label text-capitalize">{field.replace(/_/g, " ")}</label>
              <input
                type="number"
                step="0.01"
                name={field}
                value={formData[field]}
                onChange={handleInputChange}
                className="form-control"
                required
              />
            </div>
          ))}
        </div>

        <button type="submit" className="btn btn-success mt-3">
          Save Retail Product
        </button>
      </form>
      </div>
    </div>
  );
};

export default AddRetailProduct;
