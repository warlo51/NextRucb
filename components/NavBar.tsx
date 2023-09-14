import React, { useEffect, useState } from "react";
import { Navbar, Nav, NavDropdown } from "react-bootstrap";

export default function NavBar(props: any) {

   const [fix,setFix] = useState(false);

   function setFixed(){

      if(window.scrollY >=50){
         setFix(true);
      }else{
         setFix(false);
      }
   }
   useEffect(() => {
      window.addEventListener("scroll",setFixed);
    }, []);


    if(props.colorText === "white"){
      return (
        <Navbar bg="" expand="lg" >
          <Navbar.Toggle id="buttonToggle" aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav id="nav" className={fix ? "NavBar fixed" : "NavBar"}>
              <Nav.Link id="link" href="/" style={{color:`${props.colorText}`}}>Accueil</Nav.Link>
              <Nav.Link id="link" href="/actus" style={{color:`${props.colorText}`}}>Actualités</Nav.Link>
              <Nav.Link id="link" href="" ><img alt="logoRUCB" src="../logoruc.png" className={fix ? "logo fixed" : "logo"}/></Nav.Link>
              <NavDropdown title="Qui Sommes Nous" id="basic-nav-dropdown" >
                <NavDropdown.Item id="linkDropdown" href="/qui/historique" >Histoire Du RUC</NavDropdown.Item>
                <NavDropdown.Item id="linkDropdown" href="/formation" >Formation</NavDropdown.Item>
                <NavDropdown.Item id="linkDropdown" href="/qui/comite">Comité Directeur</NavDropdown.Item>
                <NavDropdown.Item id="linkDropdown" href="/qui/complexe">Complexe Sportif</NavDropdown.Item>
                <NavDropdown.Item id="linkDropdown" href="/qui/entraineurs">Nos Entraineurs</NavDropdown.Item>
              </NavDropdown>
              <NavDropdown title="Nos Partenaires" id="basic-nav-dropdown">
                <NavDropdown.Item id="linkDropdown"  href="/partenaires/mecenat">Mecenat</NavDropdown.Item>
                <NavDropdown.Item id="linkDropdown" href="/partenaires/info">Informations</NavDropdown.Item>
              </NavDropdown>
            </Nav>
          </Navbar.Collapse>
        </Navbar>
        );
    }else{
      return (
        <Navbar bg="" expand="lg" >
          <Navbar.Toggle aria-controls="basic-navbar-nav" id="buttonToggle"/>
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav id="nav" className={fix ? "NavBar fixed" : "NavBar"}>
              <Nav.Link href="/" style={{color:`${props.colorText}`}}>Accueil</Nav.Link>
              <Nav.Link href="/actus" style={{color:`${props.colorText}`}}>Actualités</Nav.Link>
                <Nav.Link id="link" href="" ><img alt="logoRUCB" src="../logoruc.png" className={fix ? "logo fixed" : "logo"}/></Nav.Link>
              <NavDropdown title="Qui Sommes Nous" id="basic-nav-dropdown-black" >
                <NavDropdown.Item id="linkDropdown" href="/qui/historique" >Histoire Du RUC</NavDropdown.Item>
                  <NavDropdown.Item id="linkDropdown" href="/formation" >Formation</NavDropdown.Item>
                <NavDropdown.Item id="linkDropdown" href="/qui/comite">Comité Directeur</NavDropdown.Item>
                <NavDropdown.Item id="linkDropdown" href="/qui/complexe">Complexe Sportif</NavDropdown.Item>
                <NavDropdown.Item id="linkDropdown" href="/qui/entraineurs">Nos Entraineurs</NavDropdown.Item>
              </NavDropdown>
              <NavDropdown title="Nos Partenaires" id="basic-nav-dropdown-black">
                <NavDropdown.Item id="linkDropdown"  href="/partenaires/mecenat">Mecenat</NavDropdown.Item>
                <NavDropdown.Item id="linkDropdown" href="/partenaires/info">Informations</NavDropdown.Item>
              </NavDropdown>
            </Nav>
          </Navbar.Collapse>
        </Navbar>
        );
    }
}
