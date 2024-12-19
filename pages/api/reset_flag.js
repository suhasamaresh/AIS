import { connectToDatabase } from '../../app/config/dbconfig'; // Ensure your DB connection is correctly set up
import sql from 'mssql';

export default async function handler(req, res) {
  if (req.method === 'PUT') {
    const { date, timePeriod , subjectcode, facultyId } = req.body; // Expecting date and timePeriod in the body

    // Validate the date and timePeriod
    if (!date || !timePeriod) {
      return res.status(400).json({ error: 'Date and timePeriod are required' });
    }

    const formattedDate = new Date(date).toISOString().split('T')[0]; // Format date to YYYY-MM-DD

    try {
      // Connect to the database
      const pool = await connectToDatabase();

      // Update the flag to NULL for all records matching the date and timePeriod
      const result = await pool.request()
        .input('date', sql.Date, formattedDate)
        .input('timePeriod', sql.VarChar, timePeriod)
        .input('subjectcode', sql.VarChar, subjectcode)
        .input('facultyId', sql.VarChar, facultyId)
        .query(`
          use aittest;
          UPDATE [dbo].[Attendence]
          SET [flag] = NULL
          WHERE [Date] = @date
            AND [timePeriod] = @timePeriod AND [sub_code] = @subjectcode AND [faculty_id] = @facultyId;
        `);

      // Check if any rows were affected
      if (result.rowsAffected[0] > 0) {
        res.status(200).json({ message: `Flag set to NULL for ${result.rowsAffected[0]} rows.` });
      } else {
        res.status(404).json({ message: 'No records found for the specified date and timePeriod.' });
      }

    } catch (error) {
      console.error('Error updating flag:', error);
      res.status(500).json({ error: 'Database query failed' });
    }
  } else {
    // Method not allowed for other request types
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}
