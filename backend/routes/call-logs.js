const express = require('express');
const router = express.Router();
const db = require('../db');

// GET all call logs
router.get('/', async (req, res) => {
  console.log('Received GET /api/call-logs request');
  try {
    const [rows] = await db.query(`
      SELECT 
        call_id,
        call_type,
        contact_person,
        contact_number,
        description,
        handled_by,
        status,
        created_at,
        updated_at
      FROM call_logs
      ORDER BY created_at DESC
    `);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// POST - Add new call log
router.post('/', async (req, res) => {
  const {
    call_type,
    contact_person,
    contact_number,
    description,
    handled_by
  } = req.body;

  try {
    const [result] = await db.query(
      `INSERT INTO call_logs 
      (call_type, contact_person, contact_number, description, handled_by, status)
      VALUES (?, ?, ?, ?, ?, 'Open')`,
      [call_type, contact_person, contact_number, description, handled_by]
    );
    res.json({ 
      success: true,
      message: 'Call log added',
      call_id: result.insertId 
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Failed to add call log' });
  }
});

// PUT - Update call log status
router.put('/:id', async (req, res) => {
  const callId = req.params.id;
  const { status, description, handled_by } = req.body;

  try {
    const [result] = await db.query(
      `UPDATE call_logs SET
        status = ?,
        description = COALESCE(?, description),
        handled_by = COALESCE(?, handled_by)
      WHERE call_id = ?`,
      [status, description, handled_by, callId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Call log not found' });
    }

    res.json({ success: true, message: 'Call log updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update call log' });
  }
});

// DELETE - Delete call log
router.delete('/:id', async (req, res) => {
  const callId = req.params.id;

  try {
    const [result] = await db.query('DELETE FROM call_logs WHERE call_id = ?', [callId]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Call log not found' });
    }

    res.json({ success: true, message: 'Call log deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete call log' });
  }
});

module.exports = router;
