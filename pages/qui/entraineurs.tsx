import { Box, CardContent, Typography } from "@mui/material";
import { Button } from "react-bootstrap";
import React from "react";
import {Layout} from "../../components/Layout";
import Head from "next/head";
export default function Entraineurs() {
  return (
    <Layout>
      <Head>
        <title>Entraineurs</title>
        <meta name="description" content="Les entraineurs du RUCB basket"/>
        <meta name="google-site-verification" content="g-JktWG1_hWPLXMEXwsoblRJTiPvWl8QbmLFIvt_8aU" />
    </Head>
        <div style={{margin:"20px",display:"flex",justifyContent:"center",flexDirection:"column"}}>  
            <Box className="BoxComite">
              <CardContent >
              <Button id="badge">Florent Aubry</Button>
                <p></p>
                <Typography variant="body2" color="text.secondary">
                  Tél. : 06-82-30-16-71         
                </Typography>
              </CardContent>
            </Box>
            <Box className="BoxComite">
              <CardContent >
              <Button id="badge">Aurelien Valentin</Button>
                <p></p>
                <Typography variant="body2" color="text.secondary">
                  Tél. : 06-79-46-47-07        
                </Typography>
              </CardContent>
            </Box>
            <Box className="BoxComite">
              <CardContent >
              <Button id="badge"></Button>
                <p></p>
                <Typography variant="body2" color="text.secondary">
                         
                </Typography>
              </CardContent>
            </Box>
            <Box className="BoxComite">
              <CardContent >
              <Button id="badge"></Button>
                <p></p>
                <Typography variant="body2" color="text.secondary">
                          
                </Typography>
              </CardContent>
            </Box>
        </div>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br><br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>

        </Layout>
  );
}
