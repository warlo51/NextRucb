import { Box, CardContent, Typography } from "@mui/material";
import { Button } from "react-bootstrap";
import React, { useEffect, useState } from "react";
import {Layout} from "../components/Layout";
import Head from "next/head";
import client from "../src/client";
import {PortableText} from "@portabletext/react";

export default function Arbitrage() {
  const [articlesJSON, setArticlesJSON] = useState<any>([]);

  useEffect(()=>{
    async function loadData(){
        const formations = await client.fetch(
            `*[_type == "formations"]`
        )
        setArticlesJSON(formations);

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
                  <Button id="badge" style={{backgroundColor:`${article.colorTitre.hex}`}}>{article.titre}</Button>
                  <div className="divRegleBasket">
                    <CardContent>
                      <p></p>
                        <PortableText
                            value={article.description[0]}
                        />
                    </CardContent>
                    <div className="embed-responsive embed-responsive-16by9">
                      <iframe className="videoRegleBasket" src={article.linkVideo} ></iframe>
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
