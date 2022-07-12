import { Badge } from "@mui/material";

export default function Actualite() {
    return (
        <div className="divActualite">
        <Badge badgeContent={"Le RUC Recrute !"} color="primary" anchorOrigin={{vertical: 'top',horizontal: 'left'}} style={{marginBottom:"40px",marginLeft:"20px"}} />
        <h5><a style={{color:"black"}} href="" download=''>Téléchargez le dossier de licence</a></h5>
        </div>
    );
}
