import React from "react";
import { PiUserCircleDuotone,
} from "react-icons/pi";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Offcanvas from "react-bootstrap/Offcanvas";

export default function SidePanelNav() {
  
  return (
    <div className="header-nav">
      {[false].map((expand) => (
        <Navbar key={expand} expand={expand}>
            <span 
            ><PiUserCircleDuotone className="side-panel" style={{ margin: "-5px"}} size={60}
            aria-controls={`offcanvasNavbar-expand-${expand}`}/>
              <Navbar.Toggle
                className="overlay"
                style={{ border: "none", opacity:0, height: "2em"}}
                aria-controls={`offcanvasNavbar-expand-${expand}`}
              />
            </span>
            <Navbar.Offcanvas
              id={`offcanvasNavbar-expand-${expand}`}
              aria-labelledby={`offcanvasNavbarLabel-expand-${expand}`}
              placement="start"
              style={{ width: 'auto' }}
            >
              <Offcanvas.Header closeButton>
                <Offcanvas.Title id={`offcanvasNavbarLabel-expand-${expand}`}>
                    <PiUserCircleDuotone size={70}/>
                    <br></br>
                    {`Hi, ${localStorage.getItem("firstName")}`}
                </Offcanvas.Title>
              </Offcanvas.Header>
              <Offcanvas.Body>
                <Nav className="justify-content-start flex-grow-1 pe-3">
                  <Nav.Link href='/serviceOne'>User Webpage</Nav.Link>
                  <Nav.Link href='/serviceFour'>Admin Webpage</Nav.Link>
                  <Nav.Link href='/identity'>Log In/Out</Nav.Link>
                </Nav>
              </Offcanvas.Body>
            </Navbar.Offcanvas>
        </Navbar>
      ))}
    </div>
  );
}

