import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import SkipNextIcon from '@mui/icons-material/SkipNext';

export default function CardLeft() {
    const theme = useTheme();

    return (
    <div style={{margin:"20px",display:"flex",justifyContent:"center",backgroundColor:"gray"}}>
      <Card id="cardLeft">
        <Box id="boxCard">
          <CardContent sx={{ flex: '1 0 auto'}}>
            <Typography className="titreCard" component="div" variant="h5">
              Horaires Entrainements
            </Typography>
            <Typography variant="body1" color="text.secondary" component="div">
              Découvrez les horaires d'entrainements des différentes catégories
            </Typography>
          </CardContent>
        </Box>
        <CardMedia
          component="img"
          className='imgCard'
          image="../bannerHome3.jpg"
          alt="Live from space album cover"
        />
      </Card>
      </div>);
}