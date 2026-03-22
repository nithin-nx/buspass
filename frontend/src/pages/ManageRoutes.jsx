import React, { useState, useEffect } from 'react';
import api from '../utils/api';

const ManageRoutes = () => {
    const [routes, setRoutes] = useState([]);
    const [newRoute, setNewRoute] = useState({ id: '', name: '', stops: '', fare: '', distance: '' });

    useEffect(() => {
        fetchRoutes();
    }, []);

    const fetchRoutes = async () => {
        const res = await api.get('/routes');
        setRoutes(res.data);
    };

    const handleAdd = async (e) => {
        e.preventDefault();
        try {
            await api.post('/routes', newRoute);
            fetchRoutes();
            setNewRoute({ id: '', name: '', stops: '', fare: '', distance: '' });
        } catch (err) {
            alert('Failed to add route');
        }
    };

    return (
        <div className="page">
            <div className="card">
                <h3 className="card-title">Bus Route Management</h3>
                <p className="card-sub">Create and manage routes, stops, and fare details.</p>
                
                <form className="mt-4 mb-4" onSubmit={handleAdd}>
                    <div className="grid-2">
                        <div className="form-group">
                            <label className="form-label">Route ID</label>
                            <input type="text" placeholder="e.g. R06" className="form-input" value={newRoute.id} onChange={e => setNewRoute({...newRoute, id: e.target.value})} required />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Route Name</label>
                            <input type="text" placeholder="e.g. Downtown Express" className="form-input" value={newRoute.name} onChange={e => setNewRoute({...newRoute, name: e.target.value})} required />
                        </div>
                    </div>
                    <div className="form-group">
                        <label className="form-label">Stops (Comma separated)</label>
                        <input type="text" placeholder="Stop A, Stop B, Stop C" className="form-input" value={newRoute.stops} onChange={e => setNewRoute({...newRoute, stops: e.target.value})} required />
                    </div>
                    <div className="grid-2">
                        <div className="form-group">
                            <label className="form-label">Fare (₹)</label>
                            <input type="number" placeholder="50" className="form-input" value={newRoute.fare} onChange={e => setNewRoute({...newRoute, fare: e.target.value})} required />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Total Distance</label>
                            <input type="text" placeholder="15 KM" className="form-input" value={newRoute.distance} onChange={e => setNewRoute({...newRoute, distance: e.target.value})} required />
                        </div>
                    </div>
                    <button type="submit" className="btn btn-primary w-full">Add New Route</button>
                </form>

                <div className="separator"></div>

                <div className="table-wrap">
                    <table>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Stops</th>
                                <th>Fare</th>
                                <th>Distance</th>
                            </tr>
                        </thead>
                        <tbody>
                            {routes.map(route => (
                                <tr key={route.id}>
                                    <td><div style={{ fontWeight: 600 }}>{route.id}</div></td>
                                    <td>{route.name}</td>
                                    <td><div style={{ fontSize: '12px', color: '#666' }}>{route.stops}</div></td>
                                    <td><div className="badge badge-success" style={{ backgroundColor: '#e7f1ff', color: '#0056b3' }}>₹{route.fare}</div></td>
                                    <td>{route.distance}</td>
                                    <td>
                                        <button 
                                            className="btn btn-secondary" 
                                            style={{ padding: '6px 12px', fontSize: '12px', color: '#dc3545', border: '1px solid #ffccd1' }}
                                            onClick={async () => {
                                                if(window.confirm(`Are you sure you want to delete route ${route.name}?`)) {
                                                    try {
                                                        await api.delete(`/routes/${route.id}`);
                                                        fetchRoutes();
                                                    } catch (err) {
                                                        alert(err.response?.data?.message || 'Failed to delete route');
                                                    }
                                                }
                                            }}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ManageRoutes;
