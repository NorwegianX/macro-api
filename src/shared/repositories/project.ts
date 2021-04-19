import BaseRepository from './base';
import { v4 as uuidv4 } from 'uuid';

export class ProjectRepository extends BaseRepository {
  // Fixme
  listAll() {}

  static async create(user: string, attr): Promise<[boolean, any]> {
    const projectKey = `Project#${uuidv4()}`;
    const userKey = `User#${user}`;
    const update = await ProjectRepository.dynamo
      .transactWriteItems({
        TransactItems: [
          {
            Put: {
              TableName: process.env.TABLE_NAME,
              Item: {
                pk: {
                  S: projectKey,
                },
                sk: {
                  S: projectKey,
                },
                ...attr,
              },
            },
          },
          {
            Put: {
              TableName: process.env.TABLE_NAME,
              Item: {
                pk: {
                  S: projectKey,
                },
                sk: {
                  S: userKey,
                },
                GSI1PK: {
                  S: userKey,
                },
                GSI1SK: {
                  S: projectKey,
                },
              },
            },
          },
        ],
      })
      .promise()
      .catch(e => {
        console.log('ERROR ', e);
      });

    const createdProject = await ProjectRepository.dynamo
      .getItem({
        TableName: process.env.TABLE_NAME,
        Key: {
          pk: { S: projectKey },
          sk: { S: projectKey },
        },
      })
      .promise();

    if (!update) {
      return this.error('We had an issue creating a new project');
    } else {
      return this.success(createdProject.Item);
    }
  }

  static async listAllByUser(user: string): Promise<any> {
    const params = {
      ExpressionAttributeValues: {
        ':user': {
          S: `User#${user}`,
        },
      },
      KeyConditionExpression: 'GSI1PK = :user',
      TableName: 'Macros',
      IndexName: 'GSI1',
    };
    const projectIds: any = await ProjectRepository.dynamo
      .query(params)
      .promise();

    if (projectIds.Count === 0) return [];

    const Keys = projectIds.Items.map(el => {
      return {
        pk: el.GSI1SK,
        sk: el.GSI1SK,
      };
    });

    const batchParams = {
      RequestItems: {},
    };
    batchParams.RequestItems[process.env.TABLE_NAME] = {
      Keys,
    };
    const {
      Responses: { Macros },
    } = await ProjectRepository.dynamo.batchGetItem(batchParams).promise();

    return Macros;
  }
}
