import * as React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Link from 'next/link';


export default function Layout ( {children}:any ) {
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const [sousMenuQSN,setSousMenuQSN] = React.useState(<></>);
  const [sousMenuQSNOpen,setSousMenuQSNOpen] = React.useState(false);
  const [sousMenuNP,setSousMenuNP] = React.useState(<></>);
  const [sousMenuNPOpen,setSousMenuNPOpen] = React.useState(false);

  const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
  })<AppBarProps>(({ theme, open }) => ({
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: `${drawerWidth}px`,
      transition: theme.transitions.create(['margin', 'width'], {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
    }),
  }));

  interface AppBarProps extends MuiAppBarProps {
    open?: boolean;
  }
  
  const drawerWidth = 240;

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })<{
  open?: boolean;
}>(({ theme, open }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  transition: theme.transitions.create('margin', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginLeft: `-${drawerWidth}px`,
  ...(open && {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  }),
}));
  
  const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
  }));
  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  React.useEffect(()=>{
    if(sousMenuQSNOpen === true){
      setSousMenuQSN(<>
       <Link href="/qui/historique" >
          <a>
            <ListItem button className='sousMenuQui'>
              <ListItemText primary={"Historique du RUC Basket"} />
            </ListItem>
        </a></Link>
        <Link href="/qui/comite">
          <a>
            <ListItem button className='sousMenuQui'>
              <ListItemText primary={"Comité Directeur"} />
            </ListItem>
        </a></Link>
        <Link href="/qui/entraineurs">
          <a>
            <ListItem button className='sousMenuQui'>
              <ListItemText primary={"Les Entraineurs"} />
            </ListItem>
        </a></Link>
        <Link href="/qui/complexe">
          <a>
            <ListItem button className='sousMenuQui'>
              <ListItemText primary={"Complexe Sportif H.Barbuss"} />
            </ListItem>
        </a></Link>
        </>);
        
    }
    else{
      setSousMenuQSN(<></>);
    }
  },[sousMenuQSNOpen]);

  React.useEffect(()=>{
    if(sousMenuNPOpen === true){
      setSousMenuNP(<>
        <Link href="/partenaires/mecenat">
          <a>
            <ListItem button className='sousMenuQui'>
              <ListItemText primary={"Mécenat"} />
            </ListItem>
        </a></Link>
        <Link href="/partenaires/dossier_sponsor">
          <a>
            <ListItem button className='sousMenuQui'>
              <ListItemText primary={"Dossier Sponsor"} />
            </ListItem>
        </a></Link>
        <Link href="/partenaires/info">
          <a>
            <ListItem button className='sousMenuQui'>
              <ListItemText primary={"Nos Partenaires"} />
            </ListItem>
        </a></Link>
        </>);    
    }
    else{
      setSousMenuNP(<></>);
    }
  },[sousMenuNPOpen]);

 
  return (
    <Box sx={{ display: 'flex' }} className="NavMenu">
      <CssBaseline />
      <AppBar position="fixed" open={open}>
        <Toolbar className="BarreMenu">
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{ mr: 2, ...(open && { display: 'none' }) }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            Menu
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            backgroundColor:"#3c1d79",
            color:"white"
          },
        }}
        variant="persistent"
        anchor="left"
        open={open}
        
      >
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'ltr' ? <ChevronLeftIcon style={{color:"white"}} /> : <ChevronRightIcon style={{color:"white"}} />}
          </IconButton>
        </DrawerHeader>
        <List className='ListBarreMenu'>
          <Link href="/home"><a>
            <ListItem button>
              <ListItemText primary={"Home"} />
            </ListItem>
            </a></Link>
            <Link href="/arbitrage"><a>
            <ListItem button>
              <ListItemText primary={"Arbitrage"} />
            </ListItem>
            </a></Link>
            <ListItem button onClick={()=>{setSousMenuQSNOpen(!sousMenuQSNOpen)}}>
              <ListItemText primary={"Qui Sommes Nous"} />
            </ListItem>
              {sousMenuQSN}
            <ListItem button onClick={()=>{setSousMenuNPOpen(!sousMenuNPOpen)}}>
              <ListItemText primary={"Nos Partenaires"} />
            </ListItem>
            {sousMenuNP}
        </List>
      </Drawer>
      <Main open={open} >
        <DrawerHeader />
        {children}
        
      </Main>
    </Box>
  );
}
