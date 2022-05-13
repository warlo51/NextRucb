import Head from "next/head";
import Link from "next/link";
import { Box, Button, CardContent, Container, IconButton, Input, Typography } from "@mui/material";
import React from "react";
import Layout from "../../components/Layout";

export default function DossierSponsor() {

  return (
    <Layout>
        <Container >
          <Box className="boxOrange">
            <CardContent>
              <Typography variant="h5" component="div">
                Dossier De Sponsors
              </Typography>
              <p></p>
              <Typography variant="body2" color="text.secondary">          
                Venez télécharger notre dossier de sponsoring !  
              </Typography>
              <p></p>
              <a href="../../Sponsoring.pdf" download="Sponsoring.pdf">
                <Button className='btnDownload'>Télécharger</Button>
              </a>
            </CardContent>
          </Box>
      </Container>
    </Layout>
  );
}
