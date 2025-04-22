// backend/routes/metadataRoutes.js
import express from 'express';
import sql from 'mssql';
import getDbConnection from '../utils/db.js';

const router = express.Router();

// GET /api/metadata/modules
router.get('/modules', async (req, res) => {
  try {
    const pool = await getDbConnection();

    // Step 1: Load all apps
    const appsResult = await pool.request().query(`
      SELECT id, code, name FROM Applications
    `);

    const apps = appsResult.recordset;

    // Step 2: Load all sections
    const sectionsResult = await pool.request().query(`
      SELECT id, applicationId, code, name FROM ApplicationSections
    `);
    const sections = sectionsResult.recordset;

    // Step 3: Load all fields
    const fieldsResult = await pool.request().query(`
      SELECT id, sectionId, fieldCode, fieldLabel FROM ApplicationFields
    `);
    const fields = fieldsResult.recordset;

    // Step 4: Nest fields under sections
    const sectionsWithFields = sections.map(section => ({
      ...section,
      fields: fields.filter(f => f.sectionId === section.id)
    }));

    // Step 5: Nest sections under apps
    const appsWithStructure = apps.map(app => ({
      ...app,
      sections: sectionsWithFields.filter(s => s.applicationId === app.id)
    }));

    res.json(appsWithStructure);
  } catch (err) {
    console.error('❌ Failed to load metadata modules:', err);
    res.status(500).json({ message: 'Error loading metadata modules' });
  }
});

export default router;