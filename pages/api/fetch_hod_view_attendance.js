import { connectToDatabase } from '../../app/config/dbconfig';
import sql from 'mssql';

export default async function handler(req, res) {
    try {
        const { brcode, result_year, sem } = req.query; // Get brcode, result year, and sem from query parameters

        // Validate the required query parameters
        if (!brcode || !result_year || !sem) {
            return res.status(400).json({ error: 'Branch code (brcode), result year, and semester (sem) are required' });
        }

        const pool = await connectToDatabase();

        // Execute query to fetch attendance statistics based on branch code, result year, and semester
        const results = await pool.request()
            .input('brcode', sql.VarChar, brcode)
            .input('result_year', sql.VarChar, result_year)  // assuming result_year is a string (e.g., '2021-01-01')
            .input('sem', sql.Int, sem)  // assuming sem is an integer
            .query(`
                SELECT 
                    att.usn,
                    cr.s_name AS Name,
                    att.sem,
                    att.sub_code,
                    att.sec,
                    COUNT(*) AS TotalClassesHeld,
                    SUM(CASE WHEN att.status = 'P' THEN 1 ELSE 0 END) AS ClassesAttended,
                    ROUND(
                            (CAST(SUM(CASE WHEN att.status = 'P' THEN 1 ELSE 0 END) AS FLOAT)
                             / COUNT(*)) * 100, 2
                    ) AS AttendancePercentage
                FROM 
                    [aittest].[dbo].[Attendence] att
                INNER JOIN 
                    [aittest].[dbo].[course_registration] cr
                    ON cr.usn = att.usn
                    AND cr.subcode = att.sub_code
                WHERE att.dept = @brcode  -- Filter by branch code
                AND att.year = @result_year
                AND att.sem = @sem  -- Filter by semester
                GROUP BY 
                    att.usn, cr.s_name, att.sem, att.year , att.sub_code, att.sec
                ORDER BY 
                    att.usn;
            `);

        // Return the attendance data for all students enrolled in the specified branch, result year, and semester
        res.status(200).json({ attendance: results.recordset });

    } catch (error) {
        console.error('Database query failed', error);
        res.status(500).json({ error: 'Database query failed' });
    }
}
