import { motion } from 'framer-motion';
import { Link } from 'react-scroll';

const Hero = () => {
    return (
        <section id="home" className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-white pt-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center">
                <div className="md:w-1/2 text-center md:text-left mb-10 md:mb-0">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <h2 className="text-xl md:text-2xl font-medium text-gray-600 mb-2">
                            Hello, I'm
                        </h2>
                        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4 tracking-tight">
                            Awanish <span className="text-primary">Kumar</span>
                        </h1>
                        <p className="text-xl md:text-2xl text-gray-600 mb-8 font-light">
                            Full Stack MERN Developer
                        </p>
                        <p className="text-gray-500 mb-10 max-w-lg mx-auto md:mx-0 leading-relaxed">
                            I build scalable, responsive, and modern web applications using MongoDB, Express, React, and Node.js.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                            <Link
                                to="projects"
                                smooth={true}
                                offset={-70}
                                duration={500}
                                className="px-8 py-3 bg-primary text-white rounded-lg shadow-lg hover:bg-indigo-700 transition-colors cursor-pointer font-medium"
                            >
                                View Projects
                            </Link>
                            <Link
                                to="contact"
                                smooth={true}
                                offset={-70}
                                duration={500}
                                className="px-8 py-3 bg-white text-primary border border-primary rounded-lg shadow-sm hover:bg-indigo-50 transition-colors cursor-pointer font-medium"
                            >
                                Contact Me
                            </Link>
                        </div>
                    </motion.div>
                </div>

                <div className="md:w-1/2 flex justify-center relative">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="relative z-10"
                    >
                        {/* Profile Image */}
                        <div className="w-64 h-64 md:w-96 md:h-96 bg-indigo-100 rounded-full flex items-center justify-center overflow-hidden shadow-2xl border-4 border-white">
                            <img
                                src="/profile.png"
                                alt="Awanish Kumar Profile"
                                className="w-full h-full object-cover"
                            />
                        </div>

                        {/* Decorative Elements */}
                        <div className="absolute -top-10 -right-10 w-20 h-20 bg-yellow-200 rounded-full opacity-50 blur-xl animate-pulse"></div>
                        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-primary rounded-full opacity-20 blur-2xl animate-pulse"></div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
