import { connectToDatabase } from '../../app/config/dbconfig';
import sql from 'mssql';

export default async function handler(req, res) {
    const { subjectCode, section } = req.query; // Use subjectCode instead of subcode

    if (!subjectCode || !section) {
        return res.status(400).json({ error: 'subjectCode and section are required' }); // Updated error message
    }

    try {
        const pool = await connectToDatabase();

        // Fetch students mapped to the given course ID and section
        const results = await pool.request()
            .input('subjectCode', sql.VarChar, subjectCode) // Use subjectCode here
            .input('section', sql.VarChar, section)
            .query(`USE aittest;
                SELECT [RESULT_YEAR]
                FROM [dbo].[course_registration]
                WHERE [SUBCODE] = @subjectCode AND [SECT] = @section
            `);

        res.status(200).json({ students: results.recordset });
    } catch (error) {
        console.error('Database query failed', error);
        res.status(500).json({ error: 'Database query failed' });
    }
}
