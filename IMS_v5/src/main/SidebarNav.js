import React from "react";
import {
  FaHome,
  FaUsers,
  FaBox,
  FaBarcode,
  FaShoppingCart,
  FaClipboardList,
  FaChartPie,
  FaSignOutAlt,
} from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";
import "../css/sidebarnav.css";

const SidebarNav = ({ onLogout }) => {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const menuStructure = [
    {
      category: "Main",
      links: [
        { path: "/dashboard", icon: <FaHome />, name: "Dashboard" },
        { path: "/users", icon: <FaUsers />, name: "Users" },
      ],
    },
    {
      category: "Inventory",
      links: [
        { path: "/products", icon: <FaBox />, name: "Products" },
        { path: "/product-types", icon: <FaBox />, name: "Product Types" },
        { path: "/categories", icon: <FaBox />, name: "Categories" },
        { path: "/print-barcode", icon: <FaBarcode />, name: "Print Barcode" },
        {
          path: "/transactions",
          icon: <FaClipboardList />,
          name: "Manage Stock",
        },
        { path: "/supplies", icon: <FaBox />, name: "Supplies" },
        {
          path: "/supply-transactions",
          icon: <FaBox />,
          name: "Manage Supply",
        },
        {
          path: "/inventory-report",
          icon: <FaChartPie />,
          name: "Inventory Report",
        },
      ],
    },
    {
      category: "Sales",
      links: [
        { path: "/sale-summary", icon: <FaChartPie />, name: "Sale Summary" },
        { path: "/sales", icon: <FaShoppingCart />, name: "POS" },
        { path: "/sales-report", icon: <FaChartPie />, name: "Sales Report" },

        // { path: "/discount", icon: <FaMoneyBill />, name: "Discount" },
      ],
    },
  ];

  return (
    <div className="sidebar">
      {menuStructure.map((category, index) => (
        <div key={index} className="menu-category">
          <h3 className="category-title">{category.category}</h3>
          {category.links.map((menu, idx) => (
            <Link
              key={idx}
              to={menu.path}
              className={`menu-item ${isActive(menu.path) ? "active" : ""}`}
            >
              <span className="menu-icon">{menu.icon}</span>
              <span className="menu-name">{menu.name}</span>
            </Link>
          ))}
        </div>
      ))}

      <div className="logout-container">
        <button className="logout-button" onClick={onLogout}>
          <span className="menu-icon">
            <FaSignOutAlt />
          </span>
          <span className="menu-name">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default SidebarNav;
