import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Apply from './pages/Apply';
import Applications from './pages/Applications';
import Passes from './pages/Passes';
import Verify from './pages/Verify';
import Register from './pages/Register';
import RegisterAdmin from './pages/RegisterAdmin';
import ManageRoutes from './pages/ManageRoutes';
import ApprovedStudents from './pages/ApprovedStudents';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import Landing from './pages/Landing';
import PublicVerify from './pages/PublicVerify';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import './index.css';

const ProtectedRoute = ({ children }) => {
    const { user, loading } = useAuth();
    if (loading) return <div>Loading...</div>;
    if (!user) return <Navigate to="/login" />;
    return children;
};

function App() {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    <Route path="/" element={<Landing />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/register-admin" element={<RegisterAdmin />} />
                    <Route path="/verify-pass/:passId" element={<PublicVerify />} />
                    <Route 
                        path="/*" 
                        element={
                            <ProtectedRoute>
                                <div className="app">
                                    <Sidebar />
                                    <div className="main-content">
                                        <Topbar />
                                        <div className="page">
                                            <Routes>
                                                <Route path="/dashboard" element={<Dashboard />} />
                                                <Route path="/apply" element={<Apply />} />
                                                <Route path="/applications" element={<Applications />} />
                                                <Route path="/routes" element={<ManageRoutes />} />
                                                <Route path="/users" element={<ApprovedStudents />} />
                                                <Route path="/profile" element={<Profile />} />
                                                <Route path="/settings" element={<Settings />} />
                                                <Route path="/passes" element={<Passes />} />
                                                <Route path="/verify" element={<Verify />} />
                                                <Route path="*" element={<Navigate to="/dashboard" />} />
                                            </Routes>
                                        </div>
                                    </div>
                                </div>
                            </ProtectedRoute>
                        } 
                    />
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;
