import { connectToDatabase } from '../../app/config/dbconfig'; // Ensure your DB connection is correctly set up
import sql from 'mssql';

export default async function handler(req, res) {
  try {
    const { sub_code, facultyId } = req.query; // Get the subject code from the query parameters

    // Validate if the subject code exists
    if (!sub_code) {
      return res.status(400).json({ error: 'Subject code is required' });
    }

    const pool = await connectToDatabase();

    // Query to fetch all student attendance for a specific subject code (sub_code)
    const results = await pool.request()
      .input('sub_code', sql.VarChar, sub_code)  // Pass the sub_code as a parameter
      .input('facultyId', sql.VarChar, facultyId)  // Pass the faculty
      .query(`
        SELECT 
            a.[usn],
            cr.s_name AS Name,
            a.[Date],
            a.[status],
            a.[timePeriod]
        FROM 
            [aittest].[dbo].[Attendence] a
        JOIN 
            [aittest].[dbo].[course_registration] cr 
            ON cr.usn = a.usn 
            AND cr.subcode = a.sub_code
        WHERE 
            a.sub_code = @sub_code AND a.faculty_id = @facultyId
        ORDER BY 
            a.[Date] DESC, a.[usn], a.[timePeriod];
    `);

    // Group attendance by unique Date and timePeriod
    const attendanceGroupedByDateAndTimePeriod = results.recordset.reduce((acc, row) => {
      const { Date, usn, status, Name, timePeriod } = row;

      // Create a unique key for the combination of Date and Time Period
      const dateTimeKey = `${Date}-${timePeriod}`;

      // Check if the current Date-Time combination already exists in the accumulator
      let dateTimeEntry = acc.find((entry) => entry.dateTimeKey === dateTimeKey);

      if (!dateTimeEntry) {
        // If not, create a new date-time entry
        dateTimeEntry = { dateTimeKey, date: Date, timePeriod, attendance: [] };
        acc.push(dateTimeEntry);
      }

      // Add the student's attendance record to the date-time entry
      dateTimeEntry.attendance.push({ usn, name: Name, status });

      return acc;
    }, []);

    // Return the grouped data as JSON
    res.status(200).json(attendanceGroupedByDateAndTimePeriod);

  } catch (error) {
    console.error('Database query failed', error);
    res.status(500).json({ error: 'Database query failed' });
  }
}
