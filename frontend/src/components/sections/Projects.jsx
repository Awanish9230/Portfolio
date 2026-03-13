import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import api from '../../utils/api';
import { FaGithub, FaExternalLinkAlt } from 'react-icons/fa';

const ProjectSkeleton = () => (
    <div className="bg-white dark:bg-background-dark rounded-xl overflow-hidden shadow-sm border border-gray-100 dark:border-neutral-800 h-full flex flex-col">
        <div className="h-48 bg-gray-200 dark:bg-neutral-800 animate-pulse"></div>
        <div className="p-6 flex flex-col flex-grow">
            <div className="h-6 bg-gray-200 dark:bg-neutral-800 rounded w-3/4 mb-4 animate-pulse"></div>
            <div className="space-y-2 mb-4 flex-grow">
                <div className="h-4 bg-gray-200 dark:bg-neutral-800 rounded w-full animate-pulse"></div>
                <div className="h-4 bg-gray-200 dark:bg-neutral-800 rounded w-full animate-pulse"></div>
                <div className="h-4 bg-gray-200 dark:bg-neutral-800 rounded w-5/6 animate-pulse"></div>
            </div>
            <div className="flex gap-2 mb-4">
                <div className="h-6 w-16 bg-indigo-50 dark:bg-indigo-900/30 rounded-md animate-pulse"></div>
                <div className="h-6 w-16 bg-indigo-50 dark:bg-indigo-900/30 rounded-md animate-pulse"></div>
                <div className="h-6 w-16 bg-indigo-50 dark:bg-indigo-900/30 rounded-md animate-pulse"></div>
            </div>
            <div className="h-10 border border-gray-200 dark:border-neutral-700 rounded-lg w-full animate-pulse"></div>
        </div>
    </div>
);

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
        <section id="projects" className="py-20 bg-surface-light dark:bg-surface-dark transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">Featured Projects</h2>
                        <div className="w-20 h-1 bg-primary mx-auto rounded-full"></div>
                    </div>

                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {[1, 2, 3].map((n) => (
                                <ProjectSkeleton key={n} />
                            ))}
                        </div>
                    ) : projects.length === 0 ? (
                        <div className="text-center text-gray-500 dark:text-gray-400">
                            <p>Projects coming soon!</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {projects.map((project) => (
                                <motion.div
                                    key={project._id}
                                    whileHover={{ y: -10 }}
                                    className="bg-white dark:bg-background-dark rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full border border-gray-100 dark:border-neutral-800"
                                >
                                    <div className="h-48 overflow-hidden relative group">
                                        <img
                                            src={project.images[0] ? project.images[0] : 'https://via.placeholder.com/400x300'}
                                            alt={project.title}
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                        />
                                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center space-x-4">
                                            {project.githubLink && (
                                                <a href={project.githubLink} target="_blank" rel="noopener noreferrer" className="p-2 bg-white dark:bg-neutral-800 rounded-full hover:bg-gray-200 dark:hover:bg-neutral-700 transition-colors">
                                                    <FaGithub size={20} className="text-gray-900 dark:text-gray-100" />
                                                </a>
                                            )}
                                            {project.liveLink && (
                                                <a href={project.liveLink} target="_blank" rel="noopener noreferrer" className="p-2 bg-white dark:bg-neutral-800 rounded-full hover:bg-gray-200 dark:hover:bg-neutral-700 transition-colors">
                                                    <FaExternalLinkAlt size={18} className="text-gray-900 dark:text-gray-100" />
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                    <div className="p-6 flex flex-col flex-grow">
                                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{project.title}</h3>
                                        <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-3 flex-grow">
                                            {project.shortDescription}
                                        </p>
                                        <div className="flex flex-wrap gap-2 mb-4">
                                            {project.technologies.slice(0, 3).map((tech) => (
                                                <span key={tech} className="px-2 py-1 bg-indigo-50 dark:bg-indigo-900/30 text-primary dark:text-indigo-400 text-xs font-semibold rounded-md">
                                                    {tech}
                                                </span>
                                            ))}
                                            {project.technologies.length > 3 && (
                                                <span className="px-2 py-1 bg-gray-50 dark:bg-neutral-800 text-gray-500 dark:text-gray-400 text-xs font-semibold rounded-md">
                                                    +{project.technologies.length - 3}
                                                </span>
                                            )}
                                        </div>
                                        <Link
                                            to={`/project/${project._id}`}
                                            className="block w-full text-center py-2 border border-primary text-primary dark:text-indigo-400 dark:border-indigo-400 rounded-lg hover:bg-primary hover:text-white dark:hover:bg-indigo-500 dark:hover:text-white transition-colors font-medium"
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
