import { Box, CardContent, Grid, ImageList, ImageListItem, Typography } from "@mui/material";
import Head from "next/head";
import Link from "next/link";
import React from "react";
import Layout from "../../components/Layout";
export default function Complexe() {
  return (
    <Layout>
      <Grid container spacing={2} className="gridComite">
          <Grid item xs={12} md={12} >
            <Box className="boxOrange">
              <CardContent >
                <Typography variant="h4" component="div">
                  Nous trouver 
                </Typography>
                <p></p>
                <Typography variant="body2" color="text.secondary">
                    <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2604.063739648158!2d4.049871115958945!3d49.256237780564454!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47e975cb09bb325d%3A0xd19c9f5ffa84e350!2s32-36%20Rue%20Henri%20Barbusse%2C%2051100%20Reims!5e0!3m2!1sen!2sfr!4v1652048340820!5m2!1sen!2sfr" width="1200" height="400"  loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe>      
                </Typography>
              </CardContent>
            </Box>
          </Grid>
      </Grid>
      <Grid container spacing={2} className="gridComite">
          <Grid item xs={12} md={12} >
            <Box className="boxOrange">
              <CardContent >
                <Typography variant="h4" component="div">
                  La visite
                </Typography>
                <p></p>
                <Typography variant="h6" color="text.secondary">
                  Ce complexe a fait l&apos;objet d&apos;une complète restructuration qui s&apos;est achevée en février 2015 qui a obligé le club à &quot;voyager&quot; sur les différentes installations de la Ville de Reims. Maintenant le Club bénéficie d&apos;un outil agréable et moderne.
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  <ImageList >
                    <ImageListItem className="ImagesComplexe">
                      <img
                        src="../../gymnase5.jpg"
                        
                      />
                    </ImageListItem>
                    <ImageListItem className="ImagesComplexe">
                      <img
                        src="../../gymnase1.jpg"
                      />
                    </ImageListItem>
                    <ImageListItem className="ImagesComplexe">
                      <img
                        src="../../gymnase2.jpg"
                      />
                    </ImageListItem>
                    <ImageListItem className="ImagesComplexe">
                      <img
                        src="../../gymnase3.jpg"
                      />
                    </ImageListItem>
                    <ImageListItem className="ImagesComplexe">
                      <img
                        src="../../gymnase4.jpg"
                      />
                    </ImageListItem>
                  </ImageList>
                </Typography>
              </CardContent>
            </Box>
          </Grid>
      </Grid>
      </Layout>
  );
}
