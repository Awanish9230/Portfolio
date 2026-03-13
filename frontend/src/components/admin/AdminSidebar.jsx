import { FaThLarge, FaBriefcase, FaEnvelope, FaCog, FaChartLine, FaTimes, FaSignOutAlt } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { useContext } from 'react';
import AuthContext from '../../context/AuthContext';

const AdminSidebar = ({ activeTab, setActiveTab, isOpen, setIsOpen }) => {
    const { user, logout } = useContext(AuthContext);
    const menuItems = [
        { id: 'overview', label: 'Overview', icon: FaChartLine },
        { id: 'projects', label: 'Projects', icon: FaThLarge },
        { id: 'experience', label: 'Experience', icon: FaBriefcase },
        { id: 'messages', label: 'Messages', icon: FaEnvelope },
        { id: 'settings', label: 'Settings', icon: FaCog },
    ];

    return (
        <>
            {/* Mobile Overlay */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsOpen(false)}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 lg:hidden"
                    />
                )}
            </AnimatePresence>

            <aside className={`w-64 bg-white dark:bg-surface-dark border-r border-gray-200 dark:border-neutral-800 h-screen fixed left-0 top-0 pt-20 z-[51] transition-transform duration-300 lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="absolute top-6 right-4 lg:hidden">
                    <button onClick={() => setIsOpen(false)} className="p-2 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
                        <FaTimes size={20} />
                    </button>
                </div>
            <div className="px-4 py-6">
                <nav className="space-y-2">
                    {menuItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id)}
                            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                                activeTab === item.id
                                    ? 'bg-primary text-white shadow-lg shadow-primary/20'
                                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-neutral-800 hover:text-gray-900 dark:hover:text-white'
                            }`}
                        >
                            <item.icon className="text-lg" />
                            <span className="font-medium">{item.label}</span>
                            {activeTab === item.id && (
                                <motion.div
                                    layoutId="sidebar-active"
                                    className="absolute left-0 w-1 h-6 bg-white rounded-r-full"
                                />
                            )}
                        </button>
                    ))}
                </nav>
            </div>
            
            <div className="absolute bottom-6 left-0 w-full px-6 space-y-4">
                <div className="p-4 bg-gray-50 dark:bg-neutral-900 rounded-xl border border-gray-100 dark:border-neutral-800">
                    <p className="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wider mb-1">Logged in as</p>
                    <p className="text-sm font-bold text-gray-900 dark:text-white truncate">{user?.email || 'Admin User'}</p>
                </div>
                <button 
                    onClick={logout}
                    className="w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-xl border border-red-100 dark:border-red-900/30 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all font-bold group"
                >
                    <FaSignOutAlt className="group-hover:-translate-x-1 transition-transform" />
                    <span>Logout</span>
                </button>
            </div>
        </aside>
        </>
    );
};

export default AdminSidebar;
