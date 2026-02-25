import { motion } from 'framer-motion';
import { SiMongodb, SiExpress, SiReact, SiNodedotjs, SiTailwindcss, SiFirebase, SiGit, SiGithub, SiJavascript, SiHtml5 } from 'react-icons/si';
import { FaDatabase, FaServer, FaCode } from 'react-icons/fa';

const TechStack = () => {
    const technologies = [
        { name: 'MongoDB', icon: SiMongodb, color: 'text-green-500' },
        { name: 'Express.js', icon: SiExpress, color: 'text-gray-500' },
        { name: 'React.js', icon: SiReact, color: 'text-blue-400' },
        { name: 'Node.js', icon: SiNodedotjs, color: 'text-green-600' },
        { name: 'Tailwind CSS', icon: SiTailwindcss, color: 'text-cyan-400' },
        { name: 'Firebase', icon: SiFirebase, color: 'text-yellow-500' },
        { name: 'Git', icon: SiGit, color: 'text-orange-600' },
        { name: 'GitHub', icon: SiGithub, color: 'text-gray-800' },
        { name: 'JavaScript', icon: SiJavascript, color: 'text-yellow-400' },
        { name: 'REST API', icon: FaServer, color: 'text-indigo-500' },
    ];

    return (
        <section id="skills" className="py-20 bg-surface">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Technologies & Skills</h2>
                        <div className="w-20 h-1 bg-primary mx-auto rounded-full"></div>
                        <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
                            My technical toolkit includes a range of modern technologies for building robust full-stack applications.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
                        {technologies.map((tech, index) => (
                            <motion.div
                                key={tech.name}
                                whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)" }}
                                className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center justify-center transition-all duration-300"
                            >
                                <tech.icon className={`text-5xl ${tech.color} mb-4`} />
                                <h4 className="text-lg font-medium text-gray-700">{tech.name}</h4>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default TechStack;
