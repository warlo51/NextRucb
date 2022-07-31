import { Button } from "react-bootstrap";
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
export default function Sponsors() {
    return (
        <a style={{color:"black", padding:"0"}} href="../Mecenat.pdf" download='../Mecenat.pdf'>
        <div className="divActualite">
        <Button id="badge">Dossier Sponsoring</Button>
        <h5>Téléchargez le dossier Ici</h5>
        </div>
        </a>
    );
}
