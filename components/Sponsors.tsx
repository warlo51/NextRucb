import { Button } from "react-bootstrap";
export default function Sponsors(): JSX.Element {
    return (
        <a style={{color:"black", padding:"0"}} href="../Mecenat.pdf" download='../Mecenat.pdf'>
        <div className="divActualite">
        <Button id="badge">Dossier Sponsoring</Button>
        <h5>Téléchargez le dossier Ici</h5>
        </div>
        </a>
    );
}
