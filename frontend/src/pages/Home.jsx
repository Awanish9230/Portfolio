import Hero from '../components/sections/Hero';
import About from '../components/sections/About';
import TechStack from '../components/sections/TechStack';
import Experience from '../components/sections/Experience';
import Projects from '../components/sections/Projects';
import Contact from '../components/sections/Contact';

const Home = () => {
    return (
        <div className="bg-white">
            <Hero />
            <About />
            <TechStack />
            <Experience />
            <Projects />
            <Contact />
        </div>
    );
};

export default Home;
