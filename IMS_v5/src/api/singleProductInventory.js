import React from "react";
import { decodeBase64 } from "../api/decodeBase64";
import {
  FaCaretUp,
  FaCaretDown,
  FaChevronLeft,
  FaChevronRight,
  FaEdit,
  FaRegEye,
  FaRegTrashAlt,
} from "react-icons/fa";
const ProductInventory = ({ inventory }) => {
  if (!inventory || inventory.length === 0) return null;

  // Group inventory by product_id and variant_sku
  const groupedInventory = {};

  inventory.forEach((item) => {
    const {
      product_id,
      variant_sku,
      attribute_name,
      attribute_value,
      quantity_in_stock,
      reorder_level,
      batch_number,
      expiration_date,
      storage_zone,
    } = item;

    if (!groupedInventory[product_id]) {
      groupedInventory[product_id] = {};
    }

    if (!groupedInventory[product_id][variant_sku]) {
      groupedInventory[product_id][variant_sku] = {
        variant_sku,
        attributes: [],
        quantity_in_stock,
        reorder_level,
        batch_number,
        expiration_date,
        storage_zone,
      };
    }

    // Avoid duplicate attributes
    groupedInventory[product_id][variant_sku].attributes.push({
      attribute_name,
      attribute_value,
    });
  });

  return (
    <div>
      {Object.entries(groupedInventory).map(([productId, variants]) =>
        Object.entries(variants).map(([variantSku, variant]) => (
          <div key={`${productId}-${variantSku}`} className="mb-4">
<h4 className="d-flex align-items-center">
  <span className="me-2">SKU: {decodeBase64(variant.variant_sku)}</span>
  <FaEdit className="edit-icon" size={12} style={{ cursor: "pointer" }} />
</h4>
            <table className="table table-bordered table-sm">
              <tbody>
                <tr>
                  <td><strong>Attributes</strong></td>
                  <td>
                    {variant.attributes.map((attr, index) => (
                      <div key={index}>
                        {decodeBase64(attr.attribute_name)}: {decodeBase64(attr.attribute_value)}
                      </div>
                    ))}
                  </td>
                </tr>
                <tr>
                  <td><strong>Quantity in Stock</strong></td>
                  <td>{decodeBase64(variant.quantity_in_stock)}</td>
                </tr>
                <tr>
                  <td><strong>Reorder Level</strong></td>
                  <td>{decodeBase64(variant.reorder_level)}</td>
                </tr>
                <tr>
                  <td><strong>Batch Number</strong></td>
                  <td>{decodeBase64(variant.batch_number)}</td>
                </tr>
                <tr>
                  <td><strong>Expiration Date</strong></td>
                  <td>{decodeBase64(variant.expiration_date)}</td>
                </tr>
                <tr>
                  <td><strong>Storage Zone</strong></td>
                  <td>{decodeBase64(variant.storage_zone)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        ))
      )}
    </div>
  );
};

export default ProductInventory;
