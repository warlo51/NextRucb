import { Box, CardContent, Container, Typography } from "@mui/material";
import { Button } from "react-bootstrap";
import React, { useEffect, useState } from "react";
import {Layout} from "../../components/Layout";
import Head from "next/head";
import client from "../../src/client";
import {PortableText} from "@portabletext/react";
export default function Mecenat() {
  const [fichesJSON, setFichesJSON] = useState<any>([]);

  useEffect(()=>{
    async function loadData(){
        const mecenat = await client.fetch(
            `*[_type == "mecenat"]`
        )
     setFichesJSON(mecenat)
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
                  <Button id="badge" style={{backgroundColor:`${article.colorTitre.hex}`}}>{article.titre}</Button>
                    <p></p>
                      <PortableText
                          value={article.description}
                      />
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
