const API_URL = 'http://identity.galvanizelabs.net/api/admin';

export const fetchUsers = async (searchQuery = "") => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/users?search=${encodeURIComponent(searchQuery)}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to fetch users: ${errorText}`);
      }
      const data = await response.json();
      console.log("Raw API Data:", data);
      const users = data.userSearchResults || []; 
      return Array.isArray(users) ? users : []; 
    } catch (error) {
      console.error("Error in fetchUsers:", error);
      throw error;
    }
  };
  

export const getUserDetails = async (username) => {
  const token = localStorage.getItem('token'); 
  const response = await fetch(`${API_URL}/users/${username}`, {
    headers: {
      'Authorization': `Bearer ${token}` 
    }
  });
  if (!response.ok) throw new Error("Failed to fetch user details");
  return response.json();
};

export const updateUser = async (username, userData) => {
  const token = localStorage.getItem('token'); 
  const response = await fetch(`${API_URL}/users/${username}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(userData),
  });
  if (!response.ok) throw new Error("Failed to update user");
};

export const deleteUser = async (username) => {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_URL}/users/${username}`, {
    method: "DELETE",
    headers: {
      'Authorization': `Bearer ${token}` 
    }
  });
  if (!response.ok) throw new Error("Failed to delete user");
};

export const fetchItems = async () => {
  const token = localStorage.getItem('token');
  try {
    const response = await fetch('http://alfi-items.galvanizelabs.net/api/items', {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error('Failed to fetch items');
    }
    const data = await response.json();
    console.log('Fetched Items:', data);
    return data.items || [];
  } catch (error) {
    console.error('Error fetching items:', error);
    throw error;
  }
};

export const deleteItem = async (itemId) => {
  const token = localStorage.getItem('token');
  try {
    const response = await fetch(`http://alfi-items.galvanizelabs.net/api/items/${itemId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error('Failed to delete item');
    }
  } catch (error) {
    console.error('Error deleting item:', error);
    throw error;
  }
};

