/* eslint-disable */
//retun error if env is not test
require("dotenv").config({ path: "./.env.test" });

if (!process.env.DATABASE_URL) {
  throw new Error(
    "Tests must be run with NODE_ENV=test, Also be Careful use diffrent database for e2e testing",
  );
}
const { exec } = require("child_process");
const util = require("util");
const execAsync = util.promisify(exec);

// Export the migrate function for explicit use in tests
export async function migrateDatabase() {
  console.log("Running migrations on the test database...");
  try {
    const { stdout, stderr } = await execAsync("pnpx prisma db push", {
      env: {
        ...process.env, // Spread all current environment variables
      },
    });
    console.log(stdout);
    if (stderr) {
      console.error("Error running migrations:", stderr);
    }
  } catch (error) {
    console.error("Failed to run migrations:", error);
    throw error; // Ensure the setup fails if migrations cannot be applied
  }
}
