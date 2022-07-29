import { Box, CardContent, Typography } from "@mui/material";
import { GetServerSideProps } from "next";
import Head from "next/head";
import React from "react";
import { Button } from "react-bootstrap";
import { Layout } from "../../components/Layout";
import { getDatabase } from "../../src/database/database";

interface MediaProps {
  loading?: boolean;
}

export const getServerSideProps: GetServerSideProps = async () =>{
  const mongodb = await getDatabase();

  const fiches = await mongodb.db().collection("Comite").find().toArray();
  const fichesConvert = JSON.stringify(fiches)

  return {
    props: {
      fiches: fichesConvert
    }
  };
}

export default function Comite({fiches}: any){
  const fichesJSON = JSON.parse(fiches);
console.log(fichesJSON)
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
                <Button id="badge">{fiche.nom}</Button>
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
