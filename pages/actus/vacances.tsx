import * as React from 'react';
import CardContent from '@mui/material/CardContent';
import { Badge, Box, Container, Grid, Typography } from "@mui/material";
import Header from '../../components/Header';
import NavBar from '../../components/NavBar';
import { Layout } from '../../components/Layout';



export default function Vacance():JSX.Element {
  return (
       <Layout>
        <div style={{margin:"20px",display:"flex",justifyContent:"center",flexDirection:"column"}}>
        <Box className="boxHistoriquePage">
          <CardContent>
          <Badge badgeContent={"RUCB en vacance"}  anchorOrigin={{vertical: 'top',horizontal: 'left'}} /> 
            <p></p>
            <Typography variant="body2" color="text.secondary"> 
                <p style={{textDecoration:"underline",fontSize:"20px"}}>Ami Basketteurs !!</p>    
                <p>La saison 2021/2022 vient de se terminer. Le RUCB prend quelques jours de repos.</p>     
                <p>L&apos;idée étant de revenir encore plus fort à la rentrée !!</p>  
                <p>Une permanence se met toutefois en place :</p>
                <ul>
                    <li>Info Joueurs (projets horaires, entraînements, essais): merci de contacter <u>Aurelien VALENTIN (06-79-46-47-07)</u> ou <u>Florent Aubry (06-82-30-16-71)</u></li>
                    <li>Infos Licences: vous pouvez contacter <u>Gérard BAUDESSON (07-60-75-99-77)</u> ou <u>Sophie AUFRAY (06-19-54-43-75)</u></li>
                    <li>Infos Sponsoring/Recrutement/Dirigeants/Entraineurs: merci de contacter <u>Franck MANSUY (06-68-20-27-34)</u> </li>
                </ul>
                <p>
                    Belles vacances à toutes et tous et rendez vous en septembre !!
                </p>
                </Typography>
          </CardContent>
        </Box>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        </div>
        </Layout>
  );
}
