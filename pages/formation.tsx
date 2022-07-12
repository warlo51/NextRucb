import { Box, CardContent, Typography } from "@mui/material";
import Head from "next/head";
import Link from "next/link";
import React from "react";
import {Layout} from "../components/Layout";
export default function Arbitrage() {
  return (
    <Layout>
        <div style={{margin:"20px",display:"flex",justifyContent:"center",flexDirection:"column"}}>
      <Box className="boxFormation">
            <div className="divRegleBasket">
            <CardContent>
              <Typography variant="h5" component="div" style={{color:"#3d1e7b"}}>
                Apprendre les règles de basket
              </Typography>
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
        <CardContent>
          <Typography variant="h5" component="div" style={{color:"#3d1e7b"}}>
                Les Catégories
          </Typography>
              <p></p>
          <Typography variant="body2" color="text.secondary">
          </Typography>
        </CardContent>
      </Box>
      <Box className="boxFormation">
      <div className="divRegleBasket">
            <CardContent>
              <Typography variant="h5" component="div" style={{color:"#3d1e7b"}}>
                Découvrir l'E-Marque
              </Typography>
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
      </div>
    </Layout>
  );
}
