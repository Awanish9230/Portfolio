import { motion } from 'framer-motion';
import { FaDownload } from 'react-icons/fa';

const About = () => {
    return (
        <section id="about" className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">About Me</h2>
                        <div className="w-20 h-1 bg-primary mx-auto rounded-full"></div>
                    </div>

                    <div className="flex flex-col md:flex-row items-center gap-12">
                        <div className="md:w-1/3">
                            <div className="aspect-square rounded-2xl overflow-hidden shadow-lg bg-gray-100 relative group">
                                <img
                                    src="https://images.unsplash.com/photo-1571171637578-41bc2dd41cd2?q=80&w=2070&auto=format&fit=crop"
                                    alt="Working on code"
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-primary/10 group-hover:bg-transparent transition-colors duration-300"></div>
                            </div>
                        </div>

                        <div className="md:w-2/3">
                            <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                                Passionate MERN Stack Developer
                            </h3>
                            <p className="text-gray-600 mb-6 leading-relaxed">
                                I am an enthusiastic fresher MERN Stack Developer with a strong foundation in building dynamic and responsive web applications. I love turning ideas into reality through code and am constantly learning new technologies to improve my skills.
                            </p>
                            <p className="text-gray-600 mb-8 leading-relaxed">
                                My journey in web development started with a curiosity about how websites work, which led me to master HTML, CSS, JavaScript, and eventually the MERN stack. I am eager to contribute to innovative projects and grow as a software engineer.
                            </p>

                            <div className="flex flex-wrap gap-4 mb-8">
                                {['Web Development', 'UI/UX Design', 'API Integration', 'Database Management'].map((skill) => (
                                    <span key={skill} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
                                        {skill}
                                    </span>
                                ))}
                            </div>

                            <a
                                href="/resume.pdf" // Placeholder path
                                download="Awanish_Resume.pdf"
                                className="inline-flex items-center px-6 py-3 bg-primary text-white rounded-lg shadow-md hover:bg-indigo-700 transition-colors font-medium"
                            >
                                <FaDownload className="mr-2" />
                                Download Resume
                            </a>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default About;
