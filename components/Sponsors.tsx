import { Button } from "react-bootstrap";
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
export default function Sponsors() {
    return (
        <a style={{color:"black"}} href="../Mecenat.pdf" download='../Mecenat.pdf'>
        <div className="divSponsors">
        <Button id="badge">Dossier Sponsoring</Button>
        <h5>Téléchargez le dossier Ici</h5>
        </div>
        </a>
    );
}
