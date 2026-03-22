import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';

const Topbar = () => {
    const { user } = useAuth();
    const [notifCount, setNotifCount] = useState(0);

    useEffect(() => {
        const fetchNotifs = async () => {
            try {
                const res = await api.get(`/notifications/${user.id}`);
                setNotifCount(res.data.filter(n => !n.is_read).length);
            } catch (err) {
                console.error('Failed to fetch notifications');
            }
        };
        fetchNotifs();
    }, [user.id]);

    return (
        <div className="topbar">
            <div className="topbar-title">BusID<span style={{ color: 'var(--primary)' }}>+</span> Portal</div>
            <div className="topbar-actions">
                <div className="icon-btn" style={{ 
                    position: 'relative', border: '1px solid var(--border)', background: 'white',
                    padding: '10px', borderRadius: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center'
                }}>
                    <span style={{ fontSize: '18px' }}>🔔</span>
                    {notifCount > 0 && <div className="notif-dot" style={{ 
                        position: 'absolute', top: '8px', right: '8px', 
                        width: '10px', height: '10px', background: 'var(--danger)', 
                        borderRadius: '50%', border: '2px solid white'
                    }}></div>}
                </div>
                <div className="user-profile-sm" style={{ 
                    display: 'flex', alignItems: 'center', gap: '12px', 
                    padding: '8px 16px', background: '#f8fafc', borderRadius: '14px', border: '1px solid var(--border)'
                }}>
                    <div style={{ 
                        width: '32px', height: '32px', background: 'var(--bg-gradient)', 
                        borderRadius: '10px', display: 'flex', alignItems: 'center', 
                        justifyContent: 'center', color: 'white', fontWeight: '800', fontSize: '13px'
                    }}>
                        {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <div style={{ fontWeight: 700, fontSize: '14px', color: '#1e293b' }}>{user.name}</div>
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>{user.role}</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Topbar;
