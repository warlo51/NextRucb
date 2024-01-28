import * as React from 'react';
import { Button } from "react-bootstrap";
import { Box } from "@mui/material";
import { Layout } from '../../components/Layout';
import { Col, Row } from 'react-bootstrap';
import Head from 'next/head';
import client from "../../src/client";
import {PortableText} from "@portabletext/react";
import urlFor from "../../src/fonctions/urlImageSanity";




export default function ActuRUCB() {
    const [articlesJSON, setArticlesJSON] = React.useState<any>([]);

    React.useEffect(()=>{
        async function loadData(){
            const actus = await client.fetch(
                `*[_type == "actus" && active == "Oui"]`
            )
            setArticlesJSON(actus.map((actu: any) => {
                return {
                    ...actu,
                    image: actu.image ? urlFor(actu.image).url() : ""
                }
            }))
        }
        loadData();
    },[]);

    console.log("toto", articlesJSON)
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
                            <Button id="badge" style={{backgroundColor:`${article.colorTitre.value}`}}>{article.titre}</Button>
                            <Row >
                                <Col xs={12} sm={6} id="colBox">
                                    <PortableText
                                        value={article.description}
                                    />
                                </Col>
                                <Col id="imgActu"  xs={12} sm={6}>
                                    {article.image.length !== 0 ? <img key={index} alt={article.image} src={article.image}/> : <></>}
                                </Col>
                            </Row>
                        </Box>
                    );
                })}

            </div>
        </Layout>
    );
}
