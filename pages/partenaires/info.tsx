import { Box, CardContent, Container, ImageList, ImageListItem, Typography } from "@mui/material";
import { Button } from "react-bootstrap";
import React from "react";
import {Layout} from "../../components/Layout";
export default function info() {
  const itemData = [
    "../CD51.png",
    "../LogoVilledeReims.jpg",
    "../liguegdestbasket.png",
    "../ffbb.png",
    "../logocomitemarne.png"
  ]
  const itemDataPrive = [
    "../NouveauLogoNorauto.jpg",
    "../LOGOMAISONKIKEL.jpg",
    "../logocarrefour.png",
    "../logoBuffaloGrill.png",
    "../Charpentiersdumassif.png",
    "../logoCIC.jpg",
    "../TAYLOR.jpg",
    "../JSRDRUM.jpg"
  ]
  return (
    <Layout>
      
         <div style={{padding:"20px",marginTop:"40px" ,display:"flex",justifyContent:"center",flexDirection:"column"}}>
          <Box className="boxPartenaires">
          <Button id="badge">Les partenaires institutionnels</Button>
            <div className="containerImgPartenaires">
              {itemData.map((element,index)=>{
                return <img className="imgBoxPartenaires" key={index} style={{marginRight:"20px"}} src={`${element}`}/>
              })}
            </div>
          </Box>
          
          <Box className="boxPartenaires">
          <Button id="badge">Les partenaires privés</Button>
            <div className="containerImgPartenaires">
              {itemDataPrive.map((element,index)=>{
                return <img className="imgBoxPartenaires" key={index} style={{marginRight:"20px",marginBottom:"20px"}} src={`${element}`}/>
              })}
            </div>
          </Box>
          
      </div>
     
    </Layout>
  );
}
