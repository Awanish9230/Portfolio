import { useState, useEffect, useContext } from 'react';
import api from '../utils/api';
import AuthContext from '../context/AuthContext';
import { useToastStore } from '../components/Toast';
import { FaPlus, FaTrash, FaEdit } from 'react-icons/fa';

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('projects');
    const [projects, setProjects] = useState([]);
    const [experiences, setExperiences] = useState([]);
    const [messages, setMessages] = useState([]);
    const { user, login } = useContext(AuthContext);
    const addToast = useToastStore((state) => state.addToast);

    // Settings State
    const [settingsForm, setSettingsForm] = useState({
        email: user?.email || '',
        password: '',
        confirmPassword: ''
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
            if (activeTab === 'projects') {
                const { data } = await api.get('/projects');
                setProjects(data);
            } else if (activeTab === 'experience') {
                const { data } = await api.get('/experience');
                setExperiences(data);
            } else if (activeTab === 'messages') {
                const { data } = await api.get('/messages');
                setMessages(data);
            }
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
            const { data } = await api.put('/admin/profile', {
                email: settingsForm.email,
                password: settingsForm.password || undefined
            });
            login(data); // update global auth context
            addToast('Profile updated successfully', 'success');
            setSettingsForm({ ...settingsForm, password: '', confirmPassword: '' });
        } catch (error) {
            addToast(error.response?.data?.message || 'Failed to update profile', 'error');
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 pt-24 pb-10 px-4">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>

                {/* Tabs */}
                <div className="flex space-x-4 mb-8 border-b border-gray-200">
                    {['projects', 'experience', 'messages', 'settings'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`pb-4 px-4 font-medium capitalize ${activeTab === tab
                                ? 'text-primary border-b-2 border-primary'
                                : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {/* Content */}
                {activeTab === 'projects' && (
                    <div>
                        <button
                            onClick={() => {
                                if (showProjectForm) resetProjectForm();
                                else setShowProjectForm(true);
                            }}
                            className={`mb-6 px-4 py-2 ${showProjectForm ? 'bg-gray-500' : 'bg-primary'} text-white rounded-md flex items-center transition-colors`}
                        >
                            {showProjectForm ? 'Cancel' : <><FaPlus className="mr-2" /> Add Project</>}
                        </button>

                        {showProjectForm && (
                            <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                                <h3 className="text-xl font-bold mb-4">{editingProject ? 'Edit Project' : 'Add New Project'}</h3>
                                <form onSubmit={handleProjectSubmit} className="space-y-4">
                                    <input type="text" placeholder="Title" className="w-full p-2 border rounded" required
                                        value={projectForm.title} onChange={e => setProjectForm({ ...projectForm, title: e.target.value })} />
                                    <input type="text" placeholder="Short Description" className="w-full p-2 border rounded" required
                                        value={projectForm.shortDescription} onChange={e => setProjectForm({ ...projectForm, shortDescription: e.target.value })} />
                                    <textarea placeholder="Full Description" className="w-full p-2 border rounded" rows="4" required
                                        value={projectForm.fullDescription} onChange={e => setProjectForm({ ...projectForm, fullDescription: e.target.value })}></textarea>
                                    <input type="text" placeholder="Technologies (comma separated)" className="w-full p-2 border rounded" required
                                        value={projectForm.technologies} onChange={e => setProjectForm({ ...projectForm, technologies: e.target.value })} />
                                    <input type="url" placeholder="GitHub Link" className="w-full p-2 border rounded"
                                        value={projectForm.githubLink} onChange={e => setProjectForm({ ...projectForm, githubLink: e.target.value })} />
                                    <input type="url" placeholder="Live Link" className="w-full p-2 border rounded"
                                        value={projectForm.liveLink} onChange={e => setProjectForm({ ...projectForm, liveLink: e.target.value })} />
                                    <input type="text" placeholder="Video URL (YouTube)" className="w-full p-2 border rounded"
                                        value={projectForm.video} onChange={e => setProjectForm({ ...projectForm, video: e.target.value })} />
                                    <div>
                                        <label className="block text-sm text-gray-600 mb-1">Images (Upload to append)</label>
                                        <input type="file" multiple accept="image/*" className="w-full p-2 border rounded"
                                            onChange={e => setProjectForm({ ...projectForm, images: e.target.files })} />
                                    </div>
                                    <div className="flex space-x-2">
                                        <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
                                            {editingProject ? 'Update Project' : 'Save Project'}
                                        </button>
                                        <button type="button" onClick={resetProjectForm} className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500">
                                            Cancel
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {projects.map(project => (
                                <div key={project._id} className="bg-white p-4 rounded shadow flex flex-col justify-between">
                                    <div>
                                        <h3 className="font-bold text-lg mb-1">{project.title}</h3>
                                        <p className="text-sm text-gray-600 truncate mb-4">{project.shortDescription}</p>
                                    </div>
                                    <div className="flex justify-end space-x-3">
                                        <button onClick={() => handleProjectEdit(project)} className="text-blue-500 hover:text-blue-700">
                                            <FaEdit size={18} />
                                        </button>
                                        <button onClick={() => handleDelete(project._id, 'projects')} className="text-red-500 hover:text-red-700">
                                            <FaTrash size={18} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'experience' && (
                    <div>
                        <button
                            onClick={() => {
                                if (showExperienceForm) resetExperienceForm();
                                else setShowExperienceForm(true);
                            }}
                            className={`mb-6 px-4 py-2 ${showExperienceForm ? 'bg-gray-500' : 'bg-primary'} text-white rounded-md flex items-center transition-colors`}
                        >
                            {showExperienceForm ? 'Cancel' : <><FaPlus className="mr-2" /> Add Experience</>}
                        </button>

                        {showExperienceForm && (
                            <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                                <h3 className="text-xl font-bold mb-4">{editingExperience ? 'Edit Experience' : 'Add New Experience'}</h3>
                                <form onSubmit={handleExperienceSubmit} className="space-y-4">
                                    <input type="text" placeholder="Title" className="w-full p-2 border rounded" required
                                        value={experienceForm.title} onChange={e => setExperienceForm({ ...experienceForm, title: e.target.value })} />
                                    <input type="text" placeholder="Organization" className="w-full p-2 border rounded" required
                                        value={experienceForm.organization} onChange={e => setExperienceForm({ ...experienceForm, organization: e.target.value })} />
                                    <textarea placeholder="Description" className="w-full p-2 border rounded" rows="3" required
                                        value={experienceForm.description} onChange={e => setExperienceForm({ ...experienceForm, description: e.target.value })}></textarea>
                                    <input type="text" placeholder="Duration (e.g. June 2023 - Present)" className="w-full p-2 border rounded" required
                                        value={experienceForm.duration} onChange={e => setExperienceForm({ ...experienceForm, duration: e.target.value })} />
                                    <select className="w-full p-2 border rounded"
                                        value={experienceForm.type} onChange={e => setExperienceForm({ ...experienceForm, type: e.target.value })}>
                                        <option value="Internship">Internship</option>
                                        <option value="Training">Training</option>
                                        <option value="Project">Project</option>
                                        <option value="Job">Job</option>
                                        <option value="Certification">Certification</option>
                                    </select>
                                    <div className="flex space-x-2">
                                        <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
                                            {editingExperience ? 'Update Experience' : 'Save Experience'}
                                        </button>
                                        <button type="button" onClick={resetExperienceForm} className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500">
                                            Cancel
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}

                        <div className="space-y-4">
                            {experiences.map(exp => (
                                <div key={exp._id} className="bg-white p-4 rounded shadow flex justify-between items-center">
                                    <div>
                                        <h3 className="font-bold text-lg">{exp.title}</h3>
                                        <p className="text-sm text-gray-600">{exp.organization}</p>
                                    </div>
                                    <div className="flex space-x-3">
                                        <button onClick={() => handleExperienceEdit(exp)} className="text-blue-500 hover:text-blue-700">
                                            <FaEdit size={18} />
                                        </button>
                                        <button onClick={() => handleDelete(exp._id, 'experience')} className="text-red-500 hover:text-red-700">
                                            <FaTrash size={18} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'messages' && (
                    <div className="bg-white rounded-lg shadow overflow-hidden">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Message</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {messages.map(msg => (
                                    <tr key={msg._id}>
                                        <td className="px-6 py-4 whitespace-nowrap">{msg.name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{msg.email}</td>
                                        <td className="px-6 py-4 max-w-xs truncate">{msg.message}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {new Date(msg.createdAt).toLocaleDateString()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {activeTab === 'settings' && (
                    <div className="bg-white p-6 rounded-lg shadow-md max-w-lg">
                        <h3 className="text-xl font-bold mb-6 text-gray-900">Admin Profile Settings</h3>
                        <form onSubmit={handleSettingsSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Update Email Address</label>
                                <input
                                    type="email"
                                    placeholder="admin@example.com"
                                    className="w-full p-2 border border-gray-300 rounded focus:ring-primary focus:border-primary"
                                    required
                                    value={settingsForm.email}
                                    onChange={e => setSettingsForm({ ...settingsForm, email: e.target.value })}
                                />
                            </div>
                            <div className="pt-4 border-t border-gray-100">
                                <label className="block text-sm font-medium text-gray-700 mb-1">New Password (leave blank to keep current)</label>
                                <input
                                    type="password"
                                    placeholder="Enter new password"
                                    className="w-full p-2 border border-gray-300 rounded focus:ring-primary focus:border-primary mb-3"
                                    value={settingsForm.password}
                                    onChange={e => setSettingsForm({ ...settingsForm, password: e.target.value })}
                                />

                                <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                                <input
                                    type="password"
                                    placeholder="Confirm new password"
                                    className="w-full p-2 border border-gray-300 rounded focus:ring-primary focus:border-primary"
                                    value={settingsForm.confirmPassword}
                                    onChange={e => setSettingsForm({ ...settingsForm, confirmPassword: e.target.value })}
                                />
                            </div>
                            <div className="pt-4">
                                <button type="submit" className="w-full py-2 px-4 bg-primary text-white rounded-md hover:bg-indigo-700 transition-colors font-medium">
                                    Update Profile
                                </button>
                            </div>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;
