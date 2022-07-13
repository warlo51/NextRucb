import * as React from 'react';
import CardContent from '@mui/material/CardContent';
import { Badge, Box, Container, Grid, Typography } from "@mui/material";
import Header from '../../components/Header';
import NavBar from '../../components/NavBar';
import { Layout } from '../../components/Layout';



export default function Historique():JSX.Element {
  return (
       <Layout>
        <div style={{margin:"20px",display:"flex",justifyContent:"center",flexDirection:"column"}}>
        <Box className="boxHistoriquePage">
          <CardContent>
          <Badge badgeContent={"Notre Histoire"} anchorOrigin={{vertical: 'top',horizontal: 'left'}} /> 
            <p></p>
            <Typography variant="body2" color="text.secondary">          
                Le RUC Basket est né il y a 35 ans de la dissolution de la section basket de l&apos;Université de Reims, le Reims Université Club.
                C&apos;est un club de Basket rémois connu dans toute la région champardennaise et qui contribut à la vie sportive rémoise.
                Pendant plusieurs années, le club a organisé une compétition de basket inédite dans la région : les 60h du RUCB.
                Ce tournoi sans commune mesure rassemblait sur presque 3 jours de nombreuses équipes féminines et masculines de différentes régions. La dernière édition a eu lieu en 2014.
                L&apos;équipe Seniors évolue en championnat pré-national et joue les premiers rôles. Elle a atteint en 2016 et 2017 le dernier carré pour l&apos;accession en National 3 (finale perdue en 2016 contre Vitry le François, demi-finale en 2017 contre l&apos;Etoile de Charleville Mézières), championnat dans lequel elle a évolué lors de la saision 2014-2015.
                Le RUCB c&apos;est aussi des équipes jeunes qui participent à la notoriété de la politique de formation du club. En 2018, c&apos;est l&apos;équipe U11 (Poussins) qui a garni le palmarès du club en remportant la coupe de la Marne.
              </Typography>
          </CardContent>
        </Box>
        <Box className="boxHistoriquePage">
          <CardContent>
          <Badge badgeContent={"Le Présent"} anchorOrigin={{vertical: 'top',horizontal: 'left'}} /> 
            <p></p>
            <Typography variant="body2" color="text.secondary">          
              Le RUC Basket, pour cette saison 2018-2019 c&apos;est :
              140 licenciés de 7 à 60 ans.
              Une section initiation à la pratique : Baby, Mini et Poussins.
              Une section formation des jeunes  : Benjamins, Minimes.
              Un groupe séniors de 4 équipes, évoluant jusqu&apos;au plus haut niveau régional.
              Des entraineurs dipômés au niveau régional pour former les joueurs de demain.
              L&apos;essentiel des rencontres a lieu au Gymnase Henri Barbusse, ainsi qu&apos;une majorité des entrainements. (les autres étant répartis sur le Gymnase Courcelles et Europe).
              
              Mais c&apos;est aussi
                
              Des bénévoles, une grande famille du basket animée par le plaisir du jeu et de moments de convivialité.
              Des dirigeants, des parents, des joueurs s&apos;investissant pour le plaisir de la balle orange.
              Des partenaires fidèles et soutenant le projet du Club.
              Des valeurs, sur et en dehors des terrains :
              Compétition, Respect, Accueil, Convivialité.
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
        </div>
        </Layout>
  );
}
