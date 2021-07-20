import * as arc from '@architect/functions';
import ProjectRepository from '@/repositories/project';
import { JsonResponse, UserErrorResponse } from '@/responses';

async function http(req: any) {
  console.log('PUTTING NEW PROJECT');

  if (!req.query.user) return UserErrorResponse('No user specified');
  const [ok, data] = await ProjectRepository.create(req.query.user, req.body);
  if (!ok) {
    return UserErrorResponse(data);
  } else {
    return JsonResponse(data);
  }
}

exports.handler = arc.http.async(http);
