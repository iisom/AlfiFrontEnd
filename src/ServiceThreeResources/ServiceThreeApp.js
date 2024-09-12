import 'bootstrap/dist/css/bootstrap.min.css';
import "./singleItem.css";
import "../index.css";
import React, { useState, useEffect, useCallback  } from 'react';
import { useLocation } from 'react-router-dom';
import Carousel from 'react-bootstrap/Carousel';
import StarRating from './StarRating';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal'; // Import the StarRating component
// import CarouselItem from 'react-bootstrap/CarouselItem'
// import CarouselCaption from 'react-bootstrap/CarouselCaption'
// import 'bootstrap/dist/css/bootstrap.min.css';
// import 'bootstrap/dist/css/bootstrap.css';
// import ExampleCarouselImage from './dresser.jpeg';
//import Dresser from "./dresser.jpeg";
// import Location from "./location.jpeg";

function ServiceThreeApp(props) {

  const location = useLocation();
  let stateData = location.state;
  ; 
  if (location.state.data === undefined){
    stateData = location.state;
  } else {
    stateData = location.state.data;
  }
  
  console.log(stateData)

  const [responseData, setResponse] = useState([]);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  // const [userProfileId, setUserProfileId] = useState(0);
  // const [responseData, setResponse] = useState([]);
  const [categories, setCategories] = useState([]);
  const [itemData, setItemData] = useState([]);
  const [hubs, setHubs] = useState([]);
  const [imageLinks, setImageLinks] = useState([]);
  //const [inputValue, setInputValue] = useState('');
  const token = localStorage.getItem('token');
  const [editListing, setEditListing] = useState("hidden");
  const [showModal, setShowModal] = useState(false); // State to control modal visibility
  const [formData, setFormData] = useState({
    itemDescription: '',
    price: '',
    condition: '',
    categoryID: 0
  });

  //Test Code for Rating System
  const [rating, setRating] = useState(0);

  // const handleRatingChange = (newRating) => {
  //   setRating(newRating);
  // };

  const parseImageLinks = useCallback(() => {
    if (stateData.photoID) {
      setImageLinks(stateData.photoID.split(";"));
    }
  }, [stateData.photoID]);

  const handleMessageChange = (e) => {
    setNewMessage(e.target.value);
  };

  useEffect(() => {
    fetch('http://alfi-profiles.galvanizelabs.net/api/profiles/' + stateData.profileID, {
      method: 'GET', 
      headers: {
        'Authorization': `Bearer ${token}`
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
      setResponse(data);
      console.log(data.profileId)
    })
    .catch(error => {
      console.error('Fetch error test:', error);
    });
  }, [token, stateData]);

  useEffect(() => {
    fetch('http://alfi-profiles.galvanizelabs.net/api/profiles/loginProfileId/' + localStorage.getItem("guid"), {
      method: 'GET', 
      headers: {
        'Authorization': `Bearer ${token}`
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
      // setUserProfileId(data.profileId);
      console.log(data.profileId)
      if (data.profileId === stateData.profileID) {
        setEditListing("");
      }
    })
    .catch(error => {
      console.error('Fetch error test:', error);
    });
  }, [token, stateData]);

  useEffect(() => {
    fetch('http://alfi-messages.galvanizelabs.net/api/messages/' + stateData.id, {
      method: 'GET', 
      headers: {
        'Authorization': `Bearer ${token}`
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
      setMessages(data.messageList);
      console.log(data.profileId)
    })
    .catch(error => {
      console.error('Fetch error test:', error);
    });
  }, [token, stateData]);

  //Fetch Call for getting categories
  useEffect(() => {
    fetch('http://alfi-admin.galvanizelabs.net:8080/api/admin/categories', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
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
      console.log(data.categories); 
      setCategories(data.categories);
    })
    .catch(error => {
      console.error('Fetch error test:', error);
    });
  }, [token]);
  //End of Fetch Call

  //Fetch Call for getting hubs
  useEffect(() => {
    fetch('http://alfi-admin.galvanizelabs.net:8080/api/admin/hubs', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
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
      setHubs(data.hubs);
    })
    .catch(error => {
      console.error('Fetch error test:', error);
    });
  }, [token]);
  //End of Fetch Call

  // const {id} = props.match.params;
  //console.log(props.);

  useEffect(() => {
    fetch('http://alfi-items.galvanizelabs.net/api/items/id/' + stateData.id , {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
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
      setItemData(data);
    })
    .catch(error => {
      console.error('Fetch error test:', error);
    });
  }, [token, stateData]);

  useEffect(() => {
    parseImageLinks();
  }, [parseImageLinks])

  const hubName = hubs.find((obj) => obj.id === responseData.hub)?.name || "Unknown Hub";

    

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
    fetch('http://alfi-items.galvanizelabs.net/api/items/' + stateData.id, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(formData),
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      setResponse(data);
      setShowModal(false);
      fetch('http://alfi-items.galvanizelabs.net/api/items/id/' + stateData.id , {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
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
        setItemData(data);
      })
      .catch(error => {
        console.error('Fetch error test:', error);
      });
      // Optionally, you might want to update other states or reload data
    })
    .catch(error => {
      console.error('Update error:', error);
    });
    console.log("Item Updated")
    console.log(formData)
  };

  return (
    <div className="content">  
      <div className="item-header">
        <h1>{}</h1>
        <h2>{}</h2>
      </div>
      <div className="container">
        <div className="singleItemImage">
        <Carousel>  
          {imageLinks.map((item) => (
           <Carousel.Item>  
           <img style={{maxHeight:"100vh"}}
               className="d-block w-100"  
               src={item}  
               alt="First slide"  
             />  
             <Carousel.Caption>  
               <h3>First Slider Image Title</h3>  
               <p>First Slide decription.</p>  
             </Carousel.Caption>  
           </Carousel.Item>  
        ))}  
        </Carousel>
        {/* <h1>{data.itemName}</h1> */}
       
          {/* <img src="https://www.statefarm.com/local/illinois/normal/_jcr_content/root/container/container/image.coreimg.85.1024.jpeg/1702504547189/become-agent-office.jpeg" alt={"Product For Sale"} /> */}
        </div>
        <div className="item-details">
          <div className="itemDescription">
            <h3 className="singleItemDescriptionHeader">Item Description:</h3>
            <p>{itemData.itemDescription}
            </p>
            <div className="itemDetails">
            <div className="itemDetail">
                <h5 className="singleItem">Price:</h5>
                <p>${itemData.price}</p>
            </div>
            <div className="itemDetail">
                <h5 className="singleItem">Condition:</h5>
                <p>{itemData.condition}</p>
            </div>
            <div className="itemDetail">
                <h5 className="singleItem">Category:</h5>
                <p>{categories.find((obj) => obj.id === itemData.categoryID)?.name || 'Unknown'}</p>
            </div>
            <Button variant="primary" onClick={handleEditClick} className={editListing}>Edit</Button> {/* Edit button */}
            <div className="seller-details">
              <h2>Seller Information</h2>
              <p className="seller-name"><strong>Seller Name: </strong> {responseData.firstName}</p>
              <p className="seller-contact"><strong>Email: </strong> {responseData.emailAddress}</p>
              <p className="seller-contact"><strong>Phone: </strong> {responseData.phoneNumber}</p>
              <p className="seller-contact"><strong>Hub: </strong> {hubName}</p>
              <StarRating rating={rating} onRatingChange={setRating} />
            </div>
        </div>
          </div>
          <div className='messages'>
            {messages.length > 0 ? (
              messages.map((message, index) => (
                <div className='message' key={index}>
                  <div className='message-author'>Comment #{index}:</div>
                  <div className='message-text'>{message.comment}</div>
                </div>
              ))
            ) : (
              <p>No messages available</p>
            )}
          </div>
          <div className='input-container'>
            <textarea
              value={newMessage}
              onChange={handleMessageChange}
              placeholder="Type your message here..."
              rows="2"
            />
          </div>
          <button onClick={() => {
            //Fetch Call to add the message
            fetch('http://alfi-messages.galvanizelabs.net/api/messages', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
              },
              body: JSON.stringify({
                comment: newMessage,
                profileId: stateData.profileID,
                itemId: stateData.id
              })
            })
            .then(response => {
              console.log(response)
              window.location.reload()
              // Handle the response
            })
            .catch(error => {
              console.log("ERROR:" + {error})
              // Handle errors
            });
            //End of Fetch Call
          }}>Send</button>
          {/* <div className="singleItemHub">
            <h5 className="singleItemHubHeader">HUB</h5>
            <div className="singleItemHubImage">
              <img src={""} alt={""} />
            </div>
          </div> */}
        </div>
      </div>
      {/* Test Code */}
      <Modal show={showModal} onHide={handleModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Item Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form>
            <div className="mb-3">
              <label htmlFor="firstName" className="form-label">Item Description</label>
              <input
                type="text"
                className="form-control"
                id="itemDescription"
                name="itemDescription"
                value={formData.itemDescription}
                onChange={handleFormChange}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="price" className="form-label">Price</label>
              <input
                type="Number"
                className="form-control"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleFormChange}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="condition" className="form-label">Condition</label>
              <select 
                id="condition"
                name="condition"
                value={formData.condition}
                onChange={handleFormChange}>
              <option value="NEW">NEW</option>
              <option value="REFURBISHED">REFURBISHED</option>
              <option value="EXCELLENT">EXCELLENT</option>
              <option value="FAIR">FAIR</option>
              </select>
              {/* <input
                type="text"
                className="form-control"
                id="phoneNumber"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleFormChange}
              /> */}
            </div>
            {/* <div className="mb-3">
              <label htmlFor="categoryID" className="form-label">Category</label>
              <select id="categoryID"
                name="categoryID"
                value={formData.categoryID}
                onChange={handleFormChange}>
              {categories.map(category => (
              <option key={category.id} value={category.id}>{category.name}</option>
            ))}
              </select>
              {/* <input
                type="text"
                className="form-control"
                id="hub"
                name="hub"
                value={formData.hub}
                onChange={handleFormChange}
              /> 
            </div> */}
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleModalClose}>Close</Button>
          <Button variant="primary" onClick={handleFormSubmit}>Save Changes</Button>
        </Modal.Footer>
      </Modal>
      {/* End of Test Code */}
    </div>
  );
}

export default ServiceThreeApp;