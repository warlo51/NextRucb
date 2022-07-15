import { Carousel, Container, Row } from "react-bootstrap";

import { Facebook, Instagram } from "@mui/icons-material";
export default function Header() {
    return (
        <Container fluid className="Header">
    <Row>
        <ul>
            <li><a href="https://fr-fr.facebook.com/pages/category/Amateur-Sports-Team/Reims-Universit%C3%A9-Club-Basket-150181285527456/"><Facebook /></a></li>
            <li><a href="https://www.instagram.com/rucb_51100/?hl=en"><Instagram /></a></li>
            <li><a href="http://www.ffbb.com/accueil"><img alt="logoFFBB" style={{height:"25px"}} src="../logoFFBB.png"/></a></li>
        </ul>
    </Row>
   </Container>    
    );
}
