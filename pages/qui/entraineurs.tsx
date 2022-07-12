import { Badge, Box, CardContent, Typography } from "@mui/material";
import Head from "next/head";
import Link from "next/link";
import React from "react";
import {Layout} from "../../components/Layout";
export default function Entraineurs() {
  return (
    <Layout>
        <div style={{margin:"20px",display:"flex",justifyContent:"center",flexDirection:"column"}}>  
            <Box className="BoxComite">
              <CardContent >
              <Badge badgeContent={"Florent Aubry"} color="primary" anchorOrigin={{vertical: 'top',horizontal: 'left'}} />
                <p></p>
                <Typography variant="body2" color="text.secondary">
                  Tél. : 06-82-30-16-71         
                </Typography>
              </CardContent>
            </Box>
            <Box className="BoxComite">
              <CardContent >
              <Badge badgeContent={"Aurelien Valentin"} color="primary" anchorOrigin={{vertical: 'top',horizontal: 'left'}} />
                <p></p>
                <Typography variant="body2" color="text.secondary">
                  Tél. : 06-79-46-47-07        
                </Typography>
              </CardContent>
            </Box>
            <Box className="BoxComite">
              <CardContent >
              <Badge badgeContent={""} color="primary" anchorOrigin={{vertical: 'top',horizontal: 'left'}} />
                <p></p>
                <Typography variant="body2" color="text.secondary">
                         
                </Typography>
              </CardContent>
            </Box>
            <Box className="BoxComite">
              <CardContent >
              <Badge badgeContent={""} color="primary" anchorOrigin={{vertical: 'top',horizontal: 'left'}} />
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
