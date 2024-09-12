import React, { useState, useEffect } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

function AddItemForm({ onHide }) {
  const [itemName, setItemName] = useState('');
  const [itemDescription, setItemDescription] = useState('');
  const [itemPrice, setItemPrice] = useState('');
  const [itemPhoto, setItemPhoto] = useState('');
  const [itemCondition, setItemCondition] = useState('');
  const [itemCategory, setItemCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [profileId, setProfileId] = useState(null);
  const [expirationDate, setExpirationDate] = useState('');
  const [itemPostedDate] = useState(() => new Date().toISOString());
  const [, setItems] = useState([]); // Added state for items
  
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const guid = localStorage.getItem('guid');

  useEffect(() => {
    fetch(`http://alfi-profiles.galvanizelabs.net:80/api/profiles/loginProfileId/${guid}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      setProfileId(data.profileId);
    })
    .catch(error => {
      console.error('Fetch error:', error);
      setErrorMessage('Failed to fetch profile ID.');
    });
  }, [guid, token]);

  useEffect(() => {
    fetch('http://alfi-admin.galvanizelabs.net:8080/api/admin/categories', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      setCategories(data.categories);
    })
    .catch(error => {
      console.error('Fetch error:', error);
      setErrorMessage('Failed to fetch categories.');
    });
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!profileId) {
      setErrorMessage('Profile ID is not available.');
      return;
    }

    try {
      const response = await fetch('http://alfi-items.galvanizelabs.net/api/items', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          itemName,
          itemDescription,
          price: itemPrice,
          condition: itemCondition,
          categoryID: itemCategory,
          profileID: profileId,
          photoID: itemPhoto,
          expirationDate: new Date(expirationDate).toISOString(),
          itemPostedDate: itemPostedDate,
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Server error:', errorText);
        setErrorMessage(`Server error: ${errorText}`);
        throw new Error(`Network response was not ok: ${response.statusText}`);
      }

      const data = await response.json();
      setItems(prevItems => [...prevItems, data]); 
      setSuccessMessage("Item added successfully.");
      navigate('/ServiceThree', { state: { data: data } });
  
 

    } catch (error) {
      console.error('Fetch error:', error);
      setErrorMessage('An error occurred while adding the item.');
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        backgroundColor: '#f8f9fa',
        padding: '2em',
        borderRadius: '8px',
        boxShadow: '0 0 10px rgba(0,0,0,0.3)',
        zIndex: 1050,
        width: '50%',
        maxHeight: '97%',
        overflowY: 'auto'
      }}
    >
      {successMessage && <Alert variant="success">{successMessage}</Alert>}
      {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}

      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="formItemName">
          <Form.Label>Item Name</Form.Label>
          <Form.Control
            type="text"
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group controlId="formItemDescription">
          <Form.Label>Description</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            value={itemDescription}
            onChange={(e) => setItemDescription(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group controlId="formItemPrice">
          <Form.Label>Price</Form.Label>
          <Form.Control
            type="number"
            step="0.01"
            value={itemPrice}
            onChange={(e) => setItemPrice(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group controlId="formItemCondition">
          <Form.Label>Condition</Form.Label>
          <Form.Control
            as="select"
            value={itemCondition}
            onChange={(e) => setItemCondition(e.target.value)}
            required
          >
            <option value="">Select Condition</option>
            <option value="NEW">NEW</option>
            <option value="REFURBISHED">REFURBISHED</option>
            <option value="EXCELLENT">EXCELLENT</option>
            <option value="FAIR">FAIR</option>
          </Form.Control>
        </Form.Group>

        <Form.Group controlId="formItemCategory">
          <Form.Label>Category</Form.Label>
          <Form.Control
            as="select"
            value={itemCategory}
            onChange={(e) => setItemCategory(e.target.value)}
            required
          >
            <option value="">Select Category</option>
            {categories.map(category => (
              <option key={category.id} value={category.id}>{category.name}</option>
            ))}
          </Form.Control>
        </Form.Group>

        <Form.Group controlId="formExpirationDate">
          <Form.Label>Expiration Date</Form.Label>
          <Form.Control
            type="date"
            value={expirationDate}
            onChange={(e) => setExpirationDate(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group controlId="formPostDate">
          <Form.Label>Post Date</Form.Label>
          <Form.Control
            type="date"
            value={itemPostedDate.split('T')[0]}
            readOnly
          />
        </Form.Group>

        <Form.Group controlId="formItemPhoto">
          <Form.Label>Photo URL</Form.Label>
          <Form.Control
            type= "text"
            value={itemPhoto}
            onChange={(e) => setItemPhoto(e.target.value)}
            required
          />
        </Form.Group>

        {itemPhoto && (
            <div style={{ marginTop: '10px' }}>
              <img
                src={itemPhoto}
                alt="Preview"
                style={{ width: '500px', height: 'auto' }}
              />
            </div>
          )}

        <Button variant="primary" type="submit">
          Submit
        </Button>
        <Button variant="link" onClick={onHide}>
          Close
        </Button>
      </Form>
    </div>
  );
}

export default AddItemForm;
