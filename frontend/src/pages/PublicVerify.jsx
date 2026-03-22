import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../utils/api';

const PublicVerify = () => {
    const { passId } = useParams();
    const [pass, setPass] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchPassDetails = async () => {
            try {
                const res = await api.get(`/public/verify/${passId}`);
                setPass(res.data);
            } catch (err) {
                setError('Invalid or expired bus pass.');
            } finally {
                setLoading(false);
            }
        };
        fetchPassDetails();
    }, [passId]);

    if (loading) return (
        <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-gradient)' }}>
            <div className="loader" style={{ color: 'white', fontSize: '20px' }}>Verifying Pass...</div>
        </div>
    );

    if (error) return (
        <div style={{ display: 'flex', height: '100vh', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-gradient)', padding: '20px' }}>
            <div className="card" style={{ maxWidth: '400px', textAlign: 'center', padding: '40px' }}>
                <div style={{ fontSize: '64px', marginBottom: '20px' }}>❌</div>
                <h2 style={{ color: '#dc3545', marginBottom: '10px' }}>Verification Failed</h2>
                <p style={{ color: 'var(--text-muted)' }}>{error}</p>
                <Link to="/" className="btn btn-primary" style={{ marginTop: '30px', textDecoration: 'none' }}>Back to Home</Link>
            </div>
        </div>
    );

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg-gradient)', padding: '40px 20px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <div className="card" style={{ maxWidth: '450px', width: '100%', padding: '0', overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)' }}>
                <div style={{ background: 'var(--primary)', padding: '30px', textAlign: 'center', color: 'white' }}>
                    <div style={{ fontSize: '14px', fontWeight: '600', opacity: 0.8, letterSpacing: '2px', marginBottom: '8px' }}>OFFICIAL VERIFICATION</div>
                    <h2 style={{ fontSize: '24px', fontWeight: '800' }}>Valid Bus Pass</h2>
                </div>

                <div style={{ padding: '30px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '30px' }}>
                        <div style={{ 
                            width: '120px', height: '150px', borderRadius: '12px', overflow: 'hidden', 
                            border: '4px solid white', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
                            marginBottom: '16px', background: '#f1f5f9'
                        }}>
                            {pass.photo_url ? (
                                <img src={`http://localhost:5050${pass.photo_url}`} alt="Student" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            ) : (
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', fontSize: '50px' }}>👤</div>
                            )}
                        </div>
                        <h3 style={{ fontSize: '22px', fontWeight: '700', color: 'var(--primary)' }}>{pass.student_name}</h3>
                        <p style={{ color: 'var(--text-muted)', fontWeight: '500' }}>{pass.roll_no} • {pass.dept}</p>
                    </div>

                    <div style={{ background: '#f8fafc', borderRadius: '12px', padding: '20px', marginBottom: '30px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                            <span style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Status</span>
                            <span style={{ color: '#28a745', fontWeight: '700', fontSize: '14px' }}>● APPROVED</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                            <span style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Route</span>
                            <span style={{ color: 'var(--text-dark)', fontWeight: '600', fontSize: '14px' }}>{pass.route_name}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                            <span style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Validity</span>
                            <span style={{ color: 'var(--text-dark)', fontWeight: '600', fontSize: '14px' }}>{new Date(pass.valid_from).toLocaleDateString()} - {new Date(pass.valid_to).toLocaleDateString()}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Pass ID</span>
                            <span style={{ color: 'var(--text-dark)', fontWeight: '600', fontSize: '14px' }}>{pass.id}</span>
                        </div>
                    </div>

                    <div style={{ textAlign: 'center', borderTop: '1px dashed #cbd5e1', paddingTop: '20px' }}>
                        <div style={{ fontFamily: '"Brush Script MT", cursive', fontSize: '28px', color: '#0d3270', marginBottom: '4px' }}>
                            Nithin N
                        </div>
                        <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '600', letterSpacing: '1px' }}>
                            DIGITALLY SIGNED BY ADMINISTRATOR
                        </div>
                        <div style={{ fontSize: '10px', color: '#94a3b8', marginTop: '8px' }}>
                            Verified on {new Date().toLocaleString()}
                        </div>
                    </div>
                </div>

                <div style={{ background: '#f1f5f9', padding: '15px', textAlign: 'center' }}>
                    <Link to="/" style={{ color: 'var(--primary)', textDecoration: 'none', fontSize: '14px', fontWeight: '600' }}>
                        Visit BusID+ Official Portal
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default PublicVerify;
