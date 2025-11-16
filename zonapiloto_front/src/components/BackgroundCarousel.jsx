import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import "../styles/components/carouselBackground.css";

import img1 from "../assets/images/background_carousel/carrusel1.png";
import img2 from "../assets/images/background_carousel/carrusel2.png";
import img3 from "../assets/images/background_carousel/carrusel3.jpeg";

function BackgroundCarousel() {
    return (
        <div className="background-carousel">
            <Carousel
                autoPlay
                infiniteLoop
                showThumbs={false}
                showStatus={false}
                interval={5000}
                transitionTime={600}
                showArrows={false}
                swipeable={false}
                emulateTouch={false}
                stopOnHover={false}
                dynamicHeight={false}
            >
                <div><img src={img1} alt="Imagen 1" loading="eager" /></div>
                <div><img src={img2} alt="Imagen 2" loading="lazy" /></div>
                <div><img src={img3} alt="Imagen 3" loading="lazy" /></div>
            </Carousel>
        </div>
    );
}

export default BackgroundCarousel;