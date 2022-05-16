import { Box, CardContent, Container, ImageList, ImageListItem, Typography } from "@mui/material";
import Head from "next/head";
import Link from "next/link";
import React from "react";
import {Layout} from "../../components/Layout";
export default function info() {
  const itemData = [
    {img:"../../sponsors/CD51.png"},
    {img:"../../sponsors/LogoVilledeReims.jpg"},
    {img:"../../sponsors/liguegdestbasket.png"},
    {img:"../../sponsors/ffbb.png"},
    {img:"../../sponsors/logocomitemarne.png"}
  ]
  const itemDataPrive = [
    {img:"../../sponsors/NouveauLogoNorauto.jpg"},
    {img:"../../sponsors/LOGOMAISONKIKEL.jpg"},
    {img:"../../sponsors/logocarrefour.png"},
    {img:"../../sponsors/logoBuffaloGrill.png"},
    {img:"../../sponsors/Charpentiersdumassif.png"},
    {img:"../../sponsors/logoCIC.jpg"},
    {img:"../../sponsors/TAYLOR.jpg"},
    {img:"../../sponsors/JSRDRUM.jpg"}
  ]
  return (
    <Layout>
        <Container >
          <Box className="boxOrange">
            <CardContent>
              <Typography variant="h5" component="div">
                Les partenaires institutionnels
              </Typography>
              <p></p>
              <ImageList sx={{ height: 450}} cols={3} rowHeight={164}>
                {itemData.map((item) => (
                  <ImageListItem key={item.img}>
                    <img
                      className="imagesSponsorInfo"
                      src={`${item.img}?w=164&h=164&fit=crop&auto=format`}
                      srcSet={`${item.img}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
                      loading="lazy"
                    />
                  </ImageListItem>
                ))}
              </ImageList>
            </CardContent>
          </Box>
          <Box className="boxOrange">
            <CardContent>
              <Typography variant="h5" component="div">
                Les partenaires privés
              </Typography>
              <p></p>
              <ImageList sx={{ height: 700}} cols={3} rowHeight={200}>
                {itemDataPrive.map((item) => (
                  <ImageListItem key={item.img}>
                    <img
                      className="imagesSponsorInfo"
                      src={`${item.img}?w=164&h=164&fit=crop&auto=format`}
                      srcSet={`${item.img}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
                      loading="lazy"
                    />
                  </ImageListItem>
                ))}
              </ImageList>  
            </CardContent>
          </Box>
      </Container>
    </Layout>
  );
}
