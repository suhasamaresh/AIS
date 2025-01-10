import { connectToDatabase } from '@/app/config/dbconfig';
import sql from 'mssql';

// Route handler to update att_elg for an array of students
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    // Extract data from request body
    const { students } = req.body;

    // Validate required parameters
    if (!Array.isArray(students) || students.length === 0) {
      return res.status(400).json({ error: 'An array of students is required' });
    }

    const pool = await connectToDatabase();

    // Begin transaction
    const transaction = new sql.Transaction(pool);
    await transaction.begin();

    try {
      for (const student of students) {
        const { sem, br_code, result_year, usn, att_elg, sub_code } = student;

        console.log('Processing student:', student); // Log for debugging

        // Validate each student object
        if (!sem || !br_code || !result_year || !usn || att_elg === undefined || !sub_code) {
          throw new Error(
            `Missing required parameters for student with USN: ${usn}`
          );
        }

        // Update query for att_elg
        await transaction.request()
          .input('sem', sql.VarChar, sem)
          .input('brcode', sql.VarChar, br_code)
          .input('resultYear', sql.VarChar, result_year)
          .input('usn', sql.VarChar, usn)
          .input('att_elg', sql.Bit, att_elg)
          .input('subCode', sql.VarChar, sub_code)
          .query(`
            UPDATE [aittest].[dbo].[course_registration]
            SET att_elg = @att_elg
            WHERE semester = @sem
            AND brcode = @brcode
            AND result_year = @resultYear
            AND usn = @usn
            AND subcode = @subCode
          `);
      }

      // Commit transaction
      await transaction.commit();

      return res.status(200).json({ message: 'att_elg updated successfully for all students' });
    } catch (error) {
      // Rollback transaction on error
      await transaction.rollback();
      console.error('Error updating att_elg:', error);
      throw error;
    }
  } catch (error) {
    console.error('Database update failed:', error);
    return res.status(500).json({ error: 'Failed to update att_elg' });
  }
}
