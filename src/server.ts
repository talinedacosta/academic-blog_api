import { app } from "@/app";
import { env } from "@/env";
import { database } from "./lib/pg/db";

const PORT = env.PORT;
const HOST = "0.0.0.0";
const MAX_RETRIES = 20; 
const RETRY_DELAY = 2000;

const startServer = async () => {
  console.log("Starting server...");
  
  let attempts = 0;
  while (attempts < MAX_RETRIES) {
    try {
      await database.connection();
      await database.testConnection();
      console.log("Database connection successful!");

      app.listen(PORT, HOST, () => {
        console.log(`Server is running at http://${HOST}:${PORT}`);
      });
      return;
    } catch (error) {
      attempts++;
      console.error(`Error connecting to the database (attempt ${attempts}): ${error}`);
      if (attempts < MAX_RETRIES) {
        console.log(`Retrying in ${RETRY_DELAY / 1000} seconds...`);
        await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY));
      }
    }
  }

  console.error("Max retries reached. Unable to connect to the database.");
};

startServer();
