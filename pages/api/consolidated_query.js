import { connectToDatabase } from '../../app/config/dbconfig';
import sql from 'mssql';

export default async function handler(req, res) {
  try {
    const { sub_code, section, facultyId } = req.query; // Get sub_code, section, and facultyId from query parameters

    if (!sub_code || !section || !facultyId) {
      return res.status(400).json({ error: 'sub_code, section, and facultyId are required' });
    }

    const pool = await connectToDatabase();

    // Execute query to fetch attendance statistics based on subject code, section, and facultyId
    const results = await pool.request()
      .input('sub_code', sql.VarChar, sub_code) // Bind the 'sub_code' parameter
      .input('section', sql.VarChar, section) // Bind the 'section' parameter
      .input('facultyId', sql.VarChar, facultyId) // Bind the 'facultyId' parameter
      .query(`
        USE aittest;
        SELECT 
          att.usn,
          (SELECT TOP 1 cr.s_name 
           FROM [aittest].[dbo].[course_registration] cr
           WHERE cr.usn = att.usn 
             AND cr.subcode = att.sub_code 
             AND cr.sect = @section) AS Name,
          COUNT(*) AS TotalClassesHeld,
          SUM(CASE WHEN att.status = 'P' THEN 1 ELSE 0 END) AS ClassesAttended,
          ROUND(
              (CAST(SUM(CASE WHEN att.status = 'P' THEN 1 ELSE 0 END) AS FLOAT)
               / COUNT(*)) * 100, 2
          ) AS AttendancePercentage
        FROM [aittest].[dbo].[Attendence] att
        INNER JOIN [aittest].[dbo].[subject_faculty_map] sfm
          ON att.sub_code = sfm.subcode AND sfm.sect = @section AND sfm.emp_id = @facultyId
        WHERE att.sub_code = @sub_code
        GROUP BY att.usn, att.sub_code
        ORDER BY att.sub_code, att.usn;
      `);

    // Return the attendance data for all students enrolled in the subject
    res.status(200).json({ attendance: results.recordset });
  } catch (error) {
    console.error('Database query failed', error);
    res.status(500).json({ error: 'Database query failed' });
  }
}
