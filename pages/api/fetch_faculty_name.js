import { connectToDatabase } from '../../app/config/dbconfig';
import sql from 'mssql';

export default async function handler(req, res) {
  try {
    const { employeeID } = req.query; // Get employee ID from query parameters
    const pool = await connectToDatabase();

    // Fetch courses mapped to the given employee ID (CSU20)
    const results = await pool.request()
        .input('employeeID', sql.VarChar, employeeID) // Input parameter for employee ID
      .query(`USE aittest;
        SELECT  [FACULTY_NAME]
        FROM [dbo].[facultyData]
        WHERE [employee_id] = @employeeID
      `);

    res.status(200).json({ courses: results.recordset });
  } catch (error) {
    console.error('Database query failed', error);
    res.status(500).json({ error: 'Database query failed' });
  }
}
