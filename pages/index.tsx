import { Box, Grid } from '@mui/material'
import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import { Button, Col, Container, Row } from 'react-bootstrap'
import Actualite from '../components/Actualite'
import BandeauIMG from '../components/BandeauIMG'
import Horaires from '../components/Horaires'
import { Layout } from '../components/Layout'
import Sponsors from '../components/Sponsors'
import styles from '../styles/Home.module.css'


const Home: NextPage = () => {
  return (
    <Layout>
   <BandeauIMG/>
   <Container className="containerActu">
    <Row>
      <Col xs={12} sm={6}><Horaires/></Col>
      <Col xs={12} sm={6}>
        <Row id="rowActu"><Actualite/></Row>
        <Row id="rowActu"><Sponsors/></Row>
      </Col>
    </Row>
    </Container>
 </Layout>
  );
}

export default Home
