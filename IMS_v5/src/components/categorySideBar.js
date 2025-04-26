import React from "react";
import { FaTags } from "react-icons/fa";
import "../css/sidebarnav.css"; // reuse the same styles as SidebarNav

const CategorySidebarNav = ({
  categories,
  selectedCategory,
  setSelectedCategory,
  screenWidth,
}) => {
  return (
    <div className="sidebar-category">
      <div className="menu-category">
        <h3 className="category-title">Categories</h3>
        {categories.map((category) => (
          <button
            key={category.categoryID}
            className={`categorymenu-item ${
              selectedCategory === category.categoryID ? "active" : ""
            }`}
            onClick={() => setSelectedCategory(category.categoryID)}
          >
            <span className="categorymenu-icon">
              <FaTags />
            </span>
            {category.categoryName}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategorySidebarNav;
