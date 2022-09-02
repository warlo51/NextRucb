import type { GetServerSideProps, NextPage } from 'next'
import { useEffect, useState } from 'react'
import { Button, Col, Container, Row } from 'react-bootstrap'

import Actualite from '../components/Actualite'
import BandeauIMG from '../components/BandeauIMG'
import Equipes from '../components/Equipes'
import Ffbb from '../components/Ffbb'
import Horaires from '../components/Horaires'
import { Layout } from '../components/Layout'
import Partenaires from '../components/Partenaires'
import Sponsors from '../components/Sponsors'
import useAnalyticsEventTracker from '../src/useAnalyticsEventTracker'


export const getServerSideProps: GetServerSideProps = async (context: any) => {

        const url = "http://www.ffbb.com/rss2.xml";
        const data = await fetch(url)
          .then((response) => {
            return response.arrayBuffer();
          })
          .then((responseText) => {
            const decoder = new TextDecoder('iso-8859-1');
            const text = decoder.decode(responseText);
            return text;
         })
      .catch((error) => {
        console.log('Error fetching the feed: ', error);
      });

    return {
      props: {
        data: data,
      },
    };
  
};

const Home: NextPage = (props: any) => {

  const [tailleEcran, setTailleEcran] = useState(0);
  const gaEventTrackerVacance = useAnalyticsEventTracker("Le RUCB basket est en vacance");
  const gaEventTrackerActu = useAnalyticsEventTracker("Les actualités du RUCB basket");
    useEffect(()=>{
        setTailleEcran(window.innerWidth);
    },[]);

  return (
    <Layout >
    <BandeauIMG/>
   <Container className="containerActu">
   {tailleEcran > 780 ? <></> : <><Row>
        <a style={{color:"black"}} href="/actus/vacances" onClick={()=>gaEventTrackerVacance('click')}>
        <div className="divActualite">
        <Button  id="badge">Le RUCB basket est en vacance</Button>
        <h5>Découvrez l'article</h5>
        </div>
        </a>
    </Row>
    <br></br>
    <Row>
        <a style={{color:"black"}} href="/actus/actuRUCB" onClick={()=>gaEventTrackerActu('click')}>
        <div className="divActualite">
        <Button  id="badge">Les actualités du RUCB basket</Button>
        <h5>Découvrez les actualités</h5>
        </div>
        </a>
    </Row>
    </>}
    <Row>
      <Col xs={12} sm={4} >
        <Horaires/>
        <Equipes/>
      </Col>
      <Col xs={12} sm={4} id="colHomeCentre">
        <Row id="rowActu"><Actualite/></Row>
        <Row id="rowActu"><Sponsors/></Row>
        <Row id="rowActu"><Partenaires/></Row>
      </Col>
      <Col xs={12} sm={4}>
        <Row id="rowActu"><Ffbb data={props.data} /></Row>
      </Col>
    </Row>
    </Container>
 </Layout>
  );
}

export default Home
