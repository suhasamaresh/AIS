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

        // Execute query to fetch distinct subject codes based on branch code, result year, and semester
        const results = await pool.request()
            .input('brcode', sql.VarChar, brcode)
            .input('result_year', sql.VarChar, result_year)
            .input('sem', sql.Int, sem)  // assuming sem is an integer
            .query(`
                SELECT DISTINCT sub_code
                FROM [aittest].[dbo].[Attendence]
                WHERE dept = @brcode
                AND year = @result_year
                AND sem = @sem;
            `);

        // Return the distinct subject codes
        res.status(200).json({ subjectCodes: results.recordset });

    } catch (error) {
        console.error('Database query failed', error);
        res.status(500).json({ error: 'Database query failed' });
    }
}
