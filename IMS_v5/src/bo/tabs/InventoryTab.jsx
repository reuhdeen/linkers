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
  inventory_status: "in_stock",
  location_code: "",
};

export default function InventoryTab({ productId }) {
  const [rows, setRows] = useState([]);
  const [variantsList, setVariantsList] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [types, setTypes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState(new Set());
  const [filters, setFilters] = useState({
    warehouse: "",
    type: "",
    status: "",
    search: "",
  });

  const [showModal, setShowModal] = useState(false);
  const [modalInv, setModalInv] = useState({ ...blankInventory });
  const [editingId, setEditingId] = useState(null);

async function loadVariants() {
  if (!productId) {
    setVariantsList([]);
    return;
  }

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



  // Load inventory rows
async function loadInventory() {
  if (!productId) {
    setRows([]);
    return;
  }

  setLoading(true);
  setError("");

  try {
    const token = localStorage.getItem("accessToken");

    const inventoryData = await fetchQueryData(token, {
      table:
        "inventory " +
        "LEFT JOIN product_variants ON product_variants.product_variant_id = inventory.product_variant_id",
      columns: "inventory.*",
      where: `product_variants.product_id = ${productId}`,
    });

    setRows(
      (inventoryData || []).map((r) => ({
        inventory_id: r.inventory_id,
        product_variant_id: decodeBase64(r.product_variant_id),
        warehouse_id: decodeBase64(r.warehouse_id),
        inventory_type_id: decodeBase64(r.inventory_type_id),
        quantity_in_stock: parseFloat(decodeBase64(r.quantity_in_stock)),
        reorder_level: r.reorder_level
          ? parseFloat(decodeBase64(r.reorder_level))
          : "",
        batch_number: r.batch_number ? decodeBase64(r.batch_number) : "",
        expiration_date: r.expiration_date ? decodeBase64(r.expiration_date) : "",
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

  useEffect(() => {
    loadVariants();
    loadWarehouses();
    loadTypes();
    loadInventory();
  }, []);

  // Filter data
  const filtered = rows.filter((r) => {
    if (filters.warehouse && r.warehouse_id !== filters.warehouse)
      return false;
    if (filters.type && r.inventory_type_id !== filters.type) return false;
    if (filters.status && r.inventory_status !== filters.status)
      return false;
    if (
      filters.search &&
      !r.product_variant_id
        .toString()
        .toLowerCase()
        .includes(filters.search.toLowerCase())
    )
      return false;
    return true;
  });

  // Select handlers
  function handleSelectAll(e) {
    if (e.target.checked) {
      setSelected(new Set(filtered.map((r) => r.inventory_id)));
    } else {
      setSelected(new Set());
    }
  }
  function handleSelectOne(id) {
    return (e) => {
      const s = new Set(selected);
      e.target.checked ? s.add(id) : s.delete(id);
      setSelected(s);
    };
  }

  // Bulk delete
  async function handleBulkDelete() {
    if (!selected.size) return;
    setLoading(true);
    try {
      const token = localStorage.getItem("accessToken");
      for (let id of selected) {
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
    } catch (e) {
      console.error("Error bulk deleting:", e);
      setError("Bulk delete failed.");
    } finally {
      setLoading(false);
    }
  }

  // Inline update (if needed)
  async function handleCellChange(id, field, value) {
    try {
      const token = localStorage.getItem("accessToken");
      const payload = {
        [field]: value,
      };
      await updateQueryData(
        token,
        "inventory",
        payload,
        { inventory_id: id }
      );
      await loadInventory();
    } catch (e) {
      console.error("Error updating cell:", e);
      setError("Update failed.");
    }
  }

  // Open "Add" modal
  function handleAddClick() {
    setModalInv({ ...blankInventory });
    setEditingId(null);
    setShowModal(true);
  }

  // Open "Edit" modal
  function handleEditClick(r) {
    setModalInv({ ...r });
    setEditingId(r.inventory_id);
    setShowModal(true);
  }

  // Save from modal
  async function handleModalSave() {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("accessToken");
      const p = modalInv;

      // encode every field as Base64
      const payload = {
        product_variant_id: p.product_variant_id,
        warehouse_id: p.warehouse_id,
        inventory_type_id: p.inventory_type_id,
        quantity_in_stock: p.quantity_in_stock,
        reorder_level:
          p.reorder_level !== "" ? p.reorder_level : null,
        batch_number:
          p.batch_number !== "" ? p.batch_number : null,
        expiration_date:
          p.expiration_date !== "" ? p.expiration_date : null,
        inventory_status: p.inventory_status,
        location_code:
          p.location_code !== "" ? p.location_code : null,
      };

      if (editingId) {
        // update
        await updateQueryData(
          token,
          "inventory",
          payload,
          { inventory_id: editingId }
        );
      } else {
        // insert
        await axios.post(
          `${process.env.REACT_APP_API_URL}/insert/inventory`,
          payload,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }

      await loadInventory();
      setShowModal(false);
    } catch (e) {
      console.error("Error saving inventory:", e);
      setError("Save failed.");
    } finally {
      setLoading(false);
    }
  }

  // CSV export
  function exportCSV() {
    const header = [
      "Variant ID",
      "Warehouse",
      "Type",
      "Qty",
      "Reorder",
      "Batch",
      "Expires",
      "Status",
      "Location",
    ];
    const rowsCsv = [
      header.join(","),
      ...filtered.map((r) => {
        const wh = warehouses.find((w) => w.warehouse_id === r.warehouse_id)
          ?.name;
        const tp = types.find((t) => t.inventory_type_id === r.inventory_type_id)
          ?.name;
        return [
          r.product_variant_id,
          `"${wh || ""}"`,
          `"${tp || ""}"`,
          r.quantity_in_stock,
          r.reorder_level ?? "",
          `"${r.batch_number}"`,
          `"${r.expiration_date}"`,
          `"${r.inventory_status}"`,
          `"${r.location_code}"`,
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
      {error && <div className="alert alert-danger">{error}</div>}

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
          <input
            type="text"
            className="form-control"
            placeholder="Search Variant ID…"
            value={filters.search}
            onChange={(e) =>
              setFilters((f) => ({ ...f, search: e.target.value }))
            }
          />
        </div>
        <div className="col-md-2 text-end">
          <button className="btn btn-secondary" onClick={loadInventory}>
            Refresh
          </button>
        </div>
      </div>

      {/* Bulk actions */}
      <div className="d-flex justify-content-between mb-2">
        <div>
          <button
            className="btn btn-danger btn-sm me-2"
            onClick={handleBulkDelete}
            disabled={!selected.size}
          >
            <FaTrash /> Delete Selected
          </button>
          <button
            className="btn btn-outline-primary btn-sm"
            onClick={exportCSV}
          >
            <FaFileCsv /> Export CSV
          </button>
        </div>
        <small>
          {filtered.length} of {rows.length} records
        </small>
      </div>

      {/* Inventory table */}
      <div
        className="table-responsive mb-3"
        style={{ maxHeight: 400, overflowY: "auto" }}
      >
        <table className="table table-hover table-sm mb-0">
          <thead className="table-light sticky-top">
            <tr>
              <th style={{ width: "3%" }}>
                <input
                  type="checkbox"
                  checked={selected.size === filtered.length}
                  onChange={handleSelectAll}
                />
              </th>
              <th>Variant</th>
              <th>Warehouse</th>
              <th>Type</th>
              <th>Qty</th>
              <th>Reorder</th>
              <th>Batch</th>
              <th>Expires</th>
              <th>Status</th>
              <th>Location</th>
              <th></th>
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
                  <td>
                    <input
                      type="checkbox"
                      checked={selected.has(r.inventory_id)}
                      onChange={handleSelectOne(r.inventory_id)}
                    />
                  </td>
                  <td>{r.product_variant_id}</td>
                  <td>
                    {
                      warehouses.find(
                        (w) => w.warehouse_id === r.warehouse_id
                      )?.name
                    }
                  </td>
                  <td>
                    {
                      types.find(
                        (t) => t.inventory_type_id === r.inventory_type_id
                      )?.name
                    }
                  </td>
                  <td>
                    <input
                      type="number"
                      className="form-control form-control-sm"
                      defaultValue={r.quantity_in_stock}
                      onBlur={(e) =>
                        handleCellChange(
                          r.inventory_id,
                          "quantity_in_stock",
                          e.target.value
                        )
                      }
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      className="form-control form-control-sm"
                      defaultValue={r.reorder_level}
                      onBlur={(e) =>
                        handleCellChange(
                          r.inventory_id,
                          "reorder_level",
                          e.target.value
                        )
                      }
                    />
                  </td>
                  <td>{r.batch_number}</td>
                  <td>{r.expiration_date}</td>
                  <td>
                    <select
                      className="form-select form-select-sm"
                      defaultValue={r.inventory_status}
                      onChange={(e) =>
                        handleCellChange(
                          r.inventory_id,
                          "inventory_status",
                          e.target.value
                        )
                      }
                    >
                      <option value="in_stock">In Stock</option>
                      <option value="reserved">Reserved</option>
                      <option value="damaged">Damaged</option>
                    </select>
                  </td>
                  <td>{r.location_code}</td>
                  <td className="text-end">
                    <button
                      className="btn btn-sm btn-outline-primary me-1"
                      onClick={() => handleEditClick(r)}
                    >
                      <FaRegEdit />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

    <div className="d-flex justify-content-between mb-4">
    <button className="btn btn-success" onClick={handleAddClick}>
        ➕ Add Inventory
    </button>
    <button className="btn btn-primary" onClick={handleModalSave}>
        Save Inventory
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
                  className="btn btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button className="btn btn-primary" onClick={handleModalSave}>
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