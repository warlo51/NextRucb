
import Link from "next/link";
import React from "react";
import { Button } from "react-bootstrap";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";

export default () => (
  <Carousel autoPlay  infiniteLoop={true} className="Bandeau">
    <div>
      <img alt="" src="../bandeau1.jpg" />
      <p className="title">Le RUCB est en vacance</p>
      <Button id="buttonSlide" href="/actus/vacances">Cliquez ici</Button>
    </div>
    <div>
      <img alt="" src="../bandeau2.jpg" />
      <p className="title">L'Actu du RUCB</p>
      <Button id="buttonSlide" href="/actus/actuRUCB">Cliquez ici</Button>
    </div>
  </Carousel>
);
