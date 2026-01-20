import React, { useState, useEffect } from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import CahoIcon from "../src/assets/Img/M&M.png";
import BluePine from "../src/assets/Img/Asset1.png";
import Caho from "../src/assets/Img/cahotech-logo.png";
import CahoDia2026 from "../src/assets/Img/Diag.webp";

import "./header.css";

function Headers() {
  const [scrollPosition, setScrollPosition] = useState(0);

  const [navbarBackground, setNavbarBackground] = useState("#0c4778ff");

  return (
    <Navbar
      collapseOnSelect
      expand="lg"
      fixed="top"
      style={{
        backgroundColor: navbarBackground,
        borderBottom: "2px solid orange",
        transition: "background-color 0.3s ease",
      }}
      className="header_main montaga-regulars"
    >
      <Container>
        <Nav className="me-auto">
          <Navbar.Brand className="header">
            <img
              src={CahoDia2026}
              alt="Caho_Diagnostion_Icon"
              className="ImgLogo"
            />
          </Navbar.Brand>
        </Nav>
      </Container>
    </Navbar>
  );
}

export default Headers;
