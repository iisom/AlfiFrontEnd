import React from "react";
import "./index.css";
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Card from "react-bootstrap/Card";
import Button from 'react-bootstrap/Button';
import AtlantaHub from "./img/AtlantaHub.png";
import TempeHub from "./img/TempeHub.png";
import RichardsonHub from "./img/RichardsonHub.png";
import BloomingtonCorp from "./img/BloomingtonCorp.png";
import { useNavigate, useLocation, Link  } from "react-router-dom";
import { useState,useEffect } from "react";

function Home() {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem("token");
  const [buttonClass,] = useState('main-nav');
  const [newListings, setNewListings] = useState([]);
  const [expiringListings, setExpiringListings] = useState([]);
  const [isNewListingsActive, setIsNewListingsActive] = useState(false);
  const [isExpiringListingsActive, setIsExpiringListingsActive] = useState(false);
  
  // Check if the current path is home
  const isHome = location.pathname === '/';

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const url = "http://alfi-items.galvanizelabs.net/api/items";
        const response = await fetch(url, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        const now = new Date();
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(now.getDate() - 7);
        const inSevenDays = new Date();
        inSevenDays.setDate(now.getDate() + 7);

        const recentItems = data.items.filter(item => new Date(item.itemPostedDate) >= sevenDaysAgo);
        const soonExpiringItems = data.items.filter(item => new Date(item.expirationDate) <= inSevenDays);

        setNewListings(recentItems);
        setExpiringListings(soonExpiringItems);
      } catch (error) {
        console.error("Fetch error:", error);
      }
    };

    fetchListings();
  }, [token, isNewListingsActive, isExpiringListingsActive]);

  const handleNewListingsClick = () => {
    setIsNewListingsActive(true);
    setIsExpiringListingsActive(false);
  };

  const handleExpiringListingsClick = () => {
    setIsNewListingsActive(false);
    setIsExpiringListingsActive(true);
  };

  const handleBrowseAllClick = () => {
    setIsNewListingsActive(false);
    setIsExpiringListingsActive(false);
    navigate('/serviceTwo');
  };

  const handleNavigate = (hubId) => {
    navigate('/serviceTwo', { state: {hubId} });
  }

  return (
    <>
        <ButtonGroup style={{height: "7em"}} className={isHome ? buttonClass : 'hidden'}>
          <Button className={`home-btns ${isNewListingsActive ? 'active' : ''}`} onClick={handleNewListingsClick} >New Listings</Button>
          <Button className={`home-btns ${isExpiringListingsActive ? 'active' : ''}`} onClick={handleExpiringListingsClick}>Ending Soon</Button>
          <Button className="home-btns" onClick={handleBrowseAllClick}>Browse All</Button>
        </ButtonGroup>
        
      <div className={`content ${isNewListingsActive || isExpiringListingsActive ? 'AllItems' : ''}`}>
        {isNewListingsActive ? (
          newListings.length > 0 ? (
            newListings.map((item) => (
              <Card key={item.id} style={{ width: "20rem", marginTop: "1em" }}>
                <Card.Img variant="top" src={item.photoID} alt="product" />
                <Card.Body>
                  <Card.Title>{item.itemName} : ${item.price}</Card.Title>
                  <Card.Text>{item.itemDescription}</Card.Text>
                  <Link to={`../ServiceThree`} state={item}>View Details</Link>
                </Card.Body>
              </Card>
            ))
          ) : (
            <p style={{color:"white", fontSize: "4em", width: 'max-content'}}>No new listings available.</p>
          )
        ) : isExpiringListingsActive ? (
          expiringListings.length > 0 ? (
            expiringListings.map((item) => (
              <Card key={item.id} style={{ width: "20rem", marginTop: "1em" }}>
                <Card.Img variant="top" src={item.photoID} alt="product" />
                <Card.Body>
                  <Card.Title>{item.itemName} : ${item.price}</Card.Title>
                  <Card.Text>{item.itemDescription}</Card.Text>
                  <Link to={`../ServiceThree`} state={item}>View Details</Link>
                </Card.Body>
              </Card>
            ))
          ) : (
            <p style={{color:"white", fontSize: "4em", width: 'max-content'}}>No expiring listings available.</p>
          )
        ) : (
          // Default content or other components
          <ButtonGroup style={{marginBottom: "25em"}} className="hubButtons">
            <button className="image-button" onClick={() => {
              handleNavigate(9);
            }}>
                <div className="overlay">
                    <span className="button-text">Atlanta Hub</span>
                </div>
                <img src={AtlantaHub} alt="Atlanta Hub"/>
            </button>
            <button className="image-button" onClick={() => {
              handleNavigate(4);
            }}>
                <div className="overlay">
                    <span className="button-text">Tempe Hub</span>
                </div>
                <img src={TempeHub} alt="Tempe Hub"/>
            </button>
            <button className="image-button" onClick={() => {
              handleNavigate(2);
            }}>
                <div className="overlay">
                    <span className="button-text">Richardson Hub</span>
                </div>
                <img src={RichardsonHub} alt="Richardson Hub"/>
            </button>
            <button className="image-button" onClick={() => {
              handleNavigate(1);
            }}>
                <div className="overlay">
                    <span className="button-text">Bloomington Corporate</span>
                </div>
                <img src={BloomingtonCorp} alt="Bloomington Corp"/>
            </button>
          </ButtonGroup>
        )}
      </div>
    </>
  );
}
export default Home;
