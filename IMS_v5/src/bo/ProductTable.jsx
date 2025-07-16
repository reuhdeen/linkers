import React from "react";

const ProductTable = ({ columns, data, rows = 10 }) => {
  return (
    <div className="table-responsive">
      <table className="table table-bordered table-hover table-sm align-middle">
        <thead className="table-light">
          <tr>
            {columns.map((col) => (
              <th key={col.key} className="text-center text-nowrap">
                {col.name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="text-center text-muted py-4">
                No products found
              </td>
            </tr>
          ) : (
            data.slice(0, rows).map((row, index) => (
              <tr key={row.product_id || index}>
                {columns.map((col) => (
                  <td key={col.key} className="text-center text-nowrap">
                    {typeof col.render === "function"
                      ? col.render(row)
                      : row[col.key]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ProductTable;