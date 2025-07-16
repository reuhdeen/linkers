// src/bo/tabs/MediaTab.jsx

import React, { useState, useEffect } from "react";
import axios from "axios";
import { updateQueryData } from "../../api/updateData";

const MediaTab = ({ data = {}, onChange }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [debugInfo, setDebugInfo] = useState({});

  useEffect(() => {
  console.log("📦 MediaTab product_id:", data.product_id);
  console.log("📷 MediaTab media_url:", data.media_url);
}, [data]);

  useEffect(() => {
    if (selectedFile) {
      const reader = new FileReader();
      reader.onloadend = () => setPreviewImage(reader.result);
      reader.readAsDataURL(selectedFile);

      setDebugInfo({
        filename: selectedFile.name,
        type: selectedFile.type,
        size: `${(selectedFile.size / 1024).toFixed(2)} KB`,
      });
    } else {
      setPreviewImage(null);
      setDebugInfo({});
    }
  }, [selectedFile]);

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setUploadError("Invalid file type. Please upload an image.");
      return;
    }

    setUploadError("");
    setSelectedFile(file);
  };

  const handleUploadImage = async () => {
    const token = localStorage.getItem("accessToken");
    const productId = parseInt(data.product_id, 10);

    if (!token) {
      setUploadError("Missing access token");
      return;
    }
    if (!selectedFile) {
      setUploadError("Please select a file first");
      return;
    }
    if (!productId) {
      setUploadError("Missing or invalid product ID");
      console.warn("Upload blocked — product_id:", data.product_id);
      return;
    }

    setIsUploading(true);
    setUploadError("");

    try {
      const formData = new FormData();
      formData.append("image", selectedFile);

      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/image/upload`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const imageUrl = response.data?.image_url;
      if (!imageUrl) throw new Error("No image_url returned from server");

      await updateQueryData(
        token,
        "products",
        { media_url: imageUrl },
        { product_id: productId }
      );

      onChange({ ...data, media_url: imageUrl });
      setSelectedFile(null);
      alert("✅ Image uploaded successfully");
    } catch (err) {
      console.error("❌ Upload error:", err.response?.data || err.message);
      setUploadError("Upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="card mb-4">
      <div className="card-body">
        <h5 className="mb-4">Product Media</h5>

        <div className="row">
          {/* Current Image */}
          <div className="col-md-6 mb-4">
            <label className="form-label">Current Image</label>
            {data.media_url ? (
              <img
                src={data.media_url}
                alt="Current product"
                className="img-fluid border rounded"
              />
            ) : (
              <div className="text-muted text-center border rounded py-5">
                No image uploaded
              </div>
            )}
          </div>

          {/* Upload Panel */}
          <div className="col-md-6">
            <label className="form-label">Upload New Image</label>
            <input
              type="file"
              accept="image/*"
              className="form-control"
              onChange={handleFileSelect}
              disabled={isUploading}
            />

            {previewImage && (
              <img
                src={previewImage}
                alt="Preview"
                className="img-fluid border rounded mt-3"
              />
            )}

            {uploadError && (
              <div className="text-danger mt-2">{uploadError}</div>
            )}

            <button
              type="button"
              className="btn btn-primary mt-3"
              onClick={handleUploadImage}
              disabled={isUploading || !selectedFile}
            >
              {isUploading ? "Uploading…" : "Upload & Save"}
            </button>

            {Object.keys(debugInfo).length > 0 && (
              <div className="mt-3 text-muted small">
                <strong>Debug Info:</strong>
                <ul className="mb-0">
                  {Object.entries(debugInfo).map(([key, value]) => (
                    <li key={key}>
                      {key}: <code>{value}</code>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MediaTab;