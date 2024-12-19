import { connectToDatabase } from "../../app/config/dbconfig";
import sql from "mssql";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { sub_code, sec, attendanceDate, timePeriod } = req.body; // Renamed Date to attendanceDate

    // Check for missing fields
    if (!sub_code || !sec || !attendanceDate || !timePeriod) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Format the date to be compatible with the SQL format (YYYY-MM-DD)
    const formattedDate = new Date(attendanceDate).toISOString().split("T")[0];
    console.log("Formatted Date:", formattedDate);

    try {
      const pool = await connectToDatabase();

      // Check if the attendance for the given date and timePeriod already exists
      const result = await pool
        .request()
        .input("sub_code", sql.VarChar, sub_code)
        .input("sec", sql.VarChar, sec)
        .input("Date", sql.Date, formattedDate)
        .input("timePeriod", sql.VarChar, timePeriod)
        .query(`
          use aittest;
          SELECT COUNT(*) AS existsCount
          FROM [dbo].[Attendence]
          WHERE [sub_code] = @sub_code
            AND [sec] = @sec
            AND [Date] = @Date
            AND [timePeriod] = @timePeriod
        `);

      const exists = result.recordset[0].existsCount > 0;
      res.status(200).json({ exists });
    } catch (error) {
      console.error("Error checking attendance:", error);
      res.status(500).json({ error: "Database query failed: " + error.message });
    }
  } else {
    res.status(405).json({ error: "Method Not Allowed" });
  }
}
