import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

const Applications = () => {
    const { user } = useAuth();
    const [apps, setApps] = useState([]);
    const [remarks, setRemarks] = useState({});

    useEffect(() => {
        fetchApps();
    }, []);

    const fetchApps = async () => {
        const res = await api.get('/applications');
        setApps(res.data);
    };

    const handleAction = async (id, status) => {
        try {
            await api.patch(`/applications/${id}`, {
                status,
                remarks: remarks[id] || '',
                reviewed_by: user.name
            });
            alert(`Application ${status} successfully!`);
            fetchApps();
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to update application');
        }
    };

    return (
        <div className="page">
            <div className="card">
                <h3 className="card-title">Manage Pass Applications</h3>
                <p className="card-sub">Review and verify student payment receipts to issue passes.</p>
                
                <div className="table-wrap">
                    <table>
                        <thead>
                            <tr>
                                <th>Photo</th>
                                <th>Student</th>
                                <th>Roll No / Dept</th>
                                <th>Route</th>
                                <th>Receipt</th>
                                <th>Remarks</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {apps.map(app => (
                                <tr key={app.id}>
                                    <td>
                                        <div style={{ 
                                            width: '50px', height: '60px', background: '#f1f5f9', 
                                            borderRadius: '6px', overflow: 'hidden', border: '1px solid #e2e8f0'
                                        }}>
                                            {app.photo_url ? (
                                                <img 
                                                    src={`http://localhost:5050${app.photo_url}`} 
                                                    alt="Student" 
                                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                    onClick={() => window.open(`http://localhost:5050${app.photo_url}`, '_blank')}
                                                />
                                            ) : (
                                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', fontSize: '20px' }}>👤</div>
                                            )}
                                        </div>
                                    </td>
                                    <td>
                                        <div style={{ fontWeight: 600 }}>{app.student_name}</div>
                                        <div style={{ fontSize: '12px', color: '#666' }}>{app.id}</div>
                                    </td>
                                    <td>
                                        <div>{app.roll_no}</div>
                                        <div style={{ fontSize: '12px', color: '#666' }}>{app.dept} (Sem {app.semester})</div>
                                    </td>
                                    <td>{app.route_id}</td>
                                    <td>
                                        <div style={{ fontWeight: 600 }}>₹{app.amount}</div>
                                        <div style={{ fontSize: '11px', marginTop: '4px' }}>Ref: {app.receipt_no}</div>
                                    </td>
                                    <td>
                                        <input 
                                            type="text" 
                                            className="form-input" 
                                            style={{ padding: '6px', fontSize: '12px', minWidth: '150px' }}
                                            placeholder="Add remarks..."
                                            value={remarks[app.id] || ''}
                                            onChange={e => setRemarks({...remarks, [app.id]: e.target.value})}
                                        />
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', gap: '8px' }}>
                                            <button className="btn btn-primary" style={{ padding: '6px 12px' }} onClick={() => handleAction(app.id, 'approved')}>Approve</button>
                                            <button className="btn btn-secondary" style={{ padding: '6px 12px', color: '#dc3545' }} onClick={() => handleAction(app.id, 'rejected')}>Reject</button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {apps.length === 0 && (
                                <tr>
                                    <td colSpan="6" className="text-center">No pending applications found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Applications;
