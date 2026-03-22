import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import { QRCodeSVG } from 'qrcode.react';

const Passes = () => {
    const { user } = useAuth();
    const [passes, setPasses] = useState([]);

    useEffect(() => {
        fetchPasses();
    }, []);

    const fetchPasses = async () => {
        const endpoint = user.role === 'admin' 
            ? '/passes' 
            : `/passes/${user.id}`;
        
        try {
            const res = await api.get(endpoint);
            setPasses(res.data);
        } catch (err) {
            console.error('Failed to fetch passes');
        }
    };

    return (
        <div className="page">
            <div className="card">
                <h3 className="card-title">{user.role === 'admin' ? 'Recent Passes' : 'My Digital Bus Pass'}</h3>
                <p className="card-sub">Your official transit identity for the academic year.</p>
                
                <div className="grid-2 mt-4" style={{ gap: '30px' }}>
                    {passes.length > 0 ? passes.map(pass => (
                        <div key={pass.id} className="bus-pass" style={{ 
                            background: 'white', borderRadius: '24px', overflow: 'hidden', padding: '0',
                            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)', border: '1px solid #e2e8f0',
                            maxWidth: '400px'
                        }}>
                            <div className="pass-header" style={{ background: 'var(--primary)', padding: '20px', textAlign: 'center' }}>
                                <div className="pass-college" style={{ color: 'white', fontWeight: '800', letterSpacing: '2px', fontSize: '14px' }}>BUSID+ DIGITAL PASS</div>
                            </div>
                            
                            <div className="pass-body" style={{ padding: '25px' }}>
                                <div style={{ display: 'flex', gap: '20px', marginBottom: '25px', alignItems: 'center' }}>
                                    <div style={{ 
                                        width: '100px', height: '120px', borderRadius: '12px', overflow: 'hidden', 
                                        border: '3px solid #f1f5f9', background: '#f8fafc'
                                    }}>
                                        {pass.photo_url ? (
                                            <img src={`http://localhost:5050${pass.photo_url}`} alt="Student" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        ) : (
                                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', fontSize: '40px' }}>👤</div>
                                        )}
                                    </div>
                                    <div className="pass-qr" style={{ padding: '8px', background: 'white', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                                        <QRCodeSVG value={window.location.origin + '/verify-pass/' + pass.id} size={100} />
                                    </div>
                                </div>

                                <div style={{ marginBottom: '20px' }}>
                                    <h2 className="pass-name" style={{ fontSize: '24px', margin: '0', color: 'var(--text-dark)' }}>{pass.student_name}</h2>
                                    <p style={{ margin: '4px 0 0', color: 'var(--text-muted)', fontWeight: '600' }}>{pass.roll_no} • {pass.dept}</p>
                                </div>

                                <div style={{ background: '#f8fafc', borderRadius: '12px', padding: '16px' }}>
                                    <div className="pass-details-row" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                        <span className="pass-label" style={{ color: 'var(--text-muted)', fontSize: '12px' }}>Pass ID</span>
                                        <span className="pass-value" style={{ fontWeight: '700', fontSize: '12px' }}>{pass.id}</span>
                                    </div>
                                    <div className="pass-details-row" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                        <span className="pass-label" style={{ color: 'var(--text-muted)', fontSize: '12px' }}>Route</span>
                                        <span className="pass-value" style={{ fontWeight: '700', fontSize: '12px' }}>{pass.route_id}</span>
                                    </div>
                                    <div className="pass-details-row" style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <span className="pass-label" style={{ color: 'var(--text-muted)', fontSize: '12px' }}>Valid Until</span>
                                        <span className="pass-value" style={{ fontWeight: '700', fontSize: '12px' }}>{new Date(pass.valid_to).toLocaleDateString()}</span>
                                    </div>
                                </div>

                                <div style={{ marginTop: '20px', textAlign: 'center', borderTop: '1px dashed #e2e8f0', paddingTop: '15px' }}>
                                    <div style={{ fontFamily: '"Brush Script MT", cursive', fontSize: '24px', color: '#0d3270' }}>Nithin N</div>
                                    <div style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: '700', letterSpacing: '1px' }}>ADMINISTRATIVE SIGNATURE</div>
                                </div>
                            </div>
                            <div style={{ background: '#28a745', height: '10px' }}></div>
                        </div>
                    )) : (
                        <div className="text-muted">No active passes found.</div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Passes;
