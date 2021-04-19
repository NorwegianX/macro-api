import dotenv from "dotenv";
import uuid from "uuid";
import AWS from "aws-sdk";
import macroTable from "./macro-table.js";
import gsiTemplate from "./gsi-template.js";
dotenv.config();

const dynamo = new AWS.DynamoDB({
  endpoint: process.env.DB_URL,
  region: "eu-west-1",
});

export async function init() {
  const tables = await dynamo.listTables().promise();
  if (tables.TableNames.length !== 0) {
    await dynamo
      .deleteTable({
        TableName: "Macros",
      })
      .promise();
  }
  const table = await dynamo.createTable(macroTable).promise();
  console.log("GSI TEMPLATE ", gsiTemplate);
  await createIndex("GSI1", gsiTemplate);
  await checkIndexCreation("GSI1");
  await createIndex("GSI2", gsiTemplate);
  await checkIndexCreation("GSI2");
}

function checkIndexCreation(name) {
  return new Promise((resolve, reject) => {
    const indexInterval = setInterval(async () => {
      console.log(`Checking if index: ${name} is created`);
      const { Table } = await dynamo
        .describeTable({ TableName: "Macros" })
        .promise();

      const index = Table.GlobalSecondaryIndexes.find(
        (ele) => ele.IndexName === name
      );

      if (index?.IndexStatus !== "CREATING") {
        clearInterval(indexInterval);
        resolve();
      }
    }, 1500);
  });
}

async function createIndex(name, template) {
  const table = await dynamo
    .updateTable({
      TableName: "Macros",
      AttributeDefinitions: [
        {
          AttributeName: `${name}PK`,
          AttributeType: "S",
        },
        {
          AttributeName: `${name}SK`,
          AttributeType: "S",
        },
      ],
      GlobalSecondaryIndexUpdates: [
        {
          Create: {
            IndexName: name,
            KeySchema: [
              {
                AttributeName: `${name}PK`,
                KeyType: "HASH",
              },
              {
                AttributeName: `${name}SK`,
                KeyType: "RANGE",
              },
            ],
            ...template,
          },
        },
      ],
    })
    .promise()
    .catch((e) => {
      console.error("YEAH", e);
    });
}
init();
