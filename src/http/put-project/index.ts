import * as arc from '@architect/functions';
import ProjectRepository from '@/repositories/project';
import Project from '@/entities/project';
import { JsonResponse, UserErrorResponse } from '@/responses';

async function http(req: any) {
  console.log('PUTTING NEW PROJECT');

  if (!req.query.user) return UserErrorResponse('No user specified');
  const projectRepository = await ProjectRepository();
  const project = new Project({});
  const [ok, data] = await projectRepository.put(project, req.query.user);
  if (!ok) {
    return UserErrorResponse(data);
  } else {
    return JsonResponse(data);
  }
}

exports.handler = arc.http.async(http);
