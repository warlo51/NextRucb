import Head from "next/head";
import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import HomeIcon from "@mui/icons-material/Home";
import Link from "next/link";
import { useRouter } from "next/router";
import {
  Button,
  Container,
  Dropdown,
  Form,
  FormControl,
  Nav,
  Navbar,
  NavDropdown,
  Offcanvas,
} from "react-bootstrap";
import { Router } from "@mui/icons-material";

export const Layout: React.FC<any> = ({ children }) => {
    const [sousMenuQSN,setSousMenuQSN] = React.useState(<></>);
    const [sousMenuQSNOpen,setSousMenuQSNOpen] = React.useState(false);
    const [sousMenuNP,setSousMenuNP] = React.useState(<></>);
    const [sousMenuNPOpen,setSousMenuNPOpen] = React.useState(false);
    const [user, setUser] = React.useState<any>([{}]);
    const router = useRouter();

    function closeSousMenu(){
        setSousMenuQSN(<></>);
        setSousMenuNP(<></>);
    }

  React.useEffect(()=>{
    if(sousMenuQSNOpen === true){
      setSousMenuQSN(<>
          <Dropdown.Item
                    style={{
                      borderRadius: "10px",
                      color: "white",
                      fontFamily: "Bebas Neue",
                      fontSize: "1.5rem",
                      marginLeft: "0.5rem",
                      marginBottom: "1rem",
                    }}
                    href="/qui/historique"
                  >
                    Historique du RUC Basket
                  </Dropdown.Item>
          <Dropdown.Item
                    style={{
                      borderRadius: "10px",
                      color: "white",
                      fontFamily: "Bebas Neue",
                      fontSize: "1.5rem",
                      marginLeft: "0.5rem",
                      marginBottom: "1rem",
                    }}
                    href="/qui/comite"
                  >
                    Comité Directeur
                  </Dropdown.Item>
          <Dropdown.Item
                    style={{
                      borderRadius: "10px",
                      color: "white",
                      fontFamily: "Bebas Neue",
                      fontSize: "1.5rem",
                      marginLeft: "0.5rem",
                      marginBottom: "1rem",
                    }}
                    href="/qui/entraineurs"
                  >
                    Les Entraineurs
                  </Dropdown.Item>
          <Dropdown.Item
                    style={{
                      borderRadius: "10px",
                      color: "white",
                      fontFamily: "Bebas Neue",
                      fontSize: "1.5rem",
                      marginLeft: "0.5rem",
                      marginBottom: "1rem",
                    }}
                    href="/qui/complexe"
                  >
                    Complexe Sportif H.Barbusse
                  </Dropdown.Item>
        </>);
        
    }
    else{
      setSousMenuQSN(<></>);
    }
  },[sousMenuQSNOpen]);

  React.useEffect(()=>{
    if(sousMenuNPOpen === true){
      setSousMenuNP(<>
          <Dropdown.Item
                    style={{
                      borderRadius: "10px",
                      color: "white",
                      fontFamily: "Bebas Neue",
                      fontSize: "1.5rem",
                      marginLeft: "0.5rem",
                      marginBottom: "1rem",
                    }}
                    
                    href="/partenaires/mecenat"
                  >
                    Mécenat
                  </Dropdown.Item>
          <Dropdown.Item
                    style={{
                      borderRadius: "10px",
                      color: "white",
                      fontFamily: "Bebas Neue",
                      fontSize: "1.5rem",
                      marginLeft: "0.5rem",
                      marginBottom: "1rem",
                      paddingLeft:"20px"
                    }}
                    href="/partenaires/dossier_sponsor"
                  >
                    Dossier Sponsor
                  </Dropdown.Item>
          <Dropdown.Item
                    style={{
                      borderRadius: "10px",
                      color: "#333",
                      fontFamily: "Bebas Neue",
                      fontSize: "1.5rem",
                      marginLeft: "0.5rem",
                      marginBottom: "1rem",
                    }}
                    href="/partenaires/info"
                  >
                     Nos Partenaires
                  </Dropdown.Item>
        </>);    
    }
    else{
      setSousMenuNP(<></>);
    }
  },[sousMenuNPOpen]);

  return (
    <div>
      <Navbar bg="#3c1d79" expand={false} style={{backgroundColor:"#3c1d79"}}>
        <Container fluid>
          <div
            className="d-flex justify-content-between flex-wrap "
            style={{ width: "100%" }}
          >
            <div
              style={{
                fontFamily: "Bebas Neue",
                color: "#3c1d79",
                fontSize: "1.6rem",
              }}
            >
              <Navbar.Toggle
                aria-controls="offcanvasNavbar"
                style={{
                  backgroundColor: "white",
                  margin: " 0.8rem 1rem ",
                  color: "3c1d79",
                  border: "1px solid",
                }}
              />
            </div>

            <Navbar.Brand
              style={{
                color: "white",
                fontFamily: "Bebas Neue",
                width: "15rem",
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-around",
                alignItems: "center",
              }}
            >
              <Link href="/home">
                <button
                  className="btn btn-light"
                  style={{ backgroundColor: "#3c1d79", color: "#f77300" }}
                >
                  <HomeIcon />
                </button>
              </Link>
            </Navbar.Brand>
          </div>

          <Navbar.Offcanvas
            id="offcanvasNavbar"
            aria-labelledby="offcanvasNavbarLabel"
            placement="start"
            variant="#f77300"
            style={{
              backgroundColor: "#3c1d79",
              textAlign: "center",
              lineHeight: "4rem",
            }}
          >
            <Offcanvas.Header
              closeButton
              style={{
                backgroundColor: "#3c1d79",
              }}
              onClick={()=>{ closeSousMenu()}}
            >
              <Offcanvas.Title
                id="offcanvasNavbarLabel"
                style={{
                  color: "white",
                  fontFamily: "Bebas Neue",
                  marginBottom: "1.6rem",
                  paddingTop: "0.5rem",
                  fontSize: "3.4rem",
                  lineHeight: "2rem",
                  paddingLeft: "8.7rem",
                  height: "1.5rem",
                }}
              >
                Menu
              </Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body
              style={{
                paddingTop: "4.6rem",
                color: "white",
                fontFamily: "Bebas Neue",
                lineHeight: "6rem",
              }}
            >
              <Nav className="justify-content-start flex-grow-3 pe-3">
                <Dropdown style={{ lineHeight: "7rem" }}>
                  <Dropdown.Item
                    style={{
                      borderRadius: "10px",
                      color: "white",
                      fontFamily: "Bebas Neue",
                      fontSize: "2rem",
                      marginLeft: "0.5rem",
                      marginBottom: "1rem",
                    }}
                    
                    href="/home"
                  >
                    Accueil
                  </Dropdown.Item>
                  <Dropdown.Item
                    style={{
                      borderRadius: "10px",
                      color: "white",
                      fontFamily: "Bebas Neue",
                      fontSize: "2rem",
                      marginLeft: "0.5rem",
                      marginBottom: "1rem",
                    }}
                    href="/arbitrage"
                  >
                    Arbitrage
                  </Dropdown.Item>
                  <Dropdown.Item
                    style={{
                      borderRadius: "10px",
                      fontFamily: "Bebas Neue",
                      color: "white",
                      fontSize: "2rem",
                      marginLeft: "0.5rem",
                      marginBottom: "1rem",
                    }}
                    className="test"
                    onClick={()=>{setSousMenuQSNOpen(!sousMenuQSNOpen)}}
                  >
                    Qui Sommes Nous 
                  </Dropdown.Item>
                  {sousMenuQSN}
                  <Dropdown.Item
                    style={{
                      borderRadius: "10px",
                      color: "white",
                      fontFamily: "Bebas Neue",
                      fontSize: "2rem",
                      marginLeft: "0.5rem",
                      marginBottom: "1rem",
                    }}
                    onClick={()=>{setSousMenuNPOpen(!sousMenuNPOpen)}}
                  >
                    Nos Partenaires
                  </Dropdown.Item>
                  {sousMenuNP}
                </Dropdown>
              </Nav>
            </Offcanvas.Body>
          </Navbar.Offcanvas>
        </Container>
      </Navbar>
      {children}
    </div>
  );
};