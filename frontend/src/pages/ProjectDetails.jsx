import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../utils/api';
import { FaGithub, FaExternalLinkAlt, FaArrowLeft } from 'react-icons/fa';
import { motion } from 'framer-motion';

const ProjectDetails = () => {
    const { id } = useParams();
    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeImage, setActiveImage] = useState(0);

    useEffect(() => {
        const fetchProject = async () => {
            try {
                const { data } = await api.get(`/projects/${id}`);
                setProject(data);
            } catch (error) {
                console.error('Error fetching project details:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProject();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center pt-16">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!project) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center pt-16 text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Project Not Found</h2>
                <Link to="/" className="text-primary hover:underline flex items-center">
                    <FaArrowLeft className="mr-2" /> Back to Home
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-surface-light dark:bg-surface-dark pt-24 pb-20 transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <Link to="/" className="inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-indigo-400 transition-colors mb-8">
                    <FaArrowLeft className="mr-2" /> Back to Projects
                </Link>

                <div className="bg-white dark:bg-background-dark rounded-2xl shadow-sm overflow-hidden border border-gray-100 dark:border-neutral-800 transition-colors">
                    {/* Media Gallery */}
                    <div className="p-6 md:p-8 border-b border-gray-100 dark:border-neutral-800">
                        <div className="mb-6 aspect-video bg-gray-100 dark:bg-neutral-900 rounded-xl overflow-hidden shadow-inner">
                            {project.video && activeImage === project.images.length ? (
                                <iframe
                                    src={project.video.replace('watch?v=', 'embed/')}
                                    title={project.title}
                                    className="w-full h-full"
                                    frameBorder="0"
                                    allowFullScreen
                                ></iframe>
                            ) : (
                                <img
                                    src={project.images[activeImage] ? project.images[activeImage] : 'https://via.placeholder.com/1200x600'}
                                    alt={project.title}
                                    className="w-full h-full object-contain"
                                />
                            )}
                        </div>

                        {/* Thumbnails */}
                        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-thin">
                            {project.images.map((img, index) => (
                                <button
                                    key={index}
                                    onClick={() => setActiveImage(index)}
                                    className={`flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden border-2 transition-all ${activeImage === index ? 'border-primary ring-2 ring-primary/20' : 'border-transparent opacity-70 hover:opacity-100'
                                        }`}
                                >
                                    <img
                                        src={img}
                                        alt={`Thumbnail ${index + 1}`}
                                        className="w-full h-full object-cover"
                                    />
                                </button>
                            ))}
                            {project.video && (
                                <button
                                    onClick={() => setActiveImage(project.images.length)}
                                    className={`flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden border-2 flex items-center justify-center bg-gray-100 dark:bg-neutral-800 ${activeImage === project.images.length ? 'border-primary ring-2 ring-primary/20' : 'border-transparent opacity-70 hover:opacity-100'
                                        }`}
                                >
                                    <span className="text-xs font-bold text-gray-500 dark:text-gray-400">VIDEO</span>
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="p-6 md:p-8">
                        <div className="flex flex-col md:flex-row justify-between items-start gap-8 mb-8">
                            <div>
                                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">{project.title}</h1>
                                <div className="flex flex-wrap gap-2">
                                    {project.technologies.map((tech) => (
                                        <span key={tech} className="px-3 py-1 bg-indigo-50 dark:bg-indigo-900/30 text-primary dark:text-indigo-400 text-sm font-semibold rounded-full">
                                            {tech}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                                {project.liveLink && (
                                    <a
                                        href={project.liveLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="px-6 py-3 bg-primary text-white rounded-lg shadow-md hover:bg-indigo-700 transition-colors flex items-center justify-center font-medium"
                                    >
                                        <FaExternalLinkAlt className="mr-2" /> Live Demo
                                    </a>
                                )}
                                {project.githubLink && (
                                    <a
                                        href={project.githubLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="px-6 py-3 bg-white dark:bg-neutral-800 text-gray-800 dark:text-gray-200 border border-gray-300 dark:border-neutral-700 rounded-lg shadow-sm hover:bg-gray-50 dark:hover:bg-neutral-700 transition-colors flex items-center justify-center font-medium"
                                    >
                                        <FaGithub className="mr-2" /> Source Code
                                    </a>
                                )}
                            </div>
                        </div>

                        <div className="prose max-w-none text-gray-600 dark:text-gray-400">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 block border-b border-gray-100 dark:border-neutral-800 pb-2">Description</h3>
                            <p className="whitespace-pre-line leading-relaxed">
                                {project.fullDescription}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProjectDetails;
