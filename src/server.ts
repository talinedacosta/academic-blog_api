import { app } from "@/app";
import { env } from "@/env";
import { database } from "./lib/pg/db";

const PORT = env.PORT;
const HOST = "0.0.0.0";

const startServer = async () => {
  console.log("Starting server...");
  try {
    await database.connection();
    await database.testConnection();

    app.listen(PORT, HOST, () => {
      console.log(`Server is running at http://${HOST}:${PORT}`);
    });
  } catch (error) {
    console.error(`Error starting server: ${error}`);
  }
};

startServer();