import { Badge } from "@mui/material";
import { Table } from "react-bootstrap";

export default function Horaires() {
    return (
       <div className="divHoraires">
        <Badge badgeContent={"Entrainements"} color="primary" anchorOrigin={{vertical: 'top',horizontal: 'left'}} style={{marginBottom:"40px"}} /> 
        <img src="../HorairesEntrainements.png"/>
       </div>
    
    );
}
