import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import { Badge } from '@mui/material';
export default function Sponsors() {
    return (
        <div className="divSponsors">
        <Badge badgeContent={"Dossier Sponsoring"} color="primary" anchorOrigin={{vertical: 'top',horizontal: 'left'}} style={{marginBottom:"40px",marginLeft:"20px"}} /> 
        <h5><a style={{color:"black"}} href="../Sponsoring.pdf" download='../Sponsoring.pdf'>Téléchargez le dossier Ici</a></h5>
        </div>
    );
}
