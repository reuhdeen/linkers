import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import axios from 'axios';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Categories from './bo/Categories';
import Suppliers from './bo/Suppliers';
import Inventory from './bo/Inventory';
import UsersManagement from './bo/UsersManagement';
import InventoryTransactions from './bo/InventoryTransactions';
import InventoryAudit from './bo/InventoryAudit';
import RFIDTagsManagement from './bo/RFID';
import PurchaseOrder from './bo/PurchaseOrder';
import PurchaseDetails from './bo/PurchaseDetails';
import SaleSummary from './bo/SaleSummary';
import Products from './bo/Products';
import AddProduct from './bo/AddProduct';
import Supplies from './bo/Supplies';
import SupplyTransactions from './bo/SupplyTransactions';
import PrintBarcode from './bo/PrintBarcode';
import ProductTypes from './bo/ProductTypes';
import SalesManagement from './pos/sales';
import SaleReport from './reports/SaleReport';
import InventoryReport from './reports/InventoryReport';
import ExpiredProducts from './bo/ExpiredProducts';

import About from './fe/About';
import SidebarNav from './main/SidebarNav';
import HeaderBar from './main/HeaderBar';
import StaticDropdownSample from './fe/StaticDropdownSample';
import Login from './main/Login';
import { FaHome } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';
import "bootstrap/dist/js/bootstrap.bundle.min";
import process from "process";
function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [error, setError] = useState('');
  const [lastActivity, setLastActivity] = useState(Date.now());
  const inactivityTimeout = useRef();

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      setIsLoggedIn(true);
      setShowSidebar(true);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }

    // Setup activity listeners
    const handleActivity = () => setLastActivity(Date.now());
    window.addEventListener('mousemove', handleActivity);
    window.addEventListener('keydown', handleActivity);

    return () => {
      window.removeEventListener('mousemove', handleActivity);
      window.removeEventListener('keydown', handleActivity);
    };
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      clearTimeout(inactivityTimeout.current);
      inactivityTimeout.current = setTimeout(() => handleLogout(), 60 * 60 * 1000); // 60 minutes of inactivity
    }
  }, [lastActivity, isLoggedIn]);

  const handleLogin = (accessToken, refreshToken) => {
    if (accessToken) {
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
      setIsLoggedIn(true);
      setShowSidebar(true);
      setError('');
    } else {
      setError('Login failed. Please check your credentials and try again.');
    }
  };

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      if (token) {
        await axios.post(`${process.env.REACT_APP_API_URL}/logout`, null, {
          headers: { 'Authorization': `Bearer ${token}` },
        });
      }
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      delete axios.defaults.headers.common['Authorization'];
      setIsLoggedIn(false);
      setShowSidebar(false);
    } catch (error) {
      console.error('Error during logout:', error);
      alert('Error during logout. Please try again.');
    }
  };

  const toggleSidebar = () => {
    if (isLoggedIn) {
      setShowSidebar(!showSidebar);
    }
  };

  return (
    <Router>
      <div className="app-container">
        {!isLoggedIn ? (
          <Login onLogin={handleLogin} error={error} />
        ) : (
          <>
          {isLoggedIn && <HeaderBar onLogout={handleLogout} />}
            {showSidebar && <SidebarNav onLogout={handleLogout} />}
            <div className="">
              <Routes>
                <Route path="/" element={<div>Welcome to Dashboard!</div>} />
                <Route path="/dashboard" element={<div>Welcome to Dashboard!</div>} />
                <Route path="/categories" element={<Categories />} />
                <Route path="/suppliers" element={<Suppliers />} />
                <Route path="/product-types" element={<ProductTypes />} />
                <Route path="/inventory-report" element={<InventoryReport />} />
                <Route path="/sales-report" element={<SaleReport />} />
                AddProduct

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
                <Route path="/sales" element={<SalesManagement />} />
                <Route path="/products" element={<Products />} />
                <Route path="/add-product" element={<AddProduct />} />
                <Route path="/supplies" element={<Supplies />} />
                <Route path="/supply-transactions" element={<SupplyTransactions />} />
                

                <Route path="/About" element={<About />} />
                <Route path="/StaticDropdown" element={<StaticDropdownSample />} />
              </Routes>
            </div>
          </>
        )}
        {/* <div className="floating-home" onClick={toggleSidebar}>
          <FaHome size={24} />
        </div> */}
      </div>
    </Router>
  );
}

export default App;
