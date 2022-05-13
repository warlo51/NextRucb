import { CardActionArea, CardContent, CardMedia, Grid, Paper, Typography } from "@mui/material";
import { ReactElement, JSXElementConstructor, ReactFragment, ReactPortal, useState } from "react";
import {Navbar,Container,Nav,NavDropdown, Card, Button} from "react-bootstrap";
import Layout from "../components/Layout";
import styles from '../styles/Home.module.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Caroussel from "../components/Caroussel";

export default function home(): JSX.Element {
  return (
    <Layout>
      <div className="pageHome">
        <div >
          <img className="topBanner" src="../../bannerHome3.jpg" />
        </div>
        <Grid container spacing={3} className="gridHome">
          <Grid item xs={12} md={12} >
              <div className="messageHome">
                <span > Nos Sponsors </span>
              </div>  
          </Grid>
        </Grid>
        <Grid container spacing={3} className="gridHome">
          <Grid item xs={12} md={12}>
              <div className="messageHome">
                <span > Le Rucb basket recrute !!</span>
              </div>  
          </Grid>
          <Grid item xs={12} md={4} className="gridCardHome">
          <Card>
              <CardActionArea>
                <CardMedia
                  component="img"
                  image="../../imageRecrutement.jpg"
                  alt="green iguana"
                  className="imgCardHome"
                />
                <CardContent className="textCard">
                  <Typography gutterBottom variant="h5" component="div">
                  INFORMATION RECRUTEMENT
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
          <Grid item xs={12} md={4} className="gridCardHome">
          <Card >
              <CardActionArea>
                <CardMedia
                  component="img"
                  image="../../ballonHome.jpg"
                  alt="green iguana"
                  className="imgCardHome"
                />
                <CardContent className="textCard">
                  <Typography gutterBottom variant="h5" component="div">
                  HORAIRES ENTRAINEMENTS CLIQUEZ ICI
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
          <Grid item xs={12} md={4} className="gridCardHome">
          <Card >
              <CardActionArea>
                <CardMedia
                  component="img"
                  image="../../logoInscription.jpg"
                  alt="green iguana"
                  className="imgCardHome"
                />
                <CardContent className="textCard">
                  <Typography gutterBottom variant="h5" component="div">
                  NEWS
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        </Grid>
        <Grid container spacing={3} className="gridHome">
          <Grid item xs={12} md={12} >
              <div className="messageHome">
                <span > Retrouvez nous aussi sur nos réseaux sociaux !</span>
              </div>  
          </Grid>
          <Grid item xs={12} md={4} className="gridCardHome">
            <iframe src="https://www.facebook.com/plugins/page.php?href=https%3A%2F%2Fwww.facebook.com%2FReims-Universit%25C3%25A9-Club-Basket-150181285527456%2F&tabs=timeline&width=500&height=300&small_header=false&adapt_container_width=true&hide_cover=false&show_facepile=true&appId" width="500" height="300" style={{border:"none",overflow:"hidden"}} scrolling="no" allowFullScreen={true} allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"></iframe>
          </Grid>
          <Grid item xs={12} md={4} className="gridCardHome">
            <iframe src="https://www.facebook.com/plugins/page.php?href=https%3A%2F%2Fwww.facebook.com%2FReims-Universit%25C3%25A9-Club-Basket-150181285527456%2F&tabs=timeline&width=500&height=300&small_header=false&adapt_container_width=true&hide_cover=false&show_facepile=true&appId" width="500" height="300" style={{border:"none",overflow:"hidden"}} scrolling="no" allowFullScreen={true} allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"></iframe>
          </Grid>
          <Grid item xs={12} md={4} className="gridCardHome">
            <iframe src="https://www.facebook.com/plugins/page.php?href=https%3A%2F%2Fwww.facebook.com%2FReims-Universit%25C3%25A9-Club-Basket-150181285527456%2F&tabs=timeline&width=500&height=300&small_header=false&adapt_container_width=true&hide_cover=false&show_facepile=true&appId" width="500" height="300" style={{border:"none",overflow:"hidden"}} scrolling="no" allowFullScreen={true} allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"></iframe>
          </Grid>
        </Grid>
      </div>

    </Layout>
    
  );
}

