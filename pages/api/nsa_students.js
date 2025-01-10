import { connectToDatabase } from '../../app/config/dbconfig';
import sql from 'mssql';

export default async function handler(req, res) {
  try {
    const { sem, dept, year } = req.query;

    if (!sem || !dept || !year) {
      return res.status(400).json({ error: 'Semester, department, and year are required' });
    }

    const pool = await connectToDatabase();

    const results = await pool.request()
      .input('sem', sql.VarChar, sem)
      .input('dept', sql.VarChar, dept)
      .input('year', sql.VarChar, year)
      .query(`
        USE aittest;

        SELECT 
          usn,
          student_name,
          sub_code,
          sem,
          attendance_percentage,
          condonation_status
        FROM [aittest].[dbo].[condonation]
        WHERE condonation_status = 'Rejected' 
          AND sem = @sem 
          AND br_code = @dept 
          AND result_year = @year

        UNION

        SELECT 
          att.usn,
          cr.s_name AS student_name,
          att.sub_code,
          att.sem,
          ROUND(
            (CAST(SUM(CASE WHEN att.status = 'P' THEN 1 ELSE 0 END) AS FLOAT) 
            / COUNT(att.sub_code)) * 100, 2
          ) AS attendance_percentage,
          'Below 75%' AS condonation_status
        FROM [aittest].[dbo].[Attendence] att
        INNER JOIN [aittest].[dbo].[course_registration] cr
          ON att.usn = cr.usn
          AND att.sub_code = cr.subcode
        WHERE att.sem = @sem
          AND att.dept = @dept
          AND att.year = @year
        GROUP BY att.usn, cr.s_name, att.sub_code, att.sem
        HAVING ROUND(
          (CAST(SUM(CASE WHEN att.status = 'P' THEN 1 ELSE 0 END) AS FLOAT) 
          / COUNT(att.sub_code)) * 100, 2
        ) < 75
      `);

    res.status(200).json({ students: results.recordset });
  } catch (error) {
    console.error('Database query failed', error);
    res.status(500).json({ error: 'Database query failed' });
  }
}
