import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const res = await api.post('/auth/login', { email, password });
            if (res.data.success) {
                login(res.data.user);
                navigate('/dashboard');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed');
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-card">
                <div className="auth-logo">
                    <div style={{ 
                        width: '70px', height: '70px', background: 'var(--primary)', color: 'white', 
                        borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', 
                        margin: '0 auto 20px', boxShadow: '0 8px 16px rgba(0, 86, 179, 0.2)'
                    }}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M4 17h1" />
                            <path d="M8 17h8" />
                            <path d="M19 17h1" />
                            <path d="M16 6H4a2 2 0 0 0-2 2v7h1" />
                            <path d="M16 6h2s1.5.5 2.5 1.5S22 10 22 12v3h-1" />
                            <circle cx="6.5" cy="17" r="2.5" />
                            <circle cx="17.5" cy="17" r="2.5" />
                            <path d="M7 6v6" />
                            <path d="M11 6v6" />
                            <path d="M15 6v6" />
                            <path d="M2 11h20" />
                        </svg>
                    </div>
                    <h2 className="auth-title">BusID+ Portal</h2>
                    <p style={{ color: 'var(--text-muted)', marginTop: '8px' }}>Manage your transit identity</p>
                </div>

                {error && <div className="alert alert-danger">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">Email Address</label>
                        <input 
                            type="email" 
                            className="form-input" 
                            placeholder="your.email@college.edu" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required 
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Password</label>
                        <input 
                            type="password" 
                            className="form-input" 
                            placeholder="••••••••" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required 
                        />
                    </div>
                    <button type="submit" className="btn btn-primary w-full" style={{ padding: '14px' }}>Sign In</button>
                </form>

                <div className="separator" style={{ margin: '32px 0' }}></div>
                
                <div className="text-center">
                    <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '16px' }}>Need a new account?</p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <Link to="/register" className="btn btn-secondary w-full" style={{ textDecoration: 'none' }}>
                            Register Student Account
                        </Link>
                        <Link to="/register-admin" className="btn btn-outline-secondary w-full" style={{ textDecoration: 'none' }}>
                            Admin Registration
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
