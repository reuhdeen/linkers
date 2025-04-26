import React, { useState, useEffect } from "react";
import { fetchQueryData } from "./fetchData";
import { decodeBase64 } from "./decodeBase64";
import "../css/loading.css";

const CustomDropdown = ({
  endpoint,
  name,
  value,
  onChange,
  idField,
  nameField,
  showAllOption = true,  // Default to true if not provided
}) => {
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("accessToken");
        if (!token) throw new Error("No token found");

        const data = await fetchQueryData(token, {
          table: "iposarv3." + endpoint,
          columns: "*",
        });

        // Add "All Categories" option if showAllOption is true
        if (showAllOption) {
          const allOption = {
            [idField]: "all",
            [nameField]: "All Categories",
          };
          setOptions([allOption, ...(data || [])]);
        } else {
          setOptions(data || []);
        }
      } catch (error) {
        console.error("Error fetching options:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOptions();
  }, [endpoint, showAllOption]);

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
        options.map((option) => (
          <option key={option[idField]} value={option[idField]}>
            {decodeBase64(option[nameField])}
          </option>
        ))
      )}
    </select>
  );
};

export { CustomDropdown };
