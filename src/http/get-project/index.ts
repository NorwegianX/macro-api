import * as arc from '@architect/functions';
import ProjectRepository from '@/repositories/project';
import { JsonResponse, UserErrorResponse } from '@/responses';

async function http(req: any) {
  //FIXME, seperate filter for better error handling
  if (!req.query.user && !req.query.id) {
    return UserErrorResponse('Missing filter input');
  }

  const projects = req.query.user
    ? await ProjectRepository.listAllByUser(req.query.user)
    : await ProjectRepository.getByID(`Project#${req.query.id}`);

  if (!projects) {
    return UserErrorResponse("We couldn't find any projects");
  } else {
    return JsonResponse(projects);
  }
}

exports.handler = arc.http.async(http);
