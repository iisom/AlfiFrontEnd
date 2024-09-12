import React, { useState, useEffect } from "react";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import "../index.css";
// import Container from 'react-bootstrap/Container';
// import Col from "react-bootstrap/Col";
// import Form from "react-bootstrap/Form";
// import Row from "react-bootstrap/Row";
// import InputGroup from "react-bootstrap/InputGroup";
import { useLocation } from "react-router-dom";
// import { useCallback } from 'react';
import { Link } from 'react-router-dom';
import Modal from 'react-bootstrap/Modal';

function ServiceOneApp() {
    const [responseData, setResponse] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selling, setSelling] = useState([]);
    const [sold, setSold] = useState([]);
    const [hubData, setHubData] = useState([]);
    // const [editProfile, setEditProfile] = useState("hidden");
    const [showModal, setShowModal] = useState(false); // State to control modal visibility
    const [formData, setFormData] = useState({
      emailAddress: '',
      firstName: '',
      lastName: '',
      hub: 1,
      phoneNumber: "",
      sellerRating: "",
      buyerRating: "",
    });

  //Initial State For User Profile
  // const initialProfileState = {
  //   emailAddress: "",
  //   firstName: "",
  //   lastName: "",
  //   hub: "",
  //   phoneNumber: "",
  //   sellerRating: "",
  //   buyerRating: "",
  // };

  // const [profile, setProfile] = useState(initialProfileState);

  //const userId = 'actualUserId';
  const accessToken = localStorage.getItem("token");
  const guid = localStorage.getItem("guid");
  

  // let profileData = {
  //   emailAddress: profile.emailAddress,
  //   firstName: profile.firstName,
  //   lastName: profile.lastName,
  //   hub: profile.hub,
  //   phoneNumber: profile.phoneNumber,
  //   sellerRating: "",
  //   buyerRating: "",
  // };

  // const inputUpdate = (e) => {
  //   setProfile({
  //     ...profile,
  //     [e.target.name]: e.target.value,
  //   });
  //   console.log(profile.firstName);
  // };



  const location = useLocation();
  const isServiceOne = location.pathname === "/serviceOne";
  const [headerClass] = useState("main-head");
  

  useEffect(() => {
    fetch(
      "http://alfi-profiles.galvanizelabs.net/api/profiles/loginProfileId/" +
        guid,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    )
      .then((response) => {
        console.log(response);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        console.log(data);
        setResponse(data);
        console.log(data.profileId);
      })
      .catch((error) => {
        console.error("Fetch error test:", error);
      });
  }, [accessToken, guid]);

///api/items/profileID/{profileID}
  useEffect(() => {
    fetch('http://alfi-items.galvanizelabs.net/api/items/profileid/' + responseData.profileId, {
      method: 'GET', 
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    })
    .then(response => {
      console.log(response);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json(); 
    })
    .then(data => {
      console.log(data);
      const filteredSellingItems = data.filter(item => item.soldStatus === false || item.soldStatus === undefined); 
      setSelling(filteredSellingItems);
      setLoading(false);
    })
    .catch(error => {
      console.error('Fetch error test:', error);
    });
  }, [accessToken, responseData]);

  //API call to get all hub names
  useEffect(() => {
    fetch("http://alfi-admin.galvanizelabs.net:8080/api/admin/hubs", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
      .then((response) => {
        console.log(response);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        console.log(data);
        setHubData(data.hubs);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Fetch error test:", error);
      });
  }, [accessToken]);
  useEffect(() => {
    
    fetch('http://alfi-items.galvanizelabs.net/api/items/profileid/' + responseData.profileId, {
      method: 'GET', 
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    })
    .then(response => {
      console.log(response);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json(); 
    })
    .then(data => {
      console.log(data); 
      const filteredItems = data.filter(item => item.soldStatus === true);
      setSold(filteredItems);
      setLoading(false);
    })
    .catch(error => {
      console.error('Fetch error test:', error);
    });
  }, [accessToken, responseData]);

  if (loading) return <div>Loading...</div>;
  if (!responseData || !hubData) return <div>Loading data...</div>;

  const hubName =
    hubData.find((obj) => obj.id === responseData.hub)?.name || "Unknown Hub";
  //if (error) return <div>Error: {error.message}</div>;
  // if (!loading) await sleep(5000)


  const handleEditClick = () => {
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFormSubmit = () => {
    console.log("Updated Profile")
    console.log("Data to Update: " + JSON.stringify(formData))
    fetch(
      "http://alfi-profiles.galvanizelabs.net/api/profiles/" +
        responseData.profileId,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json", // Adjust content type as needed
        },
        body: JSON.stringify(formData),
      }
    )
      .then((response) => {
        console.log(response)
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json(); // Assuming your API returns JSON
      })
      .then((data) => {
        // Handle the response data
        console.log(data);
        window.location.reload();
      })
      .catch((error) => {
        // Handle errors
        console.error("Error:", error);
      });
  };

  return (
    <>
      <h2 className={isServiceOne ? headerClass : "hidden"}>User Profile</h2>
      <div className="content">
        <div className="selling">
          <div className="UserDetails">
            <div>
              <p>
                <strong>User:</strong> {responseData.firstName}{" "}
                {responseData.lastName}
              </p>
            </div>
            <div>
              <p>
                <strong>Email:</strong> {responseData.emailAddress}
              </p>
            </div>
            <div>
              <p>
                <strong>Phone Number:</strong> {responseData.phoneNumber}{" "}
              </p>
            </div>
            <div>
              <p>
                <strong>Hub:</strong>
                {hubName}
              </p>
            </div>
            <div>
              <p>
                <strong>Ratings (Buyer):</strong> {responseData.buyerRating}
              </p>
            </div>
            <div>
              <p>
                <strong>Ratings (Seller):</strong> {responseData.sellerRating}
              </p>
            </div>
            <Button
              style={{ width: "100%" , backgroundColor: "#ED1D24"}}
              onClick={handleEditClick}
            >
              Edit
            </Button>
            {/* <Form className={editProfile}>
              <InputGroup>
                <Form.Group
                  as={Row}
                  className="mb-3"
                  controlId="formPlaintextPassword"
                >
                  <Form.Label column sm="2">
                    First Name
                  </Form.Label>
                  <Col sm="10">
                    <Form.Control
                      type="firstName"
                      name="firstName"
                      placeholder={responseData.firstName}
                      onChange={inputUpdate}
                    />
                  </Col>
                </Form.Group>
                <Form.Group
                  as={Row}
                  className="mb-3"
                  controlId="formPlaintextPassword"
                >
                  <Form.Label column sm="2">
                    Last Name
                  </Form.Label>
                  <Col sm="10">
                    <Form.Control
                      type="lastName"
                      name="lastName"
                      placeholder={responseData.lastName}
                      onChange={inputUpdate}
                    />
                  </Col>
                </Form.Group>
                <Form.Group
                  as={Row}
                  className="mb-3"
                  controlId="formPlaintextPassword"
                >
                  <Form.Label column sm="2">
                    Email
                  </Form.Label>
                  <Col sm="10">
                    <Form.Control
                      type="email"
                      name="emailAddress"
                      placeholder={responseData.emailAddress}
                      onChange={inputUpdate}
                    />
                  </Col>
                </Form.Group>
                <Form.Group
                  as={Row}
                  className="mb-3"
                  controlId="formPlaintextPassword"
                >
                  <Form.Label column sm="2">
                    Phone Number
                  </Form.Label>
                  <Col sm="10">
                    <Form.Control
                      type="phoneNumber"
                      name="phoneNumber"
                      placeholder={responseData.phoneNumber}
                      onChange={inputUpdate}
                    />
                  </Col>
                </Form.Group>
                <Form.Group
                  as={Row}
                  className="mb-3"
                  controlId="formPlaintextPassword"
                >
                  <Form.Label column sm="2">
                    Hub
                  </Form.Label>
                  <Form.Select
                    size="lg"
                    name="hub"
                    onChange={inputUpdate}
                    required
                  >
                    <option value={1}>Bloomington</option>
                    <option value={2}>Dallas</option>
                    <option value={4}>Phoenix</option>
                    <option value={9}>Atlanta</option>
                  </Form.Select>
                </Form.Group>
              </InputGroup>
              <Button
                onClick={() => {
                  console.log("Test");
                  //Start of patch call for user profile
                  fetch(
                    "http://alfi-profiles.galvanizelabs.net:8080/api/profiles/" +
                      responseData.profileId,
                    {
                      method: "PATCH",
                      headers: {
                        Authorization: `Bearer ${accessToken}`,
                        "Content-Type": "application/json", // Adjust content type as needed
                      },
                      body: JSON.stringify(profileData),
                    }
                  )
                    .then((response) => {
                      if (!response.ok) {
                        throw new Error("Network response was not ok");
                      }
                      return response.json(); // Assuming your API returns JSON
                    })
                    .then((data) => {
                      // Handle the response data
                      console.log(data);
                      window.location.reload();
                    })
                    .catch((error) => {
                      // Handle errors
                      console.error("Error:", error);
                    });
                  //End of Patch call for user profile
                }}>Save</Button>
                </Form> */}
              </div>
                <h1>Selling</h1>
                <div className='content AllItems'>
                {selling.map(item => (
                    <Card key={item.id} style={{ width: '20rem', marginTop: "1em"}}>
                    <div key={item.id} className=''>
                        <Card.Img src={item.photoID} alt="product"/> 
                        <Card.Body>
                        <br></br> <Card.Title> {item.itemName} : ${item.price} </Card.Title> 
                        <br></br> <Card.Text> {item.itemDescription} </Card.Text>
                        <Link to={`../ServiceThree`} state={item}>View Details</Link>
                    </Card.Body>
                    </div>
                    </Card>
                ))}
                </div>
                <h1>Sold</h1>
                <div className='content AllItems'>
                {sold.map(item => (
                    <Card key={item.id} style={{ width: '20rem', marginTop: "1em"}}>
                    <div key={item.id} className=''>
                        <Card.Img src={item.photoID} alt="product"/> 
                        <Card.Body>
                        <br></br> <Card.Title> {item.itemName} : ${item.price} </Card.Title> 
                        <br></br> <Card.Text> {item.itemDescription} </Card.Text>
                        <Link to={`../ServiceThree`} state={item}>View Details</Link>
                    </Card.Body>
                    </div>
                    </Card>
                ))}
            </div>
            </div>
            <Modal show={showModal} onHide={handleModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Profile Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form>
            <div className="mb-3">
              <label htmlFor="firstName" className="firstName">First Name</label>
              <input
                type="text"
                className="form-control"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleFormChange}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="lastName" className="lastName">Last Name</label>
              <input
                type="text"
                className="form-control"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleFormChange}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="lastName" className="emailAddress">Email Address</label>
              <input
                type="email"
                className="form-control"
                id="emailAddress"
                name="emailAddress"
                value={formData.emailAddress}
                onChange={handleFormChange}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="phoneNumber" className="phoneNumber">Phone Number</label>
              <input
                type="text"
                className="form-control"
                id="phoneNumber"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleFormChange}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="hub" className="form-label">Hub</label>
              <select 
                id="hub"
                name="hub"
                value={formData.hub}
                onChange={handleFormChange}>
              <option value="1">Bloomington</option>
              <option value="2">Dallas</option>
              <option value="4">Phoenix</option>
              <option value="9">Atlanta</option>
              </select>
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleModalClose}>Close</Button>
          <Button variant="primary" onClick={handleFormSubmit}>Save Changes</Button>
        </Modal.Footer>
      </Modal>
        </div>
      </>
  );
}

export default ServiceOneApp;
