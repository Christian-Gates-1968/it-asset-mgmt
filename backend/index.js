const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const  db = require('./db'); // DB connection exported
const assetsRouter = require('./routes/assets'); // Assets routes
const complaintsRouter = require('./routes/complaints'); // Complaints routes
const callLogsRouter = require('./routes/call-logs'); // Call logs routes
const pmReportsRouter = require('./routes/pm-reports'); // PM reports routes
const bcrypt = require('bcryptjs');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Login route
app.post('/api/login', async (req, res) => {
  const { username, password, role } = req.body;

  try {
    const [rows] = await db.query(
      'SELECT * FROM users WHERE username = ? AND user_role = ?',
      [username, role]
    );

    if (rows.length === 0) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const user = rows[0];
    const passwordMatch = await bcrypt.compare(password, user.password_hash);

    if (!passwordMatch) {
      return res.status(401).json({ success: false, message: 'Incorrect password' });
    }

    res.json({
      success: true,
      user: {
        user_id: user.user_id,
        username: user.username,
        user_role: user.user_role,
        dept_id: user.dept_id
      }
    });

  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

//  Use API routes
app.use('/api/assets', assetsRouter);
app.use('/api/complaints', complaintsRouter);
app.use('/api/call-logs', callLogsRouter);
app.use('/api/pm-reports', pmReportsRouter);

// Get all users (for engineer analytics)
app.get('/api/users', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT user_id, username, user_role, dept_id FROM users');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

//  Start the server
app.listen(5000, () => {
  console.log('✅ Backend running on http://localhost:5000');
});
