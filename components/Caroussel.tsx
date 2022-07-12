import { Carousel } from "react-bootstrap";

export default function Test() {
    return (
        <Carousel >
              <Carousel.Item interval={3000} className="carouselHome">
                <img
                  className="imgCarousel"
                  src="../../ballon.jpg"
                  alt="First slide"
                />
                <Carousel.Caption>
                  <h3>First slide label</h3>
                  <p>Nulla vitae elit libero, a pharetra augue mollis interdum.</p>
                </Carousel.Caption>
              </Carousel.Item>
              <Carousel.Item interval={3000} className="carouselHome">
                <img
                  className="imgCarousel"
                  src="../../sponsors/NouveauLogoNorauto.jpg"
                  alt="Second slide"
                />

                <Carousel.Caption>
                  <h3>Second slide label</h3>
                  <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                </Carousel.Caption>
              </Carousel.Item>
              <Carousel.Item interval={3000} className="carouselHome">
                <img
                  className="d-block w-100"
                  src="../../bannerHome3.jpg"
                  alt="Third slide"
                />

                <Carousel.Caption>
                  <h3>Third slide label</h3>
                  <p>Praesent commodo cursus magna, vel scelerisque nisl consectetur.</p>
                </Carousel.Caption>
              </Carousel.Item>
            </Carousel>

    );
}
