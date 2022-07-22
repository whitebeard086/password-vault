import { FastifyInstance } from "fastify";
import createServer from "./utils/createServer";
import { connectDB, disconnectDB } from "./utils/db";
import logger from "./utils/logger";

function gracefulShutdown(signal: string, app: FastifyInstance) {
  process.on(signal, async () => {
    logger.info(`Received ${signal}, shutting down gracefully`);

    app.close();

    await disconnectDB();

    logger.info("Graceful shutdown complete");

    process.exit(0);
  });
}

async function main() {
  const app = createServer();

  try {
    const url = await app.listen(4000, "0.0.0.0");

    logger.info(`Server is ready at ${url}`);

    await connectDB();

  } catch (e) {
    logger.error(e);
    process.exit(1);
  }

  const signals = ["SIGTERM", "SIGINT"];

  for (let i = 0; i < signals.length; i++) {
    gracefulShutdown(signals[i], app);
  }
}

main();
