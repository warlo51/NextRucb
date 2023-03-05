import * as React from 'react';
import CardContent from '@mui/material/CardContent';
import { Box, Typography } from "@mui/material";
import { Button, Col, Row } from "react-bootstrap";
import { Layout } from '../../components/Layout';
import Head from 'next/head';

export default function Vacance():JSX.Element {
  const [articlesJSON, setArticlesJSON] = React.useState<any>([]);

  React.useEffect(()=>{
    async function loadData(){
      const dataDB =  await fetch("/api/loadData",{
       method: "POST",
       body: "Recrutement",
     }).then((result: any) => result.json());

     setArticlesJSON(dataDB.data)
   }
   loadData();
  },[]);

  return (
       <Layout>
        <Head>
        <title>Vacances</title>
        <meta name="description" content="Le RUCB recrute"/>
        <meta name="google-site-verification" content="g-JktWG1_hWPLXMEXwsoblRJTiPvWl8QbmLFIvt_8aU" />
       </Head>
        <div style={{margin:"20px",display:"flex",justifyContent:"center",flexDirection:"column"}}>
        {articlesJSON.map((article: any, index: number) =>{
              return (
                <Box key={index} className="boxHistoriquePage">
                  <Button id="badge" style={{backgroundColor:`${article.colorTitre}`}}>{article.titre}</Button>
                    <Row >
                        <Col xs={12} sm={6} id="colBox">
                            <Typography variant="body2" style={{whiteSpace:"pre-wrap", textAlign:"left"}} color="text.secondary">
                                {article.contenu}
                            </Typography>
                        </Col>
                        <Col id="imgActu"  xs={12} sm={6}>
                            {article.image.length !== 0 ? article.image.map((item: any, index:number)=>{
                                return (<img key={index} alt={item.alt} src={item}/>);
                            }) : <></>}
                        </Col>
                    </Row>
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
