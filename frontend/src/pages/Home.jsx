import { useState, useEffect } from 'react';
import Hero from '../components/sections/Hero';
import About from '../components/sections/About';
import TechStack from '../components/sections/TechStack';
import Experience from '../components/sections/Experience';
import Projects from '../components/sections/Projects';
import Certifications from '../components/sections/Certifications';
import Contact from '../components/sections/Contact';
import api from '../utils/api';

const Home = () => {
    useEffect(() => {
        const incrementViews = async () => {
            const hasVisited = sessionStorage.getItem('hasVisited');
            if (!hasVisited) {
                try {
                    await api.post('/stats/increment');
                    sessionStorage.setItem('hasVisited', 'true');
                } catch (error) {
                    console.error('Error incrementing views:', error);
                }
            }
        };
        incrementViews();
    }, []);

    return (
        <div className="bg-white">
            <Hero />
            <About />
            <TechStack />
            <Experience />
            <Certifications />
            <Projects />
            <Contact />
        </div>
    );
};

export default Home;
