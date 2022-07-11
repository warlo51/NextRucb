import { Box, CardContent, Container, ImageList, ImageListItem, Typography } from "@mui/material";
import Head from "next/head";
import Link from "next/link";
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
            <h1>Les partenaires institutionnels</h1>
            <div className="containerImgPartenaires">
              {itemData.map((element,index)=>{
                return <img className="imgBoxPartenaires" key={index} src={`${element}`}/>
              })}
            </div>
          </Box>
          <Box className="boxPartenaires">
            <h1>Les partenaires privés</h1>
            <div className="containerImgPartenaires">
              {itemDataPrive.map((element,index)=>{
                return <img className="imgBoxPartenaires" key={index}  src={`${element}`}/>
              })}
            </div>
          </Box>
      </div>
    </Layout>
  );
}
