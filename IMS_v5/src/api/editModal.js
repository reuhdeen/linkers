import React, { useState, useEffect } from "react";
import axios from "axios";
import "../css/modal.css";
import { decodeBase64 } from "../api/decodeBase64";

const EditModal = ({
  isOpen,
  onClose,
  data,
  fields,
  onSubmit,
  apiEndpoint,
  primaryKey,
  title,
}) => {
  const [formData, setFormData] = useState({});

  // Initialize form data **only once when modal opens**
  useEffect(() => {
    if (isOpen && data) {
      setFormData((prevFormData) => {
        if (Object.keys(prevFormData).length === 0) {
          return fields.reduce((acc, { key, decode }) => {
            acc[key] = decode ? decodeBase64(data[key]) || "" : data[key] || "";
            return acc;
          }, {});
        }
        return prevFormData;
      });
    }
  }, [isOpen, data, fields]); // Runs only when modal opens

  if (!isOpen) return null;

  // ✅ Correctly updates `formData` when user types
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // 🛠️ Handles form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) throw new Error("No token found");

      const updatedData = {
        data: { ...formData },
        conditions: { [primaryKey]: data[primaryKey] },
      };

      await axios.put(
        `${process.env.REACT_APP_API_URL}${apiEndpoint}`,
        updatedData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      alert("Update successful!");
      onSubmit(); // Refresh parent data
      onClose(); // Close modal
    } catch (error) {
      console.error("Error updating:", error);
      alert(`Error: ${error.message}`);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-button" onClick={onClose}>
          &times;
        </button>
        <h3>{title}</h3>
        <form onSubmit={handleSubmit}>
          {fields.map(({ key, label, type }) => (
            <div key={key} className="mb-3">
              <label>{label}: </label>
              {type === "textarea" ? (
                <textarea
                  className="form-control"
                  name={key}
                  value={
                    typeof formData[key] === "string"
                      ? decodeBase64(formData[key])
                      : formData[key] ?? ""
                  }
                  onChange={handleChange}
                />
              ) : (
                <input
                  className="form-control"
                  type={type}
                  name={key}
                  value={
                    typeof formData[key] === "string"
                      ? decodeBase64(formData[key])
                      : formData[key] ?? ""
                  }
                  onChange={handleChange}
                />
              )}
            </div>
          ))}
          <button type="submit" className="btn btn-sm btn-primary">
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditModal;
