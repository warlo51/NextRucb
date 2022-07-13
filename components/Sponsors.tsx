import { Button } from "react-bootstrap";
export default function Sponsors() {
    return (
        <div className="divSponsors">
        <Button id="badge">Dossier Sponsoring</Button>
        <h5><a style={{color:"black"}} href="../Sponsoring.pdf" download='../Sponsoring.pdf'>Téléchargez le dossier Ici</a></h5>
        </div>
    );
}
