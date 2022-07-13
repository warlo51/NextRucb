import { Badge } from "@mui/material";

export default function Equipes() {
    return (
        <div className="divActualite">
        <Badge badgeContent={"Nos Equipes"} color="primary" anchorOrigin={{vertical: 'top',horizontal: 'left'}} style={{marginBottom:"40px",marginLeft:"20px"}} />
        <ul id="ulEquipe">
            <li>Sénior 1 : Pre région</li>
            <li>Senior 2 : Département</li>
            <li>U17 : Département </li>
            <li>U15 : Département</li>
            <li>U13 : Département</li>
            <li>U11 : Département</li>
            <li>U11 fille : Département</li>
            <li>U9 </li>
            <li>U7 </li>
        </ul>
        </div>
    );
}
