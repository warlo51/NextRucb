import { Button } from "react-bootstrap";

export default function Actualite() {
    return (
        <a style={{color:"black", padding:"0"}} href="../DossierLicence.pdf" download='../DossierLicence.pdf'>
        <div className="divActualite">
        <Button id="badge">Le RUC Recrute !</Button>
        <h5>Téléchargez le dossier Ici</h5>
        </div>
        </a>
    );
}
