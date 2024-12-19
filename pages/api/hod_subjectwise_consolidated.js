import { connectToDatabase } from '../../app/config/dbconfig';
import sql from 'mssql';

export default async function handler(req, res) {
  try {
    const { sub_code } = req.query; // Get sub_code from query parameters

    if (!sub_code) {
      return res.status(400).json({ error: 'sub_code is required' });
    }

    const pool = await connectToDatabase();

    // Execute query to fetch students who have taken the given subject and their attendance details
    const results = await pool.request()
      .input('sub_code', sql.VarChar, sub_code) // Bind the 'sub_code' parameter
      .query(`
        USE aittest;
        SELECT 
          cr.usn,
          cr.s_name AS Name,
          COUNT(att.status) AS TotalClassesHeld,
          SUM(CASE WHEN att.status = 'P' THEN 1 ELSE 0 END) AS ClassesAttended,
          ROUND(
            CASE 
              WHEN COUNT(att.status) = 0 THEN 0
              ELSE (CAST(SUM(CASE WHEN att.status = 'P' THEN 1 ELSE 0 END) AS FLOAT) 
                    / COUNT(att.status)) * 100
            END, 2
          ) AS AttendancePercentage
        FROM [aittest].[dbo].[course_registration] cr
        LEFT JOIN [aittest].[dbo].[Attendence] att
          ON cr.usn = att.usn AND cr.subcode = att.sub_code
        WHERE cr.subcode = @sub_code
        GROUP BY cr.usn, cr.s_name
        ORDER BY cr.usn;
      `);

    // Return the student data with attendance details
    res.status(200).json({ students: results.recordset });
  } catch (error) {
    console.error('Database query failed', error);
    res.status(500).json({ error: 'Database query failed' });
  }
}
