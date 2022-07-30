import * as React from 'react';
import { Button } from "react-bootstrap";
import CardContent from '@mui/material/CardContent';
import { Box, Container, Grid, Typography } from "@mui/material";
import Header from '../../components/Header';
import NavBar from '../../components/NavBar';
import { Layout } from '../../components/Layout';
import { Col, Row } from 'react-bootstrap';
import Head from 'next/head';
import { GetServerSideProps } from 'next';
import { getDatabase } from '../../src/database/database';



export default function ActuRUCB() {
  const [articlesJSON, setArticlesJSON] = React.useState<any>([]);

  React.useEffect(()=>{
    async function loadData(){
      const dataDB =  await fetch("/api/loadData",{
       method: "POST",
       body: "Actualites",
     }).then((result: any) => result.json());
     
     setArticlesJSON(dataDB.data)
   }
   loadData();
  },[]);
  return (
       <Layout>
        <Head>
        <title>Actualités</title>
        <meta name="description" content="Les actualités du RUCB basket"/>
        <meta name="google-site-verification" content="g-JktWG1_hWPLXMEXwsoblRJTiPvWl8QbmLFIvt_8aU" />
    </Head>
        <div style={{margin:"20px",display:"flex",justifyContent:"center",flexDirection:"column"}}>
         
            {articlesJSON.map((article: any, index:number) =>{
              return (
                <Box key={index} className="boxHistoriquePage">
                 <Button id="badge">{article.titre}</Button>
                  <Row >
                    <Col xs={12} sm={6} id="colBox">
                      {article.contenu}
                    </Col>
                    <Col id="imgActu"  xs={12} sm={6}>
                      {article.image.length !== 0 ? article.image.map((item: any, index:number)=>{
                        return (<img key={index} alt={item.alt} src={item}/>);
                      }) : <></>}
                    </Col>
                  </Row>
                </Box>
              );
            })}

        </div>
        </Layout>
  );
}
