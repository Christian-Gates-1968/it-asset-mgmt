const express = require('express');
const router = express.Router();
const  db = require('../db');
console.log('check db routes at load time:', db);

// GET all complaints (with asset name and user info if needed)
router.get('/', async (req, res) => {
  const { user_role, dept_id } = req.query;
  
  try {
    let query = `SELECT c.comp_id, 
              c.asset_id, 
              a.asset_name,
              c.raised_by,
              u.username AS reported_by,
              c.issue,
              c.comp_status,
              c.priority,
              c.creation_time,
              c.eng_assigned,
              ua.username AS assigned_to,
              c.expected_res_date,
              c.spare_req,
              c.total_time_taken,
              c.actual_res_date,
              c.comp_type,
              c.updated_at
       FROM complaints c
       JOIN assets a ON c.asset_id = a.asset_id
       JOIN users u ON c.raised_by = u.user_id
       LEFT JOIN users ua ON c.eng_assigned = ua.user_id`;
    
    const params = [];
    
    // Filter by department for Engineers
    if (user_role === 'Engineer' && dept_id) {
      query += ' WHERE a.dept_id = ?';
      params.push(dept_id);
    }
    
    const [rows] = await db.query(query, params);

    res.json(rows);
  } catch (error) {
    console.error('Error fetching complaints:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// POST - Add new complaint
router.post('/', async (req, res) => {
  const {
    asset_id,
    raised_by,
    issue,
    comp_status = 'Open',
    priority = 'Medium',
    eng_assigned,
    expected_res_date,
    spare_req,
    total_time_taken,
    actual_res_date,
    comp_type
  } = req.body;

  try {
    const [result] = await db.query(
      `INSERT INTO complaints 
        (asset_id, raised_by, issue, comp_status, priority ,creation_time, eng_assigned, expected_res_date, spare_req, total_time_taken, actual_res_date, comp_type, updated_at)
       VALUES (?, ?, ?, ?,?, NOW(), ?, ?, ?, ?, ?, ?, NOW())`,
      [
        asset_id,
        raised_by,
        issue,
        comp_status,
        priority,
        eng_assigned,
        expected_res_date,
        spare_req,
        total_time_taken,
        actual_res_date,
        comp_type
      ]
    );
    res.json({ message: 'Complaint added', comp_id: result.insertId });
  } catch (err) {
    console.error('Error adding complaint:', err);
    res.status(500).json({ error: 'Failed to add complaint' });
  }
});

// PUT - Update complaint
router.put('/:id', async (req, res) => {
  const compId = req.params.id;
  const {
    asset_id,
    raised_by,
    issue,
    comp_status,
    priority,
    eng_assigned,
    expected_res_date,
    spare_req,
    actual_res_date,
    comp_type
  } = req.body;

  try {
    let total_time_taken = null;

    if (actual_res_date) {
      // Fetch creation_time from DB
      const [rows] = await db.query('SELECT creation_time FROM complaints WHERE comp_id = ?', [compId]);
      if (rows.length === 0) {
        return res.status(404).json({ error: 'Complaint not found' });
      }

      const creationTime = new Date(rows[0].creation_time);
      const actualResDate = new Date(actual_res_date);

      // Calculate difference in milliseconds
      const diffMs = actualResDate - creationTime;

      if (diffMs >= 0) {
        const hours = Math.floor(diffMs / (1000 * 60 * 60));
        const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);

        total_time_taken = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
      }
    }

    // Update complaint
    const [result] = await db.query(
      `UPDATE complaints SET
        asset_id = ?, raised_by = ?, issue = ?, comp_status = ?, priority = ?,
        eng_assigned = ?, expected_res_date = ?, spare_req = ?, 
        total_time_taken = ?, actual_res_date = ?, comp_type = ?, updated_at = NOW()
       WHERE comp_id = ?`,
      [
        asset_id,
        raised_by,
        issue,
        comp_status,
        priority,
        eng_assigned,
        expected_res_date || null,
        spare_req,
        total_time_taken,
        actual_res_date || null,
        comp_type,
        compId
      ]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Complaint not found' });
    }

    res.json({ message: 'Complaint updated successfully', total_time_taken });
  } catch (err) {
    console.error('Error updating complaint:', err);
    res.status(500).json({ error: 'Failed to update complaint' });
  }
});


// DELETE - Delete complaint
router.delete('/:id', async (req, res) => {
  const compId = req.params.id;

  try {
    const [result] = await db.query('DELETE FROM complaints WHERE comp_id = ?', [compId]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Complaint not found' });
    }

    res.json({ message: 'Complaint deleted successfully' });
  } catch (err) {
    console.error('Error deleting complaint:', err);
    res.status(500).json({ error: 'Failed to delete complaint' });
  }
});

module.exports = router;
