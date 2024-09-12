import React, { useState, useEffect, useCallback } from "react";
import Card from "react-bootstrap/Card";
import "../index.css";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import Dropdown from "react-bootstrap/Dropdown";
import { Link, useLocation } from 'react-router-dom';

function ServiceTwoApp() {
  const [responseData, setResponse] = useState([]);
  const [categories, setCategories] = useState([]);
  const [hubs, setHubs] = useState([]);
  // const [searchQuery, setSearchQuery] = useState('');
  const token = localStorage.getItem("token");
  const location = useLocation();

  let stateData = location.state;
  // if (!location.state){
  //   console.log("No Search")
  // } else {
  //   setSearchQuery(location.state)
  // }
  
  console.log("State Data = " + JSON.stringify(stateData))

  useEffect(() => {
    fetch("http://alfi-admin.galvanizelabs.net:8080/api/admin/categories", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
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
      .catch(error => console.error("Fetch error:", error));
  }, [token]);

  useEffect(() => {
    fetch("http://alfi-admin.galvanizelabs.net:8080/api/admin/hubs", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(response => {
        console.log(response);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json(); 
      })    
      .then(data => { 
        setHubs(data.hubs);
        console.log(data.hubs);
      })   
      .catch(error => console.error("Fetch error:", error));
  }, [token]);

  useEffect(() => {
    fetch("http://alfi-items.galvanizelabs.net/api/items", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(response => {
        console.log(response);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json(); 
      })
      .then(data => {
        console.log(data.items); 
        setResponse(data.items);
        if (stateData !== null) {
          console.log("Fetch Searched Data")
          fetch("http://alfi-items.galvanizelabs.net/api/items/description?keyword=" + stateData.searchQuery, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
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
            })
            .catch(error => console.error("Fetch error:", error));
        }
      })
      .catch(error => console.error("Fetch error:", error));
  }, [token, stateData]);

  
  const isServiceTwo = location.pathname === "/serviceTwo";
  const [buttonClass, setButtonClass] = useState("main-nav");

  const fetchItems = useCallback(async (url) => {
    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setResponse(Array.isArray(data.items) ? data.items : data);
    } catch (error) {
      console.error("Fetch error:", error);
    }
  }, [token]);

  const handleSort = (sortOrder) => {
    const sortedItems = [...responseData].sort((a, b) =>
      sortOrder === "lowToHigh" ? a.price - b.price : b.price - a.price
    );
    setResponse(sortedItems);
  };

  const handleFilterByCategory = (categoryId) => {
    fetchItems(
      `http://alfi-items.galvanizelabs.net/api/items/category/${categoryId}`
    );
  };

  const handleFilterByHub = useCallback((hubid) => {
    fetchItems(
      `http://alfi-items.galvanizelabs.net/api/items/hub/${hubid}`
    );
  }, [fetchItems]);

  const [headerClass, ] = useState('main-head');

  useEffect(() => {
    if (stateData !== null) {
      if (stateData.hasOwnProperty("hubId")) {
        handleFilterByHub(stateData.hubId)
        window.history.replaceState({}, '')
      }
    }
  }, [stateData, handleFilterByHub])
  

  return (
    <>
      <h2 className={isServiceTwo ? headerClass : 'hidden'}>Browse All Items</h2>
      <ButtonGroup
        className={isServiceTwo ? buttonClass : setButtonClass("hidden")}
      >
        <Dropdown>
          <Dropdown.Toggle  variant="light" >
            Sort By Price
          </Dropdown.Toggle>
          <Dropdown.Menu >
            <Dropdown.Item
              className="itemFilters"
              onClick={() => handleSort("lowToHigh")}
            >
              Low To High (Price)
            </Dropdown.Item>
            <Dropdown.Item
              className="itemFilters"
              onClick={() => handleSort("highToLow")}
            >
              High To Low (Price)
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>

        <Dropdown>
          <Dropdown.Toggle variant="light" >
            Filter By Hub
          </Dropdown.Toggle>
          <Dropdown.Menu >
          {hubs.map((hub) => (
            <Dropdown.Item
                key={hub.id}
                className="itemFilters"
                onClick={() => handleFilterByHub(hub.id)}
              >
                {hub.name} (Hub)
              </Dropdown.Item>
          ))}
          </Dropdown.Menu>
        </Dropdown>

        <Dropdown>
          <Dropdown.Toggle variant="light" >
            Filter By Category
          </Dropdown.Toggle>
          <Dropdown.Menu >
          {categories.map((category) => (
            <Dropdown.Item
                key={category.id}
                className="itemFilters"
                onClick={() => handleFilterByCategory(category.id)}
              >
                {category.name} (Category)
              </Dropdown.Item>
          ))}
          </Dropdown.Menu>
        </Dropdown>
      </ButtonGroup>

      <div className="content AllItems">
        {responseData.map((item) => (
          <Card key={item.id} style={{ width: "20rem", marginTop: "1em" }}>
            <div key={item.id} className='cardcontent'>
            <Card.Img
              src={item.photoID}
              alt="No Photo"
            />
            <Card.Body>
            
              <Card.Title>
                {item.itemName} : ${item.price}
              </Card.Title>
              <Card.Text>{item.itemDescription}</Card.Text>
              <Link to={`../ServiceThree`} state={item}>View Details</Link>
            </Card.Body>
            </div>
          </Card>
        ))}
      </div>
    </>
  );
}

export default ServiceTwoApp;

