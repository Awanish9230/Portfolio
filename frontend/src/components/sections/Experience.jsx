import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../../utils/api';
import { FaBriefcase, FaGraduationCap } from 'react-icons/fa';

const ExperienceSkeleton = ({ index }) => (
    <div className="relative pl-8 md:pl-0 w-full mb-8 md:mb-12">
        {/* Timeline Line (Desktop) */}
        <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-neutral-800 -translate-x-1/2"></div>

        <div className={`md:flex items-center justify-between ${index % 2 === 0 ? 'md:flex-row-reverse' : ''} group`}>
            <div className="hidden md:block w-5/12"></div>

            {/* Icon Skeleton */}
            <div className="absolute left-0 md:left-1/2 top-4 md:top-0 w-6 h-6 md:w-10 md:h-10 bg-gray-300 dark:bg-neutral-700 rounded-full flex items-center justify-center shadow-lg z-10 -translate-x-1/2 md:-translate-x-1/2 animate-pulse"></div>

            {/* Card Content Skeleton */}
            <div className="md:w-5/12 bg-surface-light dark:bg-surface-dark p-6 rounded-xl border border-gray-100 dark:border-neutral-800 shadow-sm transition-all duration-300">
                <div className="inline-block w-20 h-6 bg-gray-200 dark:bg-neutral-800 rounded-full mb-3 animate-pulse"></div>
                <div className="h-6 bg-gray-200 dark:bg-neutral-800 rounded w-3/4 mb-2 animate-pulse"></div>
                <div className="h-5 bg-gray-200 dark:bg-neutral-800 rounded w-1/2 mb-4 animate-pulse"></div>
                
                <div className="space-y-2">
                    <div className="h-4 bg-gray-200 dark:bg-neutral-800 rounded w-full animate-pulse"></div>
                    <div className="h-4 bg-gray-200 dark:bg-neutral-800 rounded w-full animate-pulse"></div>
                    <div className="h-4 bg-gray-200 dark:bg-neutral-800 rounded w-4/5 animate-pulse"></div>
                </div>
            </div>
        </div>
    </div>
);

const Experience = () => {
    const [experiences, setExperiences] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchExperience = async () => {
            try {
                const { data } = await api.get('/experience');
                setExperiences(data);
            } catch (error) {
                console.error('Error fetching experience:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchExperience();
    }, []);

    const getIcon = (type) => {
        switch (type.toLowerCase()) {
            case 'internship':
            case 'job':
                return <FaBriefcase />;
            default:
                return <FaGraduationCap />;
        }
    };

    return (
        <section id="experience" className="py-20 bg-white dark:bg-background-dark transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">Experience & Education</h2>
                        <div className="w-20 h-1 bg-primary mx-auto rounded-full"></div>
                    </div>

                    {loading ? (
                        <div className="grid grid-cols-1 max-w-4xl mx-auto w-full">
                            {[0, 1].map((n) => (
                                <ExperienceSkeleton key={n} index={n} />
                            ))}
                        </div>
                    ) : experiences.length === 0 ? (
                        <div className="text-center text-gray-500 dark:text-gray-400">
                            <p>No experience added yet. Check back soon!</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-8 md:gap-12 max-w-4xl mx-auto">
                            {experiences.map((exp, index) => (
                                <motion.div
                                    key={exp._id}
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1 }}
                                    className="relative pl-8 md:pl-0"
                                >
                                    {/* Timeline Line (Desktop) */}
                                    <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-neutral-800 -translate-x-1/2"></div>

                                    <div className={`md:flex items-center justify-between ${index % 2 === 0 ? 'md:flex-row-reverse' : ''} group`}>
                                        <div className="hidden md:block w-5/12"></div>

                                        {/* Icon */}
                                        <div className="absolute left-0 md:left-1/2 top-4 md:top-0 w-6 h-6 md:w-10 md:h-10 bg-primary text-white rounded-full flex items-center justify-center shadow-lg z-10 -translate-x-1/2 md:-translate-x-1/2 transition-transform group-hover:scale-110">
                                            <div className="scale-75 md:scale-100">{getIcon(exp.type)}</div>
                                        </div>

                                        <div className="md:w-5/12 bg-surface-light dark:bg-surface-dark p-6 rounded-xl border border-gray-100 dark:border-neutral-800 shadow-sm hover:shadow-md transition-all duration-300 hover:border-primary/50">
                                            <span className="inline-block px-3 py-1 text-xs font-semibold text-primary bg-indigo-50 dark:bg-indigo-900/30 rounded-full mb-2">
                                                {exp.duration}
                                            </span>
                                            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">{exp.title}</h3>
                                            <h4 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">{exp.organization}</h4>
                                            <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                                                {exp.description}
                                            </p>
                                        </div>
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

export default Experience;
