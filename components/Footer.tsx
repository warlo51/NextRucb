import React from "react";
import { MDBContainer, MDBFooter } from "mdbreact";
import { Col, Row } from "react-bootstrap";

const FooterPage = () => {
  return (
    <MDBFooter color="blue" className="font-small pt-4 mt-4 footer">
      <Row>
        <Col style={{textAlign:"center"}} xs={12} sm={3}>COMPETITION</Col>
        <Col style={{textAlign:"center"}} xs={12} sm={3}>RESPECT</Col>
        <Col style={{textAlign:"center"}} xs={12} sm={3}>ACCUEIL</Col>
        <Col style={{textAlign:"center"}} xs={12} sm={3}>CONVIVIALITE</Col>
      </Row>
      <div className="footer-copyright text-center py-3">
        <MDBContainer fluid>
          &copy; {new Date().getFullYear()} Copyright: <a> RucBasket Reims </a><br></br>
          &copy;  Developper: <a> Mansuy Maxime </a>
        </MDBContainer>
      </div>
    </MDBFooter>
  );
}

export default FooterPage;