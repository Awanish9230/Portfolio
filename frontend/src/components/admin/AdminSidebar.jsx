import { FaThLarge, FaBriefcase, FaEnvelope, FaCog, FaChartLine } from 'react-icons/fa';
import { motion } from 'framer-motion';

const AdminSidebar = ({ activeTab, setActiveTab }) => {
    const menuItems = [
        { id: 'overview', label: 'Overview', icon: FaChartLine },
        { id: 'projects', label: 'Projects', icon: FaThLarge },
        { id: 'experience', label: 'Experience', icon: FaBriefcase },
        { id: 'messages', label: 'Messages', icon: FaEnvelope },
        { id: 'settings', label: 'Settings', icon: FaCog },
    ];

    return (
        <aside className="w-64 bg-white dark:bg-surface-dark border-r border-gray-200 dark:border-neutral-800 h-screen fixed left-0 top-0 pt-20 z-40 transition-colors">
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
            
            <div className="absolute bottom-6 left-0 w-full px-6">
                <div className="p-4 bg-gray-50 dark:bg-neutral-900 rounded-xl border border-gray-100 dark:border-neutral-800">
                    <p className="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wider mb-2">Logged in as</p>
                    <p className="text-sm font-bold text-gray-900 dark:text-white truncate">Admin User</p>
                </div>
            </div>
        </aside>
    );
};

export default AdminSidebar;
