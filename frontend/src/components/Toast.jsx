import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { create } from 'zustand';
import { HiCheckCircle, HiXCircle } from 'react-icons/hi';

// Simple Zustand store for Toast management
export const useToastStore = create((set) => ({
    toasts: [],
    addToast: (message, type = 'success') => {
        const id = Date.now();
        set((state) => ({ toasts: [...state.toasts, { id, message, type }] }));
        setTimeout(() => {
            set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }));
        }, 3000);
    },
    removeToast: (id) => set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),
}));

const Toast = () => {
    const { toasts, removeToast } = useToastStore();

    return (
        <div className="fixed top-20 right-4 z-50 flex flex-col space-y-2">
            <AnimatePresence>
                {toasts.map((toast) => (
                    <motion.div
                        key={toast.id}
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 50 }}
                        layout
                        className={`flex items-center p-4 rounded-lg shadow-lg text-white min-w-[300px] ${toast.type === 'success' ? 'bg-green-500' : 'bg-red-500'
                            }`}
                    >
                        <div className="mr-3">
                            {toast.type === 'success' ? (
                                <HiCheckCircle size={24} />
                            ) : (
                                <HiXCircle size={24} />
                            )}
                        </div>
                        <p className="font-medium">{toast.message}</p>
                        <button
                            onClick={() => removeToast(toast.id)}
                            className="ml-auto text-white/80 hover:text-white"
                        >
                            &times;
                        </button>
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
};

export default Toast;
