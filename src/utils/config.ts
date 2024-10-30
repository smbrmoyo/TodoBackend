import dotenv from "dotenv";
dotenv.config();

export const awsRegion = process.env.AWS_REGION;
export const awsAccessKeyId = process.env.AWS_ACCESS_KEY_ID;
export const awsSecretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
