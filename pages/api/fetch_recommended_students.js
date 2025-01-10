import { connectToDatabase } from '@/app/config/dbconfig';
import sql from 'mssql';

// Route handler to fetch students with 'Recommended' condonation status
export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    // Extract query parameters
    const { sem, branch, resultYear } = req.query;

    // Validate required parameters
    if (!sem || !branch || !resultYear) {
      return res.status(400).json({ error: 'Semester, branch, and result year are required' });
    }

    const pool = await connectToDatabase();

    // Query to fetch students with condonation_status = 'Recommended'
    const result = await pool.request()
      .input('sem', sql.VarChar, sem)
      .input('branch', sql.VarChar, branch)
      .input('resultYear', sql.VarChar, resultYear)
      .query(`
        SELECT usn, student_name, sub_code, sem, attendance_percentage, condonation_status
        FROM [aittest].[dbo].[condonation]
        WHERE condonation_status = 'Recommended'
        AND sem = @sem
        AND br_code = @branch
        AND result_year = @resultYear
      `);

    // Return the data as JSON
    return res.status(200).json({ students: result.recordset });
  } catch (error) {
    console.error('Database query failed', error);
    return res.status(500).json({ error: 'Failed to fetch recommended students' });
  }
}
