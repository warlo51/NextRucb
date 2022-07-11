import React from "react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";

export default () => (
  <Carousel autoPlay  infiniteLoop={true} className="Bandeau">
    <div>
      <img alt="" src="../gymnase1.jpg" />
      <p className="title">RECRUTEMENT</p>
      <p className="buttonSlide">Voir plus</p>
    </div>
    <div>
      <img alt="" src="../gymnase2.jpg" />
      <p className="title">TEST 2</p>
      <p className="buttonSlide">Voir plus</p>
    </div>
    <div>
      <img alt="" src="../gymnase3.jpg" />
      <p className="title">TEST 3</p>
      <p className="buttonSlide">Voir plus</p>
    </div>
  </Carousel>
);
