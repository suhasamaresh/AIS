import { connectToDatabase } from '../../app/config/dbconfig';
import sql from 'mssql';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { students } = req.body;
  console.log(students); // Log for debugging

  if (!students || students.length === 0) {
    return res.status(400).json({ error: 'Student data is required' });
  }

  try {
    const pool = await connectToDatabase();

    for (const student of students) {
      console.log('Processing student:', student); // Log for debugging

      await pool.request()
        .input('usn', sql.VarChar, student.usn)
        .input('student_name', sql.VarChar, student.student_name || student.Name)
        .input('sem', sql.VarChar, student.sem)
        .input('result_year', sql.VarChar, student.result_year || student.resultYear)
        .input('sub_code', sql.VarChar, student.sub_code)
        .input('br_code', sql.VarChar, student.br_code || student.dept)
        .input('classes_held', sql.Int, student.classes_held || student.TotalClassesHeld)
        .input('classes_attended', sql.Int, student.classes_attended || student.ClassesAttended)
        .input('attendance_percentage', sql.Float, student.attendance_percentage || student.AttendancePercentage)
        .input('condonation_status', sql.VarChar, student.condonation_status || student.status)
        .input('remarks', sql.VarChar, student.remarks || 'document provided') // Default to 'document provided' if not provided
        .query(`
          IF EXISTS (
            SELECT 1
            FROM [aittest].[dbo].[condonation]
            WHERE usn = @usn
              AND sub_code = @sub_code
              AND sem = @sem
              AND result_year = @result_year
              AND br_code = @br_code
              AND classes_held = @classes_held
              AND classes_attended = @classes_attended
              AND attendance_percentage = @attendance_percentage
          )
          BEGIN
            UPDATE [aittest].[dbo].[condonation]
            SET condonation_status = @condonation_status,
                remarks = @remarks
            WHERE usn = @usn
              AND sub_code = @sub_code
              AND sem = @sem
              AND result_year = @result_year
              AND br_code = @br_code
              AND classes_held = @classes_held
              AND classes_attended = @classes_attended
              AND attendance_percentage = @attendance_percentage
          END
          ELSE
          BEGIN
            INSERT INTO [aittest].[dbo].[condonation] 
            (usn, student_name, sem, result_year, sub_code, br_code, classes_held, classes_attended, attendance_percentage, condonation_status, remarks)
            VALUES (@usn, @student_name, @sem, @result_year, @sub_code, @br_code, @classes_held, @classes_attended, @attendance_percentage, @condonation_status, @remarks)
          END
        `);
    }

    res.status(200).json({ message: 'Condonation data successfully processed.' });
  } catch (error) {
    console.error('Database operation failed', error);
    res.status(500).json({ error: 'Database operation failed' });
  }
}
