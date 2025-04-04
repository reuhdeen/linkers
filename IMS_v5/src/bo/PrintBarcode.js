import React, { useState, useEffect, useRef } from "react";
import { fetchQueryData } from "../api/fetchData";
import { decodeBase64 } from "../api/decodeBase64";
import JsBarcode from "jsbarcode";
import JSZip from "jszip";
import { saveAs } from "file-saver";

const PrintBarcode = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [searchedProducts, setSearchedProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const barcodeRefs = useRef({});

  // Fetch suggestions as user types
  useEffect(() => {
    if (!searchQuery) {
      setSuggestions([]);
      return;
    }

    const fetchSuggestions = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("accessToken");
        if (!token) throw new Error("No token found");

        const response = await fetchQueryData(token, {
          table: "products",
          columns: "*",
          where: `barcode LIKE '%${searchQuery}%' OR name LIKE '%${searchQuery}%' OR description LIKE '%${searchQuery}%'`,
        });

        setSuggestions(response);
      } catch (error) {
        console.error("Error fetching suggestions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSuggestions();
  }, [searchQuery]);

  // Handle product selection from suggestions
  const handleSelectProduct = (product) => {
    setSearchedProducts((prev) => [...prev, product]);
    setSearchQuery(""); // Clear input after selection
    setSuggestions([]);
  };

  // Generate barcode images for selected products
  useEffect(() => {
    searchedProducts.forEach((product) => {
      const barcodeCanvas = barcodeRefs.current[product.product_id];

      if (barcodeCanvas) {
        JsBarcode(barcodeCanvas, decodeBase64(product.barcode), {
          format: "CODE128",
          displayValue: true,
          width: 2,
          height: 50,
        });
      }
    });
  }, [searchedProducts]);

  // Handle downloading barcode images as ZIP
  const handleDownloadBarcodes = async () => {
    const zip = new JSZip();

    for (const product of searchedProducts) {
      const canvas = barcodeRefs.current[product.product_id];

      if (canvas) {
        const dataUrl = canvas.toDataURL("image/png");
        const response = await fetch(dataUrl);
        const blob = await response.blob();
        zip.file(`barcode_${decodeBase64(product.barcode)}.png`, blob);
      }
    }

    zip.generateAsync({ type: "blob" }).then((content) => {
      saveAs(content, "barcodes.zip");
    });
  };

  return (
    <div className="container-fluid">
      <h4>Print Barcode</h4>
      <div className="input-group mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Search by Barcode, Name, or Description"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Show Suggestions */}
      {suggestions.length > 0 && (
        <ul className="list-group">
          {suggestions.map((product) => (
            <li
              key={product.product_id}
              className="list-group-item list-group-item-action"
              onClick={() => handleSelectProduct(product)}
              style={{ cursor: "pointer" }}
            >
              {decodeBase64(product.barcode)} - {decodeBase64(product.name)} - {decodeBase64(product.description)}
            </li>
          ))}
        </ul>
      )}

      <div className="row">
        <div className="col-md-12">
          <div className="card p-3 h-100">
            {/* Display Selected Products */}
            {searchedProducts.length > 0 && (
              <>
                <div className="table-responsive">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Barcode</th>
                        <th>Product Name</th>
                        <th>Description</th>
                        <th>Price</th>
                        <th>Barcode Image</th>
                      </tr>
                    </thead>
                    <tbody>
                      {searchedProducts.map((product, index) => (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td>{decodeBase64(product.barcode)}</td>
                          <td>{decodeBase64(product.name)}</td>
                          <td>{decodeBase64(product.description)}</td>
                          <td>P{decodeBase64(product.selling_price)}</td>
                          <td>
                            <canvas ref={(el) => (barcodeRefs.current[product.product_id] = el)}></canvas>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <button className="btn btn-success mt-2" onClick={handleDownloadBarcodes}>
                  Download List (ZIP)
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrintBarcode;
