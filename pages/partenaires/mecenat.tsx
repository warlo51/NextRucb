import { Box, CardContent, Container, Typography } from "@mui/material";
import { Button } from "react-bootstrap";
import React, { useEffect, useState } from "react";
import {Layout} from "../../components/Layout";
import Head from "next/head";
export default function Mecenat() {
  const [fichesJSON, setFichesJSON] = useState<any>([]);

  useEffect(()=>{
    async function loadData(){
      const dataDB =  await fetch("/api/loadData",{
       method: "POST",
       body: "Mecenat",
     }).then((result: any) => result.json());
     
     setFichesJSON(dataDB.data)
   }
   loadData();
  },[]);
  return (
    <Layout>
      <Head>
        <title>Mécenat</title>
        <meta name="description" content="Les mécenat du RUCB basket"/>
        <meta name="google-site-verification" content="g-JktWG1_hWPLXMEXwsoblRJTiPvWl8QbmLFIvt_8aU" />
      </Head>
        <div style={{margin:"20px",display:"flex",justifyContent:"center",flexDirection:"column"}}>
        {fichesJSON.map((article: any, index: number) =>{
              return (
                <Box key={index} className="boxMecenat">
                  <CardContent>
                  <Button id="badge">{article.titre}</Button>
                    <p></p>
                    <Typography variant="body2" color="text.secondary">          
                      {article.contenu}
                    </Typography>
                  </CardContent>
                </Box>
              );})}
          <br></br>
          <br></br>
          <br></br>
          <br></br>
          <br></br>
      </div>
    </Layout>
  );
}
