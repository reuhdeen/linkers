import axios from 'axios';

export const fetchData = async (token, table) => {
    console.log("Token being used:", token); // Debugging log
    try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/select`, {
            params: { table },
            headers: { 'Authorization': `Bearer ${token}` },
            withCredentials: true, // Ensure cookies are sent if needed
        });
        return response.data;
    } catch (error) {
        console.error(`There was an error fetching data from ${table}:`, error);
        throw error; // Rethrow the error for further handling
    }
};

export const fetchQueryData = async (token, queryParams) => {
  const response = await fetch(`${process.env.REACT_APP_API_URL}/select`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(queryParams)
  });

  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }

  return response.json();
};
