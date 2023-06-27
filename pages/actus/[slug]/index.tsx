import Head from "next/head";
import * as React from "react";
import {Layout} from "../../../components/Layout";
import client from "../../../src/client";
import urlFor from "../../../src/fonctions/urlImageSanity";
import {useRouter} from "next/router";
import {Box, Typography} from "@mui/material";
import {Button, Col, Row} from "react-bootstrap";
import {PortableText} from "@portabletext/react";

export default function Index({
                                 params,
                                 searchParams,
                             }: {
    params: { slug: string }
    searchParams: { [key: string]: string | string[] | undefined }
}) {
    const [articlesJSON, setArticlesJSON] = React.useState<any>([]);
    const router = useRouter()
    React.useEffect(()=>{
        async function loadData(){
            const actus = await client.fetch(
                `*[_type == "actus"]`
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
    return (
        <Layout>
            <Head>
                <title>Actualités</title>
                <meta name="description" content="Les actualités du RUCB basket"/>
                <meta name="google-site-verification" content="g-JktWG1_hWPLXMEXwsoblRJTiPvWl8QbmLFIvt_8aU" />
            </Head>
            <div style={{margin:"20px",display:"flex",justifyContent:"center",flexDirection:"column", marginBottom:"450px"}}>
                {articlesJSON.filter((actu: any) => actu._id === router.query.slug).map((article: any, index:number) =>{
                    return (
                        <Box key={index} className="boxActuDetail">
                            <Button id="badge" style={{backgroundColor:`${article.colorTitre.hex}`}}>{article.titre}</Button>
                            <Row >
                                <Col xs={12} sm={6} id="colBox">
                                    <PortableText
                                        value={article.description}
                                    />
                                </Col>
                            </Row>
                        </Box>
                    );
                })}

            </div>
        </Layout>
    )
}
