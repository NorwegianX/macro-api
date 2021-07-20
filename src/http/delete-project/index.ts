import * as arc from '@architect/functions';
import ProjectRepository from '@/repositories/project';
import { JsonResponse, UserErrorResponse } from '@/responses';

async function http(req: any) {
  if (!req.query.id) return UserErrorResponse('No id specified');

  const projectRepo = await ProjectRepository();

  const project = await projectRepo.findById(req.query.id);
  if (!project) {
    return UserErrorResponse(
      `We didn't find the project you were trying to delete`
    );
  }

  const [ok, data] = await projectRepo.delete(project);
  if (!ok) {
    return UserErrorResponse(data);
  }

  return JsonResponse();
}

exports.handler = arc.http.async(http);
