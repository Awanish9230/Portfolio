import { FaGithub, FaLinkedin, FaTwitter, FaHeart } from 'react-icons/fa';

const Footer = () => {
    return (
        <footer className="bg-white dark:bg-background-dark border-t border-gray-100 dark:border-neutral-800 py-8 transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row justify-between items-center">
                    <div className="mb-4 md:mb-0">
                        <p className="text-gray-500 dark:text-gray-400 text-sm">
                            © {new Date().getFullYear()} Awanish. All rights reserved.
                        </p>
                    </div>

                    <div className="flex space-x-6">
                        <a href="https://github.com/Awanish9230" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-primary transition-colors">
                            <FaGithub size={20} />
                        </a>
                        <a href="https://www.linkedin.com/in/awanish-kumar-verma-33740b295/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-primary transition-colors">
                            <FaLinkedin size={20} />
                        </a>
                        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-primary transition-colors">
                            <FaTwitter size={20} />
                        </a>
                    </div>
                </div>
                <div className="mt-4 text-center">
                    <p className="text-gray-400 dark:text-gray-500 text-xs flex justify-center items-center">
                        Made with <FaHeart className="text-red-500 mx-1" /> using MERN Stack
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
