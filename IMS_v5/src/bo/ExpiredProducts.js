import React, { useState, useEffect } from "react";
import axios from "axios";
import { CustomDropdown } from "../api/CustomDropdown";
import { fetchQueryData, fetchData } from "../api/fetchData";
import "bootstrap/dist/css/bootstrap.min.css";
import "../css/loading.css";
import "../css/tables.css";
import "../css/forms.css";
import DataTable from "../api/dataTable";

const ExpiredProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [SelectedProductCategory, setSelectedProductCategory] = useState({});


  const fetchProducts = async (categoryId) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("accessToken");
      if (!token) throw new Error("No token found");

      const productsData = await fetchQueryData(token, {
        table:
          "iposarv3.products INNER JOIN categories on categories.category_id = products.category_id INNER JOIN product_types ON products.product_type_id = product_types.product_type_id INNER JOIN suppliers ON products.supplier_id = suppliers.supplier_id",
        columns:
          "products.*, categories.name AS categoryName, product_types.name AS productTypeName, suppliers.name AS supplierName",
        where: `products.category_id = '${categoryId}'`,
      });

      setProducts(productsData);
    } catch (error) {
      console.error("Error fetching products:", error);
      alert(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Trigger fetchProducts when SelectedProductCategory changes
  const handleCategoryChange = (category) => {
    setSelectedProductCategory(category);
    if (category.id) {
      fetchProducts(category.id);
    }
  };

  const columns = [
    { name: "Edit", key: "edit" },
    { name: "Img", key: "product_id" },
    { name: "Name", key: "name" },
    { name: "Description", key: "description" },
    { name: "Category", key: "categoryName" },
    { name: "Product Type", key: "productTypeName" },
    { name: "Quantity In Stock", key: "quantity_in_stock" },
    { name: "Reorder Level", key: "reorder_level" },
    { name: "Supplier", key: "supplierName" },
    { name: "Barcode", key: "barcode" },
    { name: "Expiration Date", key: "expiration_date" },
    { name: "Unit of Measure", key: "unit_of_measure" },
    { name: "Markup Percentage", key: "markup_percentage" },
    { name: "Retail Price", key: "retail_price" },
    { name: "Cost Price", key: "cost_price" },
    { name: "Batch Number", key: "batch_number" },
    { name: "Warehouse Zone", key: "warehouse_zone" },
    { name: "SKU", key: "SKU" },
  ];



  // Scrollable table columns
  return (
    <div className="container-fluid">
      {loading && (
        <div className="loading-bar-container">
          <div className="loading-bar"></div>
        </div>
      )}

      {/* First Row: Add & View products */}
      <div className="row">
        <div className="col-md-12">
          <div className="card p-3 h-500">
            <h4>Expired Products</h4>
            <label>Category</label>
            <CustomDropdown
              endpoint="categories"
              name="category_id"
              value={SelectedProductCategory.id || ""}
              onChange={(e) => handleCategoryChange({ id: e.target.value })}
              idField="category_id"
              nameField="name"
              required
            />

            <hr></hr>
            <DataTable
              columns={columns}
              data={products}
              title=""
              rows={10}
              onEdit={""} 
            />
          </div>
        </div>
      </div>

    
    </div>
  );
};

export default ExpiredProducts;
