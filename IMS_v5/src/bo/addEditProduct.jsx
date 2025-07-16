import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { FaArrowLeft, FaPlusCircle } from "react-icons/fa";
import GeneralInfoTab from "./tabs/GeneralInfoTab";
import VariantsTab from "./tabs/VariantsTab";
import InventoryTab from "./tabs/InventoryTab";
import MediaTab from "./tabs/MediaTab";
import AttributesTab from "./tabs/AttributesTab";
import "../css/loading.css";
import "../css/forms.css";
import "../css/tables.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { fetchQueryData } from "../api/fetchData";
import { decodeBase64 } from "../utils/decode";

const tabLabels = ["General Info", "Variants", "Inventory", "Media", "Attributes"];

const AddEditProduct = () => {
  const { id } = useParams();
  const [isEditMode, setIsEditMode] = useState(!!id);
  const [activeTab, setActiveTab] = useState(0);
  const [formState, setFormState] = useState({
    product: isEditMode ? { product_id: id } : {},
    variants: [],
    inventory: [],
    media: [],
    attributes: [],      // must start as an array
  });

  useEffect(() => {
    if (!id) return;

    const loadProductData = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        if (!token) return;

        const whereClause = `products.product_id = ${parseInt(id, 10)}`;
        const productsData = await fetchQueryData(token, {
          table:
            "products " +
            "LEFT JOIN categories ON categories.category_id = products.category_id " +
            "LEFT JOIN suppliers ON suppliers.supplier_id = products.supplier_id " +
            "LEFT JOIN brands ON brands.brand_id = products.brand_id",
          columns:
            "products.*, categories.name AS categoryName, suppliers.name AS supplierName, brands.brand_name",
          where: whereClause,
          order: "products.product_id DESC",
        });

        const product = productsData?.[0];
        if (!product) {
          alert("❌ Product not found.");
          return;
        }

        // decode core fields
        const decodedProduct = {
          ...product,
          name: product.name ? decodeBase64(product.name) : "",
          visibility: product.visibility
            ? decodeBase64(product.visibility)
            : "public",
          slug: product.slug ? decodeBase64(product.slug) : "",
          media_url: product.media_url
            ? decodeBase64(product.media_url)
            : "",
        };

        // decode attributes (Base64-encoded JSON or plain JSON)
        let decodedAttributes = [];
        if (product.attributes) {
          try {
            // first try Base64 decode → parse
            const asJson = decodeBase64(product.attributes);
            decodedAttributes = JSON.parse(asJson);
          } catch {
            try {
              // fallback: parse as raw JSON string
              decodedAttributes = JSON.parse(product.attributes);
            } catch {
              decodedAttributes = [];
            }
          }
        }

        setFormState((prev) => ({
          ...prev,
          product: decodedProduct,
          attributes: decodedAttributes,
        }));

        setIsEditMode(true);
      } catch (error) {
        console.error("Error loading product:", error);
        alert("❌ Failed to load product for editing.");
      }
    };

    loadProductData();
  }, [id]);

  const handleTabChange = (i) => setActiveTab(i);
  const handleSectionChange = (key, val) => {
    setFormState((prev) => ({ ...prev, [key]: val }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const action = isEditMode ? "Updating" : "Creating";
    console.log(`${action} product...`, formState);
    alert(`${action} product successful.`);
  };

  return (
    <div className="container-fluid">
      <form onSubmit={handleSubmit}>
        {/* Header */}
        <div className="row align-items-center mb-3">
          <div className="col-md-6">
            <h3>{isEditMode ? "Edit Product" : "Add Product"}</h3>
            <span className="text-muted">
              {isEditMode
                ? `Editing Product #${formState.product?.product_id}`
                : "Create a new product entry"}
            </span>
          </div>
          <div className="col-md-6 text-end">
            {!isEditMode && (
              <Link to="/add-product" className="btn btn-md btn-success mx-2">
                <FaPlusCircle size={14} />
                &nbsp; New Product
              </Link>
            )}
            <Link to="/products" className="btn btn-md btn-warning">
              <FaArrowLeft size={14} />
              &nbsp; Back to Products
            </Link>
          </div>
        </div>

        {/* Tabs */}
        <ul className="nav nav-tabs mb-3">
          {tabLabels.map((label, i) => (
            <li className="nav-item" key={i}>
              <button
                type="button"
                className={`nav-link ${activeTab === i ? "active" : ""}`}
                onClick={() => setActiveTab(i)}
              >
                {label}
              </button>
            </li>
          ))}
        </ul>

        {/* Content */}
        <div className="card p-4 shadow-sm">
          {activeTab === 0 && (
            <GeneralInfoTab
              data={formState.product}
              onChange={(d) => handleSectionChange("product", d)}
              isEditMode={isEditMode}
              setEditMode={setIsEditMode}
            />
          )}
          {activeTab === 1 && (
            <VariantsTab
              data={formState.variants}
              onChange={(d) => handleSectionChange("variants", d)}
              isEditMode={isEditMode}
              productId={formState.product?.product_id}
            />
          )}
          {activeTab === 2 && (
            <InventoryTab
              data={formState.inventory}
              onChange={(d) => handleSectionChange("inventory", d)}
              isEditMode={isEditMode}
              productId={formState.product?.product_id}
            />
          )}
          {activeTab === 3 && (
            <MediaTab
              data={formState.product}
              onChange={(d) => handleSectionChange("product", d)}
            />
          )}
          {activeTab === 4 && (
            <AttributesTab
              data={formState.attributes}
              onChange={(d) => handleSectionChange("attributes", d)}
              isEditMode={isEditMode}
              productId={formState.product?.product_id}
            />
          )}
        </div>
      </form>
    </div>
  );
};

export default AddEditProduct;