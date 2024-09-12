import React, { useState, useEffect } from 'react';
import { fetchHubs, createHub, deleteHub } from './APIs/hubApi';

const AdminHubManagement = () => {
  const [hubs, setHubs] = useState([]);
  const [addHubForm, setAddHubForm] = useState({ name: '', picture: '' });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    handleGetAllHubs();
  }, []);

  useEffect(() => {
    console.log('Hubs State Updated:', hubs); 
  }, [hubs]);

  const handleGetAllHubs = async () => {
    try {
      const data = await fetchHubs();
      console.log('Fetched Hubs:', data); 
      setHubs(data);
      setMessage(data.length > 0 ? "" : "No hubs found");
    } catch (error) {
      setError(`Error fetching all hubs: ${error.message}`);
      setHubs([]);
    }
  };

  const handleAddHubChange = (e) => {
    const { name, value } = e.target;
    setAddHubForm((prevForm) => ({ ...prevForm, [name]: value }));
  };

  const handleAddHub = async (e) => {
    e.preventDefault();


    try {
      await createHub({ ...addHubForm });
      setMessage("Hub added successfully.");
      setAddHubForm({ name: '', picture: '' });
      handleGetAllHubs(); 
    } catch (error) {
      setError(`Error adding hub: ${error.message}`);
    }
  };

  const handleDeleteHub = async (id) => {
    if (window.confirm("Are you sure you want to delete this hub?")) {
      try {
        await deleteHub(id);
        setMessage("Hub deleted successfully.");
        setHubs((prevHubs) => prevHubs.filter((hub) => hub.id !== id));
      } catch (error) {
        setError(`Error deleting hub: ${error.message}`);
      }
    }
  };

  const handleClear = () => {
    setAddHubForm({ name: '', picture: '' });
    setMessage(""); // Clear success message
    setError(""); // Clear error message
  };

  return (
    <div className="hub-management">
      <h2>Hub Management</h2>

      {message && <div className="alert alert-info">{message}</div>}
      {error && <div className="alert alert-error">{error}</div>}

      <form className="form" onSubmit={handleAddHub}>
        <h3>Add New Hub</h3>
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            placeholder="New Hub Name"
            value={addHubForm.name || ""}
            onChange={handleAddHubChange}
            className="form-control"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="picture">Picture URL</label>
          <input
            type="text"
            id="picture"
            name="picture"
            placeholder="New Hub URL"
            value={addHubForm.picture || ""}
            onChange={handleAddHubChange}
            className="form-control"
          />
          {addHubForm.picture && (
            <div style={{ marginTop: '10px' }}>
              <img
                src={addHubForm.picture}
                alt="Preview"
                style={{ width: '500px', height: 'auto' }}
              />
            </div>
          )}
        </div>
        <button type="submit" className="btn btn-primary">Add Hub</button>
        <button type="button" className="btn btn-secondary" onClick={handleClear}>
          Clear
        </button>
      </form>

      <table className="table" style={{ marginTop: '20px' }}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Picture</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {hubs.length > 0 ? (
            hubs.map((hub) => (
              <tr key={hub.id}>
                <td>{hub.name}</td>
                <td>
                  {hub.picture ? (
                    <img
                      src={hub.picture}
                      alt={hub.name}
                      style={{ width: '100px', height: 'auto' }}
                    />
                  ) : (
                    <span>No Image</span>
                  )}
                </td>
                <td>
                  <button onClick={() => handleDeleteHub(hub.id)}>Delete</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3">{message || "No hubs found"}</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AdminHubManagement;
