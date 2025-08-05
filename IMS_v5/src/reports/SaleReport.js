import React, { useState, useEffect } from "react";
import { fetchQueryData } from "../api/fetchData";
import "bootstrap/dist/css/bootstrap.min.css";
import "../css/loading.css";
import "../css/tables.css";
import "../css/forms.css";

import DataTable from "../components/reportTable";

const ProductTypesManagement = () => {
  const [productTypes, setProductTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const columns = [
    { name: "ID", key: "product_id" },
    { name: "Barcode", key: "barcode" },
    { name: "Name", key: "name" },
    { name: "Description", key: "description" },
    { name: "Category", key: "Category" },
    { name: "Supplier", key: "Supplier" },
    { name: "Items Sold", key: "Items_sold" },
    { name: "Revenue", key: "Revenue" },
    { name: "Profit", key: "Profit" },
  ];

  useEffect(() => {
    const fetchProductTypes = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("accessToken");
        if (!token) throw new Error("No token found");

        // Construct date filter condition
        let dateCondition = "";
        if (startDate && !endDate) {
          dateCondition = `WHERE DATE(sales.sale_date) = '${startDate}'`;
        } else if (startDate && endDate) {
          dateCondition = `WHERE DATE(sales.sale_date) BETWEEN '${startDate}' AND '${endDate}'`;
        }

        const productTypesData = await fetchQueryData(token, {
          table: `iposarv3.products 
                  INNER JOIN categories ON categories.category_id = products.category_id 
                  INNER JOIN suppliers ON suppliers.supplier_id = products.supplier_id 
                  LEFT JOIN sale_details ON sale_details.product_id = products.product_id 
                  LEFT JOIN sales ON sales.sale_id = sale_details.sale_id 
                  ${dateCondition}
                  GROUP BY products.product_id`,
          columns: `products.*, 
                    categories.name AS 'Category', 
                    suppliers.name AS 'Supplier', 
                    COALESCE(SUM(sale_details.discounted_price), 0) AS Revenue, 
                    COALESCE(COUNT(sale_details.sale_detail_id), 0) AS 'Items_sold', 
                    COALESCE(SUM(sale_details.discounted_price) - (COUNT(sale_details.sale_detail_id) * products.cost_price), 0) AS Profit`,
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
  }, [startDate, endDate]);

  return (
    <div className="container-fluid">
      {loading && (
        <div className="loading-bar-container">
          <div className="loading-bar"></div>
        </div>
      )}

      <div className="row">
        <div className="col-md-12">
          <div className="card p-3 h-100">

              <h3 className="form-label">Sales Report:</h3>
              <div className="d-flex gap-2">
                <input
                  type="date"
                  className="form-control w-25"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
                <span className="align-self-center">to</span>
                <input
                  type="date"
                  className="form-control w-25"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  disabled={!startDate} // Prevents selecting end date without a start date
                />
              </div>


            <DataTable
              columns={columns}
              data={productTypes}
              modalOpen={""} // Replace with your modal function
              rows={10}
              dropdown={["Category", "Supplier"]} // Example dropdown filters
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductTypesManagement;
