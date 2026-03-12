import { useState, useEffect, useContext } from 'react';
import api from '../utils/api';
import AuthContext from '../context/AuthContext';
import { useToastStore } from '../components/Toast';
import { FaPlus, FaTrash, FaEdit, FaChevronRight, FaThLarge } from 'react-icons/fa';
import AdminSidebar from '../components/admin/AdminSidebar';
import AdminHeader from '../components/admin/AdminHeader';
import StatCards from '../components/admin/StatCards';
import { motion, AnimatePresence } from 'framer-motion';

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('overview');
    const [projects, setProjects] = useState([]);
    const [experiences, setExperiences] = useState([]);
    const [messages, setMessages] = useState([]);
    const [counts, setCounts] = useState({ projects: 0, experience: 0, messages: 0 });
    const { user, login } = useContext(AuthContext);
    const addToast = useToastStore((state) => state.addToast);

    // Settings State
    const [settingsForm, setSettingsForm] = useState({
        email: user?.email || '',
        password: '',
        confirmPassword: '',
        profileImage: null,
        resume: null
    });

    // Form states
    const [showProjectForm, setShowProjectForm] = useState(false);
    const [editingProject, setEditingProject] = useState(null); // ID of project being edited
    const [projectForm, setProjectForm] = useState({
        title: '', shortDescription: '', fullDescription: '', technologies: '', githubLink: '', liveLink: '', video: '', images: []
    });

    const [showExperienceForm, setShowExperienceForm] = useState(false);
    const [editingExperience, setEditingExperience] = useState(null); // ID of experience being edited
    const [experienceForm, setExperienceForm] = useState({
        title: '', organization: '', description: '', duration: '', type: 'Job'
    });

    useEffect(() => {
        fetchData();
    }, [activeTab]);

    const fetchData = async () => {
        try {
            const [projectsRes, expRes, msgRes, statsRes] = await Promise.all([
                api.get('/projects'),
                api.get('/experience'),
                api.get('/messages'),
                api.get('/stats')
            ]);
            setProjects(projectsRes.data);
            setExperiences(expRes.data);
            setMessages(msgRes.data);
            setCounts({
                projects: projectsRes.data.length,
                experience: expRes.data.length,
                messages: msgRes.data.filter(m => !m.isRead).length,
                views: statsRes.data.totalViews || 0
            });
        } catch (error) {
            console.error(error);
            addToast('Failed to fetch data', 'error');
        }
    };

    // Project Handlers
    const handleProjectEdit = (project) => {
        setEditingProject(project._id);
        setProjectForm({
            title: project.title,
            shortDescription: project.shortDescription,
            fullDescription: project.fullDescription,
            technologies: project.technologies.join(', '),
            githubLink: project.githubLink || '',
            liveLink: project.liveLink || '',
            video: project.video || '',
            images: [] // Keep empty, only for new uploads
        });
        setShowProjectForm(true);
    };

    const resetProjectForm = () => {
        setProjectForm({ title: '', shortDescription: '', fullDescription: '', technologies: '', githubLink: '', liveLink: '', video: '', images: [] });
        setEditingProject(null);
        setShowProjectForm(false);
    };

    const handleProjectSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        Object.keys(projectForm).forEach(key => {
            if (key === 'technologies') {
                const techs = projectForm.technologies.split(',').map(t => t.trim());
                formData.append('technologies', JSON.stringify(techs));
            } else if (key === 'images') {
                for (let i = 0; i < projectForm.images.length; i++) {
                    formData.append('images', projectForm.images[i]);
                }
            } else {
                formData.append(key, projectForm[key]);
            }
        });

        try {
            if (editingProject) {
                await api.put(`/projects/${editingProject}`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                addToast('Project updated successfully', 'success');
            } else {
                await api.post('/projects', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                addToast('Project added successfully', 'success');
            }
            resetProjectForm();
            fetchData();
        } catch (error) {
            addToast(editingProject ? 'Failed to update project' : 'Failed to add project', 'error');
        }
    };

    // Experience Handlers
    const handleExperienceEdit = (exp) => {
        setEditingExperience(exp._id);
        setExperienceForm({
            title: exp.title,
            organization: exp.organization,
            description: exp.description,
            duration: exp.duration,
            type: exp.type
        });
        setShowExperienceForm(true);
    };

    const resetExperienceForm = () => {
        setExperienceForm({ title: '', organization: '', description: '', duration: '', type: 'Job' });
        setEditingExperience(null);
        setShowExperienceForm(false);
    };

    const handleExperienceSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingExperience) {
                await api.put(`/experience/${editingExperience}`, experienceForm);
                addToast('Experience updated successfully', 'success');
            } else {
                await api.post('/experience', experienceForm);
                addToast('Experience added successfully', 'success');
            }
            resetExperienceForm();
            fetchData();
        } catch (error) {
            addToast(editingExperience ? 'Failed to update experience' : 'Failed to add experience', 'error');
        }
    };

    const handleDelete = async (id, type) => {
        if (!window.confirm('Are you sure?')) return;
        try {
            await api.delete(`/${type}/${id}`);
            addToast('Deleted successfully', 'success');
            fetchData();
        } catch (error) {
            addToast('Failed to delete', 'error');
        }
    };

    // Settings Handlers
    const handleSettingsSubmit = async (e) => {
        e.preventDefault();
        if (settingsForm.password && settingsForm.password !== settingsForm.confirmPassword) {
            return addToast('Passwords do not match', 'error');
        }

        try {
            const formData = new FormData();
            formData.append('email', settingsForm.email);
            if (settingsForm.password) formData.append('password', settingsForm.password);
            if (settingsForm.profileImage) formData.append('profileImage', settingsForm.profileImage);
            if (settingsForm.resume) formData.append('resume', settingsForm.resume);

            const { data } = await api.put('/admin/profile', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            login(data); // update global auth context
            addToast('Profile updated successfully', 'success');
            setSettingsForm({ ...settingsForm, password: '', confirmPassword: '', profileImage: null, resume: null });
        } catch (error) {
            addToast(error.response?.data?.message || 'Failed to update profile', 'error');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-background-dark transition-colors duration-300">
            <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
            <AdminHeader activeTab={activeTab} />
            
            <main className="ml-64 pt-24 min-h-screen">
                <div className="p-8 max-w-6xl mx-auto">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                        >
                            {/* Overview Tab */}
                            {activeTab === 'overview' && (
                                <div className="space-y-8">
                                    <div>
                                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Welcome back, Admin!</h3>
                                        <p className="text-gray-500 dark:text-gray-400">Here's what's happening with your portfolio today.</p>
                                    </div>

                                    <StatCards counts={counts} />

                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                        <div className="bg-white dark:bg-surface-dark p-6 rounded-2xl border border-gray-100 dark:border-neutral-800 shadow-sm">
                                            <div className="flex items-center justify-between mb-6">
                                                <h4 className="font-bold text-gray-900 dark:text-white">Recent Projects</h4>
                                                <button onClick={() => setActiveTab('projects')} className="text-sm text-primary font-medium flex items-center hover:underline">
                                                    View all <FaChevronRight className="ml-1 text-[10px]" />
                                                </button>
                                            </div>
                                            <div className="space-y-4">
                                                {projects.slice(0, 3).map(p => (
                                                    <div 
                                                        key={p._id} 
                                                        onClick={() => {
                                                            setActiveTab('projects');
                                                            handleProjectEdit(p);
                                                        }}
                                                        className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-neutral-800/50 transition-colors cursor-pointer group"
                                                    >
                                                        <div className="flex items-center space-x-3">
                                                            <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-neutral-800 flex items-center justify-center text-gray-400">
                                                                <FaThLarge />
                                                            </div>
                                                            <div>
                                                                <p className="text-sm font-bold text-gray-900 dark:text-white group-hover:text-primary transition-colors">{p.title}</p>
                                                                <p className="text-[10px] text-gray-500">{p.technologies.slice(0, 2).join(', ')}</p>
                                                            </div>
                                                        </div>
                                                        <FaChevronRight className="text-gray-300 dark:text-neutral-700 text-xs" />
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="bg-white dark:bg-surface-dark p-6 rounded-2xl border border-gray-100 dark:border-neutral-800 shadow-sm">
                                            <div className="flex items-center justify-between mb-6">
                                                <h4 className="font-bold text-gray-900 dark:text-white">Latest Messages</h4>
                                                <button onClick={() => setActiveTab('messages')} className="text-sm text-primary font-medium flex items-center hover:underline">
                                                    View all <FaChevronRight className="ml-1 text-[10px]" />
                                                </button>
                                            </div>
                                            <div className="space-y-4">
                                                {messages.slice(0, 3).map(m => (
                                                    <div key={m._id} className="p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-neutral-800/50 transition-colors border border-transparent hover:border-gray-100 dark:hover:border-neutral-800">
                                                        <div className="flex justify-between items-start mb-1">
                                                            <p className="text-sm font-bold text-gray-900 dark:text-white">{m.name}</p>
                                                            <p className="text-[10px] text-gray-400">{new Date(m.createdAt).toLocaleDateString()}</p>
                                                        </div>
                                                        <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1">{m.message}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Projects Tab */}
                            {activeTab === 'projects' && (
                                <div>
                                    <div className="flex justify-between items-center mb-6">
                                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">Project Inventory</h3>
                                        <button
                                            onClick={() => {
                                                if (showProjectForm) resetProjectForm();
                                                else setShowProjectForm(true);
                                            }}
                                            className={`px-4 py-2 rounded-xl text-white font-medium flex items-center transition-all shadow-lg ${showProjectForm ? 'bg-gray-500 shadow-gray-500/20' : 'bg-primary shadow-primary/20'}`}
                                        >
                                            {showProjectForm ? 'Cancel' : <><FaPlus className="mr-2" /> Add Project</>}
                                        </button>
                                    </div>

                                    {showProjectForm && (
                                        <div className="bg-white dark:bg-surface-dark p-8 rounded-2xl shadow-xl border border-gray-100 dark:border-neutral-800 mb-8 transition-colors">
                                            <h3 className="text-xl font-bold mb-6 text-gray-900 dark:text-white">{editingProject ? 'Edit Project' : 'Add New Project'}</h3>
                                            <form onSubmit={handleProjectSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div className="space-y-4">
                                                    <input type="text" placeholder="Title" className="w-full px-4 py-3 border border-gray-200 dark:border-neutral-700 rounded-xl bg-gray-50 dark:bg-neutral-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none" required
                                                        value={projectForm.title} onChange={e => setProjectForm({ ...projectForm, title: e.target.value })} />
                                                    <input type="text" placeholder="Short Description" className="w-full px-4 py-3 border border-gray-200 dark:border-neutral-700 rounded-xl bg-gray-50 dark:bg-neutral-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none" required
                                                        value={projectForm.shortDescription} onChange={e => setProjectForm({ ...projectForm, shortDescription: e.target.value })} />
                                                    <textarea placeholder="Full Description" className="w-full px-4 py-3 border border-gray-200 dark:border-neutral-700 rounded-xl bg-gray-50 dark:bg-neutral-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none" rows="5" required
                                                        value={projectForm.fullDescription} onChange={e => setProjectForm({ ...projectForm, fullDescription: e.target.value })}></textarea>
                                                </div>
                                                <div className="space-y-4">
                                                    <input type="text" placeholder="Technologies (comma separated)" className="w-full px-4 py-3 border border-gray-200 dark:border-neutral-700 rounded-xl bg-gray-50 dark:bg-neutral-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none" required
                                                        value={projectForm.technologies} onChange={e => setProjectForm({ ...projectForm, technologies: e.target.value })} />
                                                    <input type="url" placeholder="GitHub Link" className="w-full px-4 py-3 border border-gray-200 dark:border-neutral-700 rounded-xl bg-gray-50 dark:bg-neutral-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none"
                                                        value={projectForm.githubLink} onChange={e => setProjectForm({ ...projectForm, githubLink: e.target.value })} />
                                                    <input type="url" placeholder="Live Link" className="w-full px-4 py-3 border border-gray-200 dark:border-neutral-700 rounded-xl bg-gray-50 dark:bg-neutral-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none"
                                                        value={projectForm.liveLink} onChange={e => setProjectForm({ ...projectForm, liveLink: e.target.value })} />
                                                    <input type="text" placeholder="Video URL (YouTube)" className="w-full px-4 py-3 border border-gray-200 dark:border-neutral-700 rounded-xl bg-gray-50 dark:bg-neutral-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none"
                                                        value={projectForm.video} onChange={e => setProjectForm({ ...projectForm, video: e.target.value })} />
                                                    <div>
                                                        <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-widest pl-1">Project Images</label>
                                                        <input type="file" multiple accept="image/*" className="w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 transition-all cursor-pointer bg-gray-50 dark:bg-neutral-900 p-2 rounded-xl border border-dashed border-gray-300 dark:border-neutral-700"
                                                            onChange={e => setProjectForm({ ...projectForm, images: e.target.files })} />
                                                    </div>
                                                </div>
                                                <div className="md:col-span-2 flex space-x-3 pt-4">
                                                    <button type="submit" className="px-8 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 shadow-lg shadow-green-600/20 font-bold transition-all">
                                                        {editingProject ? 'Update Project' : 'Save Project'}
                                                    </button>
                                                    <button type="button" onClick={resetProjectForm} className="px-8 py-3 bg-gray-200 dark:bg-neutral-800 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-300 dark:hover:bg-neutral-700 font-bold transition-all">
                                                        Cancel
                                                    </button>
                                                </div>
                                            </form>
                                        </div>
                                    )}

                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {projects.map(project => (
                                            <div key={project._id} className="bg-white dark:bg-surface-dark p-1 rounded-3xl border border-gray-100 dark:border-neutral-800 shadow-sm hover:shadow-xl transition-all group">
                                                <div className="relative aspect-video rounded-2xl bg-gray-100 dark:bg-neutral-900 mb-4 overflow-hidden">
                                                    {project.images && project.images[0] ? (
                                                        <img src={project.images[0]} alt={project.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                                    ) : (
                                                        <div className="flex items-center justify-center h-full text-gray-400">
                                                            <FaThLarge size={40} />
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="px-5 pb-5 flex flex-col justify-between min-h-[140px]">
                                                    <div>
                                                        <h3 className="font-bold text-lg text-gray-900 dark:text-white group-hover:text-primary transition-colors">{project.title}</h3>
                                                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate mt-1">{project.shortDescription}</p>
                                                    </div>
                                                    <div className="flex justify-end items-center pt-4 space-x-2 border-t border-gray-50 dark:border-neutral-800">
                                                        <button onClick={() => handleProjectEdit(project)} className="p-2 bg-blue-50 dark:bg-blue-500/10 text-blue-500 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-500/20 transition-colors">
                                                            <FaEdit size={16} />
                                                        </button>
                                                        <button onClick={() => handleDelete(project._id, 'projects')} className="p-2 bg-red-50 dark:bg-red-500/10 text-red-500 rounded-lg hover:bg-red-100 dark:hover:bg-red-500/20 transition-colors">
                                                            <FaTrash size={16} />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Experience Tab */}
                            {activeTab === 'experience' && (
                                <div className="space-y-6">
                                    <div className="flex justify-between items-center">
                                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">Professional Journey</h3>
                                        <button
                                            onClick={() => {
                                                if (showExperienceForm) resetExperienceForm();
                                                else setShowExperienceForm(true);
                                            }}
                                            className={`px-4 py-2 rounded-xl text-white font-medium flex items-center transition-all shadow-lg ${showExperienceForm ? 'bg-gray-500 shadow-gray-500/20' : 'bg-primary shadow-primary/20'}`}
                                        >
                                            {showExperienceForm ? 'Cancel' : <><FaPlus className="mr-2" /> Add Entry</>}
                                        </button>
                                    </div>

                                    {showExperienceForm && (
                                        <div className="bg-white dark:bg-surface-dark p-8 rounded-2xl shadow-xl border border-gray-100 dark:border-neutral-800 transition-colors mb-8">
                                            <h3 className="text-xl font-bold mb-6 text-gray-900 dark:text-white">{editingExperience ? 'Edit Entry' : 'Add New Entry'}</h3>
                                            <form onSubmit={handleExperienceSubmit} className="space-y-6">
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                    <input type="text" placeholder="Job Title" className="w-full px-4 py-3 border border-gray-200 dark:border-neutral-700 rounded-xl bg-gray-50 dark:bg-neutral-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none" required
                                                        value={experienceForm.title} onChange={e => setExperienceForm({ ...experienceForm, title: e.target.value })} />
                                                    <input type="text" placeholder="Organization" className="w-full px-4 py-3 border border-gray-200 dark:border-neutral-700 rounded-xl bg-gray-50 dark:bg-neutral-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none" required
                                                        value={experienceForm.organization} onChange={e => setExperienceForm({ ...experienceForm, organization: e.target.value })} />
                                                </div>
                                                <textarea placeholder="Key responsibilities and achievements..." className="w-full px-4 py-3 border border-gray-200 dark:border-neutral-700 rounded-xl bg-gray-50 dark:bg-neutral-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none" rows="3" required
                                                    value={experienceForm.description} onChange={e => setExperienceForm({ ...experienceForm, description: e.target.value })}></textarea>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                    <input type="text" placeholder="Duration (e.g. June 2023 - Present)" className="w-full px-4 py-3 border border-gray-200 dark:border-neutral-700 rounded-xl bg-gray-50 dark:bg-neutral-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none" required
                                                        value={experienceForm.duration} onChange={e => setExperienceForm({ ...experienceForm, duration: e.target.value })} />
                                                    <select className="w-full px-4 py-3 border border-gray-200 dark:border-neutral-700 rounded-xl bg-gray-50 dark:bg-neutral-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none"
                                                        value={experienceForm.type} onChange={e => setExperienceForm({ ...experienceForm, type: e.target.value })}>
                                                        <option value="Internship">Internship</option>
                                                        <option value="Training">Training</option>
                                                        <option value="Project">Project</option>
                                                        <option value="Job">Job</option>
                                                        <option value="Certification">Certification</option>
                                                    </select>
                                                </div>
                                                <div className="flex space-x-3">
                                                    <button type="submit" className="px-8 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 shadow-lg shadow-green-600/20 font-bold transition-all">
                                                        Save Entry
                                                    </button>
                                                    <button type="button" onClick={resetExperienceForm} className="px-8 py-3 bg-gray-200 dark:bg-neutral-800 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-300 dark:hover:bg-neutral-700 font-bold transition-all">
                                                        Cancel
                                                    </button>
                                                </div>
                                            </form>
                                        </div>
                                    )}

                                    <div className="space-y-4">
                                        {experiences.map(exp => (
                                            <div key={exp._id} className="bg-white dark:bg-surface-dark p-6 rounded-2xl border border-gray-100 dark:border-neutral-800 shadow-sm hover:shadow-md transition-all flex justify-between items-center group">
                                                <div className="flex items-center space-x-6">
                                                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20 group-hover:scale-110 transition-transform font-bold italic">
                                                        {exp.organization.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <h3 className="font-bold text-gray-900 dark:text-white group-hover:text-primary transition-colors">{exp.title}</h3>
                                                        <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400 mt-1">
                                                            <span className="font-medium text-gray-700 dark:text-gray-300">{exp.organization}</span>
                                                            <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                                                            <span>{exp.duration}</span>
                                                            <span className="px-2 py-0.5 rounded bg-gray-100 dark:bg-neutral-800 uppercase tracking-tighter">{exp.type}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button onClick={() => handleExperienceEdit(exp)} className="p-2 bg-blue-50 dark:bg-blue-500/10 text-blue-500 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-500/20 transition-colors">
                                                        <FaEdit size={16} />
                                                    </button>
                                                    <button onClick={() => handleDelete(exp._id, 'experience')} className="p-2 bg-red-50 dark:bg-red-500/10 text-red-500 rounded-lg hover:bg-red-100 dark:hover:bg-red-500/20 transition-colors">
                                                        <FaTrash size={16} />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Messages Tab */}
                            {activeTab === 'messages' && (
                                <div className="bg-white dark:bg-surface-dark rounded-3xl shadow-xl overflow-hidden border border-gray-100 dark:border-neutral-800 transition-colors">
                                    <div className="p-6 border-b border-gray-100 dark:border-neutral-800 flex justify-between items-center">
                                        <h3 className="font-bold text-gray-900 dark:text-white">Inbound Inquiries</h3>
                                        <span className="bg-primary/10 text-primary text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest">{messages.length} Total</span>
                                    </div>
                                    <table className="min-w-full divide-y divide-gray-100 dark:divide-neutral-800">
                                        <thead className="bg-gray-50/50 dark:bg-neutral-900/50">
                                            <tr>
                                                <th className="px-8 py-4 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">Sender</th>
                                                <th className="px-8 py-4 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">Content Snapshot</th>
                                                <th className="px-8 py-4 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">Received On</th>
                                                <th className="px-8 py-4 text-right text-[10px] font-bold text-gray-400 uppercase tracking-widest">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white dark:bg-surface-dark divide-y divide-gray-50 dark:divide-neutral-800">
                                            {messages.map(msg => (
                                                <tr key={msg._id} className="hover:bg-gray-50 dark:hover:bg-neutral-800/20 transition-all cursor-default group">
                                                    <td className="px-8 py-5">
                                                        <div className="flex items-center space-x-3">
                                                            <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center text-[10px] font-bold">
                                                                {msg.name.charAt(0)}
                                                            </div>
                                                            <div>
                                                                <p className="text-sm font-bold text-gray-900 dark:text-white">{msg.name}</p>
                                                                <p className="text-[10px] text-gray-500 lowercase">{msg.email}</p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-8 py-5">
                                                        <p className="text-xs text-gray-600 dark:text-gray-400 max-w-md line-clamp-1 italic italic-gray-500">{msg.message}</p>
                                                    </td>
                                                    <td className="px-8 py-5 whitespace-nowrap text-[11px] text-gray-500 dark:text-gray-500 font-medium">
                                                        {new Date(msg.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                                    </td>
                                                    <td className="px-8 py-5 text-right">
                                                        <button onClick={() => handleDelete(msg._id, 'messages')} className="p-2 text-gray-400 hover:text-red-500 transition-colors">
                                                            <FaTrash size={14} />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}

                            {/* Settings Tab */}
                            {activeTab === 'settings' && (
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                    <div className="lg:col-span-2 space-y-8">
                                        <div className="bg-white dark:bg-surface-dark p-8 rounded-3xl shadow-xl border border-gray-100 dark:border-neutral-800 transition-colors">
                                            <h3 className="text-xl font-bold mb-8 text-gray-900 dark:text-white flex items-center">
                                                <FaCog className="mr-3 text-primary" /> Profile Credentials
                                            </h3>
                                            <form onSubmit={handleSettingsSubmit} className="space-y-6">
                                                <div className="space-y-2">
                                                    <label className="block text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest ml-1">Email Authority</label>
                                                    <input
                                                        type="email"
                                                        placeholder="admin@example.com"
                                                        className="w-full px-4 py-3 border border-gray-200 dark:border-neutral-700 rounded-xl bg-gray-50 dark:bg-neutral-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary outline-none transition-all"
                                                        required
                                                        value={settingsForm.email}
                                                        onChange={e => setSettingsForm({ ...settingsForm, email: e.target.value })}
                                                    />
                                                </div>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-50 dark:border-neutral-800/50">
                                                    <div className="space-y-2">
                                                        <label className="block text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest ml-1">New Password</label>
                                                        <input
                                                            type="password"
                                                            placeholder="••••••••"
                                                            className="w-full px-4 py-3 border border-gray-200 dark:border-neutral-700 rounded-xl bg-gray-50 dark:bg-neutral-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary outline-none transition-all"
                                                            value={settingsForm.password}
                                                            onChange={e => setSettingsForm({ ...settingsForm, password: e.target.value })}
                                                        />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <label className="block text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest ml-1">Confirm Identity</label>
                                                        <input
                                                            type="password"
                                                            placeholder="••••••••"
                                                            className="w-full px-4 py-3 border border-gray-200 dark:border-neutral-700 rounded-xl bg-gray-50 dark:bg-neutral-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary outline-none transition-all"
                                                            value={settingsForm.confirmPassword}
                                                            onChange={e => setSettingsForm({ ...settingsForm, confirmPassword: e.target.value })}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="pt-6">
                                                    <button type="submit" className="w-full py-4 px-6 bg-primary text-white rounded-2xl hover:bg-indigo-700 transition-all font-bold shadow-lg shadow-primary/25">
                                                        Secure & Update Profile
                                                    </button>
                                                </div>
                                            </form>
                                        </div>
                                    </div>

                                    <div className="space-y-8">
                                        <div className="bg-white dark:bg-surface-dark p-8 rounded-3xl shadow-xl border border-gray-100 dark:border-neutral-800 transition-colors">
                                            <h4 className="font-bold text-gray-900 dark:text-white mb-6 text-sm">Document Assets</h4>
                                            <div className="space-y-6">
                                                <div className="p-4 rounded-2xl bg-gray-50 dark:bg-neutral-900 border border-transparent hover:border-primary/20 transition-all group">
                                                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Avatar Profile</label>
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        className="w-full text-[10px] text-gray-500 file:mr-3 file:py-1 file:px-3 file:rounded-full file:border-0 file:bg-primary/10 file:text-primary hover:file:bg-primary/20 transition-all font-medium"
                                                        onChange={e => setSettingsForm({ ...settingsForm, profileImage: e.target.files[0] })}
                                                    />
                                                </div>
                                                <div className="p-4 rounded-2xl bg-gray-50 dark:bg-neutral-900 border border-transparent hover:border-primary/20 transition-all group">
                                                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Curriculum Vitae (PDF)</label>
                                                    <input
                                                        type="file"
                                                        accept=".pdf,.doc,.docx"
                                                        className="w-full text-[10px] text-gray-500 file:mr-3 file:py-1 file:px-3 file:rounded-full file:border-0 file:bg-primary/10 file:text-primary hover:file:bg-primary/20 transition-all font-medium"
                                                        onChange={e => setSettingsForm({ ...settingsForm, resume: e.target.files[0] })}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </main>
        </div>
    );
};

export default AdminDashboard;
