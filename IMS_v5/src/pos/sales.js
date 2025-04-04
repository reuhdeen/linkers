import React, { useState, useEffect } from "react";
import axios from "axios";
import { fetchQueryData, fetchData } from "../api/fetchData";
import { decodeBase64 } from "../api/decodeBase64";
import "../css/loading.css";
import "../css/pos.css";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  FaTrashAlt,
  FaCreditCard,
  FaMoneyBill,
  FaWallet,
} from "react-icons/fa";
import debitCredit from "./debitcredit.png";
import CartModal from "../api/cartModal"; // Ensure the correct path
import ReceiptModal from "../api/receiptModal"; // Ensure the correct path

const Sales = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showPaymentOptions, setShowPaymentOptions] = useState(false);
  const [showOtherOptions, setShowOtherOptions] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [ewalletOption, setEwalletOption] = useState("");
  const [voucherCode, setVoucherCode] = useState(""); // State for voucher code
  const cashier_id = "12"; // Replace with actual cashier ID
  const [cartCreated, setCartCreated] = useState(false); // Flag to prevent cart creation duplication
  const [modalOpen, setModalOpen] = useState(false);
  const [receiptModalOpen, setReceiptModalOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showCashModal, setShowCashModal] = useState(false);
  const [cardEntered, setCardEntered] = useState(false);
  const [cardNumber, setCardNumber] = useState("");
  const [cashEntered, setCashEntered] = useState(false);
  const [cashNumber, setCashNumber] = useState("");
  const [salesID, setSalesID] = useState("");

  useEffect(() => {
    if (orders.length > 0) {
      setShowOtherOptions(true);
    } else {
      setShowOtherOptions(false);
    }
  }, [orders]);

  const handlePaymentMethodChange = (method) => {
    setPaymentMethod(method);
    if (method === "Credit/Debit Card" && !cardEntered) {
      setShowModal(true);
      setEwalletOption(false);
    } else if (method === "Cash" && !cashEntered) {
      setShowCashModal(true);
      setEwalletOption(false);
    } else if (method === "E-Wallet") {
      setEwalletOption(true);
    } else {
      setEwalletOption(false);
    }
  };

  const handleCardSubmit = () => {
    if (cardNumber.length >= 4) {
      setCardEntered(true);
    }
    setShowModal(false);
  };

  const handleCashSubmit = () => {
    if (cashNumber != null) {
      setCashEntered(true);
    }
    setShowCashModal(false);
  };

  const createCartIfNotExist = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) throw new Error("No token found");

      const cartData = await fetchQueryData(token, {
        table: "cart",
        columns: "cart_id",
        where: `user_id = '${cashier_id}'`,
      });

      if (cartData.length > 0) {
        for (const cart of cartData) {
          const cartDetails = await fetchQueryData(token, {
            table: "cart_details",
            columns: "cart_id",
            where: `cart_id = '${cart.cart_id}'`,
          });

          if (cartDetails.length === 0) {
            localStorage.setItem("selectedCartId", cart.cart_id);
            console.log("Selected existing empty cart:", cart.cart_id);
            return;
          }
        }
      }

      // If all carts have cart_details or no carts exist, create a new cart
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/insert/cart`,
        { user_id: cashier_id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const newCartId = response.data.id;
      console.log("Cart created successfully", newCartId);
      localStorage.setItem("selectedCartId", newCartId);
    } catch (error) {
      console.error("Error checking or creating cart:", error);
    }
  };

  const handleDeleteOrder = async (productId) => {
    try {
      const token = localStorage.getItem("accessToken");
      const cartId = localStorage.getItem("selectedCartId"); // Retrieve selected cart ID

      if (!token) {
        console.error("No token found");
        return;
      }
      if (!cartId) {
        console.error("No cart selected!");
        return;
      }

      console.log(`Deleting product ${productId} from cart ${cartId}`); // Debugging log

      // API call to delete the item from cart_details
      await axios.delete(
        `${process.env.REACT_APP_API_URL}/delete/cart_details`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          data: {
            cart_id: cartId,
            product_id: productId,
          },
        }
      );
      // Remove item from UI
      setOrders((prevOrders) =>
        prevOrders.filter((order) => order.id !== productId)
      );
      console.log(`Product ${productId} deleted successfully`);
    } catch (error) {
      console.error("Error deleting order:", error);
    }
  };

  useEffect(() => {
    createCartIfNotExist();
  }, [cartCreated]);

  useEffect(() => {
    const fetchCarts = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        if (!token) throw new Error("No token found");

        const cartData = await fetchQueryData(token, {
          table: "cart",
          columns: "*",
          where: `user_id = '${cashier_id}'`,
        });

        if (cartData.length > 0) {
          setModalOpen(false);
        }
      } catch (error) {
        console.error("Error fetching carts:", error);
      }
    };
    fetchCarts();
  }, []);

  // Fetch Products and Categories
  useEffect(() => {
    const fetchDataAsync = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("accessToken");
        if (!token) throw new Error("No token found");

        const categoriesData = await fetchData(token, "categories");

        const productsData = await fetchQueryData(token, {
          table:
            "iposal.products INNER JOIN categories ON products.category_id = categories.category_id LEFT JOIN discounts ON products.product_id = discounts.product_id",
          columns:
            "*,products.product_id AS productID, products.name AS productName, categories.category_id AS categoryID, categories.name AS categoryName, discounts.discount_percent, CASE WHEN discounts.product_id IS NULL THEN 'none' WHEN NOW() BETWEEN discounts.start_date AND discounts.end_date THEN 'active' WHEN NOW() > discounts.end_date THEN 'expired' ELSE 'none' END AS discount_status, CASE WHEN NOW() BETWEEN discounts.start_date AND discounts.end_date THEN products.selling_price - (discounts.discount_percent * products.selling_price) ELSE products.selling_price END AS current_price",
        });

        setProducts(productsData);

        const decodedCategories = [
          { categoryID: "All", categoryName: "All" },
          ...categoriesData.map((category) => ({
            categoryID: category.category_id,
            categoryName: decodeBase64(category.name),
          })),
        ];

        setCategories(decodedCategories);
        setFilteredProducts(productsData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDataAsync();
  }, []); // This effect will run only once when the component mounts

  // Handle Search Submit
  const handleSearchSubmit = (e) => {
    e.preventDefault();

    const searchQueryTrimmed = searchQuery.trim().toLowerCase();

    if (searchQueryTrimmed) {
      const matchingProduct = products.find(
        (product) =>
          decodeBase64(product.barcode).toLowerCase() === searchQueryTrimmed
      );

      if (matchingProduct) {
        const existingOrder = orders.find(
          (order) => order.id === matchingProduct.productID
        );

        if (existingOrder) {
          updateOrderQuantity(existingOrder.id, existingOrder.quantity + 1);
        } else {
          addToOrders(matchingProduct);
        }

        setSearchQuery(""); // Clear the search query
      } else {
        alert(`No product found with barcode: "${searchQuery}"`);
      }
    }
  };

  // Handle Search Query Change
  const handleSearchQueryChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Add Product to Orders
  const addToOrders = async (product) => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) throw new Error("No token found");

      const cartId = localStorage.getItem("selectedCartId"); // Get correct cart_id

      if (!cartId) {
        console.error("No cart selected!");
        return;
      }

      // Check if the product is already in the cart_details
      const existingCartItem = orders.find(
        (order) => order.id === product.productID
      );

      if (existingCartItem) {
        // If it exists, update the quantity
        const updatedData = {
          data: {
            quantity: existingCartItem.quantity + 1,
          },
          conditions: {
            cart_id: cartId,
            product_id: product.productID,
          },
        };

        await axios.put(
          `${process.env.REACT_APP_API_URL}/update/cart_details`,
          updatedData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
      } else {
        // If it's a new item, insert it into cart_details
        await axios.post(
          `${process.env.REACT_APP_API_URL}/insert/cart_details`,
          {
            cart_id: cartId,
            product_id: product.productID,
            quantity: 1,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
      }

      // Update UI state
      setOrders((prevOrders) => {
        const existingOrderIndex = prevOrders.findIndex(
          (order) => order.id === product.productID
        );

        if (existingOrderIndex >= 0) {
          const updatedOrders = [...prevOrders];
          updatedOrders[existingOrderIndex].quantity += 1;
          return updatedOrders;
        } else {
          return [
            ...prevOrders,
            {
              id: product.productID,
              name: decodeBase64(product.productName),
              description: decodeBase64(product.description),
              selling_price: product.selling_price || 0,
              quantity: 1,
              discount_percent: product.discount_percent,
              discount_status: product.discount_status,
              current_price: product.current_price,
            },
          ];
        }
      });
    } catch (error) {
      console.error("Error adding/updating cart:", error);
    }
  };

  // Handle Order Quantity Update
  const updateOrderQuantity = (id, newQuantity) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === id
          ? { ...order, quantity: Math.max(newQuantity, 1) }
          : order
      )
    );
  };

  // Handle Place Order
  const handlePlaceOrder = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const cartId = localStorage.getItem("selectedCartId");
      if (!token) throw new Error("No token found");

      // Calculate total amount
      const totalAmount = orders.reduce(
        (total, order) =>
          total + decodeBase64(order.current_price) * order.quantity,
        0
      );

      // Insert into 'sales' table
      const salesResponse = await axios.post(
        `${process.env.REACT_APP_API_URL}/insert/sales`,
        {
          total_amount: totalAmount,
          payment_method: paymentMethod,
          cashier_id: cashier_id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const saleId = salesResponse.data.id; // Get generated sale_id
      console.log("Sales inserted successfully. Sale ID:", saleId);

      // Insert each order item into 'sale_details'
      for (const order of orders) {
        await axios.post(
          `${process.env.REACT_APP_API_URL}/insert/sale_details`,
          {
            sale_id: saleId,
            product_id: order.id,
            quantity: order.quantity,
            price: decodeBase64(order.selling_price),
            discount_percent: order.discount_percent
              ? decodeBase64(order.discount_percent)
              : 0, // Default to 0 if null
            discounted_price: decodeBase64(order.current_price),
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
      }
      console.log("Sale details inserted successfully!");

      await axios.delete(
        `${process.env.REACT_APP_API_URL}/delete/cart_details`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          data: {
            cart_id: cartId,
          },
        }
      );
      console.log("Cart details deleted successfully!");

      await axios.delete(`${process.env.REACT_APP_API_URL}/delete/cart`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        data: {
          cart_id: cartId,
        },
      });
      console.log("Cart deleted successfully!");

      setSalesID(saleId);
      setReceiptModalOpen(true);
    } catch (error) {
      console.error("Error placing order:", error);
      alert("Failed to place the order. Please try again.");
    }
  };

  // Handle Continue to Payment
  const handleContinueToPayment = () => {
    setShowPaymentOptions(true);
  };

  // Apply Voucher Code
  const applyVoucherCode = () => {
    console.log("Applying voucher code:", voucherCode);
  };

  const useWindowWidth = () => {
    const [width, setWidth] = useState(window.innerWidth);

    useEffect(() => {
      const handleResize = () => setWidth(window.innerWidth);
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }, []);

    return width;
  };

  const screenWidth = useWindowWidth();

  return (
    <div className="container-fluid">
      <div className="row">
        <CartModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          userId={cashier_id}
          setOrders={setOrders}
        />
        <ReceiptModal
          isOpen={receiptModalOpen}
          onClose={() => setReceiptModalOpen(false)}
          userId={cashier_id}
          salesID={salesID}
          orders={orders}
          cashNumber={cashNumber}
        />

        {/* Menu Section */}
        <div className="col-md-8 py-3">
          <div className="d-flex justify-content-between align-items-center">
            <h2 className="page-title">Choose Products</h2>
            <form onSubmit={handleSearchSubmit}>
              <input
                type="text"
                className="form-control"
                placeholder="Enter Product..."
                value={searchQuery}
                onChange={handleSearchQueryChange}
              />
            </form>
          </div>

          {/* Categories Section */}
          <div className="mt-3 categories-sec">
            <nav>
              <ul
                className={`nav ${
                  screenWidth <= 768 ? "categories-container" : ""
                }`}
              >
                {screenWidth <= 768 ? (
                  // Mobile: Show all categories in a horizontal scroll
                  categories.map((category) => (
                    <li className="nav-item" key={category.categoryID}>
                      <button
                        className={`nav-link ${
                          selectedCategory === category.categoryID
                            ? "active"
                            : ""
                        }`}
                        onClick={() => setSelectedCategory(category.categoryID)}
                      >
                        {category.categoryName}
                      </button>
                    </li>
                  ))
                ) : (
                  // Desktop: Show top 5 categories and dropdown
                  <>
                    {categories.slice(0, 5).map((category) => (
                      <li className="nav-item" key={category.categoryID}>
                        <button
                          className={`nav-link ${
                            selectedCategory === category.categoryID
                              ? "active"
                              : ""
                          }`}
                          onClick={() =>
                            setSelectedCategory(category.categoryID)
                          }
                        >
                          {category.categoryName}
                        </button>
                      </li>
                    ))}
                    {categories.length > 5 && (
                      <li className="nav-item dropdown">
                        <button
                          className="nav-link dropdown-toggle"
                          id="categoryDropdown"
                          data-bs-toggle="dropdown"
                          aria-expanded="false"
                        >
                          More
                        </button>
                        <ul
                          className="dropdown-menu"
                          aria-labelledby="categoryDropdown"
                        >
                          {categories.slice(5).map((category) => (
                            <li key={category.categoryID}>
                              <button
                                className={`dropdown-item ${
                                  selectedCategory === category.categoryID
                                    ? "active"
                                    : ""
                                }`}
                                onClick={() =>
                                  setSelectedCategory(category.categoryID)
                                }
                              >
                                {category.categoryName}
                              </button>
                            </li>
                          ))}
                        </ul>
                      </li>
                    )}
                  </>
                )}
              </ul>
            </nav>
            <hr></hr>
          </div>

          {/* Display products */}
          <div className="row g-3 mt-3">
            {loading ? (
              <p>Loading products...</p>
            ) : filteredProducts.length > 0 ? (
              filteredProducts.map((product) => {
                const order = orders.find((o) => o.id === product.productID);
                const orderCount = order ? order.quantity : 0; // Get the count of the product in the orders

                return (
                  <div
                    className="col-xl-2 col-md-3 col-sm-3 col-4"
                    key={product.productID}
                    onClick={() => addToOrders(product)}
                  >
                    <div className="card menu-card position-relative">
                      <img
                        src={`/product_images/${product.productID}.png`}
                        className="img-fluid"
                        alt={decodeBase64(product.productName || "Dish")}
                      />
                      <div className="card-body text-center">
                        <span className="text-bold">
                          {decodeBase64(product.productName || "Dish")}
                        </span>
                        <p className="card-price">
                          ₱{decodeBase64(product.selling_price)}
                        </p>
                        <span className="badge bg-primary">
                          {decodeBase64(product.categoryName || "Dish")}
                        </span>
                      </div>

                      {/* Order Count Badge */}
                      {orderCount > 0 && (
                        <div
                          className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-primary"
                          style={{ zIndex: 0 }}
                        >
                          {orderCount}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            ) : (
              <p>No products available for the selected category.</p>
            )}
          </div>
        </div>

        {/* Order Summary Section */}
        <div className="col-md-4 py-3">
          <div className="order-summary p-3">
            <div className="d-flex justify-content-between align-items-center">
              <h5 className="section-title">Order Summary</h5>
              <button
                className="btn btn-link p-0 text-muted"
                onClick={() => setModalOpen(true)}
              >
                Unfinished Transactions
              </button>
            </div>

            <ul className="list-group list-group-flush">
              {orders.length > 0 ? (
                orders.map((order) => (
                  <li
                    className="list-group-item bg-transparent text-white"
                    key={order.id}
                  >
                    <div className="row align-items-center">
                      {/* A1-A2: Image */}
                      <div className="col-2 text-center">
                        <img
                          src={`/product_images/${order.id}.png`}
                          alt={order.name}
                          className="img-fluid rounded"
                          style={{ maxHeight: "70px", objectFit: "cover" }}
                        />
                      </div>

                      {/* B1-C1: Name */}
                      <div className="col-7">
                        <div className="fw-bold">{order.name}</div>
                        <div className="d-flex justify-content-between mt-2">
                          {/* B2: Cost */}
                          {decodeBase64(order.discount_status) === "active" ? (
                            <>
                              <span className="text-start">
                                ₱
                                {decodeBase64(order.current_price) *
                                  order.quantity}
                              </span>
                              <span className="text-muted ms-2 text-decoration-line-through">
                                ₱{decodeBase64(order.selling_price)}
                              </span>
                            </>
                          ) : (
                            <span className="text-start">
                              ₱{decodeBase64(order.current_price)}
                            </span>
                          )}

                          {/* C2: Count */}
                          <input
                            type="number"
                            className="form-control text-center"
                            style={{ maxWidth: "70px" }}
                            value={order.quantity}
                            onChange={(e) =>
                              updateOrderQuantity(
                                order.id,
                                parseInt(e.target.value, 10) || 1
                              )
                            }
                          />
                        </div>
                      </div>
                      {/* D1-D2: Delete Button */}
                      <div className="col-3 text-right">
                        <button
                          className="btn btn-sm custom-btn me-3"
                          onClick={() => handleDeleteOrder(order.id)}
                        >
                          <FaTrashAlt size={16} />
                        </button>
                      </div>
                    </div>
                  </li>
                ))
              ) : (
                <li className="list-group-item bg-transparent text-white text-center">
                  No orders yet.
                </li>
              )}
            </ul>

            {/* Payment Method Section */}
            {showPaymentOptions && (
              <div className="payment-methods mt-4">
                <h6>Select Payment Method</h6>

                {/* Credit/Debit Card Option */}
                <div
                  className={`payment-card d-flex align-items-center mb-3 ${
                    paymentMethod === "Credit/Debit Card" ? "selected" : ""
                  }`}
                  onClick={() => handlePaymentMethodChange("Credit/Debit Card")}
                >
                  <div className="d-flex align-items-center w-100">
                    <div className="flex-grow-1">
                      <div className="d-flex justify-content-between">
                        <span>
                          <button className="payment-icon">
                            <FaCreditCard size={16} />
                          </button>
                          Credit/Debit Card
                        </span>
                        <input
                          type="radio"
                          className="form-check-input"
                          name="paymentMethod"
                          checked={paymentMethod === "Credit/Debit Card"}
                          readOnly
                        />
                      </div>
                      <hr></hr>
                      <div className="d-flex justify-content-between mt-1">
                        <span className="text-muted">
                          {cardEntered
                            ? `**** **** **** ${cardNumber.slice(-4)}`
                            : "Tap to add card"}
                          {cardEntered && (
                            <button
                              className="btn btn-link p-0 ms-2 text-muted"
                              onClick={() => setShowModal(true)}
                            >
                              Edit
                            </button>
                          )}
                        </span>
                        <img src={debitCredit} className="card-payments" />
                      </div>
                    </div>
                  </div>
                </div>
                {/* Credit/Debit Card Modal */}
                {showModal && (
                  <div
                    className="modal show d-block"
                    tabIndex="-1"
                    role="dialog"
                    style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
                  >
                    <div className="modal-dialog" role="document">
                      <div className="modal-content p-4">
                        <div className="modal-header">
                          <h5 className="modal-title">Enter Card Details</h5>
                        </div>
                        <div className="modal-body">
                          <input
                            type="text"
                            placeholder="Card Number"
                            className="form-control mb-2"
                            onChange={(e) => setCardNumber(e.target.value)}
                          />
                          <input
                            type="text"
                            placeholder="Expiration Date"
                            className="form-control mb-2"
                          />
                          <input
                            type="text"
                            placeholder="CVV"
                            className="form-control mb-2"
                          />
                        </div>
                        <div className="modal-footer">
                          <button
                            className="btn btn-primary"
                            onClick={handleCardSubmit}
                          >
                            Submit
                          </button>
                          <button
                            className="btn btn-secondary"
                            onClick={() => setShowModal(false)}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* E-Wallet Option */}
                <div
                  className={`payment-card d-flex align-items-center mb-3 ${
                    paymentMethod === "E-Wallet" ? "selected" : ""
                  }`}
                  onClick={() => handlePaymentMethodChange("E-Wallet")}
                >
                  <div className="d-flex align-items-center w-100">
                    {/* Icon */}
                    <button className="payment-icon">
                      <FaWallet size={16} />
                    </button>

                    {/* Texts */}
                    <div className="flex-grow-1">
                      <div className="d-flex justify-content-between">
                        <span>E-Wallet</span>
                        <input
                          type="radio"
                          className="form-check-input"
                          name="paymentMethod"
                          checked={paymentMethod === "E-Wallet"}
                          readOnly
                        />
                      </div>
                      <div className="mt-1">
                        <span className="discount-tag">
                          Get ₱10.00 discount
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* E-Wallet Sub-Options */}
                {paymentMethod === "E-Wallet" && (
                  <div className="ewallet-options ms-4 mt-2">
                    <div className="form-check">
                      <input
                        type="radio"
                        className="form-check-input"
                        id="maya"
                        name="ewalletOption"
                        onChange={() => setEwalletOption("Maya")}
                      />
                      <label className="form-check-label" htmlFor="maya">
                        Maya E-Wallet
                      </label>
                    </div>
                    <div className="form-check">
                      <input
                        type="radio"
                        className="form-check-input"
                        id="gcash"
                        name="ewalletOption"
                        onChange={() => setEwalletOption("GCash")}
                      />
                      <label className="form-check-label" htmlFor="gcash">
                        GCash E-Wallet
                      </label>
                    </div>
                    <div className="form-check">
                      <input
                        type="radio"
                        className="form-check-input"
                        id="grab"
                        name="ewalletOption"
                        onChange={() => setEwalletOption("Grab")}
                      />
                      <label className="form-check-label" htmlFor="grab">
                        Grab E-Wallet
                      </label>
                    </div>
                  </div>
                )}

                {/* Cash Option */}
                <div
                  className={`payment-card d-flex align-items-center mb-3 ${
                    paymentMethod === "Cash" ? "selected" : ""
                  }`}
                  onClick={() => handlePaymentMethodChange("Cash")}
                >
                  <div className="d-flex align-items-center w-100">
                    <div className="flex-grow-1">
                      <div className="d-flex justify-content-between">
                        <span>
                          <button className="payment-icon">
                            <FaMoneyBill size={16} />
                          </button>
                          Cash
                        </span>
                        <input
                          type="radio"
                          className="form-check-input"
                          name="paymentMethod"
                          checked={paymentMethod === "Cash"}
                          readOnly
                        />
                      </div>
                      <hr></hr>
                      <div className="d-flex justify-content-between mt-1">
                        <span className="text-muted">
                          {cashEntered
                            ? `Amount: ₱${cashNumber}`
                            : "Tap to enter amount "}
                          {cashEntered && (
                            <button
                              className="btn btn-link p-0 ms-2 text-muted"
                              onClick={() => setShowCashModal(true)}
                            >
                              Edit
                            </button>
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Cash Option Modal*/}
                {showCashModal && (
                  <div
                    className="modal show d-block"
                    tabIndex="-1"
                    role="dialog"
                    style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
                  >
                    <div className="modal-dialog" role="document">
                      <div className="modal-content p-4">
                        <div className="modal-header">
                          <h3>Enter Cash</h3>
                        </div>
                        <div className="modal-body">
                          <input
                            type="number"
                            placeholder="Amount"
                            className="form-control mb-2"
                            onChange={(e) => setCashNumber(e.target.value)}
                          />
                        </div>
                        <div className="modal-footer">
                          <button
                            className="btn btn-primary"
                            onClick={handleCashSubmit}
                          >
                            Submit
                          </button>
                          <button
                            className="btn btn-secondary"
                            onClick={() => setShowCashModal(false)}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/*  Discount Code */}
                <div className="d-flex align-items-center w-100">
                  <div className="flex-grow-1">
                    <div className="d-flex justify-content-between">
                      <input
                        type="text"
                        placeholder="Enter Voucher Code"
                        className="inline-left-custom form-control mb-2 w-100 "
                      />
                      <button className="inline-right-custom btn btn-primary w-25 mb-2">
                        Apply
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Subtotal Section */}
            {showOtherOptions && (
              <div className="mt-3">
                <div className="d-flex justify-content-between">
                  <span>Subtotal</span>
                  <span>
                    ₱
                    {orders
                      .reduce(
                        (total, order) =>
                          total +
                          decodeBase64(order.selling_price) * order.quantity,
                        0
                      )
                      .toFixed(2)}
                  </span>
                </div>
                <div className="d-flex justify-content-between">
                  <p>Discount</p>
                  <span>
                    ₱
                    {orders
                      .reduce(
                        (total, order) =>
                          total +
                          (decodeBase64(order.selling_price) -
                            decodeBase64(order.current_price)) *
                            order.quantity,
                        0
                      )
                      .toFixed(2)}
                  </span>
                </div>
                <div className="d-flex justify-content-between">
                  <span>Total</span>
                  <span>
                    ₱
                    {orders
                      .reduce(
                        (total, order) =>
                          total +
                          decodeBase64(order.current_price) * order.quantity,
                        0
                      )
                      .toFixed(2)}
                  </span>
                </div>

                <button
                  className="btn btn-primary w-100 mt-3"
                  onClick={
                    showPaymentOptions
                      ? handlePlaceOrder
                      : handleContinueToPayment
                  }
                >
                  {showPaymentOptions ? "Place Order" : "Continue to Payment"}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sales;
