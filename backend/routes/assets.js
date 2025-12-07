const express = require('express');
const router = express.Router();
const  db  = require('../db');

//  GET all assets with department name
router.get('/', async (req, res) => {
  console.log('Received GET /api/assets request');
  const { user_role, dept_id } = req.query;
  
  try {
    let query = `
      SELECT 
        a.asset_id,
        a.asset_name,
        a.category,
        a.s_no,
        a.location,
        a.amc_or_war,
        a.status,
        a.purchase_date,
        a.warranty_expiry,
        a.inventory,
        a.vendor_name,
        a.dept_id,
        d.dept_name AS dept_name
      FROM assets a
      LEFT JOIN departments d ON a.dept_id = d.dept_id
    `;
    
    const params = [];
    
    // Filter by department for Engineers
    if (user_role === 'Engineer' && dept_id) {
      query += ' WHERE a.dept_id = ?';
      params.push(dept_id);
    }
    
    const [rows] = await db.query(query, params);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

//  POST - Add new asset
router.post('/', async (req, res) => {
  console.log('🔵 Received POST /api/assets request');
  console.log('📦 Request body:', req.body);
  
  const {
    asset_name, category, s_no, location,
    amc_or_war, status, purchase_date, warranty_expiry,
    inventory, vendor_name, dept_id
  } = req.body;

  console.log('🔍 Extracted values:', { asset_name, category, s_no, location, amc_or_war, status, purchase_date, warranty_expiry, inventory, vendor_name, dept_id });

  try {
    console.log('💾 Attempting to insert into database...');
    const [result] = await db.query(
      `INSERT INTO assets 
      (asset_name, category, s_no, location, amc_or_war, status, purchase_date, warranty_expiry, inventory, vendor_name, dept_id)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [asset_name, category, s_no, location, amc_or_war, status, purchase_date, warranty_expiry, inventory, vendor_name, dept_id]
    );
    console.log('✅ Asset inserted successfully! Insert ID:', result.insertId);
    res.json({ message: 'Asset added', asset_id: result.insertId });
  } catch (err) {
    console.error('❌ Error inserting asset:', err);
    res.status(500).json({ error: 'Failed to add asset' });
  }
});

//  PUT - Update asset
router.put('/:id', async (req, res) => {
  const assetId = req.params.id;
  const {
    asset_name, category, s_no, location,
    amc_or_war, status, purchase_date, warranty_expiry,
    inventory, vendor_name, dept_id
  } = req.body;

  try {
    const [result] = await db.query(
      `UPDATE assets SET
        asset_name = ?, category = ?, s_no = ?, location = ?,
        amc_or_war = ?, status = ?, purchase_date = ?, warranty_expiry = ?,
        inventory = ?, vendor_name = ?, dept_id = ?
      WHERE asset_id = ?`,
      [asset_name, category, s_no, location, amc_or_war, status, purchase_date, warranty_expiry, inventory, vendor_name, dept_id, assetId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Asset not found' });
    }

    res.json({ message: 'Asset updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update asset' });
  }
});

//  DELETE - Delete asset
router.delete('/:id', async (req, res) => {
  const assetId = req.params.id;

  try {
    const [result] = await db.query('DELETE FROM assets WHERE asset_id = ?', [assetId]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Asset not found' });
    }

    res.json({ message: 'Asset deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete asset' });
  }
});

// bulk upload assets
router.post('/bulk-upload', async (req, res) => {
  const assets = req.body;

  try {
    for (const asset of assets) {
      // Fetch dept_id from departments table
      const [deptRows] = await db.query('SELECT dept_id FROM departments WHERE dept_name = ?', [
        asset.Department
      ]);

      let dept_id = null;
      if (deptRows.length > 0) {
        dept_id = deptRows[0].dept_id;
      } else {
        // Optional: you can choose to create a new department here if not found
        return res.status(400).json({ message: `Department '${asset.Department}' not found` });
      }

      await db.query(
        'INSERT INTO assets (asset_name, category, s_no, status, dept_id, location, purchase_date, warranty_expiry, amc_or_war, inventory, vendor_name) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [
          asset.Asset,
          asset.Category,
          asset["Serial Number"],
          asset.Status,
          dept_id,
          asset.Location,
          asset["Purchase Date"],
          asset["Warranty Expiry"],
          asset["AMC/Warranty"],
          asset.Inventory,
          asset["Vendor Name"],
        ]
      );
    }

    res.status(200).json({ message: 'Assets inserted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error inserting assets' });
  }
});


module.exports = router;
