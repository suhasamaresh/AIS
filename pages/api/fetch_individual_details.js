import { connectToDatabase } from '../../app/config/dbconfig';
import sql from 'mssql';

export default async function handler(req, res) {
    try {
        // Get the USN and semester from the query parameters
        const { usn, sem } = req.query;

        // Validate the required query parameters
        if (!usn || !sem) {
            return res.status(400).json({ error: 'USN and Semester are required' });
        }

        const pool = await connectToDatabase();

        // Execute the query to fetch the attendance data for the given USN and Semester
        const results = await pool.request()
            .input('usn', sql.VarChar, usn)
            .input('sem', sql.Int, sem)
            .query(`
                SELECT 
                    att.sub_code,
                    att.year,
                    COUNT(*) AS TotalClassesHeld,
                    SUM(CASE WHEN att.status = 'P' THEN 1 ELSE 0 END) AS ClassesAttended,
                    ROUND(
                        (CAST(SUM(CASE WHEN att.status = 'P' THEN 1 ELSE 0 END) AS FLOAT)
                         / COUNT(*)) * 100, 2
                    ) AS AttendancePercentage
                FROM 
                    [aittest].[dbo].[Attendence] att
                WHERE 
                    att.usn = @usn 
                    AND att.sem = @sem
                GROUP BY 
                    att.sub_code, att.year
                ORDER BY 
                    att.sub_code;
            `);

        // Return the attendance data for the student
        res.status(200).json({ attendance: results.recordset });

    } catch (error) {
        console.error('Database query failed', error);
        res.status(500).json({ error: 'Database query failed' });
    }
}
