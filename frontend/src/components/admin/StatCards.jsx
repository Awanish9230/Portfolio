import { FaFileCode, FaHistory, FaCommentDots, FaEye } from 'react-icons/fa';
import { motion } from 'framer-motion';

const StatCards = ({ counts }) => {
    const stats = [
        { label: 'Total Projects', value: counts.projects, icon: FaFileCode, color: 'text-blue-500', bg: 'bg-blue-500/10' },
        { label: 'Experience Items', value: counts.experience, icon: FaHistory, color: 'text-purple-500', bg: 'bg-purple-500/10' },
        { label: 'Unread Messages', value: counts.messages, icon: FaCommentDots, color: 'text-green-500', bg: 'bg-green-500/10' },
        { label: 'Site Views', value: '1.2k', icon: FaEye, color: 'text-orange-500', bg: 'bg-orange-500/10' },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 mt-4">
            {stats.map((stat, index) => (
                <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white dark:bg-surface-dark p-6 rounded-2xl border border-gray-100 dark:border-neutral-800 shadow-sm hover:shadow-md transition-all group"
                >
                    <div className="flex items-center justify-between mb-4">
                        <div className={`p-3 rounded-xl ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform`}>
                            <stat.icon size={20} />
                        </div>
                        <span className="text-[10px] font-bold text-green-500 bg-green-500/10 px-2 py-1 rounded-full">+12%</span>
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{stat.label}</p>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{stat.value}</h3>
                    </div>
                </motion.div>
            ))}
        </div>
    );
};

export default StatCards;
