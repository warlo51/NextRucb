import { useEffect, useState } from "react";
import { Button } from "react-bootstrap";

export default function Horaires() {
    const [tailleEcran, setTailleEcran] = useState(0);

    useEffect(()=>{
        setTailleEcran(window.innerWidth);
    },[]);

    return (
       <div className="divHoraires">
        <Button id="badge">Entrainements</Button>
        {tailleEcran > 1036 ? <img alt="horairesEntrainementRUCB" src="../HorairesEntrainements.png"/> : <img alt="horairesEntrainementRUCB" src="../HorairesEntrainementsSmartphone.png"/>}  
       </div>
    
    );
}
