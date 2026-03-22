import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

const Apply = () => {
    const { user } = useAuth();
    const [routes, setRoutes] = useState([]);
    const [status, setStatus] = useState('');
    const [photo, setPhoto] = useState(null);
    const [photoPreview, setPhotoPreview] = useState(null);
    const [formData, setFormData] = useState({
        route_id: '',
        receipt_no: '',
        semester: '5'
    });

    const [hasActivePass, setHasActivePass] = useState(false);
    const [isPending, setIsPending] = useState(false);

    useEffect(() => {
        const checkStatus = async () => {
            try {
                const routesRes = await api.get('/routes');
                setRoutes(routesRes.data);

                const passesRes = await api.get(`/passes/${user.id}`);
                const active = passesRes.data.some(p => p.status === 'active');
                setHasActivePass(active);

                const appsRes = await api.get('/applications');
                const pending = appsRes.data.some(a => a.student_id === user.id && a.status === 'pending');
                setIsPending(pending);
            } catch (err) {
                console.error('Status check failed');
            }
        };
        checkStatus();
    }, [user.id]);

    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setPhoto(file);
            setPhotoPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const selectedRoute = routes.find(r => r.id === formData.route_id);
        
        const data = new FormData();
        data.append('student_id', user.id);
        data.append('student_name', user.name);
        data.append('roll_no', user.roll_no || 'NOT_SET');
        data.append('dept', user.dept || 'NOT_SET');
        data.append('route_id', formData.route_id);
        data.append('semester', formData.semester);
        data.append('phone', user.phone || '0000000000');
        data.append('amount', selectedRoute ? selectedRoute.fare : 0);
        data.append('receipt_no', formData.receipt_no);
        if (photo) {
            data.append('photo', photo);
        }

        try {
            await api.post('/applications', data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setStatus('Application submitted successfully!');
        } catch (err) {
            setStatus('Failed to submit application: ' + (err.response?.data?.message || err.message));
        }
    };

    return (
        <div className="page">
            <div className="card">
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                    <div style={{ fontSize: '32px' }}>📝</div>
                    <div>
                        <h3 className="card-title">Apply for Bus Pass</h3>
                        <p className="card-sub">Choose your route and provide payment details.</p>
                    </div>
                </div>
                
                {status && <div className={`alert ${status.includes('success') ? 'alert-success' : 'alert-danger'}`}>{status}</div>}
                
                {(hasActivePass || isPending) && (
                    <div className="alert alert-warning" style={{ background: '#fff9db', color: '#856404', border: '1px solid #ffeeba' }}>
                        {hasActivePass 
                            ? "You already have an active bus pass. Duplicate applications are not allowed for the same semester." 
                            : "Your bus pass application is currently under review. Please wait for admin approval."}
                    </div>
                )}

                <form className="mt-4" onSubmit={handleSubmit} style={{ opacity: (hasActivePass || isPending) ? 0.6 : 1, pointerEvents: (hasActivePass || isPending) ? 'none' : 'auto' }}>
                    <div style={{ display: 'flex', gap: '24px', marginBottom: '24px', alignItems: 'flex-start' }}>
                        <div style={{ flex: '0 0 150px' }}>
                            <label className="form-label">Profile Photo</label>
                            <div 
                                onClick={() => document.getElementById('photo-upload').click()}
                                style={{ 
                                    width: '150px', height: '180px', border: '2px dashed var(--border)', 
                                    borderRadius: '12px', display: 'flex', alignItems: 'center', 
                                    justifyContent: 'center', cursor: 'pointer', overflow: 'hidden',
                                    background: '#f8fafc', position: 'relative'
                                }}
                            >
                                {photoPreview ? (
                                    <img src={photoPreview} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                ) : (
                                    <div style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
                                        <div style={{ fontSize: '24px' }}>📷</div>
                                        <div style={{ fontSize: '12px', marginTop: '4px' }}>Upload Photo</div>
                                    </div>
                                )}
                                <input id="photo-upload" type="file" hidden accept="image/*" onChange={handlePhotoChange} required />
                            </div>
                        </div>
                        
                        <div style={{ flex: 1 }}>
                            <div className="form-group">
                                <label className="form-label">Select Preferred Route</label>
                                <select className="form-input" style={{ height: '50px' }} onChange={e => setFormData({...formData, route_id: e.target.value})} required>
                                    <option value="">-- Choose a Route --</option>
                                    {routes.map(r => (
                                        <option key={r.id} value={r.id}>{r.name} - ₹{r.fare}</option>
                                    ))}
                                </select>
                            </div>
                            
                            <div className="grid-2">
                                <div className="form-group">
                                    <label className="form-label">Academic Semester</label>
                                    <input type="text" className="form-input" value={formData.semester} onChange={e => setFormData({...formData, semester: e.target.value})} required />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Fee Receipt Number</label>
                                    <input type="text" className="form-input" placeholder="e.g. REC-2024-XXXX" onChange={e => setFormData({...formData, receipt_no: e.target.value})} required />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="alert alert-success" style={{ backgroundColor: '#e7f1ff', color: '#0056b3', border: '1px dashed #0056b3' }}>
                        <strong>Note:</strong> Please ensure the receipt number and photo are clear for faster approval.
                    </div>

                    <button type="submit" className="btn btn-primary w-full" style={{ padding: '16px' }}>Submit Pass Application</button>
                </form>
            </div>
        </div>
    );
};

export default Apply;
