// scripts/create-local-table.js
// This is used to create a test table in our local copy of DynamoDB when the tests run
// This is not used if deploying infrastructure to AWS
const { DynamoDBClient, CreateTableCommand } = require('@aws-sdk/client-dynamodb');

(async () => {
  try {
    const client = new DynamoDBClient({
      region: process.env.AWS_REGION || "us-west-2",
      endpoint: process.env.DYNAMODB_ENDPOINT || "http://localhost:8000",
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || "FAKE_KEY",
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "FAKE_SECRET",
      },
    });

    const tableName = process.env.DYNAMODB_TABLE_NAME || "RoomsTest";

    const command = new CreateTableCommand({
      TableName: tableName,
      AttributeDefinitions: [
        { AttributeName: 'id', AttributeType: 'N' },
      ],
      KeySchema: [
        { AttributeName: 'id', KeyType: 'HASH' },
      ],
      ProvisionedThroughput: {
        ReadCapacityUnits: 5,
        WriteCapacityUnits: 5,
      },
      SSESpecification: {
        Enabled: true, // server-side encryption
      },
    });

    const result = await client.send(command);
    console.log(`Created table '${tableName}' locally.`, result.TableDescription?.TableStatus);
  } catch (err) {
    console.error('Error creating table locally:', err);
    process.exit(1);
  }
})();
