import { Button, Col, Row } from "react-bootstrap";
import React from "react";
export default function Partenaires() {
    return (
        <a style={{color:"black", padding:"0"}} href="/partenaires/info">
        <div className="divSponsors">
        <Button id="badge">Nos Partenaires</Button>
            <h5>Cliquez Ici</h5>
        </div>
        </a>
    );
}
