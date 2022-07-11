import { Grid } from '@mui/material'
import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from 'react-bootstrap'
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
   <Grid container spacing={2}>
    <Grid item xs={12} md={6}>
    <Horaires/>
    </Grid>
    <Grid item xs={12} md={6}>
    <div className="BoxInfo">
      <Actualite/>
      <Sponsors/>
     </div>
    </Grid>
   </Grid>
 </Layout>
  );
}

export default Home
