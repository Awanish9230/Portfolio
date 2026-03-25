import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCertificate, FaAward, FaExternalLinkAlt, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import api from '../../utils/api';

const CertificationCard = ({ cert }) => (
    <div className="bg-surface-light dark:bg-surface-dark p-6 rounded-3xl border border-gray-100 dark:border-neutral-800 shadow-xl hover:shadow-2xl transition-all group overflow-hidden relative h-full">
        {cert.isEmbedded ? (
            <div className="flex flex-col h-full relative z-10">
                <div className="flex-grow flex items-center justify-center min-h-[220px] bg-white rounded-2xl p-4 overflow-hidden shadow-inner mb-6">
                    <div 
                        dangerouslySetInnerHTML={{ __html: cert.embedCode }} 
                        className="certification-embed flex items-center justify-center w-full scale-110"
                    />
                </div>
                <div className="text-center mb-4">
                    <h3 className="text-lg font-bold text-text-light dark:text-text-dark line-clamp-2">{cert.title}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{cert.issuingOrganization}</p>
                </div>
                {cert.certificatePDF && (
                    <div className="mt-auto pt-4 border-t border-gray-100 dark:border-neutral-800">
                        <a 
                            href={cert.certificatePDF} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="w-full py-2 flex items-center justify-center text-xs font-bold text-primary hover:bg-primary/5 rounded-xl transition-all"
                        >
                            View Document PDF
                        </a>
                    </div>
                )}
            </div>
        ) : (
            <div className="h-full flex flex-col relative z-10">
                <div className="relative group/img mb-6 overflow-hidden rounded-2xl bg-primary/5 aspect-video flex items-center justify-center">
                    {cert.certificateImage ? (
                        <img 
                            src={cert.certificateImage} 
                            alt={cert.title} 
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                    ) : (
                        <div className="text-primary group-hover:scale-110 transition-transform duration-500">
                            <FaAward size={40} />
                        </div>
                    )}
                    {cert.certificatePDF && (
                        <div className="absolute inset-0 bg-primary/80 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center">
                            <a 
                                href={cert.certificatePDF} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="px-4 py-2 bg-white text-primary rounded-full text-xs font-bold shadow-lg transform translate-y-4 group-hover/img:translate-y-0 transition-transform"
                            >
                                View PDF
                            </a>
                        </div>
                    )}
                </div>
                <h3 className="text-xl font-bold text-text-light dark:text-text-dark mb-2 group-hover:text-primary transition-colors line-clamp-2">
                    {cert.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 font-medium mb-4">
                    {cert.issuingOrganization}
                </p>
                
                <div className="mt-auto pt-6 border-t border-gray-100 dark:border-neutral-800 flex justify-between items-center">
                    <div className="text-xs text-gray-500 dark:text-gray-500 font-bold uppercase tracking-widest">
                        Issued: {cert.issueDate}
                    </div>
                    {cert.credentialURL && (
                        <a 
                            href={cert.credentialURL} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="p-2 bg-primary/10 text-primary rounded-lg hover:bg-primary hover:text-white transition-all"
                            title="Verify Credential"
                        >
                            <FaExternalLinkAlt size={12} />
                        </a>
                    )}
                </div>
            </div>
        )}
        
        {/* Decorative background element */}
        <div className="absolute -bottom-6 -right-6 text-gray-100 dark:text-neutral-800/10 group-hover:text-primary/5 transition-colors pointer-events-none">
            <FaCertificate size={120} />
        </div>
    </div>
);

const Certifications = () => {
    const [certifications, setCertifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isExpanded, setIsExpanded] = useState(false);
    const [activeIndex, setActiveIndex] = useState(0);

    const fetchCertifications = async () => {
        try {
            const { data } = await api.get('/certifications');
            setCertifications(data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching certifications:', error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCertifications();
    }, []);

    useEffect(() => {
        if (!loading && certifications.length > 0) {
            certifications.forEach(cert => {
                if (cert.isEmbedded && cert.embedCode) {
                    const tempDiv = document.createElement('div');
                    tempDiv.innerHTML = cert.embedCode;
                    const scripts = tempDiv.getElementsByTagName('script');
                    for (let i = 0; i < scripts.length; i++) {
                        const script = document.createElement('script');
                        if (scripts[i].src) {
                            const existingScript = document.querySelector(`script[src="${scripts[i].src}"]`);
                            if (!existingScript) {
                                script.src = scripts[i].src;
                                script.async = true;
                                document.body.appendChild(script);
                            }
                        } else {
                            script.textContent = scripts[i].textContent;
                            document.body.appendChild(script);
                        }
                    }
                }
            });
        }
    }, [loading, certifications]);

    const nextSlide = useCallback(() => {
        setActiveIndex((prev) => (prev + 1) % certifications.length);
    }, [certifications.length]);

    const prevSlide = useCallback(() => {
        setActiveIndex((prev) => (prev - 1 + certifications.length) % certifications.length);
    }, [certifications.length]);

    useEffect(() => {
        if (!isExpanded && certifications.length > 1) {
            const interval = setInterval(nextSlide, 5000);
            return () => clearInterval(interval);
        }
    }, [isExpanded, certifications.length, nextSlide]);

    if (loading) return null;
    if (certifications.length === 0) return null;

    return (
        <section id="certifications" className="py-20 bg-background-light dark:bg-background-dark transition-colors duration-300 overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-3xl md:text-4xl font-black text-text-light dark:text-text-dark mb-4">
                        Honors & <span className="text-primary">Certifications</span>
                    </h2>
                    <div className="w-20 h-1.5 bg-primary mx-auto rounded-full mb-8"></div>
                    
                    {certifications.length > 3 && (
                        <button 
                            onClick={() => setIsExpanded(!isExpanded)}
                            className="inline-flex items-center px-6 py-2.5 bg-primary/10 text-primary hover:bg-primary hover:text-white rounded-full text-sm font-bold transition-all shadow-sm group"
                        >
                            {isExpanded ? 'Switch to Slider View' : 'Show All Certifications'}
                            <motion.span 
                                animate={{ x: isExpanded ? -4 : 4 }}
                                className="ml-2"
                            >
                                →
                            </motion.span>
                        </button>
                    )}
                </motion.div>

                {!isExpanded ? (
                    <div className="relative">
                        {/* Slider Controls */}
                        <div className="absolute top-1/2 -translate-y-1/2 -left-4 md:-left-12 z-20">
                            <button onClick={prevSlide} className="p-3 rounded-full bg-white dark:bg-surface-dark shadow-lg border border-gray-100 dark:border-neutral-800 text-primary hover:bg-primary hover:text-white transition-all">
                                <FaChevronLeft />
                            </button>
                        </div>
                        <div className="absolute top-1/2 -translate-y-1/2 -right-4 md:-right-12 z-20">
                            <button onClick={nextSlide} className="p-3 rounded-full bg-white dark:bg-surface-dark shadow-lg border border-gray-100 dark:border-neutral-800 text-primary hover:bg-primary hover:text-white transition-all">
                                <FaChevronRight />
                            </button>
                        </div>

                        {/* Slider Container */}
                        <div className="overflow-hidden">
                            <motion.div 
                                className="flex gap-8"
                                animate={{ x: `calc(-${activeIndex * (100 / (window.innerWidth < 768 ? 1 : window.innerWidth < 1024 ? 2 : 3))}% - ${activeIndex * (window.innerWidth < 768 ? 0 : 32)}px)` }}
                                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            >
                                {certifications.map((cert) => (
                                    <div key={cert._id} className="w-full md:w-[calc(50%-16px)] lg:w-[calc(33.333%-21.33px)] flex-shrink-0">
                                        <CertificationCard cert={cert} />
                                    </div>
                                ))}
                            </motion.div>
                        </div>

                        {/* Pagination Dots */}
                        <div className="flex justify-center mt-12 gap-2">
                            {certifications.map((_, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setActiveIndex(idx)}
                                    className={`w-2.5 h-2.5 rounded-full transition-all ${idx === activeIndex ? 'bg-primary w-8' : 'bg-gray-300 dark:bg-neutral-800'}`}
                                />
                            ))}
                        </div>
                    </div>
                ) : (
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                    >
                        {certifications.map((cert) => (
                            <CertificationCard key={cert._id} cert={cert} />
                        ))}
                    </motion.div>
                )}
            </div>
        </section>
    );
};

export default Certifications;
