import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import api from '../../utils/api';
import { FaGithub, FaExternalLinkAlt } from 'react-icons/fa';

const Projects = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const { data } = await api.get('/projects');
                setProjects(data);
            } catch (error) {
                console.error('Error fetching projects:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProjects();
    }, []);

    return (
        <section id="projects" className="py-20 bg-surface">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Featured Projects</h2>
                        <div className="w-20 h-1 bg-primary mx-auto rounded-full"></div>
                    </div>

                    {loading ? (
                        <div className="flex justify-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                        </div>
                    ) : projects.length === 0 ? (
                        <div className="text-center text-gray-500">
                            <p>Projects coming soon!</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {projects.map((project) => (
                                <motion.div
                                    key={project._id}
                                    whileHover={{ y: -10 }}
                                    className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full border border-gray-100"
                                >
                                    <div className="h-48 overflow-hidden relative group">
                                        {/* Assuming images is an array of paths */}
                                        <img
                                            src={project.images[0] ? project.images[0] : 'https://via.placeholder.com/400x300'}
                                            alt={project.title}
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                        />
                                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center space-x-4">
                                            {project.githubLink && (
                                                <a href={project.githubLink} target="_blank" rel="noopener noreferrer" className="p-2 bg-white rounded-full hover:bg-gray-200 transition-colors">
                                                    <FaGithub size={20} className="text-gray-900" />
                                                </a>
                                            )}
                                            {project.liveLink && (
                                                <a href={project.liveLink} target="_blank" rel="noopener noreferrer" className="p-2 bg-white rounded-full hover:bg-gray-200 transition-colors">
                                                    <FaExternalLinkAlt size={18} className="text-gray-900" />
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                    <div className="p-6 flex flex-col flex-grow">
                                        <h3 className="text-xl font-bold text-gray-900 mb-2">{project.title}</h3>
                                        <p className="text-gray-600 text-sm mb-4 line-clamp-3 flex-grow">
                                            {project.shortDescription}
                                        </p>
                                        <div className="flex flex-wrap gap-2 mb-4">
                                            {project.technologies.slice(0, 3).map((tech) => (
                                                <span key={tech} className="px-2 py-1 bg-indigo-50 text-primary text-xs font-semibold rounded-md">
                                                    {tech}
                                                </span>
                                            ))}
                                            {project.technologies.length > 3 && (
                                                <span className="px-2 py-1 bg-gray-50 text-gray-500 text-xs font-semibold rounded-md">
                                                    +{project.technologies.length - 3}
                                                </span>
                                            )}
                                        </div>
                                        <Link
                                            to={`/project/${project._id}`}
                                            className="block w-full text-center py-2 border border-primary text-primary rounded-lg hover:bg-primary hover:text-white transition-colors font-medium"
                                        >
                                            View Details
                                        </Link>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </motion.div>
            </div>
        </section>
    );
};

export default Projects;
