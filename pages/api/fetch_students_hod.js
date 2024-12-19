import { connectToDatabase } from '../../app/config/dbconfig'; // Make sure your DB connection is set up correctly
import sql from 'mssql';

export default async function handler(req, res) {
  try {
    const { sem, brcode } = req.query; // Get semester and branch code from query parameters

    // Validate the required query parameters
    if (!sem || !brcode) {
      return res.status(400).json({ error: 'Both semester (sem) and branch code (brcode) are required' });
    }

    const pool = await connectToDatabase();

    // Execute query to fetch unique student names and USNs based on semester and branch code
    const results = await pool.request()
      .input('sem', sql.Int, sem)  // Pass semester as an integer
      .input('brcode', sql.VarChar, brcode)  // Pass branch code as a string
      .query(`
        SELECT DISTINCT 
          att.usn,
          att.sec,
          cr.s_name AS Name
        FROM 
          [aittest].[dbo].[Attendence] att
        INNER JOIN 
          [aittest].[dbo].[course_registration] cr
          ON cr.usn = att.usn
        WHERE 
          att.sem = @sem  -- Filter by semester
          AND cr.brcode = @brcode  -- Filter by branch code
        ORDER BY 
          cr.s_name;
      `);

    // Return the list of unique students (USN and Name)
    res.status(200).json({ students: results.recordset });

  } catch (error) {
    console.error('Database query failed', error);
    res.status(500).json({ error: 'Database query failed' });
  }
}
