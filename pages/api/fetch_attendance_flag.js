import { connectToDatabase } from "../../app/config/dbconfig";
import sql from "mssql";

export default async function handler(req, res) {
  if (req.method === "GET") {
    const { date, timePeriod } = req.query; // Get the date and timePeriod from query parameters

    // Validate if the date and timePeriod are provided
    if (!date || !timePeriod) {
      return res.status(400).json({ error: "Date and timePeriod are required" });
    }

    try {
      // Format the date to be compatible with the SQL format (YYYY-MM-DD)
      const formattedDate = new Date(date).toISOString().split("T")[0];

      // Connect to the database
      const pool = await connectToDatabase();

      // Query to fetch the flag for a specific date and timePeriod
      const result = await pool
        .request()
        .input("date", sql.Date, formattedDate)
        .input("timePeriod", sql.VarChar, timePeriod)
        .query(`
          use aittest;
          SELECT [flag]
          FROM [dbo].[Attendence]
          WHERE [Date] = @date AND [timePeriod] = @timePeriod
        `);

      // Check if the result is found and send the response
      if (result.recordset.length > 0) {
        const flag = result.recordset[0].flag;
        res.status(200).json({ flag });
      } else {
        res.status(404).json({ error: "No records found for the given date and time period" });
      }
    } catch (error) {
      console.error("Error fetching flag:", error);
      res.status(500).json({ error: "Database query failed: " + error.message });
    }
  } else {
    res.status(405).json({ error: "Method Not Allowed" });
  }
}
