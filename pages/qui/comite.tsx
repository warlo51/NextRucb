import { Box, CardContent, Typography } from "@mui/material";
import { GetServerSideProps } from "next";
import Head from "next/head";
import React, { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { Layout } from "../../components/Layout";
import { getDatabase } from "../../src/database/database";


export default function Comite({fiches}: any){
  const [fichesJSON, setFichesJSON] = useState<any>([]);

  const [tailleEcran, setTailleEcran] = useState(0);

    useEffect(()=>{
        setTailleEcran(window.innerWidth);
    },[]);
  useEffect(()=>{
    async function loadData(){
      const dataDB =  await fetch("/api/loadData",{
       method: "POST",
       body: "Comite",
     }).then((result: any) => result.json());
     
     setFichesJSON(dataDB.data)
   }
   loadData();
  },[]);
  return (
       <Layout>
        <Head>
        <title>Comité Directeur</title>
        <meta name="description" content="Le comité directeur du RUCB basket"/>
        <meta name="google-site-verification" content="g-JktWG1_hWPLXMEXwsoblRJTiPvWl8QbmLFIvt_8aU" />
    </Head>
        <div style={{margin:"20px",display:"flex",justifyContent:"center",flexDirection:"column"}}> 
        {fichesJSON.map((fiche: any) =>{
              return (
              <Box className="BoxComite">
                <CardContent >
                {tailleEcran < 333 ? <Button id="badge" style={{backgroundColor:`${fiche.colorTitre}`, width:"250px"}}>{fiche.nom}</Button> : <Button id="badge" style={{backgroundColor:`${fiche.colorTitre}`, width:"400px"}}>{fiche.nom}</Button>}
                  <p></p>
                  <Typography variant="body2" color="text.secondary">
                    <p>Tél. : {fiche.telephone}</p>
                    <p>E-mail : {fiche.mail} </p>       
                  </Typography>
                </CardContent>
              </Box>
              );
        })}; 
        </div>
        </Layout>
  );
}
