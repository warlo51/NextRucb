import { Button } from "react-bootstrap";
import React, {useEffect, useState} from "react";
import client from "../src/client";

export default function Actualite() {
    const [fichesJSON, setFichesJSON] = useState<any>("");

    useEffect(()=>{
        async function loadData(){
            const dossier = await client.fetch(
                `*[_type == "dossierLicence"]{
                    ...,
                    "fichier": fichier.asset->url
                    }`
            )
            setFichesJSON(dossier[0].fichier)
        }
        loadData();
    },[]);

        return (
            <a style={{color:"black", padding:"0"}} href={fichesJSON} download={fichesJSON} target="_blank">
                <div className="divActualite">
                    <Button id="badge">Le RUCB Recrute !</Button>
                    <h5>Téléchargez le dossier Ici</h5>
                </div>
            </a>
        );


}
