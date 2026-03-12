import { FaSearch, FaBell, FaUserCircle } from 'react-icons/fa';

const AdminHeader = ({ activeTab }) => {
    return (
        <header className="h-20 bg-white/80 dark:bg-surface-dark/80 backdrop-blur-md border-b border-gray-200 dark:border-neutral-800 fixed top-0 right-0 left-0 z-[45] transition-colors">
            <div className="h-full px-8 flex items-center justify-between ml-64">
                <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white capitalize">
                        {activeTab}
                    </h2>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Manage your portfolio content</p>
                </div>

                <div className="flex items-center space-x-6">
                    <div className="relative hidden md:block">
                        <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input 
                            type="text" 
                            placeholder="Search..." 
                            className="pl-10 pr-4 py-2 bg-gray-100 dark:bg-neutral-900 border border-transparent focus:border-primary rounded-full text-sm transition-all focus:ring-0 text-gray-900 dark:text-white"
                        />
                    </div>
                    
                    <button className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white relative">
                        <FaBell size={20} />
                        <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-surface-dark"></span>
                    </button>
                    
                    <div className="h-8 w-[1px] bg-gray-200 dark:bg-neutral-800"></div>
                    
                    <div className="flex items-center space-x-3 cursor-pointer group">
                        <div className="text-right hidden sm:block">
                            <p className="text-sm font-bold text-gray-900 dark:text-white group-hover:text-primary transition-colors">Admin</p>
                            <p className="text-[10px] text-gray-500 dark:text-gray-400">Master access</p>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary border border-primary/20 overflow-hidden">
                            <FaUserCircle size={28} />
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default AdminHeader;
