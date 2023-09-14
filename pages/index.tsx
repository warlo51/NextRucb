import type { GetServerSideProps, NextPage } from 'next'
import React, { useEffect, useState } from 'react'
import { Button, Col, Container, Row } from 'react-bootstrap'
import Actualite from '../components/Actualite'
import BandeauIMG from '../components/BandeauIMG'
import Equipes from '../components/Equipes'
import Ffbb from '../components/Ffbb'
import Horaires from '../components/Horaires'
import { Layout } from '../components/Layout'
import Partenaires from '../components/Partenaires'
import Sponsors from '../components/Sponsors'
import urlFor from "../src/fonctions/urlImageSanity";
import client from "../src/client";
import Temoignages from "../components/Temoignages";


const Home: NextPage = () => {

  const [tailleEcran, setTailleEcran] = useState(0);
  const [data, setData] = useState();
  const [dataArticles, setDataArticles] = useState([]);

    useEffect(()=>{
        setTailleEcran(window.innerWidth);
        async function loadData(){
            const actus = await client.fetch(
                `*[_type == "imagesPageAccueil" && active == "Oui"]`
            )
            setDataArticles(actus.map((actu: any) => {
                return {
                    ...actu,
                    image: actu.image ? urlFor(actu.image).url() : ""
                }
            }))
        }
        loadData();

        async function loadDataFFBB(){
            const dataFFBB =  await fetch("/api/loadFFBB",{
                method: "POST",
            }).then((result: any) => result.json());

            setData(dataFFBB.data)
        }
        loadDataFFBB();
    },[]);
  return (
    <Layout >
    <BandeauIMG/>
   <Container className="containerActu">
   {tailleEcran > 780 ? <></> :
       <>
           {dataArticles.map((article: any, index:number) =>{
               return (
                   <Row key={index}>
                       <a style={{color:"black"}} href={article?.linkArticle?._ref ? `/actus/${article?.linkArticle?._ref}` : "/actus"}>
                           <div className="divActualite">
                               <Button id="badge">{article.titre}</Button>
                               <h5>Découvrez l'article</h5>
                           </div>
                       </a>
                   </Row>
               );
           })}
       </>
   }
    <Row>
      <Col xs={12} sm={4} >
        <Horaires/>
        <Equipes/>
      </Col>
      <Col xs={12} sm={4} id="colHomeCentre">
          <Row id="rowActu"><Temoignages/></Row>
          <Row id="rowActu"><Partenaires/></Row>
        <Row id="rowActu"><Actualite/></Row>
        <Row id="rowActu"><Sponsors/></Row>
      </Col>
      <Col xs={12} sm={4}>
        {data !== undefined ? <Row id="rowActu"><Ffbb data={data} /></Row> : <></>}
      </Col>
    </Row>
    </Container>
 </Layout>
  );
}

export default Home
