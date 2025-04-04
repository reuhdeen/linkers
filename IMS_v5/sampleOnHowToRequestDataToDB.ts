import React, { useState, useEffect } from 'react';
import axios from 'axios';

const DataFetcher = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.post('http://YOUR_API_ENDPOINT/dynamicselect', {
          table: "categories",
          columns: "category_id, parent_category_id, name",
          where: "parent_category_id IS NULL AND parent_category_id < 5",
          order: "name ASC",
          group: "parent_category_id",
          having: "COUNT(category_id) > 1",
          limit: "10",
          offset: "0"
        }, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer YOUR_TOKEN_HERE'
          }
        });

        setData(response.data);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      <h1>Data</h1>
      <ul>
        {data.map((item) => (
          <li key={item.category_id}>
            {item.category_id}: {item.name} (Parent: {item.parent_category_id})
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DataFetcher;
