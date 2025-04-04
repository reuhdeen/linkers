import React, { useState, useEffect } from "react";
import { fetchQueryData, fetchData } from "../api/fetchData";
import "bootstrap/dist/css/bootstrap.min.css";
import "../css/loading.css";
import "../css/tables.css";
import "../css/forms.css";

import DataTable from "../components/reportTable";

const ProductTypesManagement = () => {
  const [productTypes, setProductTypes] = useState([]);
  const [loading, setLoading] = useState(true);

  const columns = [
    { name: "ID", key: "product_id" },
    { name: "Barcode", key: "barcode" },
    { name: "Name", key: "name" },
    { name: "Desciption", key: "description" },
    { name: "Category", key: "Category" },
    { name: "Supplier", key: "Supplier" },
    { name: "Quantity in Stock", key: "quantity_in_stock" },
    { name: "Reorder Level", key: "reorder_level" },

    
  ];

  useEffect(() => {
    const fetchProductTypes = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("accessToken");
        if (!token) throw new Error("No token found");

        const productTypesData = await fetchQueryData(token, {
          table: "iposal.products INNER JOIN categories on categories.category_id = products.category_id INNER JOIN suppliers on products.supplier_id = suppliers.supplier_id",
          columns: "products.*, categories.name AS 'Category', suppliers.name AS 'Supplier'",
        });

        setProductTypes(productTypesData);
      } catch (error) {
        console.error("Error fetching productTypes:", error);
        alert(`Error: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchProductTypes();
  }, []);

  // Scrollable table columns
  return (
    <div className="container-fluid">
      {loading && (
        <div className="loading-bar-container">
          <div className="loading-bar"></div>
        </div>
      )}

      {/* First Row: Add & View productTypes */}
      <div className="row">
        <div className="col-md-12">
          <div className="card p-3 h-100">
            <DataTable
              columns={columns}
              data={productTypes}
              modalOpen={""} // Replace with your modal function
              rows={10}
              dropdown={["Category", "Supplier"]} // Example dropdown filters
              title="Inventory Report"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductTypesManagement;
