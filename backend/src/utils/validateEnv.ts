import dotenv from "dotenv";

dotenv.config();

function validateEnv() {
  const requiredEnvVars = ["DATABASE_URL", "JWT_SECRET"];

  const missingEnvVars = requiredEnvVars.filter(
    (envVar) => !process.env[envVar]
  );

  if (missingEnvVars.length > 0) {
    console.error("Error: Missing required environment variables:");
    missingEnvVars.forEach((envVar) => console.error(`- ${envVar}`));
    process.exit(1);
  }

  console.log("All required environment variables are present.");
}

validateEnv();
