import { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import api from '../utils/api';
import { useToastStore } from '../components/Toast';

const AdminLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login, user } = useContext(AuthContext);
    const navigate = useNavigate();
    const addToast = useToastStore((state) => state.addToast);

    useEffect(() => {
        if (user && user.isAdmin) {
            navigate('/admin/dashboard');
        }
    }, [user, navigate]);

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            const { data } = await api.post('/admin/login', { email, password });
            login(data);
            addToast('Login successful!', 'success');
            navigate('/admin/dashboard');
        } catch (error) {
            addToast('Invalid email or password', 'error');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-background-dark py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
            <div className="max-w-md w-full space-y-8 bg-white dark:bg-surface-dark p-10 rounded-[2.5rem] shadow-2xl border border-gray-100 dark:border-neutral-800">
                <div className="text-center">
                    <div className="mx-auto h-16 w-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-6">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 00-2 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                    </div>
                    <h2 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">
                        Platform Access
                    </h2>
                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Please enter your administrative credentials</p>
                </div>
                <form className="mt-8 space-y-6" onSubmit={submitHandler}>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">Email Authority</label>
                            <input
                                id="email-address"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                className="appearance-none block w-full px-5 py-4 border border-gray-200 dark:border-neutral-700 placeholder-gray-400 text-gray-900 dark:text-white rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-gray-50 dark:bg-neutral-900 transition-all font-medium"
                                placeholder="admin@platform.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">Access Token</label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                required
                                className="appearance-none block w-full px-5 py-4 border border-gray-200 dark:border-neutral-700 placeholder-gray-400 text-gray-900 dark:text-white rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-gray-50 dark:bg-neutral-900 transition-all font-medium"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            className="group relative w-full flex justify-center py-4 px-6 border border-transparent text-sm font-bold rounded-2xl text-white bg-primary hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary shadow-lg shadow-primary/20 transition-all active:scale-[0.98]"
                        >
                            Authorize Entry
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AdminLogin;
