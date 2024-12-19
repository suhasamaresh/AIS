import { connectToDatabase } from "../../app/config/dbconfig"; // Import the database connection module
import sql from "mssql"; // Import the mssql package

export default async function handler(req, res) {
  if (req.method === "GET") {
    const { date, brcode } = req.query; // Get the date from the query parameters

    if (!date) {
      return res.status(400).json({ error: "Date parameter is required" });
    }

    try {
      // Connect to the database
      const pool = await connectToDatabase();

      // Query to get the attendance details for each faculty (dates and time periods) based on the provided date
      const result = await pool
        .request()
        .input('date', sql.Date, date)
        .input('brcode', sql.VarChar, brcode)
        .query(`
          SELECT 
            faculty_id,
            (SELECT [FACULTY_NAME] FROM [aittest].[dbo].[facultyData] WHERE [employee_id] = faculty_id) AS facultyName,
            [Date],
            timePeriod,
            sub_code,
            CASE 
              WHEN COUNT(*) > 0 THEN 'true'
              ELSE 'false'
            END AS classesMarked
          FROM 
            [aittest].[dbo].[Attendence]
          WHERE 
            [Date] = @date AND [dept] = @brcode
          GROUP BY 
            faculty_id, [Date], timePeriod, sub_code
          ORDER BY 
            faculty_id, [Date] DESC, timePeriod;
        `);

      // Send the result back as JSON
      res.status(200).json(result.recordset);
    } catch (error) {
      console.error("Database query failed", error);
      res.status(500).json({ error: "Database query failed: " + error.message });
    }
  } else {
    res.status(405).json({ error: "Method Not Allowed" });
  }
}
