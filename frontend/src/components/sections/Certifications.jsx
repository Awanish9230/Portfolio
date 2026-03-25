import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../../utils/api';
import { FaCertificate, FaExternalLinkAlt, FaAward } from 'react-icons/fa';

const Certifications = () => {
    const [certifications, setCertifications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
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
                            // Avoid loading same script multiple times
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

    if (loading) return null;
    if (certifications.length === 0) return null;

    return (
        <section id="certifications" className="py-20 bg-background-light dark:bg-background-dark transition-colors duration-300">
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
                    <div className="w-20 h-1.5 bg-primary mx-auto rounded-full"></div>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {certifications.map((cert, index) => (
                        <motion.div
                            key={cert._id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-surface-light dark:bg-surface-dark p-6 rounded-3xl border border-gray-100 dark:border-neutral-800 shadow-xl hover:shadow-2xl transition-all group overflow-hidden relative"
                        >
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
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Certifications;
