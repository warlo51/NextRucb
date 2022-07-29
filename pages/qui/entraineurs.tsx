import { Box, CardContent, Typography } from "@mui/material";
import { Button } from "react-bootstrap";
import React, { useEffect, useState } from "react";
import {Layout} from "../../components/Layout";
import Head from "next/head";

export default function Entraineurs() {
  const [fichesJSON, setFichesJSON] = useState<any>([]);

  useEffect(()=>{
    async function loadData(){
      const dataDB =  await fetch("/api/loadData",{
       method: "POST",
       body: "Entraineurs",
     }).then((result: any) => result.json());
     
     setFichesJSON(dataDB.data)
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
              <Button id="badge">{fiche.nom}</Button>
                <p></p>
                <Typography variant="body2" color="text.secondary">
                  <p>Tél. : {fiche.telephone}  </p>       
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
