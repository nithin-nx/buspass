import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

const Settings = () => {
    const { user, login } = useAuth();
    const [formData, setFormData] = useState({
        id: user.id,
        name: user.name || '',
        email: user.email || '',
        roll_no: user.roll_no || '',
        dept: user.dept || '',
        semester: user.semester || '',
        phone: user.phone || ''
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ type: '', text: '' });

        try {
            const res = await api.patch('/users/profile', formData);
            if (res.data.success) {
                // Update local context
                login({ ...user, ...formData });
                setMessage({ type: 'success', text: 'Profile updated successfully!' });
            }
        } catch (err) {
            setMessage({ type: 'danger', text: err.response?.data?.message || 'Update failed' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="page">
            <div className="card" style={{ maxWidth: '800px', margin: '0 auto' }}>
                <h2 className="card-title">Profile Settings</h2>
                <p className="card-sub">
                    {user.role === 'admin' 
                        ? 'Update your administrative profile and contact details.' 
                        : 'Update your personal information and student details.'}
                </p>

                {message.text && (
                    <div className={`alert alert-${message.type}`} style={{ marginBottom: '20px' }}>
                        {message.text}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="grid-2">
                        <div className="form-group">
                            <label className="form-label">Full Name</label>
                            <input 
                                type="text" 
                                name="name" 
                                className="form-input" 
                                value={formData.name}
                                onChange={handleChange}
                                required 
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Email Address</label>
                            <input 
                                type="email" 
                                name="email" 
                                className="form-input" 
                                value={formData.email}
                                onChange={handleChange}
                                required 
                            />
                        </div>
                    </div>

                    <div className="grid-2">
                        <div className="form-group">
                            <label className="form-label">{user.role === 'admin' ? 'Designation' : 'Roll Number'}</label>
                            <input 
                                type="text" 
                                name="roll_no" 
                                className="form-input" 
                                value={formData.roll_no}
                                onChange={handleChange}
                                placeholder={user.role === 'admin' ? "e.g. System Administrator" : "Student Roll Number"}
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Mobile Number</label>
                            <input 
                                type="text" 
                                name="phone" 
                                className="form-input" 
                                value={formData.phone}
                                onChange={handleChange}
                                required 
                            />
                        </div>
                    </div>

                    <div className="grid-2">
                        <div className="form-group">
                            <label className="form-label">Department</label>
                            <input 
                                type="text" 
                                name="dept" 
                                className="form-input" 
                                value={formData.dept}
                                onChange={handleChange}
                                placeholder={user.role === 'admin' ? "e.g. Administration" : "e.g. Computer Science"}
                            />
                        </div>
                        {user.role === 'student' && (
                            <div className="form-group">
                                <label className="form-label">Semester</label>
                                <input 
                                    type="text" 
                                    name="semester" 
                                    className="form-input" 
                                    value={formData.semester}
                                    onChange={handleChange}
                                />
                            </div>
                        )}
                    </div>

                    <div className="separator" style={{ margin: '30px 0' }}></div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <button 
                            type="submit" 
                            className="btn btn-primary" 
                            disabled={loading}
                            style={{ padding: '12px 30px' }}
                        >
                            {loading ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Settings;
