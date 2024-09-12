const API_BASE_URL = 'http://alfi-admin.galvanizelabs.net:8080/api/admin/hubs';


const getAuthToken = () => localStorage.getItem('token');




export const fetchHubs = async () => {
  try {
    const token = getAuthToken();
    const response = await fetch(API_BASE_URL, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to fetch hubs: ${errorText}`);
    }
    const data = await response.json();
    return data.hubs || [];
  } catch (error) {
    console.error("Error in fetchHubs:", error);
    throw error;
  }
};


export const getHubDetails = async (name) => {
  try {
    const token = getAuthToken();
    const response = await fetch(`${API_BASE_URL}/${name}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to fetch hub details: ${errorText}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error in getHubDetails:", error);
    throw error;
  }
};


export const createHub = async (hub) => {
  try {
    const token = getAuthToken();
    const response = await fetch(API_BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(hub),
    });
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to create hub: ${errorText}`);
    }
    return response.json();
  } catch (error) {
    console.error("Error in createHub:", error);
    throw error;
  }
};


export const updateHub = async (name, hub) => {
  try {
    const token = getAuthToken();
    const response = await fetch(`${API_BASE_URL}/${name}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(hub),
    });
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to update hub: ${errorText}`);
    }
    return response.json();
  } catch (error) {
    console.error("Error in updateHub:", error);
    throw error;
  }
};


export const deleteHub = async (id) => {
    try {
      const token = getAuthToken();
      console.log(token);
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `${token}`
        },
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to delete hub: ${errorText}`);
      }
    } catch (error) {
      console.error("Error in deleteHub:", error);
      throw error;
    }
  };
