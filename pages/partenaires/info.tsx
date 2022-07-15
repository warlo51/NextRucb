import { Box, CardContent, Container, ImageList, ImageListItem, Typography } from "@mui/material";
import { Button } from "react-bootstrap";
import React from "react";
import {Layout} from "../../components/Layout";
export default function info() {
  const itemData = [
    "../../sponsors/CD51.png",
    "../../sponsors/LogoVilledeReims.jpg",
    "../../sponsors/liguegdestbasket.png",
    "../../sponsors/ffbb.png",
    "../../sponsors/logocomitemarne.png"
  ]
  const itemDataPrive = [
    "../../sponsors/NouveauLogoNorauto.jpg",
    "../../sponsors/LOGOMAISONKIKEL.jpg",
    "../../sponsors/logocarrefour.png",
    "../../sponsors/logoBuffaloGrill.png",
    "../../sponsors/Charpentiersdumassif.png",
    "../../sponsors/logoCIC.jpg",
    "../../sponsors/TAYLOR.jpg",
    "../../sponsors/JSRDRUM.jpg"
  ]
  return (
    <Layout>
      
         <div style={{padding:"20px",marginTop:"40px" ,display:"flex",justifyContent:"center",flexDirection:"column"}}>
          <Box className="boxPartenaires">
          <Button id="badge">Les partenaires institutionnels</Button>
            <div className="containerImgPartenaires">
              {itemData.map((element,index)=>{
                return <img alt="imagePartenairesRUCB" className="imgBoxPartenaires" key={index} style={{marginRight:"20px"}} src={`${element}`}/>
              })}
            </div>
          </Box>
          
          <Box className="boxPartenaires">
          <Button id="badge">Les partenaires privés</Button>

            <div className="containerImgPartenaires">
              {itemDataPrive.map((element,index)=>{
                return <img alt="imagePartenairesRUCB" className="imgBoxPartenaires" key={index} style={{marginRight:"20px",marginBottom:"20px"}} src={`${element}`}/>
              })}
            </div>
          </Box>
          
      </div>
     
    </Layout>
  );
}
