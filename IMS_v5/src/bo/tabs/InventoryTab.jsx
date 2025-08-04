// src/bo/tabs/InventoryTab.jsx

import React, { useState, useEffect } from "react";
import axios from "axios";
import { fetchQueryData } from "../../api/fetchData";
import { updateQueryData } from "../../api/updateData";
import { decodeBase64 } from "../../utils/decode";
import { FaTrash, FaFileCsv, FaRegEdit } from "react-icons/fa";

const blankInventory = {
  inventory_id: 0,
  product_variant_id: "",
  warehouse_id: "",
  inventory_type_id: "",
  quantity_in_stock: 0,
  reorder_level: "",
  batch_number: "",
  expiration_date: "",
  storage_zone: "",
  inventory_status: "in_stock",
  location_code: "",
};

export default function InventoryTab({ productId }) {
  const [rows, setRows] = useState([]);
  const [variantsList, setVariantsList] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [types, setTypes] = useState([]);
  const [zonesList, setZonesList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState(new Set());
  const [filters, setFilters] = useState({
    warehouse: "",
    type: "",
    status: "",
    search: "",
  });

  // Localized alert state
  const [inventoryMsg, setInventoryMsg] = useState("");
  const [inventoryType, setInventoryType] = useState("success");

  const [showModal, setShowModal] = useState(false);
  const [modalInv, setModalInv] = useState({ ...blankInventory });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    async function fetchAll() {
    await loadVariants();
    await loadWarehouses();
    await loadTypes();
    await loadStorageZones();
    await loadInventory();
    }
    fetchAll();
  }, [productId]);

  async function loadStorageZones() {
    try {
      const data = await fetchQueryData(localStorage.getItem("accessToken"), {
        table: "storage_zones",
        columns: "storage_zone_id, zone_name",
        where: "is_active = 1",
        order: "zone_name ASC",
      });
      setZonesList(
        (data || []).map((z) => ({
          storage_zone_id: z.storage_zone_id,
          zone_name: decodeBase64(z.zone_name),
        }))
      );
    } catch (e) {
      console.error("Error loading zones:", e);
    }
  }

  async function loadVariants() {
    if (!productId) return setVariantsList([]);
    try {
      const data = await fetchQueryData(localStorage.getItem("accessToken"), {
        table: "product_variants",
        columns: "product_variant_id, sku",
        where: `product_id = ${productId}`,
      });
      setVariantsList(
        (data || []).map((v) => ({
          product_variant_id: v.product_variant_id,
          sku: decodeBase64(v.sku),
        }))
      );
    } catch (e) {
      console.error("Error loading variants:", e);
    }
  }

  async function loadWarehouses() {
    try {
      const data = await fetchQueryData(localStorage.getItem("accessToken"), {
        table: "warehouses",
        columns: "warehouse_id, name",
      });
      setWarehouses(
        (data || []).map((w) => ({
          warehouse_id: w.warehouse_id,
          name: decodeBase64(w.name),
        }))
      );
    } catch (e) {
      console.error("Error loading warehouses:", e);
    }
  }

  async function loadTypes() {
    try {
      const data = await fetchQueryData(localStorage.getItem("accessToken"), {
        table: "inventory_type",
        columns: "inventory_type_id, name",
      });
      setTypes(
        (data || []).map((t) => ({
          inventory_type_id: t.inventory_type_id,
          name: decodeBase64(t.name),
        }))
      );
    } catch (e) {
      console.error("Error loading types:", e);
    }
  }

  async function loadInventory() {
    if (!productId) return setRows([]);
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("accessToken");
      const data = await fetchQueryData(token, {
        table:
          "inventory LEFT JOIN product_variants ON product_variants.product_variant_id = inventory.product_variant_id",
        columns: "inventory.*, product_variants.sku AS variant_sku",
        where: `product_variants.product_id = ${productId}`,
      });
      setRows(
        (data || []).map((r) => ({
          inventory_id: r.inventory_id,
          product_variant_id: decodeBase64(r.product_variant_id),
          variant_sku: decodeBase64(r.variant_sku),
          warehouse_id: decodeBase64(r.warehouse_id),
          inventory_type_id: decodeBase64(r.inventory_type_id),
          quantity_in_stock: parseFloat(decodeBase64(r.quantity_in_stock)),
          reorder_level: r.reorder_level
            ? parseFloat(decodeBase64(r.reorder_level))
            : "",
          batch_number: r.batch_number ? decodeBase64(r.batch_number) : "",
          expiration_date: r.expiration_date
            ? decodeBase64(r.expiration_date)
            : "",
          storage_zone: r.storage_zone ? decodeBase64(r.storage_zone) : "",
          inventory_status: decodeBase64(r.inventory_status),
          location_code: r.location_code ? decodeBase64(r.location_code) : "",
        }))
      );
    } catch (e) {
      console.error("Error loading inventory:", e);
      setError("Failed to load inventory.");
    } finally {
      setLoading(false);
    }
  }

  const filtered = rows.filter((r) => {
    if (filters.warehouse && r.warehouse_id !== filters.warehouse) return false;
    if (filters.type && r.inventory_type_id !== filters.type) return false;
    if (filters.status && r.inventory_status !== filters.status) return false;
    if (
      filters.search &&
      !r.product_variant_id.toLowerCase().includes(filters.search.toLowerCase())
    )
      return false;
    return true;
  });

  function handleSelectAll(e) {
    setSelected(e.target.checked ? new Set(filtered.map((r) => r.inventory_id)) : new Set());
  }

  function handleSelectOne(id) {
    return (e) => {
      const s = new Set(selected);
      e.target.checked ? s.add(id) : s.delete(id);
      setSelected(s);
    };
  }

  async function handleBulkDelete(ids = selected) {
    if (!ids.size) return;

    setLoading(true);
    setInventoryMsg("");      // clear old banner
    setError("");             // if you still use `error` for fetch failures

    try {
      const token = localStorage.getItem("accessToken");

      // delete each selected record
      for (let id of ids) {
        await axios.delete(
          `${process.env.REACT_APP_API_URL}/delete/inventory`,
          {
            data: { inventory_id: id },
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      }

      setSelected(new Set());
      await loadInventory();

      // show success banner
      setInventoryType("success");
      setInventoryMsg(`${ids.size} item${ids.size > 1 ? "s" : ""} deleted successfully.`);
    } catch (e) {
      console.error("Error bulk deleting:", e);

      // show error banner
      setInventoryType("danger");
      setInventoryMsg("Delete failed: " + (e.message || "Unknown error"));
    } finally {
      setLoading(false);
    }
  }

  function handleAddClick() {
    setModalInv({ ...blankInventory });
    setEditingId(null);
    setInventoryMsg("");        // clear old alert
    setInventoryType("success"); 
    setShowModal(true);
  }

  function handleEditClick(r) {
    setModalInv({ ...r });
    setEditingId(r.inventory_id);
    setInventoryMsg("");        // clear old alert
    setInventoryType("success");
    setShowModal(true);
  }

  async function handleModalSave() {
  setLoading(true);
  setError("");
  setInventoryMsg("");        // clear old alert
  setInventoryType("success");

  try {
    const token = localStorage.getItem("accessToken");
    const p = modalInv;
    const payload = {
      product_variant_id: p.product_variant_id,
      warehouse_id:        p.warehouse_id,
      inventory_type_id:   p.inventory_type_id,
      quantity_in_stock:   p.quantity_in_stock,
      reorder_level:       p.reorder_level || null,
      batch_number:        p.batch_number || null,
      expiration_date:     p.expiration_date || null,
      storage_zone:        p.storage_zone || null,
      inventory_status:    p.inventory_status,
      location_code:       p.location_code || null,
    };

    let result;
    let isSuccess = false;

    if (editingId) {
      // Returns { message, rows }
      result = await updateQueryData(
        token,
        "inventory",
        payload,
        { inventory_id: editingId }
      );
      // success if rows is a number
      isSuccess = result && typeof result.rows === "number";
    } else {
      const resp = await axios.post(
        `${process.env.REACT_APP_API_URL}/insert/inventory`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      result    = resp;
      isSuccess = resp.status === 200 || resp.status === 201;
    }

    if (isSuccess) {
      setInventoryMsg(
        editingId
          ? "Inventory updated successfully."
          : "Inventory added successfully."
      );
      setInventoryType("success");
      await loadInventory();
      setShowModal(false);
    } else {
      setInventoryMsg("Save failed. Please try again.");
      setInventoryType("danger");
    }
  } catch (e) {
    console.error("Error saving inventory:", e);
    setInventoryMsg("Error saving inventory: " + (e.message || "Unknown error"));
    setInventoryType("danger");
  } finally {
    setLoading(false);
  }
}

  function exportCSV() {
    const header = [
      "Inventory ID",
      "Variant",
      "SKU",
      "Batch",
      "Inventory Type",
      "Warehouse",
      "Storage Zone",
      "Location",
      "Qty",
      "Reorder",
      "Expires",
      "Status",
    ];
    const rowsCsv = [
      header.join(","),
      ...filtered.map((r) => {
        const wh = warehouses.find((w) => w.warehouse_id === r.warehouse_id)?.name || "";
        const tp = types.find((t) => t.inventory_type_id === r.inventory_type_id)?.name || "";
        return [
          r.inventory_id,
          r.product_variant_id,
          r.variant_sku,
          `"${r.batch_number}"`,
          `"${tp}"`,
          `"${wh}"`,
          `"${r.storage_zone}"`,
          `"${r.location_code}"`,
          r.quantity_in_stock,
          r.reorder_level ?? "",
          `"${r.expiration_date}"`,
          `"${r.inventory_status}"`,
        ].join(",");
      }),
    ].join("\n");

    const blob = new Blob([rowsCsv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "inventory.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <>
      {inventoryMsg && !showModal && (
        <div className={`alert alert-${inventoryType} mb-3`}>
          {inventoryMsg}
        </div>
      )}

      {/* Filters */}
      <div className="row g-2 mb-3">
        <div className="col-md-2">
          <select
            className="form-select"
            value={filters.warehouse}
            onChange={(e) =>
              setFilters((f) => ({ ...f, warehouse: e.target.value }))
            }
          >
            <option value="">All Warehouses</option>
            {warehouses.map((w) => (
              <option key={w.warehouse_id} value={w.warehouse_id}>
                {w.name}
              </option>
            ))}
          </select>
        </div>
        <div className="col-md-2">
          <select
            className="form-select"
            value={filters.type}
            onChange={(e) => setFilters((f) => ({ ...f, type: e.target.value }))}
          >
            <option value="">All Types</option>
            {types.map((t) => (
              <option key={t.inventory_type_id} value={t.inventory_type_id}>
                {t.name}
              </option>
            ))}
          </select>
        </div>
        <div className="col-md-2">
          <select
            className="form-select"
            value={filters.status}
            onChange={(e) =>
              setFilters((f) => ({ ...f, status: e.target.value }))
            }
          >
            <option value="">All Status</option>
            <option value="in_stock">In Stock</option>
            <option value="reserved">Reserved</option>
            <option value="damaged">Damaged</option>
          </select>
        </div>
        <div className="col-md-4">
          &nbsp;
        </div>
        <div className="col-md-2 text-end">
          
          <button className="btn btn-outline-primary btn-sm me-2" onClick={loadInventory}>
            Refresh
          </button>

          <button className="btn btn-outline-primary btn-sm" onClick={exportCSV}>
            <FaFileCsv /> Export CSV
          </button>
        </div>
      </div>

        {/* Inventory table */}
  <div
    className="table-responsive mb-3"
    style={{ maxHeight: 400, overflowY: "auto" }}
  >
    <table className="table table-hover table-sm mb-0">
      <thead className="table-light sticky-top">
        <tr>
          <th>ID</th>
          <th>SKU</th>
          <th>Batch</th>
          <th>Inventory Type</th>
          <th>Warehouse/Building</th>
          <th>Storage Zone</th> {/* 🧩 Storage zone column */}
          <th>Location Code</th>
          <th>Qty</th>
          <th>Reorder</th>
          <th>Expires</th>
          <th>Status</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {filtered.map((r) => {
          const expired =
            r.expiration_date && new Date(r.expiration_date) < new Date();
          const lowStock =
            r.reorder_level !== "" &&
            r.quantity_in_stock <= r.reorder_level;
          const rowClass = expired
            ? "table-danger"
            : lowStock
            ? "table-warning"
            : "";
          return (
            <tr key={r.inventory_id} className={rowClass}>
              <td>{r.product_variant_id}</td>
              <td>{r.variant_sku}</td>
              <td>{r.batch_number}</td>
              <td>
                {
                  types.find(
                    (t) => t.inventory_type_id === r.inventory_type_id
                  )?.name
                }
              </td>
              <td>
                {
                  warehouses.find(
                    (w) => w.warehouse_id === r.warehouse_id
                  )?.name
                }
              </td>
              <td>{r.storage_zone}</td>
              <td>{r.location_code}</td>
              <td>{r.quantity_in_stock}</td>
              <td>{r.reorder_level}</td>
              <td>{r.expiration_date}</td>
              <td>{r.inventory_status}</td>
              <td className="text-center">
                <button type="button"
                  className="btn btn-sm btn-outline-primary me-1"
                  onClick={() => handleEditClick(r)}
                >
                  <FaRegEdit />
                </button>  
                <button type="button"
                  className="btn btn-sm btn-outline-danger"
                  onClick={() => handleBulkDelete(new Set([r.inventory_id]))}
                >
                  <FaTrash />
                </button>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  </div>

  <div className="d-flex justify-content-between mb-4">
   <button
     type="button"
     className="btn btn-success"
     onClick={handleAddClick}
   >
      ➕ Add Inventory
    </button>
  </div>


      {/* Add/Edit Modal */}
      {showModal && (
        <div
          className="modal fade show d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {editingId ? "Edit Inventory" : "Add Inventory"}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                />
              </div>
              <div className="modal-body">
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label">Variant</label>
                    <select
                      className="form-select"
                      value={modalInv.product_variant_id}
                      onChange={(e) =>
                        setModalInv((m) => ({
                          ...m,
                          product_variant_id: e.target.value,
                        }))
                      }
                    >
                      <option value="">Select variant</option>
                      {variantsList.map((v) => (
                        <option
                          key={v.product_variant_id}
                          value={v.product_variant_id}
                        >
                          {v.sku}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Warehouse</label>
                    <select
                      className="form-select"
                      value={modalInv.warehouse_id}
                      onChange={(e) =>
                        setModalInv((m) => ({
                          ...m,
                          warehouse_id: e.target.value,
                        }))
                      }
                    >
                      <option value="">Select warehouse</option>
                      {warehouses.map((w) => (
                        <option
                          key={w.warehouse_id}
                          value={w.warehouse_id}
                        >
                          {w.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Inventory Type</label>
                    <select
                      className="form-select"
                      value={modalInv.inventory_type_id}
                      onChange={(e) =>
                        setModalInv((m) => ({
                          ...m,
                          inventory_type_id: e.target.value,
                        }))
                      }
                    >
                      <option value="">Select type</option>
                      {types.map((t) => (
                        <option
                          key={t.inventory_type_id}
                          value={t.inventory_type_id}
                        >
                          {t.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-md-6">
                  <label className="form-label">Storage Zone</label>
                  <select
                    className="form-select"
                    value={modalInv.storage_zone}
                    onChange={(e) =>
                      setModalInv((m) => ({
                        ...m,
                        storage_zone: e.target.value,
                      }))
                    }
                  >
                    <option value="">Select zone</option>
                    {zonesList.map((z) => (
                      <option key={z.storage_zone_id} value={z.zone_name}>
                        {z.zone_name}
                      </option>
                    ))}
                  </select>
                </div>
                  <div className="col-md-6">
                    <label className="form-label">Quantity In Stock</label>
                    <input
                      type="number"
                      className="form-control"
                      value={modalInv.quantity_in_stock}
                      onChange={(e) =>
                        setModalInv((m) => ({
                          ...m,
                          quantity_in_stock: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Reorder Level</label>
                    <input
                      type="number"
                      className="form-control"
                      value={modalInv.reorder_level}
                      onChange={(e) =>
                        setModalInv((m) => ({
                          ...m,
                          reorder_level: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Batch Number</label>
                    <input
                      type="text"
                      className="form-control"
                      value={modalInv.batch_number}
                      onChange={(e) =>
                        setModalInv((m) => ({
                          ...m,
                          batch_number: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Expiration Date</label>
                    <input
                      type="date"
                      className="form-control"
                      value={modalInv.expiration_date}
                      onChange={(e) =>
                        setModalInv((m) => ({
                          ...m,
                          expiration_date: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Status</label>
                    <select
                      className="form-select"
                      value={modalInv.inventory_status}
                      onChange={(e) =>
                        setModalInv((m) => ({
                          ...m,
                          inventory_status: e.target.value,
                        }))
                      }
                    >
                      <option value="in_stock">In Stock</option>
                      <option value="reserved">Reserved</option>
                      <option value="damaged">Damaged</option>
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Location Code</label>
                    <input
                      type="text"
                      className="form-control"
                      value={modalInv.location_code}
                      onChange={(e) =>
                        setModalInv((m) => ({
                          ...m,
                          location_code: e.target.value,
                        }))
                      }
                    />
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>

                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleModalSave}
                >
                  Save Inventory
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Loading spinner */}
      {loading && (
        <div className="position-absolute top-50 start-50 translate-middle">
          <div className="spinner-border" role="status"></div>
        </div>
      )}
    </>
  );
}