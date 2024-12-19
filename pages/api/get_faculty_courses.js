import { connectToDatabase } from '../../app/config/dbconfig';
import sql from 'mssql';

export default async function handler(req, res) {
  try {
    const pool = await connectToDatabase();

    // Fetch courses mapped to the given employee ID (CSU20)
    const results = await pool.request()
      .input('employeeId', sql.VarChar, 'CSU09') // Input parameter for employee ID
      .query(`USE aittest;
        SELECT [RESULT_YEAR], [SEMESTER], [BRCODE], [SUBCODE], [SECT], [EMP_ID], [PKY]
        FROM [dbo].[subject_faculty_map]
        WHERE [EMP_ID] = @employeeId
      `);

    res.status(200).json({ courses: results.recordset });
  } catch (error) {
    console.error('Database query failed', error);
    res.status(500).json({ error: 'Database query failed' });
  }
}
