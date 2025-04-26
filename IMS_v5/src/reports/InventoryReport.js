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
    { name: "SKU", key: "variant_sku" },
    { name: "Name", key: "product_name" },
    { name: "Attributes", key: "attributes" },
    { name: "Quantity In Stock", key: "quantity_in_stock" },
    { name: "Reorder Level", key: "reorder_level" },
    { name: "Warehouse", key: "WName" },
    { name: "Storage Zone", key: "storage_zone" },
    
    { name: "Inventory Type", key: "inventory_type_name" },
    { name: "Supplier", key: "supplier" },

  ];

  useEffect(() => {
    const fetchProductTypes = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("accessToken");
        if (!token) throw new Error("No token found");

        const productTypesData = await fetchQueryData(token, {
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
              dropdown={["WName", "supplier"]} // Example dropdown filters
              title="Inventory Report"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductTypesManagement;
