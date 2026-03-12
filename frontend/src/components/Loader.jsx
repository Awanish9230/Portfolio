import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

const Loader = ({ finishLoading }) => {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 100) {
                    clearInterval(interval);
                    setTimeout(finishLoading, 500);
                    return 100;
                }
                return prev + 1;
            });
        }, 30);
        return () => clearInterval(interval);
    }, [finishLoading]);

    return (
        <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.8, ease: "easeInOut" } }}
            className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white dark:bg-background-dark overflow-hidden"
        >
            <div className="relative flex flex-col items-center">
                {/* Animated Logo Container */}
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="relative w-24 h-24 mb-8"
                >
                    {/* Ring Animation */}
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-0 border-t-2 border-r-2 border-primary rounded-full"
                    />
                    <motion.div
                        animate={{ rotate: -360 }}
                        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-2 border-b-2 border-l-2 border-primary/30 rounded-full"
                    />
                    
                    {/* Center Logo/Icon */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <motion.span 
                            initial={{ y: 10, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="text-3xl font-black text-primary italic"
                        >
                            A
                        </motion.span>
                    </div>
                </motion.div>

                {/* Progress Text */}
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center"
                >
                    <span className="text-4xl font-black text-gray-900 dark:text-white tabular-nums">
                        {progress}%
                    </span>
                    <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: "100%" }}
                        className="h-[1px] bg-primary/20 mt-2 w-48 relative overflow-hidden"
                    >
                        <motion.div 
                            className="absolute inset-0 bg-primary"
                            style={{ width: `${progress}%` }}
                        />
                    </motion.div>
                    <span className="text-[10px] uppercase tracking-[0.3em] text-gray-400 mt-4 font-bold">
                        Initializing Experience
                    </span>
                </motion.div>
            </div>

            {/* Background Decorative Elements */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <motion.div 
                    animate={{ 
                        scale: [1, 1.2, 1],
                        opacity: [0.05, 0.1, 0.05] 
                    }}
                    transition={{ duration: 4, repeat: Infinity }}
                    className="absolute -top-1/4 -left-1/4 w-1/2 h-1/2 bg-primary rounded-full blur-[120px]"
                />
                <motion.div 
                    animate={{ 
                        scale: [1, 1.5, 1],
                        opacity: [0.02, 0.05, 0.02] 
                    }}
                    transition={{ duration: 6, repeat: Infinity, delay: 1 }}
                    className="absolute -bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-indigo-600 rounded-full blur-[120px]"
                />
            </div>
        </motion.div>
    );
};

export default Loader;
