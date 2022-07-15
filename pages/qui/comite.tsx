import { Box, CardContent, Typography } from "@mui/material";
import Head from "next/head";
import React from "react";
import { Button } from "react-bootstrap";
import { Layout } from "../../components/Layout";

interface MediaProps {
  loading?: boolean;
}

export default function Comite(props: MediaProps) {
  const { loading = false } = props;

  return (
       <Layout>
        <Head>
        <title>Comité Directeur</title>
        <meta name="description" content="Le comité directeur du RUCB basket"/>
        <meta name="google-site-verification" content="g-JktWG1_hWPLXMEXwsoblRJTiPvWl8QbmLFIvt_8aU" />
    </Head>
        <div style={{margin:"20px",display:"flex",justifyContent:"center",flexDirection:"column"}}>  
            <Box className="BoxComite">
              <CardContent >
              <Button id="badge">Gerard Baudesson (Vice Président)</Button>
                <p></p>
                <Typography variant="body2" color="text.secondary">
                  Tél. : 07-60-75-99-77
                  E-mail : gbreims51@gmail.com          
                </Typography>
              </CardContent>
            </Box>
            <Box className="BoxComite">
              <CardContent>
              <Button id="badge">Sonia Aufray (Trésorière)</Button>
                <p></p>
                <Typography variant="body2" color="text.secondary">  
                  Tél. : 06-19-54-43-75
                  E-mail : aufrays@hotmail.fr        
                </Typography>
              </CardContent>
            </Box>
            <Box className="BoxComite">
              <CardContent>
              <Button id="badge">Claudia Parizel (Secrétaire)</Button> 
                <p></p>
                <Typography variant="body2" color="text.secondary">
                  Tél. : 06-25-30-48-07
                  E-mail : claudiapir@gmail.com          
                </Typography>
              </CardContent>
            </Box>
            <Box className="BoxComite">
              <CardContent>
              <Button id="badge">Franck Mansuy (Président)</Button>
                <p></p>
                <Typography variant="body2" color="text.secondary">
                  Tél. : 06-68-20-27-34
                  E-mail : gfkmansuy@sfr.fr          
                </Typography>
              </CardContent>
            </Box>
            <Box className="BoxComite">
              <CardContent>
              <Button id="badge">Florent Aubry (Responsable du secteur jeunes)</Button>
                <p></p>
                <Typography variant="body2" color="text.secondary">
                  Tél. : 06-82-30-16-71
                  E-mail : florent.aubry@gmx.fr         
                </Typography>
              </CardContent>
            </Box>
        </div>
        </Layout>
  );
}
