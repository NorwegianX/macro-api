const ULID = require('ulid');

export default class Base {
  ulid() {
    return ULID.ulid();
  }

  get key() {
    throw new Error('Key not created');
  }

  get gsi1() {
    return {};
  }

  get gsi2() {
    return {};
  }

  toItem() {
    throw Error('Not Implemented');
  }
}
