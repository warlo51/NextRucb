import { Button, Col, Row } from "react-bootstrap";
export default function Partenaires() {
    return (
        <a style={{color:"black"}} href="/partenaires/info">
        <div className="divSponsors">
        <Button id="badge">Nos Partenaires</Button>        
        <Row>
            <Col><img src="../sponsors/LogoVilledeReims.jpg" style={{width:"80px"}}/></Col>
            <Col><img src="../sponsors/ffbb.png" style={{width:"80px"}}/></Col>
            <Col><img src="../sponsors/liguegdestbasket.png" style={{width:"80px"}}/></Col>
        </Row>
        <br></br>
        <h5>Venez découvrir nos partenaires !</h5>
        </div>
        </a>
    );
}
