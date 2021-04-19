import AWS from 'aws-sdk';
const TableName = process.env.TABLE_NAME;

export default class BaseRepository {
  static dynamo = process.env.ARC_LOCAL
    ? new AWS.DynamoDB({ endpoint: process.env.DB_URL, region: 'eu-west-1' })
    : new AWS.DynamoDB();

  static error(msg): [boolean, any] {
    return [false, msg];
  }
  static success(res: any = null): [boolean, any] {
    return [true, res];
  }

  static async getByID(pk: string): Promise<any> {
    const params = {
      TableName,
      Key: {
        pk: { S: pk },
        sk: { S: pk },
      },
    };
    return (await BaseRepository.dynamo.getItem(params).promise()).Item;
  }

  static async updateItemByID(pk: string, sk: string, attr: any): Promise<any> {
    console.log('updating item by id ', pk, sk, attr);

    const params = {
      TableName,
      Key: {
        pk,
        sk,
      },
      AttributeUpdates: attr,
    };
    return (await BaseRepository.dynamo.updateItem(params).promise()).Item;
  }

  static async deleteItemsByID(pk): Promise<any> {
    const queryParams = {
      ExpressionAttributeValues: {
        ':pk': {
          S: pk,
        },
      },
      KeyConditionExpression: 'pk = :pk',
      TableName: 'Macros',
    };

    const queryResults = await BaseRepository.dynamo
      .query(queryParams)
      .promise();

    if (queryResults.Items && queryResults.Items.length > 0) {
      const batchCalls = this.chunks(queryResults.Items, 25).map(
        async chunk => {
          const deleteRequests = chunk.map(item => {
            return {
              DeleteRequest: {
                Key: {
                  pk: item.pk,
                  sk: item.sk,
                },
              },
            };
          });

          const batchWriteParams = {
            RequestItems: {
              [TableName]: deleteRequests,
            },
          };
          await BaseRepository.dynamo
            .batchWriteItem(batchWriteParams)
            .promise();
        }
      );

      await Promise.all(batchCalls);
    }
  }

  static chunks(inputArray, perChunk) {
    return inputArray.reduce((all, one, i) => {
      const ch = Math.floor(i / perChunk);
      all[ch] = [].concat(all[ch] || [], one);
      return all;
    }, []);
  }
}
