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


const Home: NextPage = () => {

  const [tailleEcran, setTailleEcran] = useState(0);
  const [data, setData] = useState();

    useEffect(()=>{
        setTailleEcran(window.innerWidth);
        async function loadData(){
          const dataFFBB =  await fetch("/api/loadFFBB",{
           method: "POST",
         }).then((result: any) => result.json());
         
         setData(dataFFBB.data)
       }
       loadData();
    },[]);
  return (
    <Layout >
    <BandeauIMG/>
   <Container className="containerActu">
   {tailleEcran > 780 ? <></> : <><Row>
        <a style={{color:"black"}} href="/actus/vacances">
        <div className="divActualite">
        <Button id="badge">Le RUCB basket est en vacance</Button>
        <h5>Découvrez l'article</h5>
        </div>
        </a>
    </Row>
    <br></br>
    <Row>
        <a style={{color:"black"}} href="/actus/actuRUCB">
        <div className="divActualite">
        <Button id="badge">Les actualités du RUCB basket</Button>
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
        {data !== undefined ? <Row id="rowActu"><Ffbb data={data} /></Row> : <></>}
      </Col>
    </Row>
    </Container>
 </Layout>
  );
}

export default Home
