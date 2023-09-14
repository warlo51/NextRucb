import * as React from 'react';
import { Button } from "react-bootstrap";
import { Box, Typography } from "@mui/material";
import { Layout } from '../../components/Layout';
import { Col, Row } from 'react-bootstrap';
import Head from 'next/head';
import client from "../../src/client";
import {PortableText} from "@portabletext/react";

export default function TemoignagesRUCB() {
    const [temoignagesJSON, setTemoignagesJSON] = React.useState<any>([]);

    React.useEffect(()=>{
        async function loadData(){
            const temoignages = await client.fetch(
                `*[_type == "temoignages" && active == "Oui"]`
            )
            setTemoignagesJSON(temoignages.map((temoignage: any) => {
                return {
                    ...temoignage
                }
            }))
        }
        loadData();
    },[]);
    return (
        <Layout>
            <Head>
                <title>Temoignages</title>
                <meta name="description" content="Les temoignages du RUCB basket"/>
                <meta name="google-site-verification" content="g-JktWG1_hWPLXMEXwsoblRJTiPvWl8QbmLFIvt_8aU" />
            </Head>
            <div style={{margin:"20px",display:"flex",justifyContent:"center",flexDirection:"column"}}>

                {temoignagesJSON.map((temoignage: any, index:number) =>{
                    return (
                        <Box key={index} className="boxHistoriquePage">
                            <Button id="badge" style={{backgroundColor:`${temoignage.colorTitre.hex}`}}>{temoignage.titre}</Button>
                            <Row >
                                <Col xs={12} sm={6} id="colBox">
                                    <PortableText
                                        value={temoignage.description}
                                    />
                                </Col>
                            </Row>
                        </Box>
                    );
                })}

            </div>
        </Layout>
    );
}
