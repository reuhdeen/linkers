import React, { useState, useEffect } from "react";
import { fetchQueryData } from "./fetchData";
import { decodeBase64 } from "./decodeBase64";
import "../css/loading.css";

const CustomDropdown = ({
  endpoint,
  options: staticOptions,
  name,
  value,
  onChange,
  idField,
  nameField,
  showAllOption = true,
}) => {
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // If static options are provided, use them directly
    if (Array.isArray(staticOptions)) {
      setOptions(staticOptions);
      setLoading(false);
      return;
    }

    // Otherwise, fetch from API
    const fetchOptions = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("accessToken");
        if (!token) throw new Error("No token found");

        const data = await fetchQueryData(token, {
          table: "iposarv3." + endpoint,
          columns: "*",
        });

        const decoded = (data || []).map((item) => ({
          ...item,
          [nameField]: decodeBase64(item[nameField]),
        }));

        if (showAllOption) {
          const allOption = {
            [idField]: "all",
            [nameField]: "All Categories",
          };
          setOptions([allOption, ...decoded]);
        } else {
          setOptions(decoded);
        }
      } catch (error) {
        console.error("Error fetching options:", error);
        setOptions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOptions();
  }, [endpoint, showAllOption, staticOptions, idField, nameField]);

  return (
    <select
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      className="form-control"
    >
      <option value="" disabled hidden>
        Choose an option
      </option>
      {loading ? (
        <option disabled>Loading...</option>
      ) : (
        options.map((opt) => (
          <option key={opt[idField]} value={opt[idField]}>
            {opt[nameField]}
          </option>
        ))
      )}
    </select>
  );
};

export { CustomDropdown };