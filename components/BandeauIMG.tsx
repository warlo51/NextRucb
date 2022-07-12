import React from "react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";

export default () => (
  <Carousel autoPlay  infiniteLoop={true} className="Bandeau">
    <div>
      <img alt="" src="../bandeau1.jpg" />
      <p className="title">Le RUCB est en vacance</p>
      <p className="buttonSlide"><a href="/actus/vacances">Cliquez ici</a></p>
    </div>
    <div>
      <img alt="" src="../bandeau2.jpg" />
      <p className="title">L'Actu du RUCB</p>
      <p className="buttonSlide"><a href="/actus/actuRUCB">Cliquez ici</a></p>
    </div>
  </Carousel>
);
