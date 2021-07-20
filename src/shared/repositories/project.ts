import { BaseRepository, init } from './base';
import { v4 as uuidv4 } from 'uuid';
import Project from '@/entities/project';

class ProjectRepository extends BaseRepository {
  put(project): Promise<any> {
    return this.table.put(project.toItem());
  }

  listByUser(user: string): Promise<any> {
    throw new Error('Not implemented list by user');
  }

  deleteByKey(Key: { PK: String; SK: String }): [boolean, string] {
    this.delete(Key);
  }
}

export default init(ProjectRepository);
