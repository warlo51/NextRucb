import { Badge, Box, CardContent, Typography } from "@mui/material";
import { Button } from "react-bootstrap";
import React from "react";
import {Layout} from "../components/Layout";
import Head from "next/head";
import { GetServerSideProps } from "next";
import { getDatabase } from "../src/database/database";

export const getServerSideProps: GetServerSideProps = async () =>{
  const mongodb = await getDatabase();

  const articles = await mongodb.db().collection("Formation").find().toArray();
  const articlesConvert = JSON.stringify(articles)

  return {
    props: {
      articles: articlesConvert
    }
  };
}

export default function Arbitrage({articles}: any) {
  const articlesJSON = JSON.parse(articles);
  return (
    <Layout >
      <Head>
        <title>Formation</title>
        <meta name="description" content="Apprenez les règles du basket ! (RUCB basket)"/>
        <meta name="google-site-verification" content="g-JktWG1_hWPLXMEXwsoblRJTiPvWl8QbmLFIvt_8aU" />
    </Head>
        <div style={{padding:"20px",display:"flex",justifyContent:"center",flexDirection:"column"}}>
        {articlesJSON.map((article: any, index: number) =>{
              return (
                <Box key={index} className="boxFormation">
                  <Button id="badge">{article.titre}</Button>
                  <div className="divRegleBasket">
                    <CardContent>
                      <p></p>
                      <Typography variant="body2" color="text.secondary">          
                        {article.contenu}
                      </Typography>
                    </CardContent>
                    <div className="embed-responsive embed-responsive-16by9">
                      <iframe className="videoRegleBasket" src={article.video} ></iframe>
                     </div>
                  </div>
                </Box>
              );})}
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
