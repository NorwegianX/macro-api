const Base = require('./base');

class Project extends Base {
  constructor({ id, createdAt = new Date(), updatedAt = new Date() }) {
    super();
    this.id = id ? id : this.ulid();
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  get key() {
    return {
      PK: `PROJECT#${this.id}`,
      SK: `PROJECT#${this.id}`,
    };
  }

  get gsi1() {
    return {
      GSI1PK: `PROJECT#${this.id}`,
      GSI1SK: `PROJECT#${this.id}`,
    };
  }

  toItem() {
    return {
      ...this.key,
      ...this.gsi1,
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt.toISOString(),
      name: this.name,
    };
  }
}

export default Project;
