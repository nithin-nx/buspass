import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pool from './db.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5050;

app.use(cors());
app.use(express.json());

// Create uploads directory if not exists
const uploadDir = path.join(__dirname, 'uploads/applications');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Static folder for uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Multer Config
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadDir),
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'photo-' + uniqueSuffix + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

// Test DB Connection on startup
(async () => {
    try {
        const connection = await pool.getConnection();
        console.log('✅ MySQL Connected successfully to "busid_plus"');
        connection.release();
    } catch (err) {
        console.error('❌ MySQL Connection Failed:');
        console.error('Message:', err.message);
        console.error('Check your .env file and ensure MySQL is running.');
        process.exit(1);
    }
})();

// --- AUTH ROUTES ---
app.post('/api/auth/login', async (req, res) => {
    const { email, password, role } = req.body;

    // Handle Static Admin Login
    const ADMIN_EMAIL = 'www.nithinnibin@gmail.com';
    const ADMIN_PASS = 'nithin@2005';

    if (email === ADMIN_EMAIL && password === ADMIN_PASS) {
        if (role && role !== 'admin') {
            return res.status(401).json({ success: false, message: 'This account is for Administrators only.' });
        }
        return res.json({ 
            success: true, 
            user: { 
                id: 'ADMIN_01', 
                name: 'Nithin N', 
                email: ADMIN_EMAIL, 
                role: 'admin',
                dept: 'ADMINISTRATION'
            } 
        });
    }

    try {
        const [users] = await pool.query('SELECT * FROM users WHERE email = ? AND password = ?', [email, password]);
        if (users.length > 0) {
            const user = users[0];
            
            // Role Separation Check
            if (role && user.role !== role) {
                return res.status(401).json({ success: false, message: `Invalid credentials for ${role} portal.` });
            }

            res.json({ 
                success: true, 
                user: { 
                    id: user.id, 
                    name: user.name, 
                    email: user.email, 
                    role: user.role,
                    roll_no: user.roll_no,
                    dept: user.dept,
                    semester: user.semester,
                    phone: user.phone,
                    avatar: user.avatar
                } 
            });
        } else {
            res.status(401).json({ success: false, message: 'Invalid email or password' });
        }
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ success: false, message: 'Database connection failed' });
    }
});

// Update profile (Settings)
app.patch('/api/users/profile', async (req, res) => {
    const { id, name, email, roll_no, dept, semester, phone } = req.body;
    try {
        await pool.query(
            'UPDATE users SET name = ?, email = ?, roll_no = ?, dept = ?, semester = ?, phone = ? WHERE id = ?',
            [name, email, roll_no, dept, semester, phone, id]
        );
        res.json({ success: true, message: 'Profile updated successfully' });
    } catch (error) {
        console.error('Profile update error:', error);
        res.status(500).json({ success: false, message: 'Failed to update profile' });
    }
});

app.post('/api/auth/register', async (req, res) => {
    const { id, name, email, password, role, roll_no, dept, semester, phone } = req.body;
    try {
        const [existing] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
        if (existing.length > 0) {
            return res.status(400).json({ success: false, message: 'Email already registered' });
        }
        await pool.query(
            'INSERT INTO users (id, name, email, password, role, roll_no, dept, semester, phone) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [
                id, 
                name, 
                email, 
                password, 
                role || 'student', 
                roll_no || null, 
                dept || null, 
                semester || null, 
                phone || null
            ]
        );
        res.status(201).json({ success: true, message: 'Registration successful' });
    } catch (error) {
        console.error('Registration error details:', error);
        res.status(500).json({ success: false, message: 'Registration failed: ' + error.message });
    }
});

// --- ROUTE MANAGEMENT ---
app.get('/api/routes', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM routes');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch routes' });
    }
});

app.post('/api/routes', async (req, res) => {
    const { id, name, stops, fare, distance } = req.body;
    try {
        await pool.query('INSERT INTO routes (id, name, stops, fare, distance) VALUES (?, ?, ?, ?, ?)', [id, name, stops, fare, distance]);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to add route' });
    }
});

app.delete('/api/routes/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('DELETE FROM routes WHERE id = ?', [id]);
        res.json({ success: true, message: 'Route deleted successfully' });
    } catch (error) {
        console.error('Route deletion error:', error);
        res.status(500).json({ success: false, message: 'Failed to delete route. It might be in use by applications/passes.' });
    }
});

// --- APPLICATION MANAGEMENT ---
app.get('/api/applications', async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT a.*, r.name as route_name 
            FROM applications a 
            JOIN routes r ON a.route_id = r.id 
            WHERE a.status = 'pending'
            ORDER BY a.applied_at DESC
        `);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch applications' });
    }
});

app.post('/api/applications', upload.single('photo'), async (req, res) => {
    const { student_id, student_name, roll_no, dept, route_id, semester, phone, amount, receipt_no } = req.body;
    const photo_url = req.file ? `/uploads/applications/${req.file.filename}` : null;
    const id = 'APP' + Math.random().toString(36).substr(2, 6).toUpperCase();
    
    try {
        await pool.query(
            'INSERT INTO applications (id, student_id, student_name, roll_no, dept, route_id, receipt_no, amount, semester, phone, photo_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [id, student_id, student_name, roll_no, dept, route_id, receipt_no, amount, semester, phone, photo_url]
        );
        res.json({ success: true, id });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Application failed: ' + error.message });
    }
});

app.patch('/api/applications/:id', async (req, res) => {
    const { status, remarks, reviewed_by } = req.body;
    const { id } = req.params;
    try {
        await pool.query(
            'UPDATE applications SET status = ?, remarks = ?, reviewed_at = CURRENT_TIMESTAMP, reviewed_by = ? WHERE id = ?',
            [status, remarks, reviewed_by, id]
        );
        // If approved, create a pass automatically
        if (status === 'approved') {
            try {
                // Check if already approved to prevent duplicates
                const [existing] = await pool.query('SELECT * FROM passes WHERE app_id = ?', [id]);
                if (existing.length > 0) {
                    return res.json({ success: true, message: 'Pass already issued' });
                }

                const [appRows] = await pool.query('SELECT * FROM applications WHERE id = ?', [id]);
                const app = appRows[0];
                const passId = 'PASS' + Math.random().toString(36).substr(2, 8).toUpperCase();
                await pool.query(
                    'INSERT INTO passes (id, app_id, student_id, student_name, roll_no, dept, route_id, valid_from, valid_to, photo_url) VALUES (?, ?, ?, ?, ?, ?, ?, CURDATE(), DATE_ADD(CURDATE(), INTERVAL 6 MONTH), ?)',
                    [passId, id, app.student_id, app.student_name, app.roll_no, app.dept, app.route_id, app.photo_url]
                );
                
                // Add notification (Optional, fail-safe)
                try {
                    await pool.query(
                        'INSERT INTO notifications (user_id, title, message, type) VALUES (?, ?, ?, ?)',
                        [app.student_id, 'Pass Approved!', `Your bus pass (${passId}) has been issued. View it in 'My Pass'.`, 'success']
                    );
                } catch (nErr) { console.warn('Notification failed:', nErr.message); }

            } catch (pErr) {
                console.error('Pass creation failed:', pErr);
                return res.status(500).json({ success: false, message: 'Approve succeeded but Pass creation failed: ' + pErr.message });
            }
        } else if (status === 'rejected') {
            try {
                const [appRows] = await pool.query('SELECT * FROM applications WHERE id = ?', [id]);
                const app = appRows[0];
                await pool.query(
                    'INSERT INTO notifications (user_id, title, message, type) VALUES (?, ?, ?, ?)',
                    [app.student_id, 'Application Rejected', `Reason: ${remarks}`, 'danger']
                );
            } catch (nErr) { console.warn('Notification failed:', nErr.message); }
        }
        res.json({ success: true });
    } catch (error) {
        console.error('Update Application error details:', error);
        res.status(500).json({ success: false, message: 'Update failed: ' + error.message });
    }
});

// --- PASSES ---
app.get('/api/public/verify/:passId', async (req, res) => {
    const { passId } = req.params;
    try {
        const [rows] = await pool.query(`
            SELECT p.*, r.name as route_name, r.stops as route_stops 
            FROM passes p 
            JOIN routes r ON p.route_id = r.id 
            WHERE p.id = ?
        `, [passId]);
        
        if (rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Invalid or expired pass' });
        }
        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ success: false, message: 'Verification failed' });
    }
});

app.get('/api/passes', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM passes ORDER BY issued_at DESC');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch all passes' });
    }
});

app.get('/api/passes/:studentId', async (req, res) => {
    const { studentId } = req.params;
    try {
        const [rows] = await pool.query('SELECT * FROM passes WHERE student_id = ? ORDER BY issued_at DESC', [studentId]);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch student passes' });
    }
});

// --- SCAN PASS ---
app.post('/api/passes/scan', async (req, res) => {
    const { passId } = req.body;
    try {
        const [passRows] = await pool.query('SELECT * FROM passes WHERE id = ? AND status = "active"', [passId]);
        if (passRows.length === 0) {
            return res.status(404).json({ success: false, message: 'Invalid or Inactive Pass' });
        }
        
        const pass = passRows[0];
        if (pass.trips_remaining <= 0) {
            return res.status(400).json({ success: false, message: 'No trips remaining! Please recharge.' });
        }

        // Deduct trip and log attendance
        await pool.query('UPDATE passes SET trips_remaining = trips_remaining - 1, verify_count = verify_count + 1 WHERE id = ?', [passId]);
        await pool.query(
            'INSERT INTO attendance (pass_id, student_id, route_id) VALUES (?, ?, ?)',
            [passId, pass.student_id, pass.route_id]
        );

        res.json({ 
            success: true, 
            message: 'Pass Validated! Attendance marked.',
            pass: {
                student_name: pass.student_name,
                roll_no: pass.roll_no,
                trips_left: pass.trips_remaining - 1
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Scanning failed' });
    }
});

// --- ANALYTICS ---
app.get('/api/admin/analytics', async (req, res) => {
    try {
        const [totalApps] = await pool.query('SELECT COUNT(*) as count FROM applications');
        const [activePasses] = await pool.query('SELECT COUNT(*) as count FROM passes WHERE status = "active"');
        const [revenue] = await pool.query('SELECT SUM(amount) as total FROM applications WHERE status = "approved"');
        const [routeDist] = await pool.query('SELECT r.name, COUNT(p.id) as count FROM routes r LEFT JOIN passes p ON r.id = p.route_id GROUP BY r.id');
        
        res.json({
            stats: {
                totalApplications: totalApps[0].count,
                activePasses: activePasses[0].count,
                totalRevenue: revenue[0].total || 0
            },
            routeDistribution: routeDist
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch analytics' });
    }
});

app.get('/api/admin/users', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT id, name, email, role, dept, roll_no, created_at FROM users');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch users' });
    }
});

app.patch('/api/admin/users/:id/role', async (req, res) => {
    const { id } = req.params;
    const { role } = req.body;
    try {
        await pool.query('UPDATE users SET role = ? WHERE id = ?', [role, id]);
        res.json({ success: true, message: `User role updated to ${role}` });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to update user role' });
    }
});

// --- NOTIFICATIONS ---
app.get('/api/notifications/:userId', async (req, res) => {
    const { userId } = req.params;
    try {
        const [rows] = await pool.query('SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC', [userId]);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ success: false });
    }
});

// --- SETTINGS ---
app.get('/api/admin/settings', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM settings');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ success: false });
    }
});

app.post('/api/admin/settings', async (req, res) => {
    const { key, value } = req.body;
    try {
        await pool.query('REPLACE INTO settings (setting_key, setting_value) VALUES (?, ?)', [key, value]);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ success: false });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 BusID+ Server running on port ${PORT}`);
}).on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.error(`❌ Port ${PORT} is already in use.`);
    } else {
        console.error('❌ Server Error:', err);
    }
    process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});
