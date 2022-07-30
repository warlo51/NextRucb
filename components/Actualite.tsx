import { Button } from "react-bootstrap";

export default function Actualite() {
    //<h5><a style={{color:"black"}} href="" download=''>Téléchargez le dossier de licence</a></h5>
    return (
        <a style={{color:"black"}} href="../DossierLicence.pdf" download='../DossierLicence.pdf'>
        <div className="divActualite">
        <Button id="badge">Le RUC Recrute !</Button>
        <h5>Téléchargez le dossier Ici</h5>
        </div>
        </a>
    );
}
