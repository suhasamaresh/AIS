import { connectToDatabase } from '../../app/config/dbconfig';
import sql from 'mssql';

export default async function handler(req, res) {
    const { section, subjectCode, facultyId } = req.query; // Use facultyId and subjectCode as input

    if (!section || !subjectCode || !facultyId) {
        return res.status(400).json({ error: 'section, subjectCode, and facultyId are required' });
    }

    try {
        const pool = await connectToDatabase();

        // Fetch students mapped to the given faculty ID, section, and subjectCode
        const results = await pool.request()
            .input('facultyId', sql.VarChar, facultyId)
            .input('section', sql.VarChar, section)
            .input('subjectCode', sql.VarChar, subjectCode)
            .query(`USE aittest;
                SELECT cr.[S_NAME], cr.[USN]
                FROM [dbo].[course_registration] cr
                INNER JOIN [dbo].[subject_faculty_map] sfm
                ON cr.[SUBCODE] = sfm.[subcode] AND cr.[SECT] = sfm.[sect]
                WHERE sfm.[emp_id] = @facultyId 
                AND cr.[SECT] = @section 
                AND cr.[SUBCODE] = @subjectCode
            `);

        res.status(200).json({ students: results.recordset });
    } catch (error) {
        console.error('Database query failed', error);
        res.status(500).json({ error: 'Database query failed' });
    }
}
