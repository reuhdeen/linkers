import React, { useState, useEffect } from "react";
import axios from "axios";
import { fetchData } from "../api/fetchData";
import { decodeBase64 } from "../api/decodeBase64";
import { CustomDropdown } from "../api/dropDown";
import { Container } from "reactstrap";
import "../css/loading.css";

const Inventory = () => {
  const [inventories, setInventories] = useState([]);
  const [newInventory, setNewInventory] = useState({
    name: "",
    description: "",
    category_id: "",
    quantity_in_stock: "",
    reorder_level: "",
    supplier_id: "",
    barcode: "",
    expiration_date: "",
    unit_of_measure: "",
    markup_percentage: "",
    selling_price: "",
    cost_price: "",
    batch_number: "",
    warehouse_zone: "",
    SKU: "",
  });
  const [SelectedCategory, setSelectedCategory] = useState({});
  const [SelectedSub_Category, setSelectedSub_Category] = useState({});
  const [SelectedSuppliers, setSelectedSuppliers] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loginAndFetchData = async () => {
      try {
        setLoading(true);
        await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate 1 second loading
        const token = localStorage.getItem("accessToken");
        if (!token) {
          throw new Error("No token found");
        }
        const inventoriesData = await fetchData(token, "products");
        setInventories(inventoriesData);
      } catch (error) {
        console.error(
          "There was an error during login or fetching inventories:",
          error
        );
      } finally {
        setLoading(false);
      }
    };
    loginAndFetchData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewInventory({ ...newInventory, [name]: value });
  };

  const handleCategoryChange = (option) => setSelectedCategory(option);
  const handleSub_CategoryChange = (option) => setSelectedSub_Category(option);
  const handleSuppliersChange = (option) => setSelectedSuppliers(option);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const trimmedInventory = {
      name: newInventory.name.trim(),
      description: newInventory.description.trim(),
      category_id: SelectedCategory.id,
      quantity_in_stock: newInventory.quantity_in_stock.trim(),
      reorder_level: newInventory.reorder_level.trim(),
      supplier_id: SelectedSuppliers.id,
      barcode: newInventory.barcode.trim(),
      expiration_date: newInventory.expiration_date.trim(),
      unit_of_measure: newInventory.unit_of_measure.trim(),
      markup_percentage: newInventory.markup_percentage.trim(),
      selling_price: newInventory.selling_price.trim(),
      cost_price: newInventory.cost_price.trim(),
      batch_number: newInventory.batch_number.trim(),
      warehouse_zone: newInventory.warehouse_zone.trim(),
      SKU: newInventory.SKU.trim(),
    };

    if (!SelectedCategory.id || !SelectedSuppliers.id) {
      alert("Please make sure all dropdowns have a selection.");
      return;
    }

    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        throw new Error("No token found");
      }

      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/insert/products`,
        trimmedInventory,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Inventory created successfully", response.data);
      const inventoriesData = await fetchData(token, "products");
      setInventories(inventoriesData);
      setNewInventory({
        name: "",
        description: "",
        category_id: "",
        quantity_in_stock: "",
        reorder_level: "",
        supplier_id: "",
        barcode: "",
        expiration_date: "",
        unit_of_measure: "",
        markup_percentage: "",
        selling_price: "",
        cost_price: "",
        batch_number: "",
        warehouse_zone: "",
        SKU: "",
      });
    } catch (error) {
      console.error(
        "There was an error creating the inventory:",
        error.response ? error.response.data : error.message
      );
      alert(`Error: ${error.response ? error.response.data : error.message}`); // Popup error message
    }
  };

  const isFormValid = newInventory.category_id && newInventory.supplier_id;

  return (
    <Container
      className="d-flex flex-column justify-content-center align-items-center bordered-container top-margin"
      style={{ border: "1px solid black", marginTop: "5px" }}
    >
      <div>
        <h1>Inventories</h1>
        <form onSubmit={handleFormSubmit}>
          <input
            name="name"
            placeholder="Name"
            value={newInventory.name}
            onChange={handleInputChange}
          />
          <input
            name="description"
            placeholder="Description"
            value={newInventory.description}
            onChange={handleInputChange}
          />
          <CustomDropdown
            endpoint="parent_categories"
            name="category_id"
            value={SelectedCategory}
            onChange={handleCategoryChange}
            label="Category"
            idField="category_id"
            nameField="name"
            direction="down"
          />
          <CustomDropdown
            endpoint="sub_categories"
            name="category_id"
            value={SelectedSub_Category}
            onChange={handleSub_CategoryChange}
            label="Sub_Category"
            idField="category_id"
            nameField="name"
            direction="down"
          />
          <input
            name="quantity_in_stock"
            placeholder="Quantity in Stock"
            value={newInventory.quantity_in_stock}
            onChange={handleInputChange}
          />
          <input
            name="reorder_level"
            placeholder="Reorder Level"
            value={newInventory.reorder_level}
            onChange={handleInputChange}
          />
          <CustomDropdown
            endpoint="suppliers"
            name="supplier_id"
            value={SelectedSuppliers}
            onChange={handleSuppliersChange}
            label="Supplier"
            idField="supplier_id"
            nameField="name"
            direction="down"
          />
          <input
            name="barcode"
            placeholder="Barcode"
            value={newInventory.barcode}
            onChange={handleInputChange}
          />
          <input
            name="expiration_date"
            placeholder="Expiration Date"
            value={newInventory.expiration_date}
            onChange={handleInputChange}
          />
          <input
            name="unit_of_measure"
            placeholder="Unit of Measure"
            value={newInventory.unit_of_measure}
            onChange={handleInputChange}
          />
          <input
            name="markup_percentage"
            placeholder="Markup Percentage"
            value={newInventory.markup_percentage}
            onChange={handleInputChange}
          />
          <input
            name="selling_price"
            placeholder="Selling Price"
            value={newInventory.selling_price}
            onChange={handleInputChange}
          />

          <input
            name="cost_price"
            placeholder="Cost Price"
            value={newInventory.cost_price}
            onChange={handleInputChange}
          />
          <input
            name="batch_number"
            placeholder="Batch Number"
            value={newInventory.batch_number}
            onChange={handleInputChange}
          />
          <input
            name="warehouse_zone"
            placeholder="Warehouse Zone"
            value={newInventory.warehouse_zone}
            onChange={handleInputChange}
          />
          <input
            name="SKU"
            placeholder="SKU"
            value={newInventory.SKU}
            onChange={handleInputChange}
          />

          <div className="submit-button-container">
            <button
              type="submit"
              className="btn btn-primary custom-button"
              disabled={!isFormValid}
            >
              Submit
            </button>
          </div>
        </form>

        {loading && (
          <div className="loading-bar-container">
            {" "}
            <div className="loading-bar"></div>{" "}
          </div>
        )}
        <ul>
          {inventories.map((inventory, index) => (
            <li key={inventory.product_id || index}>
              {decodeBase64(inventory.name || "")}-{" "}
              {decodeBase64(inventory.description || "")}-{" "}
              {inventory.category_id || "None"}-{" "}
              {inventory.supplier_id || "None"}
            </li>
          ))}
        </ul>
      </div>
    </Container>
  );
};

export default Inventory;
