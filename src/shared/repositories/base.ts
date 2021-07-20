import AWS from 'aws-sdk';
import { ArcDataIndexable } from 'architect__functions/tables';
import * as arc from '@architect/functions';

interface NorxTable extends ArcDataIndexable {
  rawClient?: any;
}

class BaseRepository {
  table: NorxTable;

  async init() {
    console.log('Creating dynamodb Repository');

    this.table = await arc.tables();
    this.table.rawClient = process.env.ARC_LOCAL
      ? new AWS.DynamoDB({ endpoint: process.env.DB_URL, region: 'eu-west-1' })
      : new AWS.DynamoDB();
  }

  error(msg): [boolean, any] {
    return [false, msg];
  }

  success(res: any = null): [boolean, any] {
    return [true, res];
  }

  async getByID(pk: string): Promise<any> {
    // const params = {
    //   TableName,
    //   Key: {
    //     pk,
    //     sk: pk,
    //   },
    // };
    return this.table.get({ pk, sk: pk });
  }

  ExpressionAttributeNames(props) {
    return Object.keys(props).reduce(
      (obj, prop) => ({
        ...obj,
        [`#${prop}`]: prop,
      }),
      {}
    );
  }

  ExpressionAttributeValues(props) {
    return Object.keys(props).reduce(
      (obj, prop) => ({
        ...obj,
        [`:${prop}`]: props[prop],
      }),
      {}
    );
  }

  UpdateExpression(props) {
    return Object.keys(props)
      .map(prop => `#${prop} = :${prop}`)
      .join(', ')
      .replace(/^/, 'SET ');
  }

  createUpdateParams(Key, props) {
    return {
      Key,
      ExpressionAttributeNames: this.ExpressionAttributeNames(props),
      ExpressionAttributeValues: this.ExpressionAttributeValues(props),
      UpdateExpression: this.UpdateExpression(props),
    };
  }

  delete(Key: { PK: String; SK: String }) {}

  update({ PK, SK }, props) {
    props = {
      ...props,
      updatedAt: new Date().toISOString(),
    };

    console.log('Update params ', this.createUpdateParams({ PK, SK }, props));

    return this.table.update(this.createUpdateParams({ PK, SK }, props));
  }

  chunks(inputArray, perChunk) {
    return inputArray.reduce((all, one, i) => {
      const ch = Math.floor(i / perChunk);
      all[ch] = [].concat(all[ch] || [], one);
      return all;
    }, []);
  }
}

const init = Repository => async () => {
  const repo = new Repository();
  await repo.init();
  return repo;
};

export { BaseRepository, init };
