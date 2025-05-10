// ProductDetails.js

import React from "react";
import { decodeBase64 } from "../api/decodeBase64";

const ProductDetails = ({ product, columnsMap, onEdit,  onInsert}) => {
  if (!product) return null;

  return (
    <div>
      <div className="row align-items-center mb-3">
        <div className="col-md-6">
          <h4>Product Details</h4>
        </div>
        <div className="col-md-6 text-end">
          <button className="btn btn-sm btn-success mx-2"   onClick={() => onInsert(product)}>Add Variant</button>
          <button
            className="btn btn-sm btn-warning"
            onClick={() => onEdit(product)}
          >
            Edit
          </button>
        </div>
      </div>
      {/* Product Image & Name */}
      <div className="text-center mb-3">
        <img
          src={`/product_images/${product.ProdID}.png`}
          className="img-fluid"
          style={{ maxWidth: "120px", height: "auto" }}
          alt={decodeBase64(product.ProdID)}
        />
      </div>

      {/* Product Details Table */}
      <table className="table table-sm">
        <tbody>
          {Object.entries(columnsMap).map(([key, name]) => {
            if (key === "edit") return null; // Skip "edit" column

            const value = product[key];
            return (
              <tr key={key}>
                <td className="fw-bold">{name}</td>
                <td>
                  :&nbsp; &nbsp;
                  {key === "ProdID"
                    ? "" // Skip this as it's already handled by the image above
                    : typeof value === "number"
                    ? value
                    : decodeBase64(value)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default ProductDetails;
