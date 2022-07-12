import { Avatar, Badge, Box, CardActionArea, CardContent, CardHeader, CardMedia, Grid, IconButton, Skeleton, Typography } from "@mui/material";
import Head from "next/head";
import Link from "next/link";
import React from "react";
import { Button, Card, Container } from "react-bootstrap";
import Header from "../../components/Header";
import { Layout } from "../../components/Layout";
import NavBar from "../../components/NavBar";
import styles from '../../styles/Home.module.css';

interface MediaProps {
  loading?: boolean;
}

export default function Comite(props: MediaProps) {
  const { loading = false } = props;

  return (
       <Layout>
        <div style={{margin:"20px",display:"flex",justifyContent:"center",flexDirection:"column"}}>  
            <Box className="BoxComite">
              <CardContent >
              <Badge badgeContent={"Gerard Baudesson (Vice Président)"} color="primary" anchorOrigin={{vertical: 'top',horizontal: 'left'}} /> 
                <p></p>
                <Typography variant="body2" color="text.secondary">
                  Tél. : 07-60-75-99-77
                  E-mail : gbreims51@gmail.com          
                </Typography>
              </CardContent>
            </Box>
            <Box className="BoxComite">
              <CardContent>
              <Badge badgeContent={"Sonia Aufray (Trésorière)"} color="primary" anchorOrigin={{vertical: 'top',horizontal: 'left'}} /> 
                <p></p>
                <Typography variant="body2" color="text.secondary">  
                  Tél. : 06-19-54-43-75
                  E-mail : aufrays@hotmail.fr        
                </Typography>
              </CardContent>
            </Box>
            <Box className="BoxComite">
              <CardContent>
              <Badge badgeContent={"Claudia Parizel (Secrétaire)"} color="primary" anchorOrigin={{vertical: 'top',horizontal: 'left'}} /> 
                <p></p>
                <Typography variant="body2" color="text.secondary">
                  Tél. : 06-25-30-48-07
                  E-mail : claudiapir@gmail.com          
                </Typography>
              </CardContent>
            </Box>
            <Box className="BoxComite">
              <CardContent>
              <Badge badgeContent={"Franck Mansuy (Président)"} color="primary" anchorOrigin={{vertical: 'top',horizontal: 'left'}} /> 
                <p></p>
                <Typography variant="body2" color="text.secondary">
                  Tél. : 06-68-20-27-34
                  E-mail : gfkmansuy@sfr.fr          
                </Typography>
              </CardContent>
            </Box>
            <Box className="BoxComite">
              <CardContent>
              <Badge badgeContent={"Florent Aubry (Responsable du secteur jeunes)"} color="primary" anchorOrigin={{vertical: 'top',horizontal: 'left'}} /> 
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
