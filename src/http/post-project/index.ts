import * as arc from '@architect/functions';
import ProjectRepository from '@/repositories/project';
import { JsonResponse, UserErrorResponse } from '@/responses';
async function http(req: any) {
  //FIXME, seperate filter for better error handling
  if (!req.body) {
    return UserErrorResponse('Missing body update');
  }

  const projectRepo = await ProjectRepository();
  const [ok, data] = await projectRepo.update(req.params.id, req.body);
  if (!ok) {
    return UserErrorResponse(data);
  } else {
    return JsonResponse();
  }
}

exports.handler = arc.http.async(http);
