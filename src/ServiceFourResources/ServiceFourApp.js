import React, { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import {
  fetchUsers,
  updateUser,
  deleteUser,
  getUserDetails,
  fetchItems,
  deleteItem,
} from "../APIs/adminApi";
import "../Admin.css";
import AdminHubManagement from "../AdminHubManagement";
import { useLocation } from "react-router-dom";


const ServiceFourApp = () => {
  const { isAdmin } = useAuth();
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [editForm, setEditForm] = useState({
    username: "",
    email: "",
    firstName: "",
    lastName: "",
  });
  const [message, setMessage] = useState("");


  const handleSearch = () => {
    const lowerCaseSearch = searchQuery.toLowerCase();
    fetchUsers(lowerCaseSearch)
      .then((data) => {
        console.log("Search Query:", searchQuery);
        console.log("Search Results:", data);
        const filteredUsers = data.filter(
          (user) =>
            user.username.toLowerCase() === lowerCaseSearch ||
            user.email.toLowerCase() === lowerCaseSearch ||
            user.firstName.toLowerCase() === lowerCaseSearch
        );
        if (filteredUsers.length === 0) {
          setMessage("No users found");
          setUsers([]);
        } else {
          setMessage("");
          setUsers(filteredUsers);
        }
      })
      .catch((error) => {
        setMessage(`Error searching users: ${error.message}`);
        setUsers([]);
      });
  };


  const handleGetAllUsers = () => {
    fetchUsers()
      .then((data) => {
        setUsers(data);
        setMessage(data.length > 0 ? "" : "No users found");
      })
      .catch((error) => {
        setMessage(`Error fetching all users: ${error.message}`);
        setUsers([]);
      });
  };


  const handleEdit = (username) => {
    getUserDetails(username)
      .then((user) => {
        setSelectedUser(user);
        setEditForm({
          username: user.username,
          email: user.email,
          password: user.password,
          firstName: user.firstName,
          lastNam: user.lastName,
        });
      })
      .catch((error) =>
        setMessage(`Error fetching user details: ${error.message}`)
      );
  };


  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prevForm) => ({ ...prevForm, [name]: value }));
  };


  const handleUpdateUser = (e) => {
    e.preventDefault();
    const updatedFields = { ...editForm };
    Object.keys(updatedFields).forEach((key) => {
      if (updatedFields[key] === "") {
        delete updatedFields[key];
      }
    });
    updateUser(selectedUser.user.username, updatedFields)
      .then(() => {
        setMessage("User updated successfully.");
        return getUserDetails(selectedUser.user.username);
      })
      .then((updatedUser) => {
        setUsers((prevUsers) => {
          return prevUsers.map((user) =>
            user.username === updatedUser.username ? updatedUser : user
          );
        });
        setSelectedUser(updatedUser);
      })
      .catch((error) => {
        setMessage(`Error updating user: ${error.message}`);
      });
  };


  const handleDelete = (username) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      deleteUser(username)
        .then(() => {
          setMessage("User deleted successfully.");
          return fetchUsers(searchQuery);
        })
        .then(setUsers)
        .catch((error) => setMessage(`Error deleting user: ${error.message}`));
    }
  };


  const handleClearSearch = () => {
    setSearchQuery("");
    setUsers([]);
    setItems([]);
    setMessage("");
  };

  const [items, setItems] = useState([]);

  const handleGetAllItems = () => {
    fetchItems()
      .then((data) => {
        setItems(data);
        setMessage(data.length > 0 ? "" : "No items found");
      })
      .catch((error) => {
        setMessage(`Error fetching items: ${error.message}`);
        setItems([]);
      });
  };
  const handleDeleteItem = (itemId) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      deleteItem(itemId)
        .then(() => {
          setMessage('Item deleted successfully.');
          return fetchItems();
        })
        .then((data) => {
          setItems(data);
        })
        .catch((error) => {
          setMessage(`Error deleting item: ${error.message}`);
        });
    }
  };

  const location = useLocation();
  const isServiceFour = location.pathname === "/serviceFour";
  const [headerClass, ] = useState('main-head');


  return (
    <>
      <h2 className={isServiceFour ? headerClass : 'hidden'}>Admin Webpage</h2>
      <div className="content">
        {isAdmin ? (
          <>
            <div className="search-bar">
              <input
                type="text"
                placeholder="Search By Username or Email or First Name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button onClick={handleSearch}>Search</button>
              <button onClick={handleClearSearch}>Clear</button>
              <button onClick={handleGetAllUsers}>Get All Users</button>
              <button onClick={handleGetAllItems}>Get All Items</button>
            </div>


            {message && <div className="alert alert-info">{message}</div>}


            <table className="table">
              <thead>
                <tr>
                  <th>Username</th>
                  <th>First Name</th>
                  <th>Last Name</th>
                  <th>Email</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.length > 0 ? (
                  users.map((user) => (
                    <tr key={user.username}>
                      <td>{user.username}</td>
                      <td>{user.firstName || "N/A"}</td>
                      <td>{user.lastName || "N/A"}</td>
                      <td>{user.email}</td>
                      <td>
                        <button onClick={() => handleEdit(user.username)}>
                          Edit
                        </button>
                        <button onClick={() => handleDelete(user.username)}>
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5">{message || "No users found"}</td>
                  </tr>
                )}
              </tbody>
            </table>


            {console.log("Selected User:", selectedUser)}


            {selectedUser && selectedUser.user && (
              <div>
                <h3>Edit {selectedUser.user.username}</h3>
                <form onSubmit={handleUpdateUser}>
                  <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input
                      type="password"
                      id="password"
                      name="password"
                      placeholder="Change Password"
                      value={editForm.password || ""}
                      onChange={handleEditChange}
                      className="form-control"
                      optional
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      placeholder="Change Email"
                      value={editForm.email || ""}
                      onChange={handleEditChange}
                      className="form-control"
                      optional
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="firstName">First Name</label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      placeholder="Change First Name"
                      value={editForm.firstName || ""}
                      onChange={handleEditChange}
                      className="form-control"
                      optional
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="lastName">Last Name</label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      placeholder="Change Last Name"
                      value={editForm.lastName}
                      onChange={handleEditChange}
                      className="form-control"
                      optional
                    />
                  </div>
                  <button type="submit" className="btn btn-primary">
                    Update User
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setSelectedUser(null)}
                  >
                    Cancel
                  </button>
                </form>
              </div>
              )}
              {items.length > 0 && (
                <div>
                  <h2>Items Management</h2>
                  <h3>Items List</h3>
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Description</th>
                        <th>Price</th>
                        <th>Condition</th>
                        <th>Delete</th>
                      </tr>
                    </thead>
                    <tbody>
                      {items.map((item) => (
                        <tr key={item.id}>
                          <td>{item.itemName}</td>
                          <td>{item.itemDescription}</td>
                          <td>${item.price}</td>
                          <td>{item.condition}</td>
                          <td><button onClick={() => handleDeleteItem(item.id)}>Delete</button></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
    
        
                  <AdminHubManagement />
          </>
        ) : (
          <p style={{color:"black", fontSize: "4em"}}>Access denied. You do not have permission to view this page.</p>
        )}
      </div>
    </>
  );
};


export default ServiceFourApp;