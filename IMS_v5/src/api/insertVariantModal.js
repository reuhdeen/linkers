import React, { useState } from "react";
import "../css/modal.css";
import { CustomDropdown } from "../api/CustomDropdown";

const AddVariantModal = ({ isOpen, onClose, title }) => {
  const [formData, setFormData] = useState({
    product_id: "",
    sku: "",
    quantity_in_stock: "",
    reorder_level: "",
    batch_number: "",
    expiration_date: "",
    storage_zone: "",
    warehouse_id: "",
    inventory_type_id: "",
    // New pricing fields:
    base_cost: "",
    retail_price: "",
    promo_price: "",
    markup_percentage: "",
    promo_discount_price: "",
  });

  const [attributes, setAttributes] = useState([
    { attribute_id: "", attribute_value_id: "", attribute_name: "", value: "" },
  ]);

  if (!isOpen) return null;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAttributeChange = (index, e) => {
    const selectedId = e.target.value;
    const selectedName = e.target.options[e.target.selectedIndex].text;

    const updated = [...attributes];
    updated[index].attribute_id = selectedId;
    updated[index].attribute_name = selectedName;
    updated[index].attribute_value_id = "";
    updated[index].attribute_value_name = "";
    setAttributes(updated);
  };

  const handleAttributeValueChange = (index, e) => {
    const selectedId = e.target.value;
    const selectedName = e.target.options[e.target.selectedIndex].text;

    const updated = [...attributes];
    updated[index].attribute_value_id = selectedId;
    updated[index].attribute_value_name = selectedName;
    setAttributes(updated);
  };

  const addAttributeField = () => {
    setAttributes([
      ...attributes,
      {
        attribute_id: "",
        attribute_value_id: "",
        attribute_name: "",
        value: "",
      },
    ]);
  };

  const removeAttribute = (index) => {
    const updated = attributes.filter((_, i) => i !== index);
    setAttributes(updated);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-button" onClick={onClose}>
          &times;
        </button>
        <h3>{title || "Add Product Variant"}</h3>
        <form>
  <div className="row">
    {/* Product & SKU */}
    <div className="col-md-6 mb-3">
      <label>Product</label>
      <CustomDropdown
        endpoint="products"
        name="product_id"
        value={formData.product_id}
        onChange={handleInputChange}
        idField="product_id"
        nameField="name"
        showAllOption={false}
        required
      />
    </div>
    <div className="col-md-6 mb-3">
      <label>SKU</label>
      <input
        className="form-control"
        name="sku"
        value={formData.sku}
        onChange={handleInputChange}
        required
      />
    </div>

    {/* Attributes Section (Full Width) */}
    <div className="col-12 mb-3">
      <label>Attributes</label>
      {attributes.map((attr, index) => (
        <div key={index} className="d-flex gap-2 mb-2">
          <CustomDropdown
            endpoint="attributes"
            name="attribute_id"
            value={attr.attribute_id}
            onChange={(e) => handleAttributeChange(index, e)}
            idField="attribute_id"
            nameField="attribute_name"
          />
          <CustomDropdown
            endpoint="attribute_values"
            name="attribute_value_id"
            value={attr.attribute_value_id}
            onChange={(e) => handleAttributeValueChange(index, e)}
            idField="attribute_value_id"
            nameField="value"
          />
        </div>
      ))}
      <button type="button" className="btn btn-sm btn-secondary" onClick={addAttributeField}>
        + Add Attribute
      </button>
    </div>

    {attributes.some((attr) => attr.attribute_id && attr.attribute_value_id) && (
      <div className="col-12 form-control attribute-field mb-3">
        {attributes.map(
          (attr, index) =>
            attr.attribute_id &&
            attr.attribute_value_id && (
              <div className="attribute-value" key={index}>
                <span className="muted-text">
                  {attr.attribute_name}: {attr.attribute_value_name}
                </span>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => removeAttribute(index)}
                  style={{ marginLeft: "10px", fontSize: "0.8rem" }}
                />
              </div>
            )
        )}
      </div>
    )}

    {/* Warehouse & Inventory Type */}
    <div className="col-md-6 mb-3">
      <label>Warehouse</label>
      <CustomDropdown
        endpoint="warehouses"
        name="warehouse_id"
        value={formData.warehouse_id}
        onChange={handleInputChange}
        idField="warehouse_id"
        nameField="name"
        showAllOption={false}
        required
      />
    </div>
    <div className="col-md-6 mb-3">
      <label>Inventory Type</label>
      <CustomDropdown
        endpoint="inventory_type"
        name="inventory_type_id"
        value={formData.inventory_type_id}
        onChange={handleInputChange}
        idField="inventory_type_id"
        nameField="name"
        showAllOption={false}
        required
      />
    </div>

    {/* Quantity & Reorder */}
    <div className="col-md-6 mb-3">
      <label>Quantity In Stock</label>
      <input
        type="number"
        className="form-control"
        name="quantity_in_stock"
        value={formData.quantity_in_stock}
        onChange={handleInputChange}
        required
      />
    </div>
    <div className="col-md-6 mb-3">
      <label>Reorder Level</label>
      <input
        type="number"
        className="form-control"
        name="reorder_level"
        value={formData.reorder_level}
        onChange={handleInputChange}
      />
    </div>

    {/* Batch Number & Expiration */}
    <div className="col-md-6 mb-3">
      <label>Batch Number</label>
      <input
        className="form-control"
        name="batch_number"
        value={formData.batch_number}
        onChange={handleInputChange}
      />
    </div>
    <div className="col-md-6 mb-3">
      <label>Expiration Date</label>
      <input
        type="date"
        className="form-control"
        name="expiration_date"
        value={formData.expiration_date}
        onChange={handleInputChange}
      />
    </div>

    {/* Storage Zone (Full Width if needed) */}
    <div className="col-12 mb-3">
      <label>Storage Zone</label>
      <input
        className="form-control"
        name="storage_zone"
        value={formData.storage_zone}
        onChange={handleInputChange}
      />
    </div>

    {/* Pricing Section */}
    <div className="col-md-6 mb-3">
      <label>Base Cost</label>
      <input
        type="number"
        className="form-control"
        name="base_cost"
        value={formData.base_cost}
        onChange={handleInputChange}
      />
    </div>
    <div className="col-md-6 mb-3">
      <label>Retail Price</label>
      <input
        type="number"
        className="form-control"
        name="retail_price"
        value={formData.retail_price}
        onChange={handleInputChange}
      />
    </div>
    <div className="col-md-6 mb-3">
      <label>Markup %</label>
      <input
        type="number"
        className="form-control"
        name="markup_percentage"
        value={formData.markup_percentage}
        onChange={handleInputChange}
      />
    </div>
    <div className="col-md-6 mb-3">
      <label>Promo Price</label>
      <input
        type="number"
        className="form-control"
        name="promo_price"
        value={formData.promo_price}
        onChange={handleInputChange}
      />
    </div>
    <div className="col-12 mb-3">
      <label>Promo Discount Price</label>
      <input
        type="number"
        className="form-control"
        name="promo_discount_price"
        value={formData.promo_discount_price}
        onChange={handleInputChange}
      />
    </div>
  </div>

  <button type="submit" className="btn btn-primary mt-2">
    Save Variant
  </button>
</form>

      </div>
    </div>
  );
};

export default AddVariantModal;
