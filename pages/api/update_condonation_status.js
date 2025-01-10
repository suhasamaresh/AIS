import { connectToDatabase } from '@/app/config/dbconfig';
import sql from 'mssql';

export default async function handler(req, res) {
  if (req.method !== 'PUT') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { students } = req.body;  // Get students from req.body

    if (!students || !Array.isArray(students) || students.length === 0) {
      return res.status(400).json({ error: 'No data to update' });
    }

    const pool = await connectToDatabase();

    for (const student of students) {
      const result = await pool.request()
        .input('usn', sql.VarChar, student.usn)
        .input('status', sql.VarChar, student.condonation_status)
        .input('sem', sql.VarChar, student.sem)
        .input('dept', sql.VarChar, student.br_code)
        .input('year', sql.VarChar, student.result_year)
        .input('sub_code', sql.VarChar, student.sub_code)
        .query(`
          UPDATE [aittest].[dbo].[condonation]
          SET condonation_status = @status
          WHERE usn = @usn
            AND sem = @sem
            AND br_code = @dept
            AND result_year = @year
            AND sub_code = @sub_code
        `);
      
      console.log(`Updating USN: ${student.usn}, Rows Affected: ${result.rowsAffected[0]}`);
    }

    return res.status(200).json({ message: 'Condonation status updated successfully' });
  } catch (error) {
    console.error('Failed to update condonation status:', error);
    return res.status(500).json({ error: 'Database update failed' });
  }
}
