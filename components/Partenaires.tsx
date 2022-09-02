import { Button, Col, Row } from "react-bootstrap";
export default function Partenaires() {
    return (
        <a style={{color:"black", padding:"0"}} href="/partenaires/info">
        <div className="divSponsors">
        <Button id="badge">Nos Partenaires</Button>  
        <br></br>      
        <br></br>      
        <Row>
            <Col><img src="../sponsors/LogoVilledeReims.jpg" style={{width:"80px"}}/></Col>
            <Col><img src="../sponsors/ffbb.png" style={{width:"80px"}}/></Col>
            <Col><img src="../sponsors/liguegdestbasket.png" style={{width:"80px"}}/></Col>
        </Row>
        <br></br>
        <Row>
            <Col><img src="../sponsors/NouveauLogoNorauto.jpg" style={{width:"80px"}}/></Col>
            <Col><img src="../sponsors/logoBuffaloGrill.png" style={{width:"80px"}}/></Col>
            <Col><img src="../sponsors/logoPanorama.jpeg" style={{width:"80px"}}/></Col>
        </Row>
        <br></br>
        <br></br>
        <br></br>
        </div>
        </a>
    );
}
