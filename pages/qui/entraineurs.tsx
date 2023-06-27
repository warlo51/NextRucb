import { Box, CardContent, Typography } from "@mui/material";
import { Button } from "react-bootstrap";
import React, { useEffect, useState } from "react";
import {Layout} from "../../components/Layout";
import Head from "next/head";
import client from "../../src/client";

export default function Entraineurs() {
  const [fichesJSON, setFichesJSON] = useState<any>([]);

  const [tailleEcran, setTailleEcran] = useState(0);

    useEffect(()=>{
        setTailleEcran(window.innerWidth);
    },[]);

  useEffect(()=>{
    async function loadData(){
        const entraineurs = await client.fetch(
            `*[_type == "entraineurs"]`
        )

     setFichesJSON(entraineurs)
   }
   loadData();
  },[]);
  return (
    <Layout>
      <Head>
        <title>Entraineurs</title>
        <meta name="description" content="Les entraineurs du RUCB basket"/>
        <meta name="google-site-verification" content="g-JktWG1_hWPLXMEXwsoblRJTiPvWl8QbmLFIvt_8aU" />
    </Head>
        <div style={{margin:"20px",display:"flex",justifyContent:"center",flexDirection:"column"}}>
        {fichesJSON.map((fiche: any) =>{
              return (
                <Box className="BoxComite">
              <CardContent >
              {tailleEcran < 333 ? <Button id="badge" style={{backgroundColor:`${fiche.colorTitre.hex}`, width:"250px"}}>{fiche.nom}</Button> : <Button id="badge" style={{backgroundColor:`${fiche.colorTitre.hex}`, width:"400px"}}>{fiche.nom}</Button>}
                <p></p>
                <Typography variant="body2" color="text.secondary">
                  <p>Tél. : {fiche.phone}  </p>
                  <p>E mail : {fiche.email}  </p>
                </Typography>
              </CardContent>
              </Box>
              )})}
        </div>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br><br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>

        </Layout>
  );
}
