const express = require('express');
const router = express.Router();
const db = require('../db');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, '../uploads/pm-reports');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: function (req, file, cb) {
    const allowedTypes = /pdf|jpg|jpeg|png|doc|docx|xls|xlsx/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    
    // Allow common MIME types for Excel files
    const allowedMimeTypes = [
      'application/pdf',
      'image/jpeg',
      'image/jpg', 
      'image/png',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ];
    
    const mimetype = allowedMimeTypes.includes(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only PDF, JPG, PNG, DOC, and Excel files are allowed'));
    }
  }
});

// GET all PM reports
router.get('/', async (req, res) => {
  console.log('Received GET /api/pm-reports request');
  const { user_role, dept_id } = req.query;
  
  try {
    let query = `
      SELECT 
        r.report_id,
        r.asset_id,
        a.asset_name,
        r.report_type,
        r.file_name,
        r.file_path,
        r.file_size,
        r.uploaded_by,
        u.username as uploaded_by_name,
        r.status,
        r.notes,
        r.uploaded_at,
        r.reviewed_at
      FROM pm_reports r
      LEFT JOIN assets a ON r.asset_id = a.asset_id
      LEFT JOIN users u ON r.uploaded_by = u.user_id`;
    
    const params = [];
    
    // Filter by department for Engineers
    if (user_role === 'Engineer' && dept_id) {
      query += ' WHERE a.dept_id = ?';
      params.push(dept_id);
    }
    
    query += ' ORDER BY r.uploaded_at DESC';
    
    const [rows] = await db.query(query, params);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// POST - Upload new PM report
router.post('/', upload.single('file'), async (req, res) => {
  const {
    asset_id,
    report_type,
    uploaded_by,
    notes
  } = req.body;

  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  try {
    const [result] = await db.query(
      `INSERT INTO pm_reports 
      (asset_id, report_type, file_name, file_path, file_size, uploaded_by, notes, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, 'Pending')`,
      [asset_id, report_type, req.file.originalname, req.file.path, req.file.size, uploaded_by, notes]
    );
    
    res.json({ 
      success: true,
      message: 'PM report uploaded successfully',
      report_id: result.insertId 
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Failed to upload report' });
  }
});

// PUT - Update PM report status
router.put('/:id', async (req, res) => {
  const reportId = req.params.id;
  const { status, notes } = req.body;

  try {
    const updateFields = [];
    const updateValues = [];

    if (status) {
      updateFields.push('status = ?');
      updateValues.push(status);
      
      if (status === 'Reviewed' || status === 'Approved') {
        updateFields.push('reviewed_at = NOW()');
      }
    }

    if (notes !== undefined) {
      updateFields.push('notes = ?');
      updateValues.push(notes);
    }

    updateValues.push(reportId);

    const [result] = await db.query(
      `UPDATE pm_reports SET ${updateFields.join(', ')} WHERE report_id = ?`,
      updateValues
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Report not found' });
    }

    res.json({ success: true, message: 'Report updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update report' });
  }
});

// DELETE - Delete PM report
router.delete('/:id', async (req, res) => {
  const reportId = req.params.id;

  try {
    // Get file path before deleting
    const [report] = await db.query('SELECT file_path FROM pm_reports WHERE report_id = ?', [reportId]);
    
    if (report.length === 0) {
      return res.status(404).json({ error: 'Report not found' });
    }

    // Delete from database
    await db.query('DELETE FROM pm_reports WHERE report_id = ?', [reportId]);

    // Delete file from filesystem
    if (report[0].file_path && fs.existsSync(report[0].file_path)) {
      fs.unlinkSync(report[0].file_path);
    }

    res.json({ success: true, message: 'Report deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete report' });
  }
});

// Download file
router.get('/download/:id', async (req, res) => {
  const reportId = req.params.id;

  try {
    const [report] = await db.query('SELECT file_path, file_name FROM pm_reports WHERE report_id = ?', [reportId]);
    
    if (report.length === 0) {
      return res.status(404).json({ error: 'Report not found' });
    }

    const filePath = report[0].file_path;
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'File not found on server' });
    }

    res.download(filePath, report[0].file_name);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to download file' });
  }
});

module.exports = router;
