import React, { useState, useEffect } from "react";
import { fetchQueryData } from "./fetchData";
import { decodeBase64 } from "../api/decodeBase64";

const SearchProduct = ({ endpoint, name, value, onChange, label, idField, nameField }) => {
  const [barcode, setBarcode] = useState("");
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const searchProduct = async () => {
      if (!barcode) return;
      setLoading(true);

      try {
        const token = localStorage.getItem("accessToken");
        if (!token) throw new Error("No token found");

        const response = await fetchQueryData(token, {
          table: endpoint,
          columns: "*",
          where: `barcode='${barcode}'`,
        });

        if (response.length > 0) {
          setProduct(response[0]);

          // Send the product_id to the form instead of the barcode
          onChange({ target: { name, value: response[0][idField] } });
        } else {
          setProduct(null);
          onChange({ target: { name, value: "" } }); // Clear the value if no product found
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };

    searchProduct();
  }, [barcode, endpoint]);

  return (
    <div>
      <label>{label}</label>
      <input
        name={name}
        className="form-control"
        placeholder="Scan or Enter Barcode"
        value={barcode}
        onChange={(e) => setBarcode(e.target.value)}
        required
      />

      {loading ? (
        <p>Loading...</p>
      ) : product ? (
        <div className="product-details">
          <hr />
          <h6>{decodeBase64(product[nameField])}</h6>
          <p>Stock: {product.quantity_in_stock}</p>
        </div>
      ) : barcode ? (
        <p>No product found</p>
      ) : null}
    </div>
  );
};

export { SearchProduct };
