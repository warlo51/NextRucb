import { Badge, Box, CardContent, Typography } from "@mui/material";
import Head from "next/head";
import Link from "next/link";
import React from "react";
import {Layout} from "../components/Layout";
export default function Arbitrage() {
  return (
    <Layout >
        <div style={{padding:"20px",display:"flex",justifyContent:"center",flexDirection:"column"}}>
      <Box className="boxFormation">
      <Badge badgeContent={"Apprendre les règles de basket"} anchorOrigin={{vertical: 'top',horizontal: 'left'}} /> 
            <div className="divRegleBasket">
            <CardContent>
              <p></p>
              <Typography variant="body2" color="text.secondary">
                L'essentiel des règles du basket en video avec Sikana Apprentissage <br></br>
                Retrouvez sur Youtube les règles du basket.<br></br>
                Poursuivez en cliquant sur les liens ci-contre pour approfondir votre apprentissage ou vos connaissances du basket.          
              </Typography>   
            </CardContent>
              <div className="embed-responsive embed-responsive-16by9">
                <iframe className="videoRegleBasket" src="https://www.youtube.com/embed/cngh6fCaRiY" ></iframe>
              </div>
            </div>
      </Box>
      <Box className="boxFormation">
      <Badge badgeContent={"Les Catégories"} anchorOrigin={{vertical: 'top',horizontal: 'left'}} /> 
        <CardContent>
              <p></p>
          <Typography variant="body2" color="text.secondary">
          </Typography>
        </CardContent>
      </Box>
      <Box className="boxFormation">
      <Badge badgeContent={"Découvrir l'E-Marque"} anchorOrigin={{vertical: 'top',horizontal: 'left'}} /> 
      <div className="divRegleBasket">
            <CardContent>
              <p></p>
              <Typography variant="body2" color="text.secondary">
                Grâce à cette vidéo, découvrez l'e-marque en quelques minutes
              </Typography>   
            </CardContent>
              <div className="embed-responsive embed-responsive-16by9">
                <iframe className="videoRegleBasket" src="https://www.youtube.com/embed/vHAyAScqyDo" ></iframe>
              </div>
            </div>
      </Box>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      </div>
    </Layout>
  );
}
