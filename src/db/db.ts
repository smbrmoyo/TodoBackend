import {
  DynamoDBClient,
  CreateTableCommand,
  DescribeTableCommand,
  CreateTableCommandInput,
} from "@aws-sdk/client-dynamodb";
import { awsRegion, awsAccessKeyId, awsSecretAccessKey } from "../utils/config";

// Creates a client of the db
export const dynamoDBClient: DynamoDBClient = new DynamoDBClient({
  region: awsRegion!,
  credentials: {
    accessKeyId: awsAccessKeyId!,
    secretAccessKey: awsSecretAccessKey!,
  },
});
