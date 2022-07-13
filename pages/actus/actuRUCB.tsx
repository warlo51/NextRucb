import * as React from 'react';
import { Button } from "react-bootstrap";
import CardContent from '@mui/material/CardContent';
import { Box, Container, Grid, Typography } from "@mui/material";
import Header from '../../components/Header';
import NavBar from '../../components/NavBar';
import { Layout } from '../../components/Layout';
import { Col, Row } from 'react-bootstrap';



export default function ActuRUCB():JSX.Element {
  return (
       <Layout>
        <div style={{margin:"20px",display:"flex",justifyContent:"center",flexDirection:"column"}}>
        <Box className="boxHistoriquePage">
          <CardContent>
          <Button id="badge">Une page se tourne</Button>
            <p></p>
            <Box className="boxHistoriquePage">
              <Row >
                <Col xs={12} sm={6} id="colBox">
                  <p>Quelle émotion au moment de dire au revoir à Gabriel MANSUY, joueur du RUCB qui est arrivé en 2015 au club et qui signe aujourd'hui un contrat à la JDA DIJON.</p>
                  <p>L&apos;occasion pour Gérard BAUDESSON de lui remettre le maillot officiel du club pour le souvenir !!</p>
                  <p>Bonne chance à lui !!</p>
                </Col>
                <Col id="imgActu" xs={12} sm={6}><img src='../divers/gabrielDepart.jpg'/></Col>
              </Row>
              </Box>
            <Box className="boxHistoriquePage">
              <Row>
                <Col id="colBox" xs={12} sm={6}>
                  <p>Merci !!</p>
                  <p>Comment saluer plus simplement l&apos;énorme travail effectué par nos bénévoles et joueurs qui partent aujourd'hui vers d&apos;autres aventures. (JH,NAS,STANIE,JUJU,REMI ...)</p>
                  <p>Bonne continuation sur les parquets pour certains et bonne retraite sportive pour d&apos;autres ... et si vous vous ennuyer en septembre revenez nous voir !</p>
                </Col>
                <Col id="imgActu" style={{justifyContent:"flex-end"}} sm={6} xs={12}><img  src='../divers/ancienDepart.jpg'/></Col>
              </Row>
            </Box>
            <Box className="boxHistoriquePage">
              <Row>
                <Col id="colBox" xs={12} sm={6}>
                  <p>C&apos;est l&apos;heure des grandes décisions au sein de notre club.</p>
                  <p>Après plusieurs décennie de présidence, Monsieur Gérard BAUDESSON a décidé de céder sa place de président.</p>
                  <p>Séisme dans le milieu du basket grand EST !!</p>
                  <p>Rassurons nous, il ne sera pas loin car il reste bien évidemment au sein du club !!</p>
                  <p>L&apos;occasion était donc bien choisie pour lui remettre le trophée de président d&apos;honneur pour saluer l&apos;ensemble de son oeuvre !</p>
                  <p>MERCI GERARD</p>
                </Col>
                <Col id="imgActu" sm={6} xs={12}><img  src='../divers/gerardDepart.jpg'/><img  src='../divers/tropheePresident.jpg'/></Col>
              </Row>
            </Box>
          </CardContent>
        </Box>
        </div>
        </Layout>
  );
}
