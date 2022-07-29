import { Box, CardContent, Typography } from "@mui/material";
import { Button } from "react-bootstrap";
import React from "react";
import {Layout} from "../../components/Layout";
import Head from "next/head";
import { GetServerSideProps } from "next";
import { getDatabase } from "../../src/database/database";

export const getServerSideProps: GetServerSideProps = async () =>{
  const mongodb = await getDatabase();

  const fiches = await mongodb.db().collection("Entraineurs").find().toArray();
  const fichesConvert = JSON.stringify(fiches)

  return {
    props: {
      fiches: fichesConvert
    }
  };
}

export default function Entraineurs({fiches}: any) {
  const fichesJSON = JSON.parse(fiches);
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
