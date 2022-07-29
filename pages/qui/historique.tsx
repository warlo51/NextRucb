import * as React from 'react';
import CardContent from '@mui/material/CardContent';
import { Box, Typography } from "@mui/material";
import { Button } from "react-bootstrap";
import { Layout } from '../../components/Layout';
import Head from 'next/head';

export default function Historique(){
  const [articlesJSON, setArticlesJSON] = React.useState<any>([]);

  React.useEffect(()=>{
    async function loadData(){
      const dataDB =  await fetch("/api/loadData",{
       method: "POST",
       body: "Historique",
     }).then((result: any) => result.json());
     
     setArticlesJSON(dataDB.data)
   }
   loadData();
  },[]);
  
  return (
       <Layout>
        <Head>
        <title>Historique</title>
        <meta name="description" content="L'historique du RUCB basket"/>
        <meta name="google-site-verification" content="g-JktWG1_hWPLXMEXwsoblRJTiPvWl8QbmLFIvt_8aU" />
    </Head>
        <div style={{margin:"20px",display:"flex",justifyContent:"center",flexDirection:"column"}}>
        {articlesJSON.map((article: any, index: number) =>{
              return (
                <Box key={index} className="boxHistoriquePage">
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
