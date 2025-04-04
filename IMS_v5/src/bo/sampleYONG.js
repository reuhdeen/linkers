import React, { useState, useEffect } from "react";
import axios from "axios";
import { CustomDropdown } from "../api/CustomDropdown";
import {
  FaEdit,
  FaChevronLeft,
  FaChevronRight,
  FaCaretUp,
  FaCaretDown,
} from "react-icons/fa";
import { fetchQueryData, fetchData } from "../api/fetchData";
import { decodeBase64 } from "../api/decodeBase64";
import "../css/loading.css";
import "../css/tables.css";
import "../css/forms.css";
import "bootstrap/dist/css/bootstrap.min.css";

const ProductsManagement = () => {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const rowsPerPage = 10; // Number of products to show per page
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  const [newProduct, setNewProduct] = useState({
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
    product_type_id: "",
  });
  const [SelectedCategory, setSelectedCategory] = useState({});
  const [SelectedProductType, setSelectedProductType] = useState({});
  const [SelectedSupplier, setSelectedSupplier] = useState({});
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const loginAndFetchData = async () => {
      try {
        setLoading(true);
        await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate 1 second loading
        const token = localStorage.getItem("accessToken");
        if (!token) {
          throw new Error("No token found");
        }
        const productsData = await fetchQueryData(token, {
          table:
            "iposal.products INNER JOIN categories on categories.category_id = products.category_id INNER JOIN product_types ON products.product_type_id = product_types.product_type_id INNER JOIN suppliers ON products.supplier_id = suppliers.supplier_id",
          columns:
            "products.*, categories.name AS categoryName, product_types.name AS productTypeName, suppliers.name AS supplierName",
        });

        setProducts(productsData);
      } catch (error) {
        console.error(
          "There was an error during login or fetching products:",
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
    setNewProduct({ ...newProduct, [name]: value });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const trimmedInventory = {
      name: newProduct.name.trim(),
      description: newProduct.description.trim(),
      category_id: SelectedCategory.id,
      quantity_in_stock: newProduct.quantity_in_stock.trim(),
      reorder_level: newProduct.reorder_level.trim(),
      supplier_id: SelectedSupplier.id,
      barcode: newProduct.barcode.trim(),
      expiration_date: newProduct.expiration_date.trim(),
      unit_of_measure: newProduct.unit_of_measure.trim(),
      markup_percentage: newProduct.markup_percentage.trim(),
      selling_price: newProduct.selling_price.trim(),
      cost_price: newProduct.cost_price.trim(),
      batch_number: newProduct.batch_number.trim(),
      warehouse_zone: newProduct.warehouse_zone.trim(),
      SKU: newProduct.SKU.trim(),
      product_type_id: SelectedProductType.id,
    };

    if (!SelectedCategory.id || !SelectedSupplier.id) {
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
      const productsData = await fetchQueryData(token, {
        table:
          "iposal.products INNER JOIN categories on categories.category_id = products.category_id INNER JOIN product_types ON products.product_type_id = product_types.product_type_id INNER JOIN suppliers ON products.supplier_id = suppliers.supplier_id",
        columns:
          "products.*, categories.name AS categoryName, product_types.name AS productTypeName, suppliers.name AS supplierName",
      });

      setProducts(productsData);
      setNewProduct({
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
        product_type_id: "",
      });
    } catch (error) {
      console.error(
        "There was an error creating the inventory:",
        error.response ? error.response.data : error.message
      );
      alert(`Error: ${error.response ? error.response.data : error.message}`); // Popup error message
    }
  };

  // Predefined columns (you can customize this as needed)
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
    { name: "Selling Price", key: "selling_price" },
    { name: "Cost Price", key: "cost_price" },
    { name: "Batch Number", key: "batch_number" },
    { name: "Warehouse Zone", key: "warehouse_zone" },
    { name: "SKU", key: "SKU" },
  ];

  // Function to sort the data
  const sortedProducts = () => {
    const sortableProducts = [...products];
    if (sortConfig.key) {
      sortableProducts.sort((a, b) => {
        const aValue = decodeBase64(a[sortConfig.key]) || a[sortConfig.key];
        const bValue = decodeBase64(b[sortConfig.key]) || b[sortConfig.key];

        if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }
    return sortableProducts;
  };

  // Handle sorting by clicking a column header
  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value.toLowerCase().trim());
  };

  // Filtered Products (pagination only)
  // const totalPages = Math.ceil(products.length / rowsPerPage);
  // const paginatedProducts = sortedProducts().slice(
  //   (currentPage - 1) * rowsPerPage,
  //   currentPage * rowsPerPage
  // );
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("accessToken");
        if (!token) throw new Error("No token found");

        const productsData = await fetchQueryData(token, {
          table:
            "iposal.products INNER JOIN categories on categories.category_id = products.category_id INNER JOIN product_types ON products.product_type_id = product_types.product_type_id INNER JOIN suppliers ON products.supplier_id = suppliers.supplier_id",
          columns:
            "products.*, categories.name AS categoryName, product_types.name AS productTypeName, suppliers.name AS supplierName",
        });

        setProducts(productsData);
      } catch (error) {
        console.error("Error fetching products:", error);
        alert(`Error: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const filteredProducts = sortedProducts().filter((product) => {
    const productName =
      decodeBase64(product.name)?.toLowerCase() || product.name.toLowerCase();
    const productDescription =
      decodeBase64(product.description)?.toLowerCase() ||
      product.description.toLowerCase();
    const categoryName =
      decodeBase64(product.categoryName)?.toLowerCase() ||
      product.categoryName.toLowerCase();
    const supplierName =
      decodeBase64(product.supplierName)?.toLowerCase() ||
      product.supplierName.toLowerCase();

    return (
      productName.includes(searchTerm) ||
      productDescription.includes(searchTerm) ||
      categoryName.includes(searchTerm) ||
      supplierName.includes(searchTerm)
    );
  });

  // Apply pagination after filtering
  const totalPages = Math.ceil(filteredProducts.length / rowsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );
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
        <div className="col-md-8">
          <div className="card p-3 h-100">
            {/* start of table */}
            <div className="row align-items-center mb-3">
              <div className="col-md-8">
                <h4>Top Selling Products</h4>
              </div>
              <div className="col-md-4 text-end">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search product..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                />
              </div>
            </div>

            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    {columns.map((col) => (
                      <th
                        className="align-middle"
                        key={col.key}
                        onClick={() =>
                          col.key !== "edit" &&
                          col.key !== "product_id" &&
                          handleSort(col.key)
                        }
                        style={{
                          cursor:
                            col.key !== "edit" && col.key !== "product_id"
                              ? "pointer"
                              : "default",
                          textAlign: "left",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "5px",
                          }}
                        >
                          <span>{col.name.toUpperCase()}</span>
                          {col.key !== "edit" && col.key !== "product_id" && (
                            <div
                              style={{
                                display: "flex",
                                flexDirection: "column",
                                lineHeight: "1",
                              }}
                            >
                              <FaCaretUp
                                size={12}
                                style={{
                                  marginBottom: "-3px",
                                  visibility:
                                    sortConfig.key === col.key &&
                                    sortConfig.direction !== "asc"
                                      ? "hidden"
                                      : "visible",
                                }}
                              />
                              <FaCaretDown
                                size={12}
                                style={{
                                  marginTop: "-3px",
                                  visibility:
                                    sortConfig.key === col.key &&
                                    sortConfig.direction !== "desc"
                                      ? "hidden"
                                      : "visible",
                                }}
                              />
                            </div>
                          )}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {paginatedProducts.map((product) => (
                    <tr key={product.product_id}>
                      {columns.map((col) => (
                        <td key={col.key} className="align-middle">
                          {col.key === "edit" ? (
                            <FaEdit
                              className="edit-button"
                              size={16}
                              onClick={() => modalOpen(product.product_id)}
                              style={{ cursor: "pointer" }}
                            />
                          ) : col.key === "product_id" ? (
                            <img
                              src={`/product_images/${product.product_id}.png`}
                              className="img-table"
                              alt={decodeBase64(product.product_id)}
                            />
                          ) : typeof product[col.key] === "number" ? (
                            product[col.key]
                          ) : (
                            decodeBase64(product[col.key])
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            <div className="d-flex justify-content-between align-items-center mt-3">
              <span>
                Showing {(currentPage - 1) * rowsPerPage + 1} to{" "}
                {Math.min(currentPage * rowsPerPage, products.length)} of{" "}
                {products.length} entries
              </span>
              <div className="d-flex align-items-center">
                <button
                  className="btn btn-sm pagination-button me-2"
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  <FaChevronLeft size={12} />
                </button>
                {Array.from({ length: 3 }, (_, i) => currentPage - 1 + i)
                  .filter((page) => page > 0 && page <= totalPages)
                  .map((page) => (
                    <button
                      key={page}
                      className={`btn btn-sm mx-1 ${
                        page === currentPage
                          ? "btn-pagination-active"
                          : "btn-pagination"
                      }`}
                      onClick={() => setCurrentPage(page)}
                    >
                      {page}
                    </button>
                  ))}
                <button
                  className="btn btn-sm pagination-button ms-2"
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  <FaChevronRight size={12} />
                </button>
              </div>
              <div className="d-flex align-items-center">
                <span>Go to page</span> &nbsp; &nbsp;
                <input
                  type="number"
                  className="pagination-form text-center"
                  min="1"
                  max={totalPages}
                  placeholder={currentPage}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      const page = Number(e.target.value);
                      if (page >= 1 && page <= totalPages) {
                        setCurrentPage(page);
                      }
                    }
                  }}
                />
              </div>
            </div>
          {/* end of table */}
          </div>
        </div>

        <div className="col-md-4">
          <div className="card p-3 h-100">
            <h4>Add New Product</h4>
            <form onSubmit={handleFormSubmit} className="container">
              <div className="row mb-3">
                <div className="col-md-6">
                  <label>Name</label>
                  <input
                    name="name"
                    className="form-control"
                    placeholder="Name"
                    value={newProduct.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label>Barcode</label>
                  <input
                    name="barcode"
                    className="form-control"
                    placeholder="Barcode"
                    value={newProduct.barcode}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="row mb-3">
                <div className="col-12">
                  <label>Description</label>
                  <input
                    name="description"
                    className="form-control"
                    placeholder="Description"
                    value={newProduct.description}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="row mb-3">
                <div className="col-md-6">
                  <label>Category</label>
                  <CustomDropdown
                    endpoint="categories"
                    name="category_id"
                    value={SelectedCategory.id || ""}
                    onChange={(e) =>
                      setSelectedCategory({ id: e.target.value })
                    }
                    idField="category_id"
                    nameField="name"
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label>Type</label>
                  <CustomDropdown
                    endpoint="product_types"
                    name="product_type_id"
                    value={SelectedProductType.id || ""}
                    onChange={(e) =>
                      setSelectedProductType({ id: e.target.value })
                    }
                    idField="product_type_id"
                    nameField="name"
                    required
                  />
                </div>
              </div>

              <div className="row mb-3">
                <div className="col-12">
                  <label>Supplier</label>
                  <CustomDropdown
                    endpoint="suppliers"
                    name="supplier_id"
                    value={SelectedSupplier.id || ""}
                    onChange={(e) =>
                      setSelectedSupplier({ id: e.target.value })
                    }
                    idField="supplier_id"
                    nameField="name"
                    required
                  />
                </div>
              </div>

              <div className="row mb-3">
                <div className="col-md-6">
                  <label>Quantity in Stock</label>
                  <input
                    name="quantity_in_stock"
                    className="form-control"
                    type="number"
                    placeholder="Quantity in Stock"
                    value={newProduct.quantity_in_stock}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label>Reorder Level</label>
                  <input
                    name="reorder_level"
                    className="form-control"
                    type="number"
                    placeholder="Reorder Level"
                    value={newProduct.reorder_level}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="row mb-3">
                <div className="col-md-6">
                  <label>Unit of Measure</label>
                  <input
                    name="unit_of_measure"
                    className="form-control"
                    placeholder="Unit of Measure"
                    value={newProduct.unit_of_measure}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label>Expiration Date</label>
                  <input
                    name="expiration_date"
                    className="form-control"
                    type="date"
                    placeholder="Expiration Date"
                    value={newProduct.expiration_date}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="row mb-3">
                <div className="col-md-4">
                  <label>Cost Price</label>
                  <input
                    name="cost_price"
                    className="form-control"
                    type="number"
                    placeholder="Cost Price"
                    value={newProduct.cost_price}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="col-md-4">
                  <label>Selling Price</label>
                  <input
                    name="selling_price"
                    className="form-control"
                    type="number"
                    placeholder="Selling Price"
                    value={newProduct.selling_price}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="col-md-4">
                  <label>Markup Percentage</label>
                  <input
                    name="markup_percentage"
                    className="form-control"
                    type="number"
                    placeholder="Markup Percentage"
                    value={newProduct.markup_percentage}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="row mb-3">
                <div className="col-md-4">
                  <label>Warehouse Zone</label>
                  <input
                    name="warehouse_zone"
                    className="form-control"
                    placeholder="Warehouse Zone"
                    value={newProduct.warehouse_zone}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="col-md-4">
                  <label>Batch Number</label>
                  <input
                    name="batch_number"
                    className="form-control"
                    placeholder="Batch Number"
                    value={newProduct.batch_number}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="col-md-4">
                  <label>SKU</label>
                  <input
                    name="SKU"
                    className="form-control"
                    placeholder="SKU"
                    value={newProduct.SKU}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <button type="submit" className="btn btn-primary">
                Add New Product
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductsManagement;
