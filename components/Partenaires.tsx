import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import { Badge } from '@mui/material';
export default function Partenaires() {
    return (
        <div className="divSponsors">
        <Badge badgeContent={"Nos Partenaires"} anchorOrigin={{vertical: 'top',horizontal: 'left'}} style={{marginBottom:"40px",marginLeft:"20px"}} /> 
        <h5><a style={{color:"black"}} href="/partenaires/info">Venez découvrir nos partenaires !</a></h5>
        </div>
    );
}
