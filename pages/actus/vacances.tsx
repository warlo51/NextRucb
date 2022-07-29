import * as React from 'react';
import CardContent from '@mui/material/CardContent';
import { Box, Container, Grid, Typography } from "@mui/material";
import Header from '../../components/Header';
import NavBar from '../../components/NavBar';
import { Button } from "react-bootstrap";
import { Layout } from '../../components/Layout';
import Head from 'next/head';
import { GetServerSideProps } from 'next';
import { getDatabase } from '../../src/database/database';

export const getServerSideProps: GetServerSideProps = async () =>{
  const mongodb = await getDatabase();

  const articles = await mongodb.db().collection("Vacances").find().toArray();
  const articlesConvert = JSON.stringify(articles)

  return {
    props: {
      articles: articlesConvert
    }
  };
}

export default function Vacance({articles}: any):JSX.Element {
  const articlesJSON = JSON.parse(articles);
  return (
       <Layout>
        <Head>
        <title>Vacances</title>
        <meta name="description" content="Le RUCB basket est en vacance"/>
        <meta name="google-site-verification" content="g-JktWG1_hWPLXMEXwsoblRJTiPvWl8QbmLFIvt_8aU" />
       </Head>
        <div style={{margin:"20px",display:"flex",justifyContent:"center",flexDirection:"column"}}>
        {articlesJSON.map((article: any, index: number) =>{
              return (
                <Box key={index} className="boxHistoriquePage">
                  <Button id="badge">{article.titre}</Button>
                  <div className="divRegleBasket">
                    <CardContent>
                      <p></p>
                      <Typography variant="body2" color="text.secondary">          
                        {article.contenu}
                      </Typography>
                    </CardContent>
                  </div>
                </Box>
              );})}
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
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
