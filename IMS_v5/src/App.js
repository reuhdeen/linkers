import React, { useState, useEffect, useRef } from "react";
import "./App.css";
import axios from "axios";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";

import Categories from "./bo/Categories";
import Suppliers from "./bo/Suppliers";
import Inventory from "./bo/Inventory";
import UsersManagement from "./bo/UsersManagement";
import InventoryTransactions from "./bo/InventoryTransactions";
import InventoryAudit from "./bo/InventoryAudit";
import RFIDTagsManagement from "./bo/RFID";
import PurchaseOrder from "./bo/PurchaseOrder";
import PurchaseDetails from "./bo/PurchaseDetails";
import SaleSummary from "./bo/SaleSummary";
import Products from "./bo/Products";
import AddProduct from "./bo/addEditProduct.jsx";
import EditProduct from "./bo/EditProduct";
import AddRetailProduct from "./bo/AddRetail";
import Supplies from "./bo/Supplies";
import SupplyTransactions from "./bo/SupplyTransactions";
import PrintBarcode from "./bo/PrintBarcode";
import ProductTypes from "./bo/ProductTypes";
import SalesManagement from "./pos/sales";
import SaleReport from "./reports/SaleReport";
import InventoryReport from "./reports/InventoryReport";
import ExpiredProducts from "./bo/ExpiredProducts";
import RetailProducts from "./bo/RetailProducts";
import ProductDetailsPage from "./components/singleProduct";

import About from "./fe/About";
import SidebarNav from "./main/SidebarNav";
import HeaderBar from "./main/HeaderBar";
import HeaderBarPos from "./main/HeaderBarPos";
import FooterPos from "./main/FooterPos";
import StaticDropdownSample from "./fe/StaticDropdownSample";
import Login from "./main/Login";
import CategorySidebarNav from "./components/categorySideBar";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [error, setError] = useState("");
  const [lastActivity, setLastActivity] = useState(Date.now());
  const inactivityTimeout = useRef();

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      setIsLoggedIn(true);
      setShowSidebar(true);
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }

    const handleActivity = () => setLastActivity(Date.now());
    window.addEventListener("mousemove", handleActivity);
    window.addEventListener("keydown", handleActivity);

    return () => {
      window.removeEventListener("mousemove", handleActivity);
      window.removeEventListener("keydown", handleActivity);
    };
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      clearTimeout(inactivityTimeout.current);
      inactivityTimeout.current = setTimeout(
        () => handleLogout(),
        60 * 60 * 1000
      );
    }
  }, [lastActivity, isLoggedIn]);

  const handleLogin = (accessToken, refreshToken) => {
    if (accessToken) {
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
      setIsLoggedIn(true);
      setShowSidebar(true);
      setError("");
    } else {
      setError("Login failed. Please check your credentials and try again.");
    }
  };

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      if (token) {
        await axios.post(`${process.env.REACT_APP_API_URL}/logout`, null, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      delete axios.defaults.headers.common["Authorization"];
      setIsLoggedIn(false);
      setShowSidebar(false);
    } catch (error) {
      console.error("Error during logout:", error);
      alert("Error during logout. Please try again.");
    }
  };

  return (
    <Router>
      <AppContent
        isLoggedIn={isLoggedIn}
        error={error}
        handleLogin={handleLogin}
        handleLogout={handleLogout}
        showSidebar={showSidebar}
      />
    </Router>
  );
}

function AppContent({
  isLoggedIn,
  error,
  handleLogin,
  handleLogout,
  showSidebar,
}) {
  const location = useLocation();
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  const [isScannerActive, setIsScannerActive] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => setScreenWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        if (!token) throw new Error("No token");
        const res = await axios.get(
          `${process.env.REACT_APP_API_URL}/categories`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const decodedCategories = [
          { categoryID: "All", categoryName: "All" },
          ...res.data.map((cat) => ({
            categoryID: cat.category_id,
            categoryName: atob(cat.name),
          })),
        ];
        setCategories(decodedCategories);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };

    if (isLoggedIn) fetchCategories();
  }, [isLoggedIn]);

  return (
    <div className="app-container">
      {!isLoggedIn ? (
        <Login onLogin={handleLogin} error={error} />
      ) : (
        <>
          {showSidebar &&
            (location.pathname === "/sales" ? (
              <>
                <HeaderBarPos onLogout={handleLogout} />
                <FooterPos
                  onLogout={handleLogout}
                  isScannerActive={isScannerActive}
                  setIsScannerActive={setIsScannerActive}
                  setModalOpen={setModalOpen}
                />
                <CategorySidebarNav
                  categories={categories}
                  selectedCategory={selectedCategory}
                  setSelectedCategory={setSelectedCategory}
                  screenWidth={screenWidth}
                />
              </>
            ) : (
              <>
                <HeaderBar onLogout={handleLogout} />
                <SidebarNav onLogout={handleLogout} />
              </>
            ))}

          <div>
            <Routes>
              <Route path="/" element={<div>Welcome to Dashboard!</div>} />
              <Route path="/dashboard" element={<div>Welcome to Dashboard!</div>} />
              <Route path="/categories" element={<Categories />} />
              <Route path="/suppliers" element={<Suppliers />} />
              <Route path="/product-types" element={<ProductTypes />} />
              <Route path="/inventory-report" element={<InventoryReport />} />
              <Route path="/sales-report" element={<SaleReport />} />
              <Route path="/expired-products" element={<ExpiredProducts />} />
              <Route path="/print-barcode" element={<PrintBarcode />} />
              <Route path="/users" element={<UsersManagement />} />
              <Route path="/inventories" element={<Inventory />} />
              <Route path="/transactions" element={<InventoryTransactions />} />
              <Route path="/audit" element={<InventoryAudit />} />
              <Route path="/rfid" element={<RFIDTagsManagement />} />
              <Route path="/purchase" element={<PurchaseOrder />} />
              <Route path="/purchase-details" element={<PurchaseDetails />} />
              <Route path="/sale-summary" element={<SaleSummary />} />
              <Route
                path="/sales"
                element={
                  <SalesManagement
                    selectedCategory={selectedCategory}
                    setCategories={setCategories}
                    isScannerActive={isScannerActive}
                    modalOpen={modalOpen}
                    setModalOpen={setModalOpen}
                  />
                }
              />
              <Route path="/retail-products" element={<RetailProducts />} />
              <Route path="/products" element={<Products />} />

              {/* Add & Edit product routes */}
              <Route path="/add-product" element={<AddProduct />} />
              <Route path="/products/edit/:id" element={<AddProduct />} />

              {/* Product detail page */}
              <Route path="/products/:id" element={<ProductDetailsPage />} />

              <Route path="/add-retail" element={<AddRetailProduct />} />
              <Route path="/supplies" element={<Supplies />} />
              <Route path="/supply-transactions" element={<SupplyTransactions />} />
              <Route path="/About" element={<About />} />
              <Route path="/StaticDropdown" element={<StaticDropdownSample />} />
            </Routes>
          </div>
        </>
      )}
    </div>
  );
}

export default App;