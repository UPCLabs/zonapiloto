import Header from "../components/Header.jsx";
import Hero from "../components/Hero.jsx";
import ServicesGrid from "../components/ServicesGrid.jsx";
import Announcements from "../components/Announcements.jsx";
import Footer from "../components/Footer.jsx";

function Home() {
    return (
        <>
            <Header />
            <Hero />
            <ServicesGrid />
            <Announcements />
            <Footer />
        </>
    );
}

export default Home;
