import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { decodeBase64 } from "../api/decodeBase64";

import { CustomDropdown } from "../api/CustomDropdown"; // Assuming this is still needed elsewhere
import { fetchQueryData } from "../api/fetchData";
import "../css/forms.css";

const AddRetailProduct = () => {
  const [selectedVariantId, setSelectedVariantId] = useState("");
  const [variants, setVariants] = useState([]);
  const [formData, setFormData] = useState({
    base_cost: "",
    retail_price: "",
    promo_percentage: "", // New: Input for promo percentage
    promo_start_date: "", // New: Promo start date
    promo_end_date: "", // New: Promo end date
    is_taxable: false, // New: Checkbox for VAT
    wholesale_prices: [{ quantity: "", amount: "" }], // New: Array for wholesale tiers
  });

  // Derived states (calculated values, not directly input by user)
  const [promoPrice, setPromoPrice] = useState("");
  const [marginPrice, setMarginPrice] = useState("");
  const [finalPrice, setFinalPrice] = useState("");

  const navigate = useNavigate();

  // Define a constant for VAT rate (you might fetch this from a global setting)
  const VAT_RATE = 0.12; // Example: 12% VAT

  useEffect(() => {
    const fetchVariants = async () => {
      const token = localStorage.getItem("accessToken");
      if (!token) return;

      const data = await fetchQueryData(token, {
        columns: `
          MAX(p.product_id) AS product_id,
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
          MAX(sp.name) AS supplier
        `,
        table: `
          products p
          INNER JOIN product_variants pv ON p.product_id = pv.product_id
          INNER JOIN suppliers sp ON sp.supplier_id = p.supplier_id
          LEFT JOIN variant_attributes va ON pv.product_variant_id = va.product_variant_id
          LEFT JOIN attribute_values av ON va.attribute_value_id = av.attribute_value_id
          LEFT JOIN attributes a ON av.attribute_id = a.attribute_id
          INNER JOIN inventory i ON pv.product_variant_id = i.product_variant_id
          INNER JOIN warehouses w ON i.warehouse_id = w.warehouse_id
          INNER JOIN inventory_type it ON i.inventory_type_id = it.inventory_type_id
          GROUP BY pv.product_variant_id
        `,
      });
      setVariants(data);
    };
    fetchVariants();
  }, []);

  // Effect to calculate derived prices whenever relevant inputs change
  useEffect(() => {
    const retail = parseFloat(formData.retail_price);
    const base = parseFloat(formData.base_cost);
    const promoPct = parseFloat(formData.promo_percentage);
    const isTaxable = formData.is_taxable;

    // Calculate Margin Price
    if (!isNaN(retail) && !isNaN(base) && retail > 0) {
      setMarginPrice(((retail - base) / retail) * 100);
    } else {
      setMarginPrice("");
    }

    // Calculate Promo Price
    if (!isNaN(retail) && !isNaN(promoPct) && promoPct >= 0 && promoPct <= 100) {
      const calculatedPromo = retail * (1 - promoPct / 100);
      setPromoPrice(calculatedPromo.toFixed(2));
    } else {
      setPromoPrice("");
    }

    // Calculate Final Price
    const now = new Date();
    const promoStartDate = formData.promo_start_date ? new Date(formData.promo_start_date) : null;
    const promoEndDate = formData.promo_end_date ? new Date(formData.promo_end_date) : null;

    let effectivePrice = retail; // Start with retail price

    // Check if promo is active
    if (
      promoPrice &&
      !isNaN(parseFloat(promoPrice)) &&
      promoStartDate &&
      promoEndDate &&
      now >= promoStartDate &&
      now <= promoEndDate
    ) {
      effectivePrice = parseFloat(promoPrice);
    }

    // Apply VAT if taxable
    if (isTaxable && !isNaN(effectivePrice)) {
      setFinalPrice((effectivePrice * (1 + VAT_RATE)).toFixed(2));
    } else if (!isNaN(effectivePrice)) {
      setFinalPrice(effectivePrice.toFixed(2));
    } else {
      setFinalPrice("");
    }
  }, [
    formData.retail_price,
    formData.base_cost,
    formData.promo_percentage,
    formData.promo_start_date,
    formData.promo_end_date,
    formData.is_taxable,
    promoPrice, // Include promoPrice in dependency array to react to its change
  ]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleWholeSaleChange = (index, e) => {
    const { name, value } = e.target;
    const newWholesalePrices = [...formData.wholesale_prices];
    newWholesalePrices[index][name] = value;
    setFormData((prev) => ({
      ...prev,
      wholesale_prices: newWholesalePrices,
    }));
  };

  const addWholesaleTier = () => {
    setFormData((prev) => ({
      ...prev,
      wholesale_prices: [...prev.wholesale_prices, { quantity: "", amount: "" }],
    }));
  };

  const removeWholesaleTier = (index) => {
    const newWholesalePrices = formData.wholesale_prices.filter((_, i) => i !== index);
    setFormData((prev) => ({
      ...prev,
      wholesale_prices: newWholesalePrices,
    }));
  };

const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedVariantId) {
      alert("Please select a product variant.");
      return;
    }

    // Filter out empty tiers and map to correct format
    const filteredWholesalePrices = formData.wholesale_prices
      .filter(tier => tier.quantity && tier.amount)
      .map(tier => ({
        quantity: parseInt(tier.quantity),
        amount: parseFloat(tier.amount)
      }));

    // Prepare payload, including calculated fields and new fields
    const payload = {
      product_variant_id: selectedVariantId,
      base_cost: parseFloat(formData.base_cost) || 0,
      retail_price: parseFloat(formData.retail_price) || 0,
      promo_percentage: parseFloat(formData.promo_percentage) || 0,
      promo_start_date: formData.promo_start_date || null,
      promo_end_date: formData.promo_end_date || null,
      is_taxable: formData.is_taxable,
      promo_price: parseFloat(promoPrice) || 0,
      margin_price: parseFloat(marginPrice) || 0,
      final_price: parseFloat(finalPrice) || 0,
      wholesale_prices: JSON.stringify(filteredWholesalePrices), // Convert to JSON string
    };

    console.log("Submitting payload:", payload);

    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        throw new Error("No token found");
      }

      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/insert/retail_products`,
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
          <label className="form-label">Select Product Variant</label>
          <select
            className="form-control mb-3"
            value={selectedVariantId}
            onChange={(e) => setSelectedVariantId(e.target.value)}
            required
          >
            <option value="">-- Select Variant --</option>
            {variants.map((v) => (
              <option key={v.product_variant_id} value={v.product_variant_id}>
                {decodeBase64(v.product_name)} - {v.sku} {decodeBase64(v.attributes)}
              </option>
            ))}
          </select>

          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label">Base Cost</label>
              <input
                type="number"
                step="0.01"
                name="base_cost"
                value={formData.base_cost}
                onChange={handleInputChange}
                className="form-control"
                required
              />
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label">Retail Price (SRP)</label>
              <input
                type="number"
                step="0.01"
                name="retail_price"
                value={formData.retail_price}
                onChange={handleInputChange}
                className="form-control"
                required
              />
            </div>

            {/* VAT Checkbox */}
            <div className="col-md-12 mb-3">
              <div className="form-check">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id="isTaxable"
                  name="is_taxable"
                  checked={formData.is_taxable}
                  onChange={handleInputChange}
                />
                <label className="form-check-label" htmlFor="isTaxable">
                  Apply VAT ({VAT_RATE * 100}%)
                </label>
              </div>
            </div>

            {/* Promo Price Inputs */}
            <div className="col-md-4 mb-3">
              <label className="form-label">Promo Percentage (%)</label>
              <input
                type="number"
                step="0.01"
                name="promo_percentage"
                value={formData.promo_percentage}
                onChange={handleInputChange}
                className="form-control"
                min="0"
                max="100"
              />
            </div>
            <div className="col-md-4 mb-3">
              <label className="form-label">Promo Start Date</label>
              <input
                type="date"
                name="promo_start_date"
                value={formData.promo_start_date}
                onChange={handleInputChange}
                className="form-control"
              />
            </div>
            <div className="col-md-4 mb-3">
              <label className="form-label">Promo End Date</label>
              <input
                type="date"
                name="promo_end_date"
                value={formData.promo_end_date}
                onChange={handleInputChange}
                className="form-control"
              />
            </div>

            {/* Display Calculated Prices */}
            <div className="col-md-4 mb-3">
              <label className="form-label">Calculated Promo Price</label>
              <input
                type="text"
                className="form-control"
                value={promoPrice ? `₱ ${promoPrice}` : "N/A"}
                readOnly
                disabled
              />
            </div>
            <div className="col-md-4 mb-3">
              <label className="form-label">Calculated Margin (%)</label>
              <input
                type="text"
                className="form-control"
                value={marginPrice ? `${marginPrice.toFixed(2)} %` : "N/A"}
                readOnly
                disabled
              />
            </div>
            <div className="col-md-4 mb-3">
              <label className="form-label">Final Price</label>
              <input
                type="text"
                className="form-control"
                value={finalPrice ? `₱ ${finalPrice}` : "N/A"}
                readOnly
                disabled
              />
            </div>
          </div>

          <hr />

          {/* Wholesale Pricing */}
          <h4>Wholesale Pricing Tiers</h4>
          {formData.wholesale_prices.map((tier, index) => (
            <div className="row mb-2" key={index}>
              <div className="col-md-5">
                <label className="form-label">Min Quantity</label>
                <input
                  type="number"
                  name="quantity"
                  value={tier.quantity}
                  onChange={(e) => handleWholeSaleChange(index, e)}
                  className="form-control"
                  placeholder="e.g., 100"
                  min="1"
                />
              </div>
              <div className="col-md-5">
                <label className="form-label">Price per Unit</label>
                <input
                  type="number"
                  step="0.01"
                  name="amount"
                  value={tier.amount}
                  onChange={(e) => handleWholeSaleChange(index, e)}
                  className="form-control"
                  placeholder="e.g., 5.00"
                  min="0.01"
                />
              </div>
              <div className="col-md-2 d-flex align-items-end">
                <button
                  type="button"
                  className="btn btn-danger w-100"
                  onClick={() => removeWholesaleTier(index)}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
          <button type="button" className="btn btn-secondary mt-2" onClick={addWholesaleTier}>
            Add Wholesale Tier
          </button>

          <button type="submit" className="btn btn-success mt-3 w-100">
            Save Retail Product Pricing
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddRetailProduct;