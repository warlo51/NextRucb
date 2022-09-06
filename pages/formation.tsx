import { Box, CardContent, Typography } from "@mui/material";
import { Button } from "react-bootstrap";
import React, { useEffect, useState } from "react";
import {Layout} from "../components/Layout";
import Head from "next/head";

export default function Arbitrage() {
  const [articlesJSON, setArticlesJSON] = useState<any>([]);

  useEffect(()=>{
    async function loadData(){
      const dataDB =  await fetch("/api/loadData",{
       method: "POST",
       body: "Formation",
     }).then((result: any) => result.json());
     
     setArticlesJSON(dataDB.data)
   }
   loadData();
  },[]);
  return (
    <Layout >
      <Head>
        <title>Formation</title>
        <meta name="description" content="Apprenez les règles du basket ! (RUCB basket)"/>
        <meta name="google-site-verification" content="g-JktWG1_hWPLXMEXwsoblRJTiPvWl8QbmLFIvt_8aU" />
    </Head>
        <div style={{padding:"20px",display:"flex",justifyContent:"center",flexDirection:"column"}}>
        {articlesJSON.length !== 0 ? articlesJSON.map((article: any, index: number) =>{
              return (
                <Box key={index} className="boxFormation">
                  <Button id="badge" style={{backgroundColor:`${article.colorTitre}`}}>{article.titre}</Button>
                  <div className="divRegleBasket">
                    <CardContent>
                      <p></p>
                      <Typography variant="body2" style={{whiteSpace:"pre-wrap"}} color="text.secondary">          
                        {article.contenu}
                      </Typography>
                    </CardContent>
                    <div className="embed-responsive embed-responsive-16by9">
                      <iframe className="videoRegleBasket" src={article.video} ></iframe>
                     </div>
                  </div>
                </Box>
              );}) : <></>}
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      </div>
    </Layout>
  );
}
