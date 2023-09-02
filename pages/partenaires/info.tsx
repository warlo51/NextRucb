import {Box, CardContent, Container, ImageList, ImageListItem, Typography} from "@mui/material";
import {Button} from "react-bootstrap";
import React, {useEffect, useState} from "react";
import {Layout} from "../../components/Layout";
import Head from "next/head";
import client from "../../src/client";
import urlFor from "../../src/fonctions/urlImageSanity";

export default function info() {

    const [partenairePrivee, setPartenairePrivee] = useState<any>([]);
    const [partenairePublic, setPartenairePublic] = useState<any>([]);

    useEffect(() => {
        async function loadData() {
            const partenairesPublic = await client.fetch(
                `*[_type == "partenairesPublic"]`
            )
            setPartenairePublic(partenairesPublic.map((partenaire: any) => {
                return {
                    titre: partenaire.titre,
                    site: partenaire.site,
                    image: urlFor(partenaire.image).url()
                }
            }))

            const partenairesPrives = await client.fetch(
                `*[_type == "partenairesPrives"]`
            )
            setPartenairePrivee(partenairesPrives.map((partenaire: any) => {
                return {
                    titre: partenaire.titre,
                    site: partenaire.site,
                    image: urlFor(partenaire.image).url()
                }
            }))
        }

        loadData();
    }, []);

    return (
        <Layout>
            <Head>
                <title>Partenaires</title>
                <meta name="description" content="Les partenaires du RUCB basket"/>
                <meta name="google-site-verification" content="g-JktWG1_hWPLXMEXwsoblRJTiPvWl8QbmLFIvt_8aU"/>
            </Head>
            <div style={{
                padding: "20px",
                marginTop: "40px",
                display: "flex",
                justifyContent: "center",
                flexDirection: "column"
            }}>
                <Box className="boxPartenaires">
                    <Button id="badge">Les partenaires institutionnels</Button>
                    <div className="containerImgPartenaires">
                        {partenairePublic.map((element: any, index: number) => {
                            return <img alt="imagePartenairesRUCB" className="imgBoxPartenaires" key={index}
                                        style={{marginRight: "20px"}} src={`${element.image}`}/>
                        })}
                    </div>
                </Box>

                <Box className="boxPartenaires">
                    <Button id="badge">Les partenaires privés</Button>

                    <div className="containerImgPartenaires">
                        {partenairePrivee.map((element: any, index: number) => {
                            return <a href={`${element.site}`} target={"_blank"}><img alt="imagePartenairesRUCB" className="imgBoxPartenaires" key={index}
                                           style={{marginRight: "20px", marginBottom: "20px"}} src={`${element.image}`}/></a>
                        })}
                    </div>
                </Box>

            </div>

        </Layout>
    );
}
