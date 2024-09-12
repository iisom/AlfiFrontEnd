import React, { useReducer, useState } from "react";
import IdentityApp from "./IdentityResources/IdentityApp";
import ServiceOneApp from "./ServiceOneResources/ServiceOneApp";
import ServiceTwoApp from "./ServiceTwoResources/ServiceTwoApp";
import ServiceThreeApp from "./ServiceThreeResources/ServiceThreeApp";
import ServiceFourApp from "./ServiceFourResources/ServiceFourApp";
import { Route, Routes, useNavigate, useLocation } from "react-router-dom";
import Home from "./Home";
import SidePanelNav from "./SidePanelNav";
import { BsSearch } from "react-icons/bs";
import { BsFillPlusCircleFill } from "react-icons/bs";
import LoggedOut from "./LoggedOut";
import AuthContext from './IdentityResources/Contexts/AuthContext';
import AddItemForm from './AddItemForm';

const authReducer = (state, action) => {
  switch (action.type) {
    case "saveAuth":
      const copyOfState = { ...state };
      copyOfState.username = action.payload.username;
      copyOfState.token = action.payload.token;
      return copyOfState;
    default:
      return state;
  }
};

const authInitialState = {
  username: localStorage.getItem("username"),
  token: localStorage.getItem("token"),
};
  

function App() {
    const [authState, authDispatch] = useReducer(authReducer, authInitialState)
    const navigate = useNavigate();
    const location = useLocation();
    const [headerClass, ] = useState('main-head');
    const [showForm, setShowForm] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const toggleForm = () => setShowForm(!showForm);
  

    // Check if the current path is home
    const isHome = location.pathname === '/';
    const isServiceThree = location.pathname === '/ServiceThree';
    const hideBackground = ['/serviceOne', '/serviceFour'].includes(location.pathname);

    const handleSearchChange = (e) => {
      setSearchQuery(e.target.value);
    };

    const handleNavigate = () => {
      navigate('/serviceTwo', { state: {searchQuery} });
    }

  return (
    <AuthContext.Provider value={[authState, authDispatch]}>
      <div className={`wrapper ${hideBackground ? 'no-background' : ''}`}>
        <header className="header">
            <SidePanelNav />
            <h2 className={(isHome || isServiceThree) ? headerClass : 'sub-head'} onClick={()=>{
              navigate('/')
              window.location.reload();
              console.log('clicked');
              }}>ALFI</h2>
            <BsFillPlusCircleFill className="plus-icon" onClick={toggleForm} />
        </header>
      {showForm && <AddItemForm show={showForm} onHide={toggleForm} />}
        <span className="search-engine">
          <BsSearch size={25} onClick={handleNavigate}/>
          <input 
          type="text" 
          className="search-input" 
          placeholder="Search" 
          value={searchQuery}
          onChange={handleSearchChange}
          />
        </span>
        <>
          <Routes>
            <Route path={"/loggedOut"} element={<LoggedOut />} />
            <Route path={"/"} element={<Home />} />
            <Route path={"/serviceOne/*"} element={<ServiceOneApp />} />
            <Route path={"/serviceTwo/*"} element={<ServiceTwoApp />} />
            <Route path={"/serviceThree/*"} element={<ServiceThreeApp />} />
            <Route path={"/serviceFour/*"} element={<ServiceFourApp />} />
            <Route path={"/identity/*"} element={<IdentityApp />} />
          </Routes>
        </>
        <footer className="main-footer">
          <p>ALFI &copy; </p>
          <p id="copyrightText">
            All information provided by ALFI.com is for entertainment purposes
            only.
          </p>
        </footer>
      </div>
    </AuthContext.Provider>
  );
}

export default App;

