import { Button } from "react-bootstrap";

export default function Actualite() {
    //<h5><a style={{color:"black"}} href="" download=''>Téléchargez le dossier de licence</a></h5>
    return (
        <div className="divActualite">
        <Button id="badge">Le RUC Recrute !</Button>
        <h5><a style={{color:"black"}} href="../DossierLicence.pdf" download='../DossierLicence.pdf'>Téléchargez le dossier Ici</a></h5>
        </div>
    );
}
