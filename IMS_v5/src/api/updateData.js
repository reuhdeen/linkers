import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;

export const updateQueryData = async (token, table, data, conditions) => {
  if (!token) throw new Error("Missing access token");

  // Must send { data: {...}, conditions: {...} } to match Go handler
  const payload = { data, conditions };

  console.log("→ PUT:", `${API_URL}/update/${table}`);
  console.log("→ request payload:", JSON.stringify(payload, null, 2));

  const res = await axios.put(
    `${API_URL}/update/${table}`,
    payload,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.data;
};