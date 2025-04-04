import axios from 'axios';

// Function to handle API INSERT sales
export const insertSales = async (trimmedSales, token) => {
  try {
    const response = await axios.post(
      `${process.env.REACT_APP_API_URL}/insert/sales`,
      trimmedSales,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    // Return the generated sales_id from the response
    return response.data.sales_id;
  } catch (error) {
    console.error(`Error inserting sales: ${trimmedSales}:`, error);
    throw error;
  }
};
