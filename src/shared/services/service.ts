export default class Service {
  constructor() {
    this.init();
  }

  init(): void {}
  async perform(...args: any): Promise<[boolean, any]> {
    return [true, {}];
  }
  error(msg): [boolean, any] {
    return [false, msg];
  }
  success(res): [boolean, any] {
    return [true, res];
  }
}
