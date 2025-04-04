import React, { useState, useEffect } from "react";
import axios from "axios";
import { fetchQueryData } from "../api/fetchData";
import { decodeBase64 } from "../api/decodeBase64";
import { CustomDropdown } from '../api/dropDown';
import "../css/loading.css";

const UsersManagement = () => {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({
    username: "",
    password: "",
    role_id: "", // Keep role_id as a string initially
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsersAndRoles = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("accessToken");
        if (!token) throw new Error("No token found");

        const usersData = await fetchQueryData(token, {
          table: "users INNER JOIN roles ON users.role_id = roles.role_id",
          columns: "*",
        });

        setUsers(usersData);
      } catch (error) {
        console.error("Error fetching users:", error);
        alert(`Error: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchUsersAndRoles();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewUser({ ...newUser, [name]: value });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    // Ensure all fields are filled
    if (!newUser.username.trim() || !newUser.password.trim() || !newUser.role_id) {
      alert("Please fill in all fields.");
      return;
    }

    // Log form data before submission
    console.log("Form data before submission:", newUser);

    // Ensure role_id is an integer
    const trimmedUser = {
      username: newUser.username.trim(),
      password: newUser.password.trim(),
      // Convert role_id to integer before submission
      role_id: parseInt(newUser.role_id, 10) || "", // Convert to integer or set to empty string if invalid
    };

    // Log trimmedUser before API call
    console.log("Trimmed user data being sent to API:", trimmedUser);

    try {
      setLoading(true);

      const token = localStorage.getItem("accessToken");
      if (!token) {
        throw new Error("No token found");
      }

      // API call to insert user
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/insert/users`,
        trimmedUser,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      // Log the API response
      console.log("User created successfully:", response.data);
      
      // Fetch updated list of users
      const usersData = await fetchQueryData(token, {
        table: "users INNER JOIN roles ON users.role_id = roles.role_id",
        columns: "*",
      });

      setUsers(usersData);
      
      // Reset the form
      setNewUser({
        username: "",
        password: "",
        role_id: "",
      });
    } catch (error) {
      console.error("There was an error creating the user:", error.response?.data || error.message);
      alert(`Error: ${error.response?.data || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Users Management</h1>
      {loading && (
        <div className="loading-bar-container">
          <div className="loading-bar"></div>
        </div>
      )}
      <form onSubmit={handleFormSubmit}>
        <input
          name="username"
          placeholder="Username"
          value={newUser.username}
          onChange={handleInputChange}
        />
        <input
          name="password"
          placeholder="Password"
          type="password"
          value={newUser.password}
          onChange={handleInputChange}
        />
        <CustomDropdown
          endpoint="roles"
          name="role_id"
          value={newUser.role_id} // Ensure role_id is passed
          onChange={(e) => setNewUser({ ...newUser, role_id: e.target.value })}
          label="Role"
          idField="role_id"
          nameField="role_name"
          direction="down"
        />
        <button type="submit" disabled={loading}>
          {loading ? "Loading..." : "Add User"}
        </button>
      </form>



      <h2>Users List</h2>
      <ul>
        {users.map((user) => (
          <li key={user.user_id}>
            {decodeBase64(user.username || "")} -{" "}
            {decodeBase64(user.password || "")} -{" "}
            {decodeBase64(user.role_name || "No role name")} 
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UsersManagement;
