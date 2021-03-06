import { Badge, Box, CardContent } from "@mui/material";
import { Button } from "react-bootstrap";
import React from "react";
import { Col, Row } from "react-bootstrap";
import { Layout } from "../../components/Layout";
import Head from "next/head";

export default function Complexe() {

  const images = [
    "../../gymnase5.jpg",
    "../../gymnase1.jpg",
    "../../gymnase2.jpg",
    "../../gymnase3.jpg",
    "../../gymnase4.jpg"
  ]
  return (
      <Layout>
        <Head>
        <title>Complexe</title>
        <meta name="description" content="Quelques informations sur le gymnase du RUCB basket"/>
        <meta name="google-site-verification" content="g-JktWG1_hWPLXMEXwsoblRJTiPvWl8QbmLFIvt_8aU" />
    </Head>
        <div style={{margin:"20px",display:"flex",justifyContent:"center",flexDirection:"column"}}>
        <Box className="boxComplexeImage">
        <Button id="badge">PLAN D'ACCES</Button>
              <CardContent >
                <div>
                <iframe className="imgGoogleMap" src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2604.0427471073685!2d4.049136316215236!3d49.25663567932848!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47e975cba98ed503%3A0xbcbb98dd0d5707e1!2sRue%20Henri%20Barbusse%2C%2051100%20Reims!5e0!3m2!1sen!2sfr!4v1657612513327!5m2!1sen!2sfr" width="400" height="300" style={{border:0}} loading="lazy"></iframe>
                </div>
              </CardContent>
            </Box>
            <Box className="boxComplexeImage">
            <Badge badgeContent={"QUELQUES IMAGES"} anchorOrigin={{vertical: 'top',horizontal: 'left'}} /> 
              <CardContent >
                <Row>
                  <Col><img alt="imageComplexeRUCB" src="../../gymnase5.jpg" className="imgComplexeBox"/></Col>
                  <Col><img alt="imageComplexeRUCB" src="../../gymnase1.jpg" className="imgComplexeBox"/></Col>
                </Row>
                <Row>
                  <Col><img alt="imageComplexeRUCB" src="../../gymnase2.jpg" className="imgComplexeBox"/></Col>
                  <Col><img alt="imageComplexeRUCB" src="../../gymnase3.jpg" className="imgComplexeBox"/></Col>
                </Row>
                <Row>
                  <Col><img alt="imageComplexeRUCB" src="../../gymnase4.jpg" className="imgComplexeBox"/></Col>
                </Row>
              </CardContent>
            </Box>
        </div>
      </Layout>
  );
}
