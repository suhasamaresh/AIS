import { connectToDatabase } from "../../app/config/dbconfig";
import sql from "mssql";

export default async function handler(req, res) {
  if (req.method === "POST") {
    // Handle POST request (Insert new attendance)
    const {
      sub_code,
      sec,
      faculty_id,
      dept,
      sem,
      year,
      Date: date,
      attendanceData,
      timePeriod,
    } = req.body;

    if (!sub_code || !sec || !faculty_id || !dept || !sem || !year || !date || !attendanceData || !timePeriod) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const formattedDate = new Date(date).toISOString().split("T")[0];
    const formattedYear = new Date(year).toISOString().split("T")[0];

    try {
      const pool = await connectToDatabase();

      for (const student of attendanceData) {
        const { usn, status } = student;

        await pool
          .request()
          .input("usn", sql.VarChar, usn)
          .input("sub_code", sql.VarChar, sub_code)
          .input("faculty_id", sql.VarChar, faculty_id)
          .input("dept", sql.VarChar, dept)
          .input("sem", sql.Int, sem)
          .input("sec", sql.VarChar, sec)
          .input("year", sql.Date, year)
          .input("Date", sql.Date, formattedDate)
          .input("status", sql.VarChar, status)
          .input("flag", sql.Int, null)
          .input("timePeriod", sql.VarChar, timePeriod)
          .query(`
            USE aittest;
            INSERT INTO [dbo].[Attendence] (
              [usn], [sub_code], [faculty_id], [dept], [sem], [sec], [year], [Date], [status], [flag], [timePeriod]
            ) 
            VALUES (@usn, @sub_code, @faculty_id, @dept, @sem, @sec, @year, @Date, @status, @flag, @timePeriod);
        `);
      }

      res.status(200).json({ message: "Attendance recorded successfully" });
    } catch (error) {
      console.error("Database query failed", error);
      res.status(500).json({ error: "Database query failed: " + error.message });
    }
  } else if (req.method === "PUT") {
    // Handle PUT request (Update existing attendance)
    const {
      sub_code,
      sec,
      faculty_id,
      dept,
      sem,
      year,
      Date: date,
      attendanceData,
      timePeriod,
    } = req.body;

    if (!sub_code || !sec || !faculty_id || !dept || !sem || !year || !date || !attendanceData || !timePeriod) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const formattedDate = new Date(date).toISOString().split("T")[0];
    const formattedYear = new Date(year).toISOString().split("T")[0];

    try {
      const pool = await connectToDatabase();

      for (const student of attendanceData) {
        const { usn, status } = student;

        // Update the attendance for a specific date and timePeriod
        await pool
          .request()
          .input("usn", sql.VarChar, usn)
          .input("sub_code", sql.VarChar, sub_code)
          .input("faculty_id", sql.VarChar, faculty_id)
          .input("dept", sql.VarChar, dept)
          .input("sem", sql.Int, sem)
          .input("sec", sql.VarChar, sec)
          .input("year", sql.Date, year)
          .input("Date", sql.Date, formattedDate)
          .input("status", sql.VarChar, status)
          .input("flag", sql.Int, 1)
          .input("timePeriod", sql.VarChar, timePeriod)
          .query(`
            USE aittest;
            UPDATE [dbo].[Attendence]
            SET [status] = @status
            WHERE [usn] = @usn
              AND [sub_code] = @sub_code
              AND [Date] = @Date
              AND [timePeriod] = @timePeriod;
        `);
      }

      res.status(200).json({ message: "Attendance updated successfully" });
    } catch (error) {
      console.error("Database query failed", error);
      res.status(500).json({ error: "Database query failed: " + error.message });
    }
  } else {
    res.status(405).json({ error: "Method Not Allowed" });
  }
}
