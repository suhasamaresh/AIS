import { connectToDatabase } from "../../app/config/dbconfig";
import sql from "mssql";
import cron from "node-cron";

export default function handler(req, res) {
  if (req.method === "GET") {
    // Cron job to update the flag at 23:59 (11:59 PM) every day
    cron.schedule("59 23 * * *", async () => {  // This will run at 23:59 daily
      try {
        // Get the current date
        const currentDate = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

        // Connect to the database
        const pool = await connectToDatabase();

        // Update the 'flag' to 1 for all records on the current date
        const result = await pool.request()
          .input("currentDate", sql.Date, currentDate)
          .query(`
            USE aittest;
            UPDATE [dbo].[Attendence]
            SET [flag] = 1
            WHERE [Date] = @currentDate;
          `);

        console.log(`Attendance flags updated for ${currentDate}`);
      } catch (error) {
        console.error("Error updating attendance flags:", error);
      }
    });

    // Send a response indicating that the cron job is running
    res.status(200).json({ message: "Cron job scheduled to run at 23:59 daily" });
  } else {
    res.status(405).json({ error: "Method Not Allowed" });
  }
}
